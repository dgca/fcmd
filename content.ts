import type { PlasmoCSConfig } from "plasmo";
import * as DOMPurify from "dompurify";
import { marked } from "marked";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import styleText from "data-text:highlight.js/styles/github-dark.css";

hljs.registerLanguage("javascript", javascript);

export const config: PlasmoCSConfig = {
  matches: ["https://warpcast.com/*"],
  all_frames: true,
};

window.addEventListener("load", () => {
  const processedClassName = "__fcmd__processed__";
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `
    ${styleText}

    .hljs {
      border-radius: 5px;
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
