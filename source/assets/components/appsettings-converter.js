// appsettings-converter.js (ESM)
// 元件用法：
// 網頁載入此元件 <script type="module" src="/assets/components/appsettings-converter.js"></script>
// 在頁面任意位置放此標籤 <appsettings-converter></appsettings-converter>

class AppsettingsConverter extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans", "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji";
          line-height: 1.4;
        }

        .wrap { max-width: 960px; }
        h2 { margin: 0 0 12px 0; font-size: 18px; font-weight: 600; }

        label { display: inline-block; margin: 8px 0; }
        textarea {
          width: 100%;
          box-sizing: border-box;
          min-height: 180px;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 13px;
        }

        .radio-group {
          margin: 10px 0 14px 0;
          display: flex;
          gap: 14px;
          align-items: center;
        }

        .radio-group label { margin: 0; }
        button {
          appearance: none;
          border: 1px solid #ccc;
          border-radius: 10px;
          padding: 8px 12px;
          background: #fff;
          cursor: pointer;
          font-weight: 600;
        }
        button:active { transform: translateY(1px); }

        .out-label { display: block; margin-top: 18px; }
        pre {
          white-space: pre-wrap;
          word-break: break-word;
          border: 1px solid #ccc;
          padding: 10px;
          border-radius: 8px;
          background:inherit;
          color:inherit;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 13px;
          margin: 0;
        }
      </style>

      <div class="wrap">
        <h2>appsettings.json Converter</h2>

        <label for="jsonInput">輸入 appsettings.json 內容：</label>
        <br />
        <textarea id="jsonInput" rows="10" placeholder='{"AA":{"BB":"123"},"CC":"456"}'></textarea>

        <div class="radio-group" role="radiogroup" aria-label="platform">
          <input type="radio" id="windows" name="platform" value="windows" checked />
          <label for="windows">Windows</label>

          <input type="radio" id="linux" name="platform" value="linux" />
          <label for="linux">Linux</label>
        </div>

        <button id="convertBtn" type="button">Convert</button>

        <label class="out-label">環境變數設定檔：</label>
        <pre id="output"></pre>
      </div>
    `;

    this.$ = (sel) => this.shadowRoot.querySelector(sel);

    this.onConvert = this.onConvert.bind(this);
  }

  connectedCallback() {
    this.$("#convertBtn").addEventListener("click", this.onConvert);
  }

  disconnectedCallback() {
    this.$("#convertBtn").removeEventListener("click", this.onConvert);
  }

  // 遞迴遍歷 JSON，將所有葉節點展平，同時組合 key 名
  flattenJson(obj, parentKey = "", separator = ":") {
    let result = [];
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) continue;

      const newKey = parentKey ? parentKey + separator + key : key;
      const val = obj[key];

      if (typeof val === "object" && val !== null && !Array.isArray(val)) {
        result = result.concat(this.flattenJson(val, newKey, separator));
      } else {
        result.push({ name: newKey, value: val, slotSetting: false });
      }
    }
    return result;
  }

  onConvert() {
    const textarea = this.$("#jsonInput");
    const output = this.$("#output");

    const inputText = textarea.value;
    try {
      const jsonData = JSON.parse(inputText);
      const platform = this.shadowRoot.querySelector('input[name="platform"]:checked')?.value ?? "windows";
      const separator = platform === "windows" ? ":" : "__";

      const flattened = this.flattenJson(jsonData, "", separator);

      // 維持你原本的輸出形式：每個物件 JSON 串起來，用 ,\n 分隔
      output.textContent = flattened.map((item) => JSON.stringify(item, null, 2)).join(",\n");
    } catch {
      output.textContent = "Error: 無效的 JSON 格式";
    }
  }
}

customElements.define("appsettings-converter", AppsettingsConverter);
