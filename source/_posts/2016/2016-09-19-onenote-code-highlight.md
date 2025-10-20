---
layout: post
title: 在 OneNote 加入高亮程式碼
date: 2016-09-19 10:40
author: Poy Chang
comments: true
categories: [Tools]
permalink: onenote-code-highlight/
---

最近開始用 OneNote 寫筆記，當要記錄一些程式碼的時候，卻發現 OneNote 沒有支援程式碼高亮的功能，看著一片黑黑的程式碼，閱讀起來不太舒服，但又總不能手工一個個調顏色吧，找了一些工具來幫忙是一定要的！

小抱怨一下，看過 [OneNote UserVoice 的回應](https://onenote.uservoice.com/forums/245490-onenote-developer-apis/suggestions/5688964-syntax-highlighting)，覺得可惜呀。

>Thanks for the suggestion, but this feature is too specific to software developers for OneNote. - Gareth Jones July 17, 2014

## GEM for OneNote

Google 關鍵字：onenote code highlight，出現最多的就是 GEM for OneNote 這個套件，看了一下[官方網站](http://www.onenotegem.com/gem-for-onenote.html)感覺挺不錯的，而且從 OneNote 2010 就開始支援，一直到目前最新的 2016 都有，功能強大，不過缺點就是要付費（$33），口袋能支援了話，是個不錯的選擇。

我就等賺多一點的時候，再來選購了。

## 中國程序員 liufeng 製作的 OneNote 套件

中國的開發者 liufeng 修改已經很久沒更新的 NoteHighLight 增益集，使之可以支援 OneNote 2013 的版本，經網友測試 2016 也可以使用，可以至作者的網站：[OneNote2013 代码语法高亮插件](http://blog.home-ml.com/wordpress/?p=1) 選擇下載對應 32 或 64-bit 版本安裝。

這作法先收起來，也許可以找天學他將 NoteHighLight 增益集修改成繁體中文版來用。

## Repl.it

再來看到 [DEMO 大的部落格](http://demo.tc/post/830)分享到這個線上服務 Repl.it，可以上 [https://repl.it/languages](https://repl.it/languages) 這個網站，選擇你要的高亮程式碼語言，然後貼上你的程式碼，此服務會依據你選的語言幫你完成高亮的動作，然後你在將處理後的程式碼，複製至 OneNote 就搞定了。

動作有點多，但還算簡單，列為備選。

## Productivity Power Tools

Visual Studio 必裝的擴充套件之一，[Productivity Power Tools](https://github.com/Microsoft/VS-PPT) 這工具之強大就不贅述，其中有一個功能 HTML Copy 就是你在 Visual Studio 上複製的程式碼，會保留編輯畫面的程式碼樣式，因此你貼到 OneNote 或是 Word 等編輯軟體時，就會保留程式碼高亮的效果（連編輯器的背景顏色也一起保留了...）。

相當不錯用！但是每次都要開 Visual Studio 來處理程式碼，會不會有點牛刀小用。

## MarkdownPad

測試使用 Productivity Power Tools 後得到了一點啟示，他保留程式碼樣式的方式是藉由包含 HTML 標籤的方式來處理，Repl.it 也是用同樣的方式來達到程式碼高亮的目的，這讓我想到我經常使用的 [MarkdownPad](http://markdownpad.com/) 搭配 Github Flavored 做程式碼高亮，我只要在熟習的 MarkdownPad 中使用 Markdown 語法，就可以輕鬆產出漂亮的程式碼，然後在按 `F6` 或點選 `Tools > Preview Markdown in Browser`，就可以匯出至瀏覽器，然後再複製成果至 OneNote 就搞定了。

![Preview Markdown in Browser](http://i.imgur.com/AaKgQHj.png)

都是使用我熟習的工具和語法，決定就是你了！

----------

參考資料：

* [OneNote2013 代码语法高亮插件](http://blog.home-ml.com/wordpress/?p=1)
* [讓 OneNote 擁有程式碼高亮 (syntax highlight) 與實際執行片段程式碼 (live code)](http://demo.tc/post/830)
