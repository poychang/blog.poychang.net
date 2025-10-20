---
layout: post
title: 快速安裝 AdventureWorks 資料庫
date: 2016-08-26 17:20
author: Poy Chang
comments: true
categories: [SQL, Tools]
permalink: install-adventureworks-sql-database/
---

有時候在看 MSDN 的文件練習 SQL 語法時，會看到官方的範例 SQL，如果你想要執行該 SQL 試試看了話，你必須要先有一個 SQL Server 和一個資料庫，我通常會用 SQL Server Express 搭配 LocalDB 來當作測試環境，而官方的範例資料幾乎都是用 Adventure Works 的資料（以前是用NorthWind），那我們怎樣快速還原資料庫呢？請看下去。

>要還原 Adventure Works 資料庫的資料，方法很多種，可以用 Script 還原或用資料庫還原的方式，不管哪種方式，你所需要的檔案都可以從[這裡下載](https://msftdbprodsamples.codeplex.com/)或到[Sql Server Samples GitHub](https://github.com/Microsoft/sql-server-samples/releases/tag/adventureworks)，下載時要注意你`所需要的版本`和`還原的方式`就是了。

我個人偏好使用 Script 的方式安裝，主要是因為下載的檔案比較小，感覺會比較快完成測試環境建置。

## 使用 Script 還原的方式（以 2014 為例）

1. 下載 `Adventure Works 2014 OLTP Script.zip`。注意！是 Script 的方式唷
2. 解壓縮下載的檔案，會得到 CSV和 `instawdb.sql` 檔案
    * 請複製到 `C:\Program Files\Microsoft SQL Server\120\Tools\Samples\Adventure Works 2014 OLTP Script\`
    * 這是因為等一下要執行的 SQL 預設是指向這裡，當然，你也可以修改成自己想要的
3. 使用 SSMS 開啟壓縮檔中的 `instawdb.sql`
4. 點選 SSMS 的`工具列` > `查詢` > `SQLCMD模式` 開啟此功能
5. 接著`執行`此 Script 即可

## 使用資料庫還原的方式（以 2014 為例）

1. 下載 `Adventure Works DW 2014 Full Database Backup.zip`。注意！是 Backup 的方式唷
2. 解壓縮下載的檔案，會得到一個 `AdventureWorks2014.bak` 檔案
    * 64 位元系統，請複製至 `C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\Backup`
    * 32 位元系統，請複製至 `C:\Program Files (x86)\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\Backup`
    * 這是預設的路徑，當然，你也可以修改成自己想要的
3. 開啟 SSMS 並新增查詢視窗
4. 接著`執行`下面的 SQL 指令即可

```sql
USE [master]
RESTORE DATABASE AdventureWorks2014
FROM disk= 'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\Backup\AdventureWorks2014.bak'
WITH MOVE 'AdventureWorks2014_data' TO 'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\AdventureWorks2014.mdf',
MOVE 'AdventureWorks2014_Log' TO 'C:\Program Files\Microsoft SQL Server\MSSQL12.MSSQLSERVER\MSSQL\DATA\AdventureWorks2014.ldf'
,REPLACE
```

不管是使用 Script 還原還是使用資料庫方式，[這裡](https://msftdbprodsamples.codeplex.com/releases)可以下載到相關的安裝方式 PDF，可以參考看看。

## 同場加映

使用 LocalDB 時，我老是忘記資料庫的連線名稱，在此備註一下：

1. SQL Server 2012 Express LocalDB 的連線伺服器名稱：`(localdb)\v11.0`
2. SQL Server 2014 Express LocalDB 的連線伺服器名稱：`(localdb)\MSSQLLocalDB`

----------

參考資料：

* [AdventureWorks2014 installation script](http://sqlblog.com/blogs/john_paul_cook/archive/2014/08/10/adventureworks2014-installation-script.aspx)
