---
layout: post
title: 我愛 Web Component
date: 2026-05-28 14:41
author: Poy Chang
comments: true
categories: [Typescript, Javascript, Develop, AI, App]
permalink: i-like-web-component/
---

我愛 Web Component！特別是在 AI 快速發展的現在。

> Web Component 是一種瀏覽器原生支援的技術，讓開發者可以創建可重用的自定義元素，並且在不同的框架和庫中使用。相比於傳統的 JavaScript 函式庫或框架，Web Component 提供了更高的封裝性和可重用性，使得開發者可以更輕鬆地構建複雜的用戶界面。

<script type="module" src="/assets/components/ask-bing.js"></script>
<ask-bing q="什麼是 Web Component？技術細節和優缺點是什麼？">什麼是 Web Component</ask-bing>

嚴格來說不只是 Web Component 這項技術，任何能夠將功能封裝成一個獨立模組的技術我都很喜歡，除了它原本的設計目標就是為了封裝功能之外，在能用 AI 加速程式開發的情境下，我們可以透過 AI 快速創作出一個想要的功能，然後將它封裝成一個 Web Component，這樣就可以在任何需要的地方使用這個功能，而不會和既有程式或環境造成衝突。

我的部落格是用 Markdown 的方式撰寫內容，有時候我會想直接在文章中放一些互動的工具，過去，我可以直接在文章中放一些 JavaScript 程式碼來呈現，例如[PowerPoint 版面尺寸計算機：pixels to cm](https://blog.poychang.net/calculating-powerpoint-slide-dimensions-pixels-to-cm/)這篇裡面的計算機工具。

基本的實現原理是，在 Markdown 文章中放入一個 `<div id="app"></div>` 的容器，然後在同一篇文章中放入一段 JavaScript 程式碼，來操作這個容器，實現我們想要的功能。如下程式碼片段：

```html
<div id="app"></div>
<script type="text/javascript">
    // 獲取 div 容器的引用
    const appDiv = document.getElementById('app');
    // 在這裡放入一些 JavaScript 程式碼來實現功能
</script>
```

但如果有多篇文章都想要呈現同一個工具的時候，就會需要在每篇文章中都放入相同的 JavaScript 程式碼，這樣卻會造成維護上的困難。

當然，是有方法可以避免這樣的問題的，例如我可以將 JavaScript 程式碼放在一個獨立的檔案中，然後在需要的文章中引入這個檔案，而這樣的做法其實就很接近 Web Component 的概念了。

後來，當我想要在文章中放入一些互動工具的時候，我就會選擇使用 Web Component 的方式來實現，將功能封裝成一個獨立的模組，然後在需要的地方使用這個模組，而不會和既有程式或環境造成衝突。只要在文章中放入一段如下程式碼片段即可呈現我想要的功能：

```html
<script type="module" src="/assets/components/the-web-component.js"></script>
<the-web-component></the-web-component>
```

因此不論是像[將 ASP.NET Core 的 AppSettings.json 轉成適合 Azure Web App 用的環境變數格式](https://blog.poychang.net/convert-appsettings-to-azure-webapp-environment-variables/)這篇文章的簡單的轉換工具，或是像[一場舒服的 Vibe Coding](https://blog.poychang.net/comfy-vibe-coding-experience/)這篇文章中所插入的 **Ask Bing** 按鈕（這篇文章上方也放了一個 Ask Bing 的 Web Component），都是透過 Web Component 的方式來實現的。

在 AI 時代下，基本上我只要有想法，就可以讓 AI 快速幫我寫出一個 Web Component，然後我就可以直接在需要的地方使用這個 Web Component。至於程式碼細節，放在部落格上的功能基本上不會有太複雜或機敏的功能，因此不需要特別去優化程式碼，功能的實現比較貼近需求。何況在複雜和優化的面向上，AI 的能力也在不斷提升，因此我覺得這樣的開發流程是非常舒服的。

---

參考資料：

- [Web Components - MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
- [GitHub - blog.poychang.net /source/assets/components/](https://github.com/poychang/blog.poychang.net/tree/main/source/assets/components)
