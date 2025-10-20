---
layout: post
title: Wallaby.js Logging 進階技巧
date: 2017-08-14 23:32
author: Poy Chang
comments: true
categories: [Develop, Tools, Test]
permalink: wallaby-js-advanced-logging/
---
使用 Wallaby.js 時，有三個非常值得學習的 Logging 技巧，用來直接在編輯器中輸出運算結果或測試狀態，讓測試一目了然。

>本篇程式碼截圖取自 [Wallaby.js 官網文件](https://wallabyjs.com/docs/)

## 使用 console.log

最簡單也最常用的方法，就是使用 `console.log(anything)` 將結果輸出`。

![console.log](http://i.imgur.com/H77u2qz.gif)

## 使用 Identifier Expressions

另外一種簡單的使用方式，舊式直接在編輯器中打上要輸出的變數名稱，這樣在該行後面就會顯示該變數的內容，效果跟第一種用法很像，但只是適用於變數，例如 `a`，而不能輸出屬性或方法 `a.b` 或 `a.b()`。

![Identifier Expressions](http://i.imgur.com/3BEWYyB.gif)

## 使用 Live Comments

這是最強大的方法，使用特定的註解方式來控制輸出。

>如果你使用的是 CoffeeScript 會因為[編譯器的限制](https://github.com/jashkenas/coffeescript/issues/2365)，這些方法可能無法使用。

### 輸出值 Values

使用 `/*?*/` 來輸出變數內容，效果和第二個方法一樣。

![使用 /*?*/ 輸出內容](http://i.imgur.com/c5wLlAz.png)

強大的是，你可以在 `?` 後面寫 JavaScript！例如 `/*? ($ ? persoin.id : '-')*/`，來控制輸出的內容，其中 `$` 代表該註解所依附的變數對象。

![用程式碼控制輸出內容](http://i.imgur.com/O2Tk4Ha.gif)

更強大的是，Live Comments 內建了一般 `console.log` 所辦不到的功能，例如呈現 Promise 的 resolve 結果，或是 Observable 所回傳的值，這點超級強大！

![內建輸出 Promise 或 Observable 結果的功能](http://i.imgur.com/RCm2KaH.gif)

### 輸出測試效能 Performance Testing

想知道這段程式碼跑了多久？沒問題！在任何表示式（Expressions）後面，使用 `/*?.*/` 就可以呈現該程式所花費的時間。

![使用 /*?.*/ 顯示執行所花費的時間](http://i.imgur.com/rA6k50q.gif)

如果該表示式（Expressions）執行了多次，Wallaby.js 會自動幫你加總執行時間，並算出平均執行時間、最快和最慢的執行時間。

![自動統計執行時間](http://i.imgur.com/WakZoUQ.gif)

自動統計執行時間的方法，也可以用在陣列的 `map()` 方法中，這些基於執行多次的方法，都可以使用 Wallaby.js 來輸出執行時間。

![也可用在陣列運算中](http://i.imgur.com/776bLdw.gif)

### 可以把 ? 改掉嗎

這個是可以在 Wallaby.js 的設定檔中做修改，只要新增或修改 `hints` 屬性中的 `commentAutoLog` 即可，如下面的設定方式，就可以把 `/*?*/` 換成 `/*out:*/` 來使用。

```js
module.exports = function (wallaby) {
  return {
    ...

    hints: {
      commentAutoLog: 'out:'
    }
  };
};
```

----------

參考資料：

* [Wallaby.js Introduction: Advanced Logging](https://wallabyjs.com/docs/intro/advanced-logging.html#live-comments)