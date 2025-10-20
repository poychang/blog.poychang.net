---
layout: post
title: 在 SQL Server 中取得欄位說明
date: 2017-03-08 12:00
author: Poy Chang
comments: true
categories: [SQL, Develop]
permalink: sql-server-table-field-description/
---

SQL Database 的資料表是允許我們在上面輸入欄位說明的，我們可以透過此欄位更容易資料表內的各個欄位的用途，不過要查看的時候都都要透過 SQL Server Management Studio 的介面去查，有一點不方便，這時候可以使用這篇的 SQL 來快速查詢

我們撰寫的資料表欄位描述如下圖：

![資料表欄位描述](http://i.imgur.com/nekiVPl.png)

直接用下面的 SQL 查詢語法，即可幫助我們查看所需資料表的欄位描述：

```sql
SELECT
    a.TABLE_NAME                as 表格名稱,
    b.COLUMN_NAME               as 欄位名稱,
    b.DATA_TYPE                 as 資料型別,
    b.CHARACTER_MAXIMUM_LENGTH  as 最大長度,
    b.COLUMN_DEFAULT            as 預設值,
    b.IS_NULLABLE               as 允許空值,
    (
        SELECT
            value
        FROM
            fn_listextendedproperty (NULL, 'schema', 'dbo', 'table', 
                                     a.TABLE_NAME, 'column', default)
        WHERE
            name='MS_Description' 
            and objtype='COLUMN' 
            and objname Collate Chinese_Taiwan_Stroke_CI_AS=b.COLUMN_NAME
    ) as 欄位備註
FROM
    INFORMATION_SCHEMA.TABLES  a
    LEFT JOIN INFORMATION_SCHEMA.COLUMNS b ON (a.TABLE_NAME=b.TABLE_NAME)
WHERE
    TABLE_TYPE='BASE TABLE'
ORDER BY
    a.TABLE_NAME, ordinal_position
```

上面的程式碼的查詢結果如下：

![查詢結果](http://i.imgur.com/IkxLspS.png)

----------

參考資料：

* [在 SQL Server 2005 中取得所有欄位定義的方法(含備註欄位)](http://blog.miniasp.com/post/2007/11/05/How-to-get-detailed-Data-Dictionary-in-SQL-Server-2005.aspx)