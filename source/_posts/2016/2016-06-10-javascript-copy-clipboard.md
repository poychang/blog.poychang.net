---
layout: post
title: 只用 JavaScript 實作一鍵複製
date: 2016-06-10 00:12
author: Poy Chang
comments: true
categories: [Javascript]
permalink: javascript-copy-clipboard/
---

很久以前要做到在網頁上提供貼心的「一鍵複製」小功能，會需要用到 flash。後來 JavaScript 有了 `execCommand` 之後，搭配 jQuery 來選定 HTML 元素，實作一鍵複製的功能就變得輕鬆許多。

那麼在沒有使用 jQuery 框架的情況下，要如何達成一樣的功能呢？

將功能剝絲抽繭，一項項列出來：

----------

項目 | jQuery 的作法
--- | ---
等待 DOM 載入完畢 | `$(document).ready()`
綁定按鈕動作 | `$(document).on(events, selector, data, handler)`
找到要複製的區塊 | [jQuery Selectors](https://api.jquery.com/category/selectors/)
選取目標 | `window.getSelection()`
執行複製 | `document.execCommand('copy')`

----------

接著就會發現，只有前三項動作有用到 jQuery 的框架，而剛好這三項都有純 JavaScript 的方式來取代，所以我們把項目的作法修改一下：

----------

項目 | JavaScript 的作法
--- | ---
等待 DOM 載入完畢 | `document.addEventListener("DOMContentLoaded")`
綁定按鈕動作 | `EventTarget.addEventListener()`
找到要複製的區塊 | `document.querySelector()` 或 `document.getElementById()`
選取目標 | `window.getSelection()`
執行複製 | `document.execCommand('copy')`

----------

如此一來，我們可以就可以用最原始的 JavaScript 不引用任何框架，就達成一鍵複製。

## 完整程式碼

<script src="https://gist.github.com/poychang/2b8682c29383920eac49c238e36b8ae2.js"></script>

## 不要重複造輪子

有同樣需求的人很多，因此也有人完成了一樣的功能，而且做得更完善，[clipboard.js](https://clipboardjs.com/) 這套也不引用任何框架，且使用 ES6 語法寫成的工具，十分方便好用，有需要的可以試試看。

不要重複造輪子，的確節省了很多開發時間，而且在暇時之餘，更可以研究高手們的程式碼是如何寫的精粹。唯一的缺點就是，畢竟東西不是自己寫的，必須要花一點時間閱讀文件，然後測試看看，是否手邊適合專案。

----------

參考資料：

* [Click button copy to clipboard using jQuery](http://stackoverflow.com/questions/22581345/click-button-copy-to-clipboard-using-jquery)
* [Copy to Clipboard in pure javascript](http://coderexample.com/copy-to-clipboard-in-pure-javascript/)
