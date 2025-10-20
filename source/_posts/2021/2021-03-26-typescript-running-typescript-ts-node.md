---
layout: post
title: 如何直接執行 TypeScript 指令檔
date: 2021-03-26 13:13
author: Poy Chang
comments: true
categories: [Typescript, Javascript]
permalink: typescript-running-typescript-ts-node/
---

TypeScript 是 JavaScript 的超集合，在使用上 TypeScript 必須轉譯成 JavaScript 才能讓 JavaScript V8 引擎執行，這時你就需要像是 [TSC](https://www.typescriptlang.org/docs/handbook/compiler-options.html) 或 [Babel](https://babeljs.io/) 這類的轉譯器幫忙。不過有時候我們只是想單純的執行 TypeScript 指令檔，然後盡速得到結果，這時候 [ts-node](https://www.npmjs.com/package/ts-node) 就是你的好幫手。

## 安裝

基本上你可以把 [ts-node](https://www.npmjs.com/package/ts-node) 看作是 Node.js + TSC，使用上有兩種安裝方式：

### 全域安裝

如果想要可以直接使用 `ts-node` 來執行，例如 `ts-node your-typescript-file.ts` 這樣的方式，則需要將 typescript 和 ts-node 安裝在全域環境，安裝指令如下：

```
npm install -g typescript ts-node
```

### 專案資料夾內安裝

一般比較常見的方式是，開一個新的專案資料夾，然後使用 `npm init` 建立 package.json 設定檔，然後使用下列方式安裝 typescript 和 ts-node 安裝到此專案資料夾中，並透過 `-D` （相當於 `--save-dev`）設定成開發時期依賴的套件，安裝指令如下：

```
npm install -D typescript ts-node
```

接著我們就可以在專案資料夾下，使用 `npx ts-node your-typescript-file.ts` 指令來執行特定檔案。

## 使用方式

這裡你可以簡單測試看看，或者參考我的動作，先建立一個 `tsnode-playground` 資料夾，然後在裡面執行以下指令/動作：

1. `npm init`
2. `npm install -D typescript ts-node`
3. `npm install cowsay` 這是安裝來顯示些有趣畫面的...
4. 建立 `playground.ts` 檔案
5. 輸入下面的程式碼
6. 執行 `npx ts-node playground.ts`

```ts
import * as cowsay from 'cowsay';
console.log(
    cowsay.say({
        text: "I'm a moooodule",
        e: 'oO',
        T: 'U ',
    })
);
```

看個下面圖片，你應該就馬上有感覺了 😅

![參考畫面](https://i.imgur.com/Z3BMtiy.png)

另外特別提一下，執行時可以加上 `-T` 或 `--transpile-only` 執行參數，這會讓 ts-node 使用 TypeScript 快速轉譯功能，使之轉譯時不檢查型別，讓處理速度更快一些。

其他執行參數的就到 [ts-node 的 GitHub](https://github.com/TypeStrong/ts-node#cli-options) 上面看了。

## 後記

ts-node 背後是先將 TypeScript 轉譯成 JavaScript 並放在快取中，然後再調用 Node.js 來執行，所以不建議直接拿他來放在正式環境執行，畢竟他中間多做了一次編譯動作，執行起來一定會比 Node.js 慢上許多。

----------

參考資料：

* [TypeStrong/ts-node](https://github.com/TypeStrong/ts-node)
* [How To Run TypeScript Scripts with ts-node](https://www.digitalocean.com/community/tutorials/typescript-running-typescript-ts-node)
* [ts-node 應用](https://paulcodinglife.blogspot.com/2017/03/ts-node.html)
