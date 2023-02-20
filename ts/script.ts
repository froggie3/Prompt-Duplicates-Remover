type PromptResponse = {
  prompts: string[];
  reduced: { prompt: string[]; prompts: string[] };
};

type updateParameter = {
  prompts?: string;
  reduced?: string;
  redundants?: string;
};

type ValueCount = {
  [index: string]: number;
};

class RequestLocalAPI {
  static MAXLENGTH = 3000;

  public request(prompts: string): PromptResponse {
    const prompts_array = prompts.trim().split(", ");
    const cleaned_prompts = (() =>
      array_unique(Object.values(prompts_array)))();

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
}

class RequestAPI {
  static API = "https://tools.yokkin.com/prompts/api/";
  //static API = "http://localhost/prompts/src/api/";
  static MAXLENGTH = 3000;

  /**
   *
   * @param api Specify an API entrypoint to use
   * @param content Specify text to send
   * @returns Returns false when a request was failed
   */
  public async fetch(
    api: string,
    content: string
  ): Promise<PromptResponse | undefined> {
    const text = content ?? "";

    if (this.withinMaxChar(text)) {
      const request = await this.request(RequestAPI.API, text);

      return request;
    }

    alert(`Exceeded max text length ${RequestAPI.MAXLENGTH} characters!`);
  }

  private async request(api: string, text: string): Promise<PromptResponse> {
    const query = `?prompts=${encodeURIComponent(text)}`;

    const request = await fetch(`${api + query}`)
      .then(response => response.json())
      .then(data => data);

    return request;
  }

  private withinMaxChar(text: string): boolean {
    return text.length < RequestAPI.MAXLENGTH || false;
  }
}

/**
 * ページロード時の処理
 */

window.addEventListener("DOMContentLoaded", (): void => {
  const textarea = document.getElementById("inputArea") as HTMLInputElement;

  (function setPromptFromStorage(): void {
    const prompts = localStorage.getItem("prompt") ?? undefined;
    const req = new RequestLocalAPI();
    const text = textarea.value;

    if (!prompts) {
      render({});
    }

    responseProcess(req.fetch(text));
  })();

  (function setMaxLength(): void {
    textarea.maxLength = RequestAPI.MAXLENGTH;
  })();
});

/**
 * 共通の処理
 */

function saveCurrentPrompt(prompt: string): void {
  localStorage.setItem(`prompt`, `${prompt}`);
}

function responseProcess(data: PromptResponse): void {
  const prompts = data.prompts;
  const reduced: number = data.reduced.prompt.length;
  const redundants = data.reduced.prompts;

  render({
    prompts: prompts.join(", "),
    reduced: "" + reduced,
    redundants: redundants.length > 0 ? redundants.join(", ") : undefined,
  });
}

function render({ prompts, reduced, redundants }: updateParameter): void {
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

((): void => {
  const button = document.getElementById("hideInfo") as HTMLElement;
  const promptInfo = document.getElementById("prompt-information");

  const toggleState = {
    counter: 0,
    isOpen: localStorage.getItem("isPromptInfoOpen") ?? "false",
  };

  (function setInfomationState(): void {
    if (toggleState.isOpen === "true") {
      button?.classList.add("isopen");
      promptInfo?.classList.remove("ishidden");

      return;
    }

    ++toggleState.counter;
  })();

  button.onclick = (): void => {
    ((): void => {
      toggleState.isOpen = toggleState.counter % 2 === 0 ? "false" : "true";

      ++toggleState.counter;
      localStorage.setItem(`isPromptInfoOpen`, toggleState.isOpen);
    })();

    ((): void => {
      button?.classList.toggle("isopen");
      promptInfo?.classList.toggle("ishidden");
    })();
  };
})();

/**
 * テキストエリアの入力に応じてリクエストを行う処理
 */

((): void => {
  const textarea = document.getElementById("inputArea") as HTMLInputElement;

  textarea.oninput = (): void => {
    ((): void => {
      const req = new RequestLocalAPI();
      const text = textarea.value;

      // when empty text is given
      if (!text) {
        render({});
        return;
      }

      responseProcess(req.fetch(text));
    })();

    saveCurrentPrompt(textarea.value);
  };
})();

/**
 * プロンプトをクライアント側で浄化する処理
 */

((): void => {
  const cleanze = document.getElementById("cleanze") as HTMLElement;
  const removeBreak = document.getElementById(
    "removeBreak"
  ) as HTMLInputElement;
  const addSpace = document.getElementById("addSpace") as HTMLInputElement;

  ((): void => {
    [removeBreak, addSpace].forEach(e => {
      e.onclick = (): void => {
        if (!removeBreak.checked && !addSpace.checked) {
          cleanze?.classList.add("cleanze-hidden");
          return;
        }

        cleanze?.classList.remove("cleanze-hidden");
      };
    });
  })();

  cleanze.onclick = (): void => {
    const textarea = document.getElementById("inputArea") as HTMLInputElement;

    ((): void => {
      const req = new RequestLocalAPI();

      // ここの部分は冗長なので、部分適用を会得したら直す
      const text = ((): string => {
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
      textarea.value = text;

      if (!!text) {
        //console.log(req.fetch(RequestAPI.API, content) || "Request failed");
        responseProcess(req.fetch(text));

        return;
      }

      alert("Deletion cannot be applied to an empty prompt!");
    })();

    saveCurrentPrompt(textarea.value);
  };
})();

/**
 * 配列内で重複している値を全て出力する
 *
 * @param string[] 重複している値を調べる配列
 * @return string[] 重複している値を全て含む配列
 */
function get_differences(array: string[]): string[] {
  const duplicates: ValueCount = array_duplicates(array);
  let out = [];

  for (let words in duplicates) {
    for (let i = 0; i <= duplicates[words] - 1; i++) {
      out.push(words);
    }
  }

  return out;
  // white, white, white, repeated
}

/**
 * 与えられた配列にある重複した値を削除して返す
 *
 * @param target     重複したエントリを取り除きたい配列
 */
function array_unique(target: string[]): string[] {
  return [...new Set(target)];
}

/**
 * 与えられた配列の値が重複しているかを確認する
 *
 * @param string $search_word   重複しているかどうか確認する単語
 * @param array $prompts        Prompt の入っている配列
 */
function array_has_duplicates(search_word: string, prompts: string[]): boolean {
  const duplicates = array_extract_duplicates(search_word, prompts);

  // 自分自身の値が配列に含まれていることを考慮に入れて計算する
  const SELF = 1;
  const duplicates_count = duplicates.length - SELF;

  const MIN_EXISTS = 1;
  return (!duplicates === false && duplicates_count >= MIN_EXISTS) || false;
}

/**
 * $search_word が 配列 prompts に含まれている場合は、
 * 自分自身を含む search_word と重複する値を含んだ配列を返す
 *
 * @param string search_word   重複しているかどうか確認する単語
 * @param string[] prompts        Prompt の入っている配列
 */
function array_extract_duplicates(
  search_word: string,
  prompts: string[]
): string[] {
  return prompts.filter(e => search_word === e);
}

/**
 * 配列内で重複している値の種類を出力する (リファクタ版)
 *
 * @param $array 重複している値を調べる配列
 * @return array key = 値, value = 重複している回数
 */

function array_duplicates(array: string[]): ValueCount {
  const NOEXISTS = 1;
  const formatted = array_count_values(array);

  const filtered: [string, number][] = Object.entries(formatted).filter(
    value => value[1] !== NOEXISTS
  );

  const duplicates = (() => {
    const object: ValueCount = {};
    filtered.map((value, i) => (object[filtered[i][0]] = --value[1]));
    return object;
  })();

  return duplicates;
}

function array_count_values(array: any[]): object {
  let object: any = {};

  for (let value of array) {
    object[value] = array_count_duplicates(value, array, false);
  }

  return object;
}

/**
 * 指定された単語が、配列のなかで何回重複しているかを数える
 *
 * @param string $search_word   重複しているかどうか確認する単語
 * @param array $prompts        Prompt の入っている配列
 * @param bool  $recursive      自分自身の値が $duplicates に含まれていることを考慮に入れて計算する
 */
function array_count_duplicates(
  search_word: string,
  prompts: string[],
  recursive: boolean = true
): number {
  const duplicates = array_extract_duplicates(search_word, prompts);
  const EXISTS = 1;
  const count = duplicates.length;

  // -1 が返ってきたらヤバいので
  if (count >= EXISTS && recursive) {
    return count - 1;
  }

  return count;
}
