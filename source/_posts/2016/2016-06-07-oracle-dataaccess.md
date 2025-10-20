---
layout: post
title: 無法載入檔案或組件 - 使用 64 位元版本的 IIS Express
date: 2016-06-07 17:11
author: Poy Chang
comments: true
categories: [CSharp, Develop]
permalink: oracle-dataaccess/
---

使用 C# 連線 Oracle 資料庫時，需要安裝 ODAC (Oracle Data Access Components)，這元件有分 [32 位元](http://www.oracle.com/technetwork/topics/dotnet/utilsoft-086879.html)和 [64 位元](http://www.oracle.com/technetwork/database/windows/downloads/index-090165.html)的版本，除了要用對版本外，不同的 Visual Studio 版本，也需配合[不同的 ODAC 版本](http://www.oracle.com/technetwork/developer-tools/visual-studio/downloads/index.html)。

以為裝對版本就沒事了，正當要測試網站的時候，卻出現這個畫面：

![無法載入檔案或組件 'Oracle.DataAccess' 或其相依性的其中之一。 試圖載入格式錯誤的程式。](http://i.imgur.com/dJhYEGQ.png)

Google 這個錯誤訊息 `無法載入檔案或組件 'Oracle.DataAccess' 或其相依性的其中之一。 試圖載入格式錯誤的程式。`，找到的資料幾乎都是因為版本問題所以出現這狀況，讓我想到會不會是因為 IIS 的支援問題。

IIS Express 預設是使用 32 位元模式來執行，因此如果你的元件是 64 位元的時候，就無法正常運作，要怎麼知道目前所執行的 IIS Express 是用哪種模式執行呢？很簡單，開啟`工作管理員`然後找到 `IIS Express` 這個處理程序就會知道了，如果是 32 位元的程序，他後面就會標註`(32位元)`。

![IIS Express 系統匣](http://i.imgur.com/TxoISJU.png)

謎題解開一半了，再來就是如何開啟 64 位元模式。

Visual Studio 果真是地表上最強的 IDE，裡面的設定多如牛毛，好險有提供`快速啟動`（Ctrl+Q），只要輸入 `iis` 就可以找到相關的設定選項。

![Visual Studio 快速啟動](http://i.imgur.com/fvcCv2r.png)

接著來到`工具` > `選項` > `專案和方案` > `Web 專案`下，將這個選項`將 64 位元版本的 IIS Express 用於網站和專案`勾起來，一切就大功告成了。

![將 64 位元版本的 IIS Express 用於網站和專案](http://i.imgur.com/XeYisBh.png)

----------

參考資料：

* [VS2010修改專案使用x86平台方式](https://dotblogs.com.tw/rainmaker/2012/04/02/71244)
* [使用C#連線oracle資料庫](http://www.erowii.idv.tw/2015/02/ccoracle.html)
* [How do I get IIS Express to launch MVC3 web application with 64 bit 3rd party DLLS](http://stackoverflow.com/questions/10746546/how-do-i-get-iis-express-to-launch-mvc3-web-application-with-64-bit-3rd-party-dl/10793466#10793466)
