---
layout: post
title: Visual Studio Code 1.0 釋出囉！
date: 2016-04-15 01:41
author: Poy Chang
comments: true
categories: [Tools]
permalink: visual-studio-code-release-and-configure-language/
---

開放原始碼的 [Visual Studio Code 1.0](https://www.visualstudio.com/zh-tw/products/code-vs.aspx) 釋出囉！這是一個基於 electron 打造的編輯器，可以跨平台使用，不論你使用的是 OS X、Linux、Windows 都可以使用，而且超過30多種的語言支援，想寫 JavaScript、C#、C++、PHP、Java 還是 Python，通通都可以，詳細語言列表請[參閱完整語言清單](https://code.visualstudio.com/docs/languages/overview)

Visual Studio Code 1.0 釋出後，介面會自動轉乘系統預設的語系，因此中文作業系統的使用者，介面就**自動變中文**了！

只是中文的介面讓我一時之間不知道如何下指令了...

如果要切換回英文介面，可以按 `Ctrl + Shift + P` 輸入`語言`，執行`設定語言`， 這時候 VSCode 會將 locale.json 開啟，只要把其中 `"locale":"zh-TW"` 改成 `"locale":"en-US"`，儲存後重新啟動，即可將 Visual Studio Code 介面切換成英文語系。

![設定語言](http://i.imgur.com/oUXS0wh.png)
