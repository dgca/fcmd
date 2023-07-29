import type { PlasmoCSConfig } from "plasmo";
import * as DOMPurify from "dompurify";
import { marked } from "marked";
import hljs from "highlight.js";
import hljsDefineSolidity from "highlightjs-solidity";
import styleText from "data-text:highlight.js/styles/github-dark.css";

hljsDefineSolidity(hljs);

marked.use({
  headerIds: false,
  mangle: false,
});

export const config: PlasmoCSConfig = {
  matches: ["https://warpcast.com/*"],
  all_frames: true,
};

window.addEventListener("load", () => {
  const processedClassName = "__fcmd__processed__";
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    ${styleText}

    .${processedClassName} .hljs {
      border-radius: 5px;
    }

    .${processedClassName} ul {
      list-style: initial;
    }
  `;
  document.head.appendChild(styleEl);

  const observer = new MutationObserver(() => {
    const contentEls = document.querySelectorAll(
      `.tracking-normal:not(.${processedClassName})`,
    );

    if (!contentEls.length) return;

    contentEls.forEach((el) => {
      const textEl = el.children[0];

      if (!(textEl instanceof HTMLElement)) return;

      el.classList.add(processedClassName);

      const content = DOMPurify.sanitize(marked(textEl.innerHTML));

      textEl.innerHTML = content;

      const codeEls = textEl.querySelectorAll("pre code");

      codeEls.forEach((codeEl) => {
        if (!(codeEl instanceof HTMLElement)) return;
        hljs.highlightElement(codeEl);
      });
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
});
