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

  request(prompts: string): PromptResponse {
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

  fetch(prompts: string): void {
    const response = this.request(prompts);

    responseProcess(response);
  }
}

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
  public async fetch(api: string, content: string): Promise<void> {
    const text = content ?? "";

    if (this.withinMaxChar(text)) {
      const request = await this.request(RequestAPI.API, text);

      responseProcess(request);
      return;
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
    const prompts = localStorage.getItem("prompt") ?? "";
    const req = new RequestLocalAPI();
    const text = textarea.value;

    if (prompts === "") {
      render({});
    }

    req.fetch(text);
    
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

      if (text === "") {
        render({});
        return;
      }

      req.fetch(text);
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
        req.fetch(content);
        
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
 * @param $array 重複している値を調べる配列
 * @return array 重複している値を全て含む配列
 */
function get_differences(array: string[]): string[] {
  let duplicates: ValueCount = array_duplicates(array);
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
 * 与えられた配列にある重複した値を削除して返す (array_unique で置換可能)
 *
 * @param array $target     重複したエントリを取り除きたい配列
 */
function array_unique(target: string[]): string[] {
  // 重複するアイテムのない配列
  let cleaned = [];

  // 重複したアイテムが1個だけたまる配列
  let duplicates: string[] = [];

  for (let e of target) {
    if (array_has_duplicates(e, target)) {
      let again = duplicates.length > 0 && duplicates[0] === e;
      if (again) {
        continue;
      }

      duplicates.pop(); // いらないので捨てる
      duplicates.push(e);
      cleaned.push(duplicates[0]);
    } else {
      cleaned.push(e);
    }
  }

  // (cleaned.length > 0)
  return cleaned;
}

/**
 * 与えられた配列の値が重複しているかを確認する
 *
 * @param string $search_word   重複しているかどうか確認する単語
 * @param array $prompts        Prompt の入っている配列
 */
function array_has_duplicates(search_word: string, prompts: string[]): boolean {
  let duplicates = array_extract_duplicates(search_word, prompts);
  let duplicates_count = array_count_duplicates_custom(duplicates, true);
  const EXISTS = 1;

  if (!duplicates === false && duplicates_count >= EXISTS) {
    return true;
  }

  return false;
}

/**
 * $search_word が 配列 $prompts に含まれている場合は、
 * 自分自身を含む $search_word と重複する値を含んだ配列を返す
 *
 * @param string $search_word   重複しているかどうか確認する単語
 * @param array $prompts        Prompt の入っている配列
 */
function array_extract_duplicates(
  search_word: string,
  prompts: string[]
): string[] {
  // 全く同一の値が複数入る配列
  let duplicates = [];

  for (let e of prompts) {
    if (search_word === e) {
      duplicates.push(e);
    }
  }

  return duplicates;
}

/**
 * 与えられた配列の値が何回重複しているかを数える
 *
 * @param array $duplicates     全く同一の値が複数入る配列でなければいけない
 * @param bool  $recursive      自分自身の値が $duplicates に含まれていることを考慮に入れて計算する
 */
function array_count_duplicates_custom(
  duplicates: string[],
  recursive: boolean = true
): number {
  const EXISTS = 1;
  let count = duplicates.length;

  // -1 が返ってきたらヤバいので
  if (count >= EXISTS && recursive) {
    return count - 1;
  }

  return count;
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
  let duplicates = array_extract_duplicates(search_word, prompts);
  let EXISTS = 1;
  let count = duplicates.length;

  // -1 が返ってきたらヤバいので
  if (count >= EXISTS && recursive) {
    return count - 1;
  }

  return count;
}
