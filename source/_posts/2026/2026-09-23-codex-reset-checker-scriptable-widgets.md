---
layout: post
title: 透過 iOS 和 iPadOS 的 Widget 追蹤 Codex 用量
date: 2026-09-23 16:36
author: Poy Chang
comments: true
categories: [Javascript, AI, Tools, App]
permalink: codex-reset-checker-scriptable-widgets/
---

iOS 上的 Widget 很適合拿來建立即時資訊的小工具，於是我就想用他來追蹤 Codex 用量，但正規作法是需要開發 App 才能實現，直到我發現了 [Scriptable](https://scriptable.app/) 這支 App，他可以讓我直接在 iPhone 或 iPad 上撰寫 JavaScript，並建立自己的 Widget，這就開啟了新的可能性。

之前 Will 保哥有分享了他所製作的 [Codex Reset Checker](https://www.npmjs.com/package/@willh/codex-reset-checker) Codex 額度查詢工具，於是乎我就採用這工具背後的查詢機制，並將其整合到 Scriptable Widget 中，讓我可以直接在 iPhone 或 iPad 的桌面上查看 Codex 用量。

> 當然，以下程式碼是請 Codex 幫我寫的。

<script src="https://raw.githubusercontent.com/poychang/scriptable-widgets/main/widgets/codex-reset-checker/codex-reset-checker.js"></script>

在下載並安裝 Scriptable 之後，可以透過以下方式來建立這個 Scriptable Widget，安裝方式如下：

1. 將 [codex-reset-checker.js](./codex-reset-checker.js) 的內容複製到 Scriptable，建立同名腳本。
2. 開啟腳本最上方的 `AUTH_JSON` 設定。
3. 將 `~/.codex/auth.json` 的完整 JSON 貼到 `AUTH_JSON` 物件中。
4. 在 Scriptable 執行一次腳本，確認能正常顯示使用量。
5. 將腳本加入主畫面小工具，選擇 Small、Medium 或 Large 尺寸。

其中 `~/.codex/auth.json` 是 Codex 用來存放認證資訊的檔案，你必須在你得電腦上安裝 Codex CLI 並完成登入，才能取得這個檔案。

請注意！這裡面有非常重要的 Token 資訊，千萬不要隨意洩漏，否則可能會導致你的 Codex 帳號被濫用。

## 工具效果

在 iPhone 的桌面上建立 Scriptable Widget 並設定執行的 Script 為 `codex-reset-checker`，會看到如下效果：

![iPhone 工具效果](https://raw.githubusercontent.com/poychang/scriptable-widgets/main/widgets/codex-reset-checker/iphone-widget.jpg)

同樣，我們也可以在 iPad 的桌面上做到一樣的效果，而下圖是我在 iPad 主畫面的側邊欄加入 Scriptable Widget，並設定執行的 Script 為 `codex-reset-checker` 所看到得效果：

![iPad 側邊欄工具效果](https://raw.githubusercontent.com/poychang/scriptable-widgets/main/widgets/codex-reset-checker/ipad-side-widget.jpg)

---

參考資料：
- [Scriptable：用 JavaScript 打造自己的 iPhone／iPad 自動化工具與 Widget](https://blog.poychang.net/scriptable-widget-introduction/)
- [Codex Reset Checker Scriptable Widgets](https://github.com/poychang/scriptable-widgets/blob/main/widgets/codex-reset-checker/README.md)
