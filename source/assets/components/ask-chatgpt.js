// ask-chatgpt.js（ESM）
// 元件用法：
// 網頁載入此元件 <script type="module" src="/assets/components/ask-chatgpt.js"></script>
// 在頁面任意位置放此標籤 <ask-chatgpt q="你的問題"></ask-chatgpt>

class AskChatGPT extends HTMLElement {
  static get observedAttributes() { return ["q"]; }

  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
      .pill{
        cursor:pointer;
        display:inline-flex;
        align-items:center;
        gap:6px;
        padding:6px 12px;
        border-radius:9999px;
        border:1px solid #ccc;
        background:transparent;
        color:inherit;
        font-size:14px;
        user-select:none;
      }
      .pill:focus{ outline:2px solid rgba(0,0,0,.2); outline-offset:2px; }
      .icon{ line-height:1; }
    `;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "pill";
    btn.setAttribute("part", "button");

    const icon = document.createElement("i");
    icon.className = "fa-regular fa-comments icon";
    icon.setAttribute("aria-hidden", "true");

    const label = document.createElement("span");

    btn.append(icon, label);
    btn.addEventListener("click", () => this.open());

    this.shadowRoot.append(style, btn);

    this._btn = btn;
    this._label = label;

    // 監看 slot 內容變更（<ask-chatgpt>ABC</ask-chatgpt>）
    this._mo = new MutationObserver(() => this.syncUI());
  }

  connectedCallback() {
    this._mo.observe(this, { childList: true, characterData: true, subtree: true });
    this.syncUI();
  }

  disconnectedCallback() {
    this._mo.disconnect();
  }

  attributeChangedCallback(name, oldVal, newVal) {
    if (name === "q" && oldVal !== newVal) this.syncUI();
  }

  get q() { return this.getAttribute("q") ?? ""; }
  set q(value) { this.setAttribute("q", value ?? ""); }

  get extraLabel() {
    // 取 light DOM 文字（忽略空白）
    const text = (this.textContent ?? "").trim();
    return text.length ? text : "";
  }

  syncUI() {
    const extra = this.extraLabel;

    // label 規則：有夾帶內容則顯示 "Ask ChatGPT: 內容"；沒有則呈現 "Ask ChatGPT"
    this._label.textContent = extra ? `Ask ChatGPT : ${extra}` : "Ask ChatGPT";

    // hint 規則：維持顯示 q
    this._btn.title = this.q;
    this._btn.setAttribute("aria-label", extra ? `Ask ChatGPT: ${extra}` : "Ask ChatGPT");
  }

  open() {
    const url = "https://chatgpt.com/?q=" + encodeURIComponent(this.q);
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

customElements.define("ask-chatgpt", AskChatGPT);
