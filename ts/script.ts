class RequestAPI {
  static API = "https://tools.yokkin.com/prompts/api/";
  //static API = "http://localhost/prompts/src/api/";
  static MAXLENGTH: number = 3000;

  /**
   *
   * @param api Specify an API entrypoint to use
   * @param content Specify text to send
   * @returns Returns false when a request was failed
   */
  public send(api: string, content: string): Boolean {
    const text = content ?? "";
    const query = `?prompts=${encodeURIComponent(text)}`;

    if (this.isValid(text)) {
      fetch(`${api + query}`)
        .then(response => response.json())
        .then(data => action(data));

      return true;
    }
    alert(`Exceeded max text length ${RequestAPI.MAXLENGTH} characters!`);
    return false;
  }

  private isValid(text: string): Boolean {
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
    const req = new RequestAPI();
    const text = textarea.value;

    textarea.value = prompts;

    req.send(RequestAPI.API, text);

    return;
  })();

  (function setMaxLength(): void {
    textarea.maxLength = RequestAPI.MAXLENGTH;

    return;
  })();

  return;
});

/**
 * 共通の処理
 */

function saveCurrentPrompt(prompt: string): void {
  localStorage.setItem(`prompt`, `${prompt}`);

  return;
}

function action(data: any): void {
  (function updatePreviewArea(): void {
    const preview = document.getElementById("preview") as HTMLInputElement;
    const previewData = data.prompts.join(", ");

    preview.innerHTML = previewData;

    return;
  })();

  (function updateInfomationArea(): void {
    const reduced = document.getElementById("totalRemoved") as HTMLElement;
    const redundants = document.getElementById("reducedPrompts") as HTMLElement;

    reduced.innerHTML = data.reduced.prompt.length;
    redundants.innerHTML = data.reduced.prompts.join(", ");

    return;
  })();

  return;
}

/**
 * Infomation の項目の開閉処理
 */

((): void => {
  const button = document.getElementById("hideInfo") as HTMLElement;
  const promptInfo = document.querySelector(".prompt-information");

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

    return;
  })();

  button.onclick = (): void => {
    ((): void => {
      toggleState.isOpen = toggleState.counter % 2 === 0 ? "false" : "true";
      ++toggleState.counter;
      localStorage.setItem(`isPromptInfoOpen`, toggleState.isOpen);

      return;
    })();

    ((): void => {
      button?.classList.toggle("isopen");
      promptInfo?.classList.toggle("ishidden");

      return;
    })();

    return;
  };

  return;
})();

/**
 * テキストエリアの入力に応じてリクエストを行う処理
 */

((): void => {
  const textarea = document.getElementById("inputArea") as HTMLInputElement;

  textarea.oninput = (): void => {
    ((): void => {
      const req = new RequestAPI();
      const text = textarea.value;

      req.send(RequestAPI.API, text);

      return;
    })();

    saveCurrentPrompt(textarea.value);

    return;
  };

  return;
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
    [removeBreak, addSpace].forEach((e): void => {
      e.onclick = (): void => {
        if (!removeBreak.checked && !addSpace.checked) {
          cleanze?.classList.add("cleanze-hidden");
          return;
        }

        cleanze?.classList.remove("cleanze-hidden");

        return;
      };

      return;
    });

    return;
  })();

  cleanze.onclick = (): void => {
    const textarea = document.getElementById("inputArea") as HTMLInputElement;

    ((): void => {
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
        //console.log(req.send(RequestAPI.API, content) || "Request failed");
        req.send(RequestAPI.API, content);

        return;
      }

      alert("Deletion cannot be applied to an empty prompt!");

      return;
    })();

    saveCurrentPrompt(textarea.value);

    return;
  };

  return;
})();
