---
layout: post
title: 快速更新 SSMS 自動完成文字（Intellisense）的快取
date: 2017-07-01 12:00
author: Poy Chang
comments: true
categories: [SQL, Tools]
permalink: refresh-ssms-intellisense-cache-to-update-scheme/
---
SQL Server Management Studio (SSMS) 是一款免費又好用的 SQL Server 管理工具，和資料庫打交道的時候，大部分的時候都是透過他來執行資料庫作業，但最近有一點困擾，在建立一張新的 Table 或任何新的物件，Intellisense 就失效了，這時候除了重開 SSMS 還有一種做法。

SSMS 連接上資料庫後，會自動建立給 Intellisense 使用的快取，讓你方便撰寫 SQL 程式，要更新這快取，可以執行 `Edit` > `IntelliSense` > `Refresh Local Cache` 來更新，快速鍵為 `CTRL` + `SHIFT` + `R`。

![Refresh Local Cache](http://i.imgur.com/0PeYse1.png)

更新完快取之後，就可以開心地繼續寫 SQL 囉～

## 後記

將 SSMS 更新至 SQL Server Management Studio 17.1 之後發現，SSMS 開始會**自動更新快取**，真的是越來越貼心了。

----------

參考資料：

* [下載 SQL Server Management Studio (SSMS)](https://docs.microsoft.com/zh-tw/sql/ssms/download-sql-server-management-studio-ssms?WT.mc_id=DT-MVP-5003022)
* [SQL SERVER – How to Refresh SSMS Intellisense Cache to Update Schema Changes](https://blog.sqlauthority.com/2013/07/04/sql-server-how-to-refresh-ssms-intellisense-cache-to-update-schema-changes/)