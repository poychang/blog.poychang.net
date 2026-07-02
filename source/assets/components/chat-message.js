/********************************************************************************
chat-message.js（ESM）
元件用法：
載入此元件後，在頁面任意位置放指定標籤

<script type="module" src="/assets/components/chat-message.js"></script>

<chat-message-left name="Poy Chang">我的訊息</chat-message-left>
<chat-message-right name="ChatGPT">回應的訊息</chat-message-right>

*********************************************************************************/

class ChatMessageBase extends HTMLElement {
  constructor(direction) {
    super();
    this.direction = direction;
  }

  connectedCallback() {
    if (this.shadowRoot) return;

    const name = this.getAttribute("name") ?? "";

    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 0.75rem 0;
          font-family: inherit;
        }

        .wrap {
          display: flex;
          width: 100%;
          box-sizing: border-box;
        }

        .wrap.left {
          justify-content: flex-start;
        }

        .wrap.right {
          justify-content: flex-end;
        }

        .bubble {
          padding: 0.75rem 1rem;
          border: 1.5px solid;
          border-radius: 1rem;
          line-height: 1.6;
          word-break: break-word;
          background: transparent;
          box-sizing: border-box;
        }

        .left .bubble {
          width: 100%;
          max-width: 100%;
          border-color: var(--chat-left-border-color, #64748b);
          border-top-left-radius: 0.25rem;
        }

        .right .bubble {
          max-width: var(--chat-right-max-width, 75%);
          border-color: var(--chat-right-border-color, #2563eb);
          border-top-right-radius: 0.25rem;
        }

        .name {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.8rem;
          font-weight: 600;
          opacity: 0.75;
        }

        .left .name {
          color: var(--chat-left-name-color, #64748b);
        }

        .right .name {
          color: var(--chat-right-name-color, #2563eb);
        }

        ::slotted(*) {
          margin-top: 0;
        }

        ::slotted(*:last-child) {
          margin-bottom: 0;
        }

        @media (max-width: 640px) {
          .right .bubble {
            max-width: var(--chat-right-mobile-max-width, 90%);
          }
        }
      </style>

      <div class="wrap ${this.direction}">
        <div class="bubble">
          ${name ? `<span class="name">${this.escapeHtml(name)}</span>` : ""}
          <slot></slot>
        </div>
      </div>
    `;
  }

  escapeHtml(value) {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}

class ChatMessageLeft extends ChatMessageBase {
  constructor() {
    super("left");
  }
}

class ChatMessageRight extends ChatMessageBase {
  constructor() {
    super("right");
  }
}

customElements.define("chat-message-left", ChatMessageLeft);
customElements.define("chat-message-right", ChatMessageRight);
