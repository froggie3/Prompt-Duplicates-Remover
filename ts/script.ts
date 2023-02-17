class RequestAPI {
  //static API = "https://tools.yokkin.com/prompts/api/";
  static API = "http://localhost/prompts/src/api/";
  static MAXLENGTH = 3000;

  /**
   *
   * @param api Specify an API entrypoint to use
   * @param content Specify text to send
   * @returns Returns false when a request was failed
   */
  public fetch(api: string, content: string): Boolean {
    const text = content ?? "";
    const query = `?prompts=${encodeURIComponent(text)}`;

    if (this.withinMaxChar(text)) {
      fetch(`${api + query}`)
        .then(response => response.json())
        .then(data => responseProcess(data));

      return true;
    }

    alert(`Exceeded max text length ${RequestAPI.MAXLENGTH} characters!`);

    return false;
  }

  private withinMaxChar(text: string): Boolean {
    return text.length < RequestAPI.MAXLENGTH || false;
  }
}

/**
 * ページロード時の処理
 */

window.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("inputArea") as HTMLInputElement;

  (function setPromptFromStorage() {
    const prompts = localStorage.getItem("prompt") ?? "";
    const req = new RequestAPI();
    const text = textarea.value;

    if (prompts === "") {
      render({});
    }

    req.fetch(RequestAPI.API, text);
  })();

  (function setMaxLength() {
    textarea.maxLength = RequestAPI.MAXLENGTH;
  })();

  return;
});

/**
 * 共通の処理
 */

function saveCurrentPrompt(prompt: string) {
  localStorage.setItem(`prompt`, `${prompt}`);
}

function responseProcess(data: any) {
  const prompts: string[] = data.prompts;
  const reduced: number = data.reduced.prompt.length;
  const redundants: string[] = data.reduced.prompts;

  render({
    prompts: prompts.join(", "),
    reduced: "" + reduced,
    redundants: redundants.length > 0 ? redundants.join(", ") : undefined,
  });
}

type updateParameter = {
  prompts?: string;
  reduced?: string;
  redundants?: string;
};

function render({ prompts, reduced, redundants }: updateParameter) {
  const element = {
    preview: document.getElementById("preview") as HTMLInputElement,
    reduced: document.getElementById("totalRemoved") as HTMLElement,
    redundants: document.getElementById("reducedPrompts") as HTMLElement,
  };

  element.preview.innerHTML = prompts ?? "";
  element.reduced.innerHTML = reduced ?? "0";
  element.redundants.innerHTML = redundants ?? "<em>(no duplicates)</em>";
}

/**
 * Infomation の項目の開閉処理
 */

(() => {
  const button = document.getElementById("hideInfo") as HTMLElement;
  const promptInfo = document.getElementById("prompt-information");

  const toggleState = {
    counter: 0,
    isOpen: localStorage.getItem("isPromptInfoOpen") ?? "false",
  };

  (function setInfomationState() {
    if (toggleState.isOpen === "true") {
      button?.classList.add("isopen");
      promptInfo?.classList.remove("ishidden");

      return;
    }

    ++toggleState.counter;
  })();

  button.onclick = () => {
    (() => {
      toggleState.isOpen = toggleState.counter % 2 === 0 ? "false" : "true";

      ++toggleState.counter;
      localStorage.setItem(`isPromptInfoOpen`, toggleState.isOpen);
    })();

    (() => {
      button?.classList.toggle("isopen");
      promptInfo?.classList.toggle("ishidden");
    })();
  };
})();

/**
 * テキストエリアの入力に応じてリクエストを行う処理
 */

(() => {
  const textarea = document.getElementById("inputArea") as HTMLInputElement;

  textarea.oninput = () => {
    (() => {
      const req = new RequestAPI();
      const text = textarea.value;

      if (text === "") {
        render({});
        return;
      }

      req.fetch(RequestAPI.API, text);
    })();

    saveCurrentPrompt(textarea.value);
  };
})();

/**
 * プロンプトをクライアント側で浄化する処理
 */

(() => {
  const cleanze = document.getElementById("cleanze") as HTMLElement;
  const removeBreak = document.getElementById(
    "removeBreak"
  ) as HTMLInputElement;
  const addSpace = document.getElementById("addSpace") as HTMLInputElement;

  (() => {
    [removeBreak, addSpace].forEach(e => {
      e.onclick = () => {
        if (!removeBreak.checked && !addSpace.checked) {
          cleanze?.classList.add("cleanze-hidden");
          return;
        }

        cleanze?.classList.remove("cleanze-hidden");
      };
    });
  })();

  cleanze.onclick = () => {
    const textarea = document.getElementById("inputArea") as HTMLInputElement;

    (() => {
      const req = new RequestAPI();

      // ここの部分は冗長なので、部分適用を会得したら直す
      const content = ((): string => {
        const regEx = {
          default: /\n+|^ +| +$/g,
          trim: /^ +| +$/g,
          break: /\n+/g,
        };

        if (removeBreak.checked && addSpace.checked) {
          return textarea.value
            .split(",")
            .map(e => e.replace(regEx.default, ""))
            .filter(e => e !== "")
            .join(", ");
        }

        if (removeBreak.checked) {
          return textarea.value.replace(regEx.break, "");
        }

        if (addSpace.checked) {
          return textarea.value
            .split(",")
            .map(e => e.replace(regEx.trim, ""))
            .filter(e => e !== "")
            .join(", ");
        }

        return "";
      })();

      textarea.value = "";
      textarea.value = content;

      if (content !== "") {
        //console.log(req.fetch(RequestAPI.API, content) || "Request failed");
        req.fetch(RequestAPI.API, content);

        return;
      }

      alert("Deletion cannot be applied to an empty prompt!");
    })();

    saveCurrentPrompt(textarea.value);
  };
})();
