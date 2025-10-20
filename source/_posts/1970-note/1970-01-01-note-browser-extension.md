---
layout: post
title: 瀏覽器擴充套件筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note]
permalink: note-browser-extension/
---

本篇作為書籤用途，記錄網路上的關於開發瀏覽器擴充套件的參考資料

## 專案架構

如果你想要是使用 TypeScript 來開發擴充套件，可以參考 [chibat/chrome-extension-typescript-starter](https://github.com/chibat/chrome-extension-typescript-starter) 這個專案架構，開發環境、TS 轉 JS 等設定都已經處理好了，使用起來相當順手。

## 發行

要發行到 Chrome Web Store 網路上比較常看到使用 [DrewML/chrome-webstore-upload](https://github.com/DrewML/chrome-webstore-upload) 這個套件，而 Firefox 則會使用 [mozilla/web-ext](https://github.com/mozilla/web-ext)。

但我推薦使用 [LinusU/wext-shipit](https://github.com/LinusU/wext-shipit) 這 node 套件，可以輕鬆將你的擴充套件發行到 Chrome、Firefox、Opera，而且使用放非常簡單，基本上只要把必要的 ID、SECRET 等參數在環境中設定好，自動化上架只要一行搞定。

例如要透過 npx 來執行發行擴充套件的動作，可以參考以下指令：

```
npm install @wext/shipit && npx shipit chrome ./dist-chrome
```

## Chrome 開發資訊

- [Chrome 插件开发全攻略 sxei/chrome-plugin-demo](https://github.com/sxei/chrome-plugin-demo)
- [Chrome Extension 開發與實作](https://ithelp.ithome.com.tw/users/20079450/ironman/1149)
- [Chrome extension 開發分享](https://medium.com/@sj82516/chrome-extension-%E9%96%8B%E7%99%BC%E5%88%86%E4%BA%AB-99ba7957e22a)

## AngularJS in TypeScript

- [TypeScript + AngularJs Controller 撰寫方式](https://dotblogs.com.tw/joysdw12/2016/01/05/typescript_angularjs_controller)
- [jpreecedev/TypeScriptAngularJSDemo](https://github.com/jpreecedev/TypeScriptAngularJSDemo)
- [tastejs/todomvc](https://github.com/tastejs/todomvc/blob/gh-pages/examples/typescript-angular/readme.md)

---

參考資料：

- [Webpack 中文說明](https://www.webpackjs.com/concepts/entry-points/#%E5%8D%95%E4%B8%AA%E5%85%A5%E5%8F%A3-%E7%AE%80%E5%86%99-%E8%AF%AD%E6%B3%95)
- [Dynamic loading of content script (chrome extension)](https://stackoverflow.com/questions/25726131/dynamic-loading-of-content-script-chrome-extension)
