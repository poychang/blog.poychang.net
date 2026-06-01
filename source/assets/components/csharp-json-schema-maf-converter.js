import {
  SchemaConversionError,
  convertCsharpToJsonSchema,
  formatSchema,
  highlightCsharp,
  highlightJson,
  DEFAULT_SAMPLE,
} from "./csharp-json-schema-converter.js";

const RESPONSE_FORMAT_NAME_PATTERN = /^[A-Za-z0-9_-]{1,64}$/;
const MAF_EMPTY_OUTPUT =
  "Paste a C# class and fill response format metadata to generate a MAF response format.";

function convertCsharpToMafResponseFormat(source, responseFormat, options) {
  const metadata = normalizeResponseFormatMetadata(responseFormat);

  return {
    name: metadata.name,
    description: metadata.description,
    schema: convertCsharpToJsonSchema(source, options),
    strict: true,
  };
}

function normalizeResponseFormatMetadata(responseFormat) {
  const metadata = responseFormat || {};
  const name = normalizeSpaces(metadata.name);
  const description = normalizeSpaces(metadata.description);

  if (!name) {
    throw new SchemaConversionError(
      "InvalidResponseFormatName",
      "$.name",
      "Response format name is required.",
    );
  }

  if (!RESPONSE_FORMAT_NAME_PATTERN.test(name)) {
    throw new SchemaConversionError(
      "InvalidResponseFormatName",
      "$.name",
      "Response format name must be 1-64 characters and contain only letters, numbers, underscores, or dashes.",
    );
  }

  if (!description) {
    throw new SchemaConversionError(
      "InvalidResponseFormatDescription",
      "$.description",
      "Response format description is required.",
    );
  }

  return { name, description };
}

function normalizeSpaces(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

const globalScope = typeof window !== "undefined" ? window : globalThis;

if (globalScope.document && globalScope.customElements) {
  const template = document.createElement("template");

  template.innerHTML = `
    <style>
      :host {
        display: block;
      }

      .converter {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 20px;
        align-items: stretch;
      }

      .pane {
        min-width: 0;
      }

      label {
        display: block;
        margin: 0 0 8px;
        // color: #354258;
        font-size: 0.92rem;
        font-weight: 680;
      }

      .metadata-grid {
        display: grid;
        grid-template-columns: minmax(0, 1fr);
        gap: 12px;
        margin: 0 0 16px;
      }

      .metadata-input {
        box-sizing: border-box;
        width: 100%;
        min-height: 38px;
        border: 1px solid #c8d0dd;
        border-radius: 7px;
        background: #ffffff;
        color: #172033;
        font: 0.94rem/1.4 Inter, ui-sans-serif, system-ui, -apple-system,
          BlinkMacSystemFont, "Segoe UI", sans-serif;
        padding: 8px 10px;
      }

      .metadata-input:focus {
        border-color: #2f6feb;
        box-shadow: 0 0 0 3px rgba(47, 111, 235, 0.15);
        outline: none;
      }

      .metadata-hint {
        display: block;
        margin: 6px 0 0;
        color: #687385;
        font-size: 0.78rem;
        line-height: 1.35;
      }

      .editor-shell,
      .output-shell {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        min-height: 560px;
        margin: 0;
        border: 1px solid #c8d0dd;
        border-radius: 8px;
        background: #ffffff;
        color: #172033;
        font: 0.92rem/1.52 "Cascadia Code", "Fira Code", Consolas, monospace;
        overflow: hidden;
      }

      .editor-shell {
        height: 560px;
        resize: vertical;
      }

      .editor-shell:focus-within {
        border-color: #2f6feb;
        box-shadow: 0 0 0 3px rgba(47, 111, 235, 0.15);
      }

      textarea,
      pre {
        font: inherit;
        tab-size: 2;
      }

      textarea,
      .highlight-layer {
        position: absolute;
        inset: 0;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        margin: 0;
        border: 0;
        padding: 16px;
        white-space: pre;
        overflow: auto;
      }

      textarea {
        z-index: 1;
        display: block;
        background: transparent;
        color: transparent;
        caret-color: #172033;
        outline: none;
        resize: none;
      }

      textarea::selection {
        background: rgba(47, 111, 235, 0.24);
        color: transparent;
      }

      .highlight-layer {
        z-index: 0;
        pointer-events: none;
        scrollbar-width: none;
      }

      .highlight-layer::-webkit-scrollbar {
        display: none;
      }

      #output {
        box-sizing: border-box;
        width: 100%;
        min-height: inherit;
        margin: 0;
        border: 0;
        background: transparent;
        color: #172033;
        overflow: auto;
        padding: 48px 16px 16px;
        white-space: pre;
      }

      .token.keyword {
        color: #7a3fb0;
        font-weight: 700;
      }

      .token.type {
        color: #1558a6;
      }

      .token.string {
        color: #176844;
      }

      .token.number,
      .token.literal {
        color: #9a4d00;
      }

      .token.comment {
        color: #687385;
        font-style: italic;
      }

      .token.key {
        color: #0f6a78;
      }

      .token.punctuation {
        color: #59657a;
      }

      button {
        position: absolute;
        top: 10px;
        right: 10px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 38px;
        height: 34px;
        border: 1px solid #bac5d5;
        border-radius: 7px;
        background: #eef3fa;
        color: #1f2c3f;
        cursor: pointer;
      }

      button:hover {
        background: #e2eaf5;
      }

      button[disabled] {
        cursor: not-allowed;
        opacity: 0.52;
      }

      button[data-copied="true"] {
        border-color: #1f8f5f;
        background: #e6f6ee;
        color: #176844;
      }

      button:focus-visible {
        outline: 3px solid rgba(47, 111, 235, 0.25);
        outline-offset: 2px;
      }

      .output-shell[data-state="error"] {
        border-color: #d45142;
        background: #fff7f5;
        color: #5b1d16;
      }

      .output-shell[data-state="error"] #output,
      .output-shell[data-state="error"] .token {
        color: #5b1d16;
      }

      svg {
        width: 17px;
        height: 17px;
      }

      @media (max-width: 860px) {
        .converter {
          grid-template-columns: 1fr;
        }

        .editor-shell,
        .output-shell {
          min-height: 420px;
          height: 420px;
        }

        .output-shell {
          height: auto;
        }
      }
    </style>

    <section class="converter">
      <div class="pane">
        <div class="metadata-grid">
          <div>
            <label for="format-name">1. Response format name</label>
            <input
              id="format-name"
              class="metadata-input"
              maxlength="64"
              pattern="[A-Za-z0-9_-]{1,64}"
              placeholder="The name of the response format"
              autocomplete="off"
            >
            <span class="metadata-hint">Use letters, numbers, underscores, or dashes. Maximum length is 64.</span>
          </div>
          <div>
            <label for="format-description">2. Response format description</label>
            <input
              id="format-description"
              class="metadata-input"
              placeholder="A description of what the response format is for"
              autocomplete="off"
            >
            <span class="metadata-hint">Used by the model to determine how to respond in the format.</span>
          </div>
        </div>
        <label for="source">3. C# Class</label>
        <div class="editor-shell">
          <pre id="source-highlight" class="highlight-layer" aria-hidden="true"></pre>
          <textarea id="source" spellcheck="false" wrap="off"></textarea>
        </div>
      </div>
      <div class="pane">
        <label for="output">Output: MAF Response Format</label>
        <div class="output-shell">
          <button type="button" title="Copy MAF Response Format" aria-label="Copy MAF Response Format">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" stroke-width="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" stroke="currentColor" stroke-width="2" stroke-linecap="round"></path>
            </svg>
          </button>
          <pre id="output">${MAF_EMPTY_OUTPUT}</pre>
        </div>
      </div>
    </section>
  `;

  class CsharpSchemaMafConverter extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" }).append(template.content.cloneNode(true));
      this.currentSchemaText = "";
      this.copyTimer = 0;
      this.handleSourceInput = this.handleSourceInput.bind(this);
      this.handleMetadataInput = this.handleMetadataInput.bind(this);
      this.handleCopy = this.handleCopy.bind(this);
      this.handleSourceScroll = this.handleSourceScroll.bind(this);
    }

    connectedCallback() {
      this.nameInput = this.shadowRoot.getElementById("format-name");
      this.descriptionInput = this.shadowRoot.getElementById(
        "format-description",
      );
      this.source = this.shadowRoot.getElementById("source");
      this.sourceHighlight = this.shadowRoot.getElementById("source-highlight");
      this.output = this.shadowRoot.getElementById("output");
      this.outputShell = this.shadowRoot.querySelector(".output-shell");
      this.copyButton = this.shadowRoot.querySelector("button");

      if (!this.nameInput.value.trim()) {
        this.nameInput.value =
          this.getAttribute("format-name") || this.getAttribute("name") || "name";
      }

      if (!this.descriptionInput.value.trim()) {
        this.descriptionInput.value =
          this.getAttribute("format-description") ||
          this.getAttribute("description") ||
          "description";
      }

      if (!this.source.value.trim()) {
        this.source.value = this.getAttribute("value") || DEFAULT_SAMPLE;
      }

      this.nameInput.addEventListener("input", this.handleMetadataInput);
      this.descriptionInput.addEventListener("input", this.handleMetadataInput);
      this.source.addEventListener("input", this.handleSourceInput);
      this.source.addEventListener("scroll", this.handleSourceScroll);
      this.copyButton.addEventListener("click", this.handleCopy);
      this.updateInputHighlight();
      this.updateSchema();
    }

    disconnectedCallback() {
      this.nameInput.removeEventListener("input", this.handleMetadataInput);
      this.descriptionInput.removeEventListener(
        "input",
        this.handleMetadataInput,
      );
      this.source.removeEventListener("input", this.handleSourceInput);
      this.source.removeEventListener("scroll", this.handleSourceScroll);
      this.copyButton.removeEventListener("click", this.handleCopy);
      clearTimeout(this.copyTimer);
    }

    handleSourceInput() {
      this.updateInputHighlight();
      this.updateSchema();
    }

    handleMetadataInput() {
      this.updateSchema();
    }

    handleSourceScroll() {
      this.sourceHighlight.scrollTop = this.source.scrollTop;
      this.sourceHighlight.scrollLeft = this.source.scrollLeft;
    }

    updateInputHighlight() {
      this.sourceHighlight.innerHTML = `${highlightCsharp(this.source.value)}\n`;
      this.handleSourceScroll();
    }

    updateSchema() {
      const input = this.source.value.trim();
      const name = this.nameInput.value.trim();
      const description = this.descriptionInput.value.trim();

      if (!input || !name || !description) {
        this.currentSchemaText = "";
        this.output.textContent = MAF_EMPTY_OUTPUT;
        this.outputShell.dataset.state = "empty";
        this.copyButton.disabled = true;
        return;
      }

      try {
        const responseFormat = convertCsharpToMafResponseFormat(input, {
          name,
          description,
        });
        this.currentSchemaText = formatSchema(responseFormat);
        this.output.innerHTML = highlightJson(this.currentSchemaText);
        this.outputShell.dataset.state = "ready";
        this.copyButton.disabled = false;
      } catch (error) {
        const errorText = formatSchema(formatConversionError(error));
        this.currentSchemaText = "";
        this.output.innerHTML = highlightJson(errorText);
        this.outputShell.dataset.state = "error";
        this.copyButton.disabled = true;
      }
    }

    async handleCopy() {
      if (!this.currentSchemaText) {
        return;
      }

      await copyText(this.currentSchemaText);
      this.markCopied();
    }

    markCopied() {
      this.copyButton.dataset.copied = "true";
      this.copyButton.title = "Copied";
      this.copyButton.setAttribute("aria-label", "Copied");
      clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => {
        this.copyButton.dataset.copied = "false";
        this.copyButton.title = "Copy MAF Response Format";
        this.copyButton.setAttribute("aria-label", "Copy MAF Response Format");
      }, 1500);
    }
  }

  if (!customElements.get("csharp-json-schema-maf-converter")) {
    customElements.define(
      "csharp-json-schema-maf-converter",
      CsharpSchemaMafConverter,
    );
  }
}

function formatConversionError(error) {
  if (error instanceof SchemaConversionError) {
    return {
      code: error.code,
      path: error.path,
      message: error.message,
    };
  }

  return {
    code: "UnexpectedError",
    path: "$",
    message: error && error.message
      ? error.message
      : "Unexpected conversion failure.",
  };
}

async function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export {
  convertCsharpToMafResponseFormat,
  normalizeResponseFormatMetadata,
  RESPONSE_FORMAT_NAME_PATTERN,
  MAF_EMPTY_OUTPUT,
};
