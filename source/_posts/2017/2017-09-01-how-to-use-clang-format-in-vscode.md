---
layout: post
title: 如何在 VSCode 中使用 Clang-Format 程式碼格式化工具
date: 2017-09-01 12:00
author: Poy Chang
comments: true
categories: [Tools]
permalink: how-to-use-clang-format-in-vscode/
---
每次都要手動將程式碼排整齊了話，那也太沒生產力了，如果有工具幫你代勞，甚至幫你把一些開發基本規範給套用上去，那人生會美好很多，Clang-Format 是一套我很喜歡的排版工具。

## 前言

在 VS Code 上有很多程式碼美化的工具，可以參考這個[連結](https://marketplace.visualstudio.com/search?target=VSCode&category=Formatters&sortBy=Downloads)，其中我最喜歡的是 [Clang-Format](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format)。

Clang-Format 除了能排版外，還能將 tslint 或是 jslint 一些提示的寫法做自動修正，而且還可以自行客製你的規則或排版樣式。

## 安裝

1. 使用 npm 安裝 clang-format
```
npm install -g clang-format
```

2. 安裝 [Clang-Format](https://marketplace.visualstudio.com/items?itemName=xaver.clang-format) Visual Stuido Code 擴充套件
3. 在專案下新增 `.clang-format` 的檔案 , 內容如下：
```
BasedOnStyle:    Google
Language:        JavaScript
ColumnLimit:     100
```

4. 重新啟動 Visual Studio Code。

## 我的 Clang-Format 設定檔

<script src="https://gist.github.com/poychang/a7e01e342b1dd3fbb24f087712bbaaea.js"></script>

----------

參考資料：

* [使用Clang-format來幫助你美化你的程式碼](https://forum.angular.tw/t/topic/235/2)
* [Clang-Format Style Options](https://clang.llvm.org/docs/ClangFormatStyleOptions.html)
