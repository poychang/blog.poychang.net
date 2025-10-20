---
layout: post
title: 處理 OpenQuery 參數長度有 8000 字元的限制
date: 2016-08-30 15:39
author: Poy Chang
comments: true
categories: [SQL]
permalink: sql-openquery-8000-limit/
---

在 SQL Server 做跨異質資料庫（如 Oracle）查詢的時候，可以透過 DBLink 方式建立連結，然後透過 OpenQuery 的方式做查詢，但是如果遇到要執行的 SQL 語法，超級無敵長的時候，就會發生 `'SELECT xxxxxxxx' 開頭的 字元字串 太長。最大長度為 8000。` 這樣的錯誤訊息。

>建立 DBLink 後，使用 OpenQuery 的基本方法，可以參考這篇：[SQL Server 使用 OpenQuery 以及傳遞參數](http://blog.poychang.net/sql-server-open-query/)

嚴格來說，`'SELECT xxxxxxxx' 開頭的 字元字串 太長。最大長度為 8000。` 這錯誤訊息不是 OpenQuery 的限制，而是因為 VARCHAR 變數型態的關係，才出現這樣的錯誤訊息。

>NVARCHAR 是 Unicode 的可變長度型態，最長可以放 4000 字元，VARCHAR 則最長可以放 8000 字元。

在 [OpenQuery MSDN](https://msdn.microsoft.com/zh-tw/library/ms188427.aspx) 文件中，可以看到 OpenQuery 的參數 `query` 的說明是：`這是在連結伺服器中執行的查詢字串。該字串的最大長度是 8 KB。`，因此有了長度 8000 的限制。

該怎麼辦呢？

爬問許久找到一種解法，可以透過下面 `EXECUTE` 指令，來忽略這項檢查

```sql
Execute a pass-through command against a linked server
{ EXEC | EXECUTE }
    ( { @string_variable | [ N ] 'command_string [ ? ]' } [ + ...n ]
        [ { , { value | @variable [ OUTPUT ] } } [ ...n ] ]
    ) 
    [ AS { LOGIN | USER } = ' name ' ]
    [ AT linked_server_name ]
[;]
```

上面這是 [EXECUTE MSDN](https://msdn.microsoft.com/zh-tw/library/ms188332.aspx) 的 Scheme，以簡單的實例來說，就是用像這樣的語句：

```sql
EXECUTE (@Query) AT LinkedServer
```

其中 `@Query` 就可以使用 NVARCHAR(MAX) 的變數型態，讓 8000 的字元限制消失。

>NVARCHAR(MAX) 可存放多達 2GB 的資料量，目的是為了取代舊 SQL Server 的 text、ntext、image 等型態

此文件中也說明 `@string_variable` 這區域變數可以是任何 char、varchar、nchar 或 nvarchar 資料類型，其中包含 (max) 資料類型在內。

## 總結

如果是在 SQL 語句中，要調用其他資料庫的資料，且所用的查詢條件不會太長時，這種情境使用 OpenQuery 來做資料調用是滿適合的。但如果查詢的條件超級無敵長（超過 8KB），可以將該查詢改寫成系統預存程序、使用者定義預存程序、CLR 預存程序等方式，使用 EXECUTE 的方式來做。

----------

參考資料：

* [Execute very long statements in TSQL using sp_executesql](http://stackoverflow.com/questions/8151121/execute-very-long-statements-in-tsql-using-sp-executesql)
* [OPENQUERY (Transact-SQL)](https://msdn.microsoft.com/zh-tw/library/ms188427.aspx)
* [EXECUTE (Transact-SQL)](https://msdn.microsoft.com/zh-tw/library/ms188332.aspx)
