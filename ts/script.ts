type PromptResponse = {
  prompts: string[];
  reduced: { prompt: string[]; prompts: string[] };
};

type updateParameter = {
  prompts?: string;
  reduced?: string;
  redundants?: string;
};

class RequestLocalAPI {
  static MAXLENGTH = 100000;

  public request(prompts: string): PromptResponse {
    const prompts_array = prompts.trim().split(", ");
    const cleaned_prompts = [...new Set(Object.values(prompts_array))];
    return {
      prompts: cleaned_prompts,
      reduced: {
        prompt: get_differences(prompts_array),
        prompts: (() => Object.keys(array_duplicates(prompts_array)))(),
      },
    };
  }

  public fetch(prompts: string): PromptResponse {
    return this.request(prompts);
  }

  public extractText(text: string): string {
    const result = /\(?(.+)\)?/g.exec(text);
    return result ? result[1] : "";
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("inputArea") as HTMLInputElement;
  textarea.maxLength = RequestLocalAPI.MAXLENGTH;
});

window.addEventListener("DOMContentLoaded", () => {
  const inStorage = (): boolean => {
    const p = localStorage.getItem("prompt") ?? false;
    return !p || true;
  };

  if (inStorage()) {
    const textarea = document.getElementById("inputArea") as HTMLInputElement;
    const req = new RequestLocalAPI();
    textarea.value = localStorage.getItem("prompt") ?? "";
    responseProcess(req.fetch(textarea.value));
  }
});

/**
 * 共通の処理
 */

function saveCurrentPrompt(prompt: string) {
  localStorage.setItem("prompt", prompt);
}

function responseProcess(data: PromptResponse) {
  const prompts = data.prompts;
  const reduced: number = data.reduced.prompt.length;
  const redundants = data.reduced.prompts;

  render({
    prompts: prompts.join(", "),
    reduced: "" + reduced,
    redundants: redundants.length > 0 ? redundants.join(", ") : undefined,
  });
}

function render({ prompts, reduced, redundants }: updateParameter) {
  const element = {
    preview: document.getElementById("preview") as HTMLInputElement,
    reduced: document.getElementById("totalRemoved") as HTMLElement,
    redundants: document.getElementById("reducedPrompts") as HTMLElement,
  };

  element.preview.innerHTML = injectSpanTag(prompts, redundants) ?? "";
  element.reduced.innerHTML = reduced ?? "0";
  element.redundants.innerHTML = redundants ?? "<em>(no duplicates)</em>";
}

function injectSpanTag(prompt = "", redundants = ""): string | undefined {
  if (!prompt) return undefined;
  const array = prompt.split(", ");
  const refer = redundants.split(", ");
  const output = [...new Set(array)].flatMap(e =>
    refer.includes(e)
      ? [['<span class="promptHighlighted">', e, "</span>"].join("")]
      : [e]
  );
  return output.join(", ");
}

/**
 * Infomation の項目の開閉処理
 */

(() => {
  const button = document.getElementById("hideInfo") as HTMLElement;
  const promptInfo = document.getElementById("prompt-information");
  let counter = 0;
  let isopen = localStorage.getItem("isPromptInfoOpen") ?? "false";

  (function setInfomationState() {
    if (isopen === "true") {
      button?.classList.add("isopen");
      promptInfo?.classList.remove("ishidden");
    } else {
      ++counter;
    }
  })();

  button.onclick = () => {
    isopen = counter % 2 === 0 ? "false" : "true";
    ++counter;
    localStorage.setItem("isPromptInfoOpen", isopen);

    button?.classList.toggle("isopen");
    promptInfo?.classList.toggle("ishidden");
  };
})();

/**
 * テキストエリアの入力に応じてリクエストを行う処理
 */

(() => {
  const textarea = document.getElementById("inputArea") as HTMLInputElement;
  textarea.oninput = () => {
    if (textarea.value === "") {
      render({});
    } else {
      const req = new RequestLocalAPI();
      responseProcess(req.fetch(textarea.value));
    }
    saveCurrentPrompt(textarea.value);
  };
})();

/**
 * プロンプトをクライアント側で浄化する処理
 */

(() => {
  const cleanze = document.getElementById("cleanze") as HTMLElement;
  const rmbr = document.getElementById("removeBreak") as HTMLInputElement;
  const addSpace = document.getElementById("addSpace") as HTMLInputElement;

  [rmbr, addSpace].forEach(e => {
    e.onclick = () => {
      if (!rmbr.checked && !addSpace.checked) {
        cleanze?.classList.add("cleanze-hidden");
      } else {
        cleanze?.classList.remove("cleanze-hidden");
      }
    };
  });

  cleanze.onclick = () => {
    const textarea = document.getElementById("inputArea") as HTMLInputElement;
    const req = new RequestLocalAPI();
    const text = clean(textarea.value);

    function clean(x: string): string {
      let arr = x.split(",");
      if (rmbr.checked && addSpace.checked) {
        arr = arr.map(e => e.replace(/\n+|^ +| +$/g, ""));
      } else if (rmbr.checked) {
        arr = arr.map(e => e.replace(/\n+/g, ""));
      } else if (addSpace.checked) {
        arr = arr.map(e => e.replace(/^ +| +$/g, ""));
      }
      arr = arr.filter(e => e !== "");
      return arr.join(", ");
    }

    textarea.value = text;

    if (!!text) {
      responseProcess(req.fetch(text));
    } else {
      alert("Deletion cannot be applied to an empty prompt!");
    }

    saveCurrentPrompt(textarea.value);
  };
})();

/**
 * 配列内で重複している値を全て出力する
 *
 * @param string[] 重複している値を調べる配列
 * @return string[] 重複している値を全て含む配列
 * @example white, white, white, repeated
 */
function get_differences(array: string[]): string[] {
  const duplicates = array_duplicates(array);
  let out: string[] = [];
  Object.keys(duplicates).forEach(words => {
    for (let i = 0; i <= duplicates[words] - 1; i++) {
      out.push(words);
    }
  });
  return out;
}

function array_duplicates(array: string[]): { [index: string]: number } {
  const formatted = array_count_values(array);
  const obj: { [index: string]: number } = {};
  Object.values(formatted).forEach((x, i) => {
    const v = Object.keys(formatted)[i];
    if (x > 1) obj[v] = x;
  });
  return obj;
}

function array_count_values(array: any[]): object {
  const obj: { [index: string]: number } = {};
  array.forEach(k => (obj[k] = (obj[k] || 0) + 1));
  return obj;
}
