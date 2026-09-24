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

完整程式碼請參考 [codex-reset-checker.js](https://raw.githubusercontent.com/poychang/scriptable-widgets/main/widgets/codex-reset-checker/codex-reset-checker.js)。

## 安裝與設定

在 App Store 下載並安裝 [Scriptable](https://apps.apple.com/tw/app/scriptable/id1405459188) 之後，可以透過以下方式來建立這個 Scriptable Widget，安裝方式如下：

1. 開啟 Scriptable，點選右上方 ＋ 按鈕，新增一個名為 `Codex Reset Checker` 的 Script，並將上面所提供的程式碼貼進去
![01-create-new-script](https://files.poychang.net/storage/codex-reset-checker-scriptable-widgets/01-create-new-script.jpeg)

2. 從你電腦中取得 `~/.codex/auth.json` 內容，再將完整的 JSON 貼到 Script 上方的 `AUTH_JSON` 物件中
![02-paste-the-code](https://files.poychang.net/storage/codex-reset-checker-scriptable-widgets/02-paste-the-code.jpeg)

3. 回到桌面並開啟編輯模式，準備加入 Widget 小工具
![03-press-screen-to-select-and-add](https://files.poychang.net/storage/codex-reset-checker-scriptable-widgets/03-press-screen-to-select-and-add.jpeg)

4. 選擇`加入小工具`，會開啟 Scriptable 讓你選擇要加入 Widget 的尺寸，建議選擇 medium
![04-add-widget](https://files.poychang.net/storage/codex-reset-checker-scriptable-widgets/04-add-widget.jpeg)

5. 點選桌面上的 Scriptable Widget 並選擇`編輯小工具`，接著 Script 挑選剛剛建立好的 `Codex Reset Checker`
![06-edit-the-widget](https://files.poychang.net/storage/codex-reset-checker-scriptable-widgets/06-edit-the-widget.jpeg)
![07-select-the-script](https://files.poychang.net/storage/codex-reset-checker-scriptable-widgets/07-select-the-script.jpeg)

6. 即可在桌面上看到你的 Codex 使用量 
![08-now-you-can-check-your-usage](https://files.poychang.net/storage/codex-reset-checker-scriptable-widgets/08-now-you-can-check-your-usage.jpeg)

其中 `~/.codex/auth.json` 是 Codex 用來存放認證資訊的檔案，你必須在你得電腦上安裝 Codex CLI 並完成登入，才能取得這個檔案。

<script type=“module” src=“/assets/components/ask-chatgpt.js”></script>
<ask-chatgpt q=“如何取得自己電腦的 .codex/auth.json 檔案位置與內容”></ask-chatgpt>

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
- [rushhiii/Scriptable-iOSWidgets](https://github.com/rushhiii/Scriptable-iOSWidgets)
