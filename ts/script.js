"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class RequestLocalAPI {
    request(prompts) {
        const prompts_array = prompts.trim().split(", ");
        const cleaned_prompts = (() => array_unique(Object.values(prompts_array)))();
        return {
            prompts: cleaned_prompts,
            reduced: {
                prompt: get_differences(prompts_array),
                prompts: (() => Object.keys(array_duplicates(prompts_array)))(),
            },
        };
    }
    fetch(prompts) {
        const response = this.request(prompts);
        responseProcess(response);
    }
}
RequestLocalAPI.MAXLENGTH = 3000;
class RequestAPI {
    fetch(api, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const text = content !== null && content !== void 0 ? content : "";
            if (this.withinMaxChar(text)) {
                const request = yield this.request(RequestAPI.API, text);
                responseProcess(request);
                return;
            }
            alert(`Exceeded max text length ${RequestAPI.MAXLENGTH} characters!`);
        });
    }
    request(api, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = `?prompts=${encodeURIComponent(text)}`;
            const request = yield fetch(`${api + query}`)
                .then(response => response.json())
                .then(data => data);
            return request;
        });
    }
    withinMaxChar(text) {
        return text.length < RequestAPI.MAXLENGTH || false;
    }
}
RequestAPI.API = "http://localhost/prompts/src/api/";
RequestAPI.MAXLENGTH = 3000;
window.addEventListener("DOMContentLoaded", () => {
    const textarea = document.getElementById("inputArea");
    (function setPromptFromStorage() {
        var _a;
        const prompts = (_a = localStorage.getItem("prompt")) !== null && _a !== void 0 ? _a : "";
        const req = new RequestLocalAPI();
        const text = textarea.value;
        if (prompts === "") {
            render({});
        }
        req.fetch(text);
    })();
    (function setMaxLength() {
        textarea.maxLength = RequestAPI.MAXLENGTH;
    })();
});
function saveCurrentPrompt(prompt) {
    localStorage.setItem(`prompt`, `${prompt}`);
}
function responseProcess(data) {
    const prompts = data.prompts;
    const reduced = data.reduced.prompt.length;
    const redundants = data.reduced.prompts;
    render({
        prompts: prompts.join(", "),
        reduced: "" + reduced,
        redundants: redundants.length > 0 ? redundants.join(", ") : undefined,
    });
}
function render({ prompts, reduced, redundants }) {
    const element = {
        preview: document.getElementById("preview"),
        reduced: document.getElementById("totalRemoved"),
        redundants: document.getElementById("reducedPrompts"),
    };
    element.preview.innerHTML = prompts !== null && prompts !== void 0 ? prompts : "";
    element.reduced.innerHTML = reduced !== null && reduced !== void 0 ? reduced : "0";
    element.redundants.innerHTML = redundants !== null && redundants !== void 0 ? redundants : "<em>(no duplicates)</em>";
}
(() => {
    var _a;
    const button = document.getElementById("hideInfo");
    const promptInfo = document.getElementById("prompt-information");
    const toggleState = {
        counter: 0,
        isOpen: (_a = localStorage.getItem("isPromptInfoOpen")) !== null && _a !== void 0 ? _a : "false",
    };
    (function setInfomationState() {
        if (toggleState.isOpen === "true") {
            button === null || button === void 0 ? void 0 : button.classList.add("isopen");
            promptInfo === null || promptInfo === void 0 ? void 0 : promptInfo.classList.remove("ishidden");
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
            button === null || button === void 0 ? void 0 : button.classList.toggle("isopen");
            promptInfo === null || promptInfo === void 0 ? void 0 : promptInfo.classList.toggle("ishidden");
        })();
    };
})();
(() => {
    const textarea = document.getElementById("inputArea");
    textarea.oninput = () => {
        (() => {
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
(() => {
    const cleanze = document.getElementById("cleanze");
    const removeBreak = document.getElementById("removeBreak");
    const addSpace = document.getElementById("addSpace");
    (() => {
        [removeBreak, addSpace].forEach(e => {
            e.onclick = () => {
                if (!removeBreak.checked && !addSpace.checked) {
                    cleanze === null || cleanze === void 0 ? void 0 : cleanze.classList.add("cleanze-hidden");
                    return;
                }
                cleanze === null || cleanze === void 0 ? void 0 : cleanze.classList.remove("cleanze-hidden");
            };
        });
    })();
    cleanze.onclick = () => {
        const textarea = document.getElementById("inputArea");
        (() => {
            const req = new RequestLocalAPI();
            const content = (() => {
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
                req.fetch(content);
                return;
            }
            alert("Deletion cannot be applied to an empty prompt!");
        })();
        saveCurrentPrompt(textarea.value);
    };
})();
function get_differences(array) {
    let duplicates = array_duplicates(array);
    let out = [];
    for (let words in duplicates) {
        for (let i = 0; i <= duplicates[words] - 1; i++) {
            out.push(words);
        }
    }
    return out;
}
function array_unique(target) {
    let cleaned = [];
    let duplicates = [];
    for (let e of target) {
        if (array_has_duplicates(e, target)) {
            let again = duplicates.length > 0 && duplicates[0] === e;
            if (again) {
                continue;
            }
            duplicates.pop();
            duplicates.push(e);
            cleaned.push(duplicates[0]);
        }
        else {
            cleaned.push(e);
        }
    }
    return cleaned;
}
function array_has_duplicates(search_word, prompts) {
    let duplicates = array_extract_duplicates(search_word, prompts);
    let duplicates_count = array_count_duplicates_custom(duplicates, true);
    const EXISTS = 1;
    if (!duplicates === false && duplicates_count >= EXISTS) {
        return true;
    }
    return false;
}
function array_extract_duplicates(search_word, prompts) {
    let duplicates = [];
    for (let e of prompts) {
        if (search_word === e) {
            duplicates.push(e);
        }
    }
    return duplicates;
}
function array_count_duplicates_custom(duplicates, recursive = true) {
    const EXISTS = 1;
    let count = duplicates.length;
    if (count >= EXISTS && recursive) {
        return count - 1;
    }
    return count;
}
function array_duplicates(array) {
    const NOEXISTS = 1;
    const formatted = array_count_values(array);
    const filtered = Object.entries(formatted).filter(value => value[1] !== NOEXISTS);
    const duplicates = (() => {
        const object = {};
        filtered.map((value, i) => (object[filtered[i][0]] = --value[1]));
        return object;
    })();
    return duplicates;
}
function array_count_values(array) {
    let object = {};
    for (let value of array) {
        object[value] = array_count_duplicates(value, array, false);
    }
    return object;
}
function array_count_duplicates(search_word, prompts, recursive = true) {
    let duplicates = array_extract_duplicates(search_word, prompts);
    let EXISTS = 1;
    let count = duplicates.length;
    if (count >= EXISTS && recursive) {
        return count - 1;
    }
    return count;
}
