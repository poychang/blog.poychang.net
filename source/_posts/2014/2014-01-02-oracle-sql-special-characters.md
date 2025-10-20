---
layout: post
title: Oracle 的 SQL 報表出現斷行錯誤
date: 2014-01-02 11:30
author: Poy Chang
comments: true
categories: [SQL]
permalink: oracle-sql-special-characters/
---

今天要分享 Oracle 執行 SQL 報表時，可能會出現的錯誤狀況。

你是否曾經遇過，SQL 明明就是正確的，在 TOAD 上可以順利執行，但上傳到 Oracle 之後，卻頻頻出現出現錯誤，或毫無作用。解決的方法是：

* 將多餘的空行刪掉
* 注意 SQL 最後一行有沒有加 `/` 符號

但將多餘的空行刪掉，這動作究竟是為甚麼呢？

這時候可以檢查你的SQL檔案，並顯示特殊字元看看，在 notepad 顯示特殊字元的方法很簡單：

檢視 > 特殊字元 > **顯示所有字元**（參考下圖：顯示特殊字元）

![顯示特殊字元](http://i.imgur.com/9Jf6bpi.jpg)

你會發現每個換行的地方會出現 `CR CF` 的符號，這就是傳說中的換行符號，一般來說換行符號是 `CR CF` 配對產生的，`CR` 表示增加一行，`CF`表示游標移到下一行起點。

**在 Oracle 中，如果換行字元不正確，那該 SQL 是無法正確執行的。**因此如果你的檔案有換行，但無法正確執行（如下圖：不可執行的版本）那可能就是你的換行符號有問題了。

可執行的版本

![可執行的版本](http://i.imgur.com/oDX1swo.jpg)

不可執行的版本

![不可執行的版本](http://i.imgur.com/YEVDqJf.jpg)
