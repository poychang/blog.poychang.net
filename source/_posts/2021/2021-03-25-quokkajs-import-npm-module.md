---
layout: post
title: 在 Quokka.js 環境下使用 npm 第三方模組
date: 2021-03-25 14:14
author: Poy Chang
comments: true
categories: [Typescript, Javascript, Develop, Tools]
permalink: quokkajs-import-npm-module/
---

如果有在寫 JavaScript 或 TypeScript，那麼 [Quokka.js](https://quokkajs.com/) 絕對是一個讓你隨手測試程式碼的好用工具，可以為當前的程式碼提供即時的執行結果回饋，讓我們可以直接在編輯器中看到運行後的結果，非常方便！不過有時候要測試的程式需要第三方套件，或是其他相依的檔案需要匯入，這時候在 Quokka.js 的環境下可以怎麼操作呢？

>其實動作相當簡單，但好像都沒有人特別提這件事，甚至有人誤以為一定要 Quokka.js PRO 才能這樣做，所以筆記一下。

就跟我們建立一個空白的 Node.js 專案差不多，我以要使用 [Lodash](https://lodash.com/) 為例，大致上的步驟如下：

1. 建立空資料夾
2. 執行 `npm init` 產生 `package.json`
3. 使用 npm 安裝所需要的第三方套件，例如 `npm install lodash`
4. 新增 js 或 ts 檔，例如 `playground.ts`
5. 在檔案上方 `import` 所需要的第三方套件，例如 `import * as _ from 'lodash';`
6. 搞定！

下面一張圖應該就可以讓你更了解上面做了啥：

![Quokka.js 操作畫面](https://i.imgur.com/CnHK9wh.png)

特別一提的是，圖中的第 9 行，用到 Quokka.js PRO 才支援的 Live Value Display，在後方加上註解和問號 `//?` 就可以顯示當前的資料內容，方常方便！不過 Community 用 `console.log` 也是可以做到就是了。

----------

參考資料：

* [Quokka.js Docs](https://quokkajs.com/docs/)
