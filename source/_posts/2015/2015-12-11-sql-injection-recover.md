---
layout: post
title: 被 SQL Injection 改掉系統預存程序及管理者密碼
date: 2015-12-11 10:01
author: Poy Chang
comments: true
categories: [SQL]
permalink: sql-injection-recover/
---

舊系統維護久了難免會遇見程 SQL Injection 攻擊，真的遇上了。

這次是被透過一些駭客工具，透過該站台開放的 Web Service，利用 SQL Injection 手法所攻擊造成，紀錄本次修復方法，如下。

```sql
--透過下列指令，列出系統所有擴展預存程序
use master
EXEC sp_helpextendedproc

--sp_dropextendedproc 此為系統內建的移除擴展預存程序之功能，這次攻擊有被改寫，因此要先用dbcc指令移除並重建
dbcc dropextendedproc('sp_dropextendedproc')

--以下為此次攻擊被改寫的擴展預存程序，及其回復指令
--sp_OACreate
EXEC sp_dropextendedproc 'sp_OACreate'
EXEC sp_addextendedproc Sp_OACreate ,@dllname ='odsole70.dll' 

--xp_cmdshell C:\Program Files\Microsoft SQL Server\MSSQL\Binn\xplog70.dll
EXEC sp_dropextendedproc 'xp_cmdshell'
EXEC sp_addextendedproc xp_cmdshell ,@dllname ='xplog70.dll' 

--xp_dirtree  C:\Program Files\Microsoft SQL Server\MSSQL\Binn\xpstar.dll
EXEC sp_dropextendedproc 'xp_dirtree'
EXEC sp_addextendedproc xp_dirtree ,@dllname ='xpstar.dll' 

--此為修改系統使用者密碼之功能，這次攻擊有被改寫，因此要移除後重建預存程序
EXEC sp_dropextendedproc 'sp_password'

```

----------

參考資料：

* [查詢 SQL Server 中安裝的擴充預存程序](https://msdn.microsoft.com/zh-tw/library/ms164637%28v=sql.120%29.aspx?f=255&MSPPError=-2147217396)
* [從 SQL Server 中移除擴充預存程序](https://msdn.microsoft.com/zh-tw/library/ms164755%28v=sql.120%29.aspx?f=255&MSPPError=-2147217396)
* [將擴充預存程序加入至 SQL Server](https://msdn.microsoft.com/zh-tw/library/ms164653%28v=sql.120%29.aspx?f=255&MSPPError=-2147217396)
