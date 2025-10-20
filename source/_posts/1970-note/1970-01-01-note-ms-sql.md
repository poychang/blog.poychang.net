---
layout: post
title: SQL 指令筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note]
permalink: note-ms-sql/
---

## LocalDB 連線

LocalDB 其實是 SQL Server Express 產品的一部份，如果你要安裝最新版的 SQL Server LocalDB，那就要下載 SQL Server Express 的安裝檔。LocalDB 的安裝檔 `SqlLocalDB.msi` 必須從 SQL Server Express 的安裝檔來下載，執行後選擇[下載媒體]，然後再選擇 LocalDB 的選項，這樣就能下載到對應版本的 LocalDB 安裝檔。

參考資料：[如何下載與升級 SQL Server Express LocalDB 到最新版](https://blog.miniasp.com/post/2020/02/16/install-and-upgrade-sql-server-express-localdb)

SQL Server 2012 Express LocalDB 的連線伺服器名稱：`(localdb)\v11.0`

SQL Server 2014 Express LocalDB 的連線伺服器名稱：`(localdb)\MSSQLLocalDB`

> 官方 [SQL Server 2014 Express LocalDB](https://msdn.microsoft.com/zh-tw/library/hh510202%28v=sql.120%29.aspx) 文件，SQL Server 2014 Express LocalDB 預設執行個體名稱改為 MSSQLLocalDB

參考資料：[升級舊專案中 SQLLOCALDB V11.0 至 V12.0](http://blog.kkbruce.net/2015/12/upgrade-sqllocaldb-v11-to-v12.html#.V8ADJyh97cs)

## SQL 執行順序

![SQL 執行順序](https://i.imgur.com/8jmTSgX.jpg)

## 清除資料庫交易紀錄 Log

REF:[SQL Server 資料庫清除 Log](https://shunnien.github.io/2017/05/27/mssql-clear-log/)

```sql
--- 清除SQL Server Log檔
USE [資料庫名稱]
GO
ALTER DATABASE [資料庫名稱] SET RECOVERY SIMPLE WITH NO_WAIT
DBCC SHRINKFILE(記錄檔邏輯名稱, 1)
ALTER DATABASE [資料庫名稱] SET RECOVERY FULL WITH NO_WAIT
GO
```

## 大量資料批次刪除

REF: [Break large delete operations into chunks](https://sqlperformance.com/2013/03/io-subsystem/chunk-deletes)

如果使用 `DELETE` 指令刪除大量資料時，可能會因為執行時間過長，造成其他也需要該資料表的功能被卡住，而發生 Timeout 的問題，因此可使用下列語法批次刪除特定數量的資料，讓刪除大量資料的動作可以分成一段一段，讓資料庫的交易可以切換。

```sql
SET NOCOUNT ON;
DECLARE @Rowcount INT;
DECLARE @LimitRowcount INT = 100000;

SET @Rowcount = 1;
WHILE @Rowcount > 0
    BEGIN
        BEGIN TRANSACTION;
        DELETE TOP (LimitRowcount) dbo.TargetTable WHERE 1 = 1;
        SET @Rowcount = @@ROWCOUNT;
        COMMIT TRANSACTION;
    END;
```

## 使用 EXISTS 取代 IN

SQL 的 `IN` 非常方便好用，而且可讀性也很好，但是會成為效能優化的瓶頸，因此建議使用 `EXISTS` 取代，除非 `IN` 的參數是純數值的清單。

以下兩種查詢結果是一樣的，但使用 `EXISTS` 的速度較快。

## IN 方式查詢

使用 `IN` 會讓資料庫先執行 `SELECT id FROM TableB` 子查詢，然後將結果存在暫存表中，接著再全表掃描然後掃描暫存表取得符合條件的資料，全表掃描通長是非常耗費資源的。

```sql
SELECT * FROM TableA
WHERE id IN ( SELECT id FROM TableB );
```

## EXISTS 方式查詢

使用 `EXISTS` 時，只要查到一筆資料滿足條件，就會終止查詢動作，而且不會產生暫存表。而且如果設定條件式中有索引（例如 `id`），那麼查詢 `TableB` 時就可以直接查詢索引即可。

```sql
SELECT * FROM TableA A
WHERE EXISTS ( SELECT * FROM TableB B WHERE A.id = B.id );
```

## 設定 In-Memory 資料表

計算最佳 Bucket count 語法

```sql
SELECT
  POWER(2,CEILING( LOG(COUNT(0)) / LOG(2))) AS 'BUCKET_COUNT'
FROM
  (SELECT DISTINCT [索引用的欄位] FROM [資料庫名稱]) T
```

REF:

- [透過參考數值設定In Memory Table的Index](https://edwardkuo.imas.tw/paper/2017/03/22/DataBase/Memorytableindex/)
- [[SQL Server][In-Memory OLTP]記憶內資料表BUCKET_COUNT預估](https://dotblogs.com.tw/stanley14/2016/10/28/234914)

## 基本指令

```sql
UPDATE [TableName] SET [Column1] = 'Value1', [Column2] = 'Value2' WHERE [Condition]
DELETE FROM [TableName] WHERE [Condition]
INSERT INTO [TableName] ([Column1], [Column2], ...) VALUES ('Value1', 'Value2', ...)
INSERT INTO "TableName1" ("Column1", "Column2", ...) SELECT "Column3", "Column4", ... FROM "TableName2";
```

## 隨機挑選資料

使用 SQL 語法的 `TOP n` 來指定取得筆數，再用 `ORDER BY` 的方式，來取得 `NEWID()` 產生的亂數資料，並排序。

```sql
SELECT TOP 1 * FROM [TableName] WHERE [Condition] ORDER BY NEWID()
```

## 查詢筆數重複的資料

依 stud_no 欄位查詢 stud_no 欄位資料重複的筆數

```sql
SELECT stud_no, COUNT(*) AS count
FROM student_data
GROUP BY stud_no
HAVING (COUNT(*) > 1)
```

## 查詢時顯示群組資料中最新一筆的資料(需要一個不重複的 Identity 欄位)

依 Date 欄位做判斷，顯示最新的紀錄

```sql
SELECT ID, Number, Price, Date
FROM test AS T
WHERE Date IN (
        SELECT TOP 1 DATE
        FROM test
        WHERE ID = T.ID
        ORDER BY Date DESC
        )
```

## 資料庫定序

SQL Server 的預設定序

- 台灣地區 `Chinese_Taiwan_Stroke_CI_AS`
- 美國地區 `SQL_Latin1_General_CP1_CI_AS`

縮寫

- Case Sensitivity CI 指定不區分大小寫，CS 指定區分大小寫
- Accent Sensitivity AI 指定不區分腔調字，AS 指定區分腔調字(通常用在歐洲語系，如法文)
- Kana Sensitivity KS 指定區分假名(用在日文)
- Width Sensitivity WS 指定區分全半形，不寫就表示不區分

## 執行計畫

參考資料：[SQL 觀看執行計畫重點](http://jengting.blogspot.tw/2013/12/executionplan-keypoint.html)

在分析執行計畫時，我們不能只單看成本(CBO)，應該將 Statistics I/O、Statistics Time 也列入分析中，可以先執行以下 SQL 來觀察 Logical Read 最高是發生在哪一個

```sql
SET STATISTICS IO ON;
SET STATISTICS TIME ON;
```

## 查詢 SQL Server 目前使用者連線數

查詢目前連線數

```sql
USE master

SELECT cntr_value AS User_Connections
FROM sys.sysperfinfo AS sp
WHERE sp.object_name = 'SQLServer:General Statistics'
    AND sp.counter_name = 'User Connections'
```

查詢目前連線明細

```sql
USE master

SELECT c.session_id
    ,c.connect_time
    ,s.login_time
    ,c.client_net_address
    ,s.login_name
    ,s.STATUS
FROM sys.dm_exec_connections c
LEFT JOIN sys.dm_exec_sessions s ON c.session_id = s.session_id
```

刪除指定的 Session 只要下 `KILL 52` 其中 `52` 是透或上面方法查到的 `session_id`，這樣就可以把咬住的連線踢出去了

## DBLink 連線至另一台資料庫做查詢的動作

參考文章：[SQL Server 使用 OpenQuery 以及傳遞參數](http://blog.poychang.net/sql-server-open-query/)

先建立連結

```sql
exec sp_addlinkedserver 'DBName','','SQLOLEDB','127.0.0.1'
exec sp_addlinkedsrvlogin 'DBName','false',null,'sa','password'
go
```

以下範例，在資料表前，先指定哪一個 SQL Server

```sql
INSERT INTO Area
SELECT * FROM DBName.dbo.Area WHERE AreaID = 'US0002'
```

## 建立完 DBlink 後，可使用 OPENQUERY 的方式，對遠端資料庫做查詢

```sql
SELECT * FROM OPENQUERY(PROD, 'select sysdate from dual')
```

## 使用 SQL 指令取得資料表內的欄位名稱

```sql
SELECT NAME, *
FROM SYSCOLUMNS
WHERE ID = Object_ID('[TableName]')
```

## 使用 SQL 指令取得所有資料表名稱

```sql
SELECT TABLE_NAME, *
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
AND TABLE_CATALOG = 'DatabaseName'
AND TABLE_NAME = 'TableName'
```

## 使用 SQL 指令查詢資料庫定序(Collation)

```sql
SELECT name, collation_name
FROM sys.databases
WHERE name = N'DatabaseName';
```

## 列出資料庫檔案的實際路徑

每個 Databse 檔案都會可以由 sys.master_files 這個 View 取得相關的資訊。如果要列出 DB Server 中資料庫檔案的實際路徑，就可以透過以下的 SQL 得到。

```sql
SELECT name, physical_name FROM sys.master_files;
```

## INFORMATION_SCHEMA 是訊息資料庫，其中保存著關於資料庫伺服器所維護的所有其他資料庫的訊息

透過下列 SQL，可找出有具有特定關鍵字的預存程序或函數

```sql
SELECT ROUTINE_NAME, ROUTINE_DEFINITION
FROM INFORMATION_SCHEMA.ROUTINES
WHERE ROUTINE_DEFINITION LIKE '%poy%'
AND ROUTINE_TYPE='PROCEDURE'
ORDER BY ROUTINE_NAME
```

## 取得資料表的欄位名稱

```sql
SELECT NAME FROM SYSCOLUMNS WHERE ID=OBJECT_ID('TableName')
```

搜尋資料庫所有欄位名稱，可以使用這兩種語法

```sql
SELECT * FROM SYSCOLUMNS
SELECT * FROM SYS.COLUMNS
```

取得資料庫中所有資料表的名稱，可以使用以下語法

```sql
SELECT * FROM INFORMATION_SCHEMA.TABLES
```

## 小技巧

```sql
sp_who          --可查看目前連線id
sp_spaceused    --可查詢每一個資料表用了多少硬碟空間 ex: EXEC sp_spaceused Leads
kill            --可直接把該連線刪除
```

## 查詢相關的版本資料

```sql
SELECT RIGHT(LEFT(@@VERSION,25),4) N'產品版本編號' ,
    SERVERPROPERTY('ProductVersion') N'版本編號',
    SERVERPROPERTY('ProductLevel') N'版本層級',
    SERVERPROPERTY('Edition') N'執行個體產品版本',
    DATABASEPROPERTYEX('master','Version') N'資料庫的內部版本號碼',
    @@VERSION N'相關的版本編號、處理器架構、建置日期和作業系統'
```

## 取得資料庫中各 Table 的使用量資訊

參考資料：[https://dotblogs.com.tw/rainmaker/2012/02/02/67498](https://dotblogs.com.tw/rainmaker/2012/02/02/67498)

```sql
SET NOCOUNT ON

--http://msdn.microsoft.com/zh-tw/library/ms188414.aspx
--更新目前資料庫中之所有物件的頁面及 (或) 資料列計數
DBCC UPDATEUSAGE(0)

-- DB size.
EXEC sp_spaceused

-- Table row counts and sizes.
CREATE TABLE #t
(
    [name] NVARCHAR(128),
    [rows] CHAR(11),
    reserved VARCHAR(18),
    data VARCHAR(18),
    index_size VARCHAR(18),
    unused VARCHAR(18)
)

--把每個Table使用的資訊存到#t之中
INSERT #t EXEC sys.sp_MSforeachtable 'EXEC sp_spaceused ''?'''

--依使用空間較大的依序排列並顯示MB
SELECT *
, LTRIM(STR(CAST(LEFT(reserved,LEN(reserved)-3) AS NUMERIC(18,0)) / 1024, 18)) + 'MB' AS reservedSize_M
, LTRIM(STR(CAST(LEFT(data,LEN(data)-3) AS NUMERIC(18,0)) / 1024, 18)) + 'MB' AS dataSize_M
, LTRIM(STR(CAST(LEFT(index_size,LEN(index_size)-3) AS NUMERIC(18,0)) / 1024, 18)) + 'MB' AS indexSize_M
FROM #t
ORDER BY CAST(LEFT(data,LEN(data)-3) AS NUMERIC(18,0)) DESC

-- 顯示總共筆數及總共使用資訊
SELECT SUM(CAST([rows] AS int)) AS [rows]
, LTRIM(STR(SUM(CAST(LEFT(reserved,LEN(reserved)-3) AS NUMERIC(18,0))) / 1024, 18)) + 'MB' AS sumOfreservedSize_M
, LTRIM(STR(SUM(CAST(LEFT(data,LEN(data)-3) AS NUMERIC(18,0))) / 1024, 18)) + 'MB' AS sumOfdataSize_M
, LTRIM(STR(SUM(CAST(LEFT(index_size,LEN(index_size)-3) AS NUMERIC(18,0))) / 1024, 18)) + 'MB'AS sumOfindexSize_M
FROM #t

DROP TABLE #t
```

## 將欄位識別值種子歸零

```sql
DBCC CHECKIDENT(dbo.TableName, RESEED, 0)
```

## DATEPART 取得年、月、日及其它時間單位值

```sql
SELECT getdate()
    ,DatePart(year, getdate()) AS '年'
    ,DatePart(month, getdate()) AS '月'
    ,DatePart(day, getdate()) AS '日'
    ,DatePart(dayofyear, getdate()) AS '本年一月一號至今的天數'
    ,DatePart(week, getdate()) AS '第N週'
    ,DatePart(weekday, getdate()) AS '星期幾(代號)' --星期日 = 1
    --星期一 = 2
    --星期二 = 3
    --星期三 = 4
    --星期四 = 5
    --星期五 = 6
    --星期六 = 7
    ,DATENAME(Weekday, GETDATE()) AS '星期幾'
    ,DatePart(hour, getdate()) AS '時'
    ,DatePart(minute, getdate()) AS '分'
    ,DatePart(second, getdate()) AS '秒'
    ,DatePart(millisecond, getdate()) AS '毫秒'
```

資料來源：[MSDN DATEPART (Transact-SQL)](https://msdn.microsoft.com/zh-tw/library/ms174420.aspx?f=255&MSPPError=-2147217396)

## SQL Server 資料類型對應

SQL Server 和 .NET 是以不同的型別系統為基礎，可以使用下表來推斷 SQL Server 和 .NET 型別類型對應。

REF: [SQL Server 資料類型對應](https://docs.microsoft.com/zh-tw/dotnet/framework/data/adonet/sql-server-data-type-mappings)

- `DbType` 列舉：指定 .NET 資料提供者的欄位、屬性或 Parameter 物件的資料類型。([Docs](https://docs.microsoft.com/zh-tw/dotnet/api/system.data.dbtype))
- `SqlDbType` 列舉：指定欄位的 SQL Server 特定的資料型別與屬性，以便在 SqlParameter 中使用。([Docs](https://docs.microsoft.com/zh-tw/dotnet/api/system.data.sqldbtype))

| SQL Server Database Engine 類型             | .NET Framework 類型 | SqlDbType 列舉型別           | DbType 列舉型別                                 |
| ------------------------------------------- | ------------------- | ---------------------------- | ----------------------------------------------- |
| BIGINT                                      | Int64               | `SqlDbType.BigInt`           | `DbType.Int64`                                  |
| BINARY                                      | Byte[]              | `SqlDbType.VarBinary`        | `DbType.Binary`                                 |
| bit                                         | Boolean             | `SqlDbType.Bit`              | `DbType.Boolean`                                |
| char                                        | String、Char[]      | `SqlDbType.Char`             | `DbType.AnsiStringFixedLength`, `DbType.String` |
| date (SQL Server 2008 及以後版本)           | Datetime            | `SqlDbType.Date`             | `DbType.Date`                                   |
| Datetime                                    | Datetime            | `SqlDbType.DateTime`         | `DbType.DateTime`                               |
| datetime2 (SQL Server 2008 及以後版本)      | Datetime            | `SqlDbType.DateTime2`        | `DbType.DateTime2`                              |
| datetimeoffset (SQL Server 2008 及以後版本) | DateTimeOffset      | `SqlDbType.DateTimeOffset`   | `DbType.DateTimeOffset`                         |
| decimal                                     | Decimal             | `SqlDbType.Decimal`          | `DbType.Decimal`                                |
| FILESTREAM attribute (varbinary(max))       | Byte[]              | `SqlDbType.VarBinary`        | `DbType.Binary`                                 |
| FLOAT                                       | Double              | `SqlDbType.Float`            | `DbType.Double`                                 |
| image                                       | Byte[]              | `SqlDbType.Binary`           | `DbType.Binary`                                 |
| int                                         | Int32               | `SqlDbType.Int`              | `DbType.Int32`                                  |
| money                                       | Decimal             | `SqlDbType.Money`            | `DbType.Decimal`                                |
| NCHAR                                       | String、Char[]      | `SqlDbType.NChar`            | `DbType.StringFixedLength`                      |
| ntext                                       | String、Char[]      | `SqlDbType.NText`            | `DbType.String`                                 |
| NUMERIC                                     | Decimal             | `SqlDbType.Decimal`          | `DbType.Decimal`                                |
| NVARCHAR                                    | String、Char[]      | `SqlDbType.NVarChar`         | `DbType.String`                                 |
| real                                        | Single              | `SqlDbType.Real`             | `DbType.Single`                                 |
| rowversion                                  | Byte[]              | `SqlDbType.Timestamp`        | `DbType.Binary`                                 |
| smalldatetime                               | Datetime            | `SqlDbType.DateTime`         | `DbType.DateTime`                               |
| SMALLINT                                    | Int16               | `SqlDbType.SmallInt`         | `DbType.Int16`                                  |
| SMALLMONEY                                  | Decimal             | `SqlDbType.SmallMoney`       | `DbType.Decimal`                                |
| sql_variant                                 | Object              | `SqlDbType.Variant`          | `DbType.Object`                                 |
| text                                        | String、Char[]      | `SqlDbType.Text`             | `DbType.String`                                 |
| time (SQL Server 2008 及以後版本)           | TimeSpan            | `SqlDbType.Time`             | `DbType.Time`                                   |
| timestamp                                   | Byte[]              | `SqlDbType.Timestamp`        | `DbType.Binary`                                 |
| TINYINT                                     | Byte                | `SqlDbType.TinyInt`          | `DbType.Byte`                                   |
| UNIQUEIDENTIFIER                            | Guid                | `SqlDbType.UniqueIdentifier` | `DbType.Guid`                                   |
| varbinary                                   | Byte[]              | `SqlDbType.VarBinary`        | `DbType.Binary`                                 |
| varchar                                     | String、Char[]      | `SqlDbType.VarChar`          | `DbType.AnsiString`, `DbType.String`            |
| xml                                         | Xml                 | `SqlDbType.Xml`              | `DbType.Xml`                                    |

## SQL 字串樣式轉換為日期格式 CAST 和 CONVERT

臨時找資料，方便又上手的查詢日期方式：

```sql
-- 換掉 Table 和 Date_Column 名稱
SELECT * FROM Table WHERE CONVERT(varchar(8), [Date_Column], 112) = '20210425'
```

字串格式轉換為日期格式範例：

```sql
-- SQL Server string to date / datetime conversion - datetime string format sql server
-- MSSQL string to datetime conversion - convert char to date - convert varchar to date
-- Subtract 100 from style number (format) for yy instead yyyy (or ccyy with century)
SELECT convert(datetime, 'Oct 23 2012 11:01AM', 100) -- mon dd yyyy hh:mmAM (or PM)
SELECT convert(datetime, 'Oct 23 2012 11:01AM') -- 2012-10-23 11:01:00.000

-- Without century (yy) string date conversion - convert string to datetime function
SELECT convert(datetime, 'Oct 23 12 11:01AM', 0) -- mon dd yy hh:mmAM (or PM)
SELECT convert(datetime, 'Oct 23 12 11:01AM') -- 2012-10-23 11:01:00.000

-- Convert string to datetime sql - convert string to date sql - sql dates format
-- T-SQL convert string to datetime - SQL Server convert string to date
SELECT convert(datetime, '10/23/2016', 101) -- mm/dd/yyyy
SELECT convert(datetime, '2016.10.23', 102) -- yyyy.mm.dd ANSI date with century
SELECT convert(datetime, '23/10/2016', 103) -- dd/mm/yyyy
SELECT convert(datetime, '23.10.2016', 104) -- dd.mm.yyyy
SELECT convert(datetime, '23-10-2016', 105) -- dd-mm-yyyy
-- mon types are nondeterministic conversions, dependent on language setting
SELECT convert(datetime, '23 OCT 2016', 106) -- dd mon yyyy
SELECT convert(datetime, 'Oct 23, 2016', 107) -- mon dd, yyyy
-- 2016-10-23 00:00:00.000
SELECT convert(datetime, '20:10:44', 108) -- hh:mm:ss
-- 1900-01-01 20:10:44.000

-- mon dd yyyy hh:mm:ss:mmmAM (or PM) - sql time format - SQL Server datetime format
SELECT convert(datetime, 'Oct 23 2016 11:02:44:013AM', 109)
-- 2016-10-23 11:02:44.013
SELECT convert(datetime, '10-23-2016', 110) -- mm-dd-yyyy
SELECT convert(datetime, '2016/10/23', 111) -- yyyy/mm/dd
-- YYYYMMDD ISO date format works at any language setting - international standard
SELECT convert(datetime, '20161023')
SELECT convert(datetime, '20161023', 112) -- ISO yyyymmdd
-- 2016-10-23 00:00:00.000
SELECT convert(datetime, '23 Oct 2016 11:02:07:577', 113) -- dd mon yyyy hh:mm:ss:mmm
-- 2016-10-23 11:02:07.577
SELECT convert(datetime, '20:10:25:300', 114) -- hh:mm:ss:mmm(24h)
-- 1900-01-01 20:10:25.300
SELECT convert(datetime, '2016-10-23 20:44:11', 120) -- yyyy-mm-dd hh:mm:ss(24h)
-- 2016-10-23 20:44:11.000
SELECT convert(datetime, '2016-10-23 20:44:11.500', 121) -- yyyy-mm-dd hh:mm:ss.mmm
-- 2016-10-23 20:44:11.500

-- Style 126 is ISO 8601 format: international standard - works with any language setting
SELECT convert(datetime, '2008-10-23T18:52:47.513', 126) -- yyyy-mm-ddThh:mm:ss(.mmm)
-- 2008-10-23 18:52:47.513
SELECT convert(datetime, N'23 شوال 1429  6:52:47:513PM', 130) -- Islamic/Hijri date
SELECT convert(datetime, '23/10/1429  6:52:47:513PM',    131) -- Islamic/Hijri date

-- Convert DDMMYYYY format to datetime - sql server to date / datetime
SELECT convert(datetime, STUFF(STUFF('31012016',3,0,'-'),6,0,'-'), 105)
-- 2016-01-31 00:00:00.000
-- SQL Server T-SQL string to datetime conversion without century - some exceptions
-- nondeterministic means language setting dependent such as Mar/Mär/mars/márc
SELECT convert(datetime, 'Oct 23 16 11:02:44AM') -- Default
SELECT convert(datetime, '10/23/16', 1) -- mm/dd/yy U.S.
SELECT convert(datetime, '16.10.23', 2) -- yy.mm.dd ANSI
SELECT convert(datetime, '23/10/16', 3) -- dd/mm/yy UK/FR
SELECT convert(datetime, '23.10.16', 4) -- dd.mm.yy German
SELECT convert(datetime, '23-10-16', 5) -- dd-mm-yy Italian
SELECT convert(datetime, '23 OCT 16', 6) -- dd mon yy non-det.
SELECT convert(datetime, 'Oct 23, 16', 7) -- mon dd, yy non-det.
SELECT convert(datetime, '20:10:44', 8) -- hh:mm:ss
SELECT convert(datetime, 'Oct 23 16 11:02:44:013AM', 9) -- Default with msec
SELECT convert(datetime, '10-23-16', 10) -- mm-dd-yy U.S.
SELECT convert(datetime, '16/10/23', 11) -- yy/mm/dd Japan
SELECT convert(datetime, '161023', 12) -- yymmdd ISO
SELECT convert(datetime, '23 Oct 16 11:02:07:577', 13) -- dd mon yy hh:mm:ss:mmm EU dflt
SELECT convert(datetime, '20:10:25:300', 14) -- hh:mm:ss:mmm(24h)
SELECT convert(datetime, '2016-10-23 20:44:11',20) -- yyyy-mm-dd hh:mm:ss(24h) ODBC can.
SELECT convert(datetime, '2016-10-23 20:44:11.500', 21)-- yyyy-mm-dd hh:mm:ss.mmm ODBC
------------

-- SQL Datetime Data Type: Combine date & time string into datetime - sql hh mm ss
-- String to datetime - mssql datetime - sql convert date - sql concatenate string
DECLARE @DateTimeValue varchar(32), @DateValue char(8), @TimeValue char(6)

SELECT @DateValue = '20120718',
       @TimeValue = '211920'
SELECT @DateTimeValue =
convert(varchar, convert(datetime, @DateValue), 111)
+ ' ' + substring(@TimeValue, 1, 2)
+ ':' + substring(@TimeValue, 3, 2)
+ ':' + substring(@TimeValue, 5, 2)
SELECT
DateInput = @DateValue, TimeInput = @TimeValue,
DateTimeOutput = @DateTimeValue;
/*
DateInput   TimeInput   DateTimeOutput
20120718    211920      2012/07/18 21:19:20 */
```

資料來源：[MSDN CAST 和 CONVERT (Transact-SQL)](https://msdn.microsoft.com/zh-tw/library/ms187928.aspx)

## 查詢 SQL Agent 內排程相關訊息

```
--Enable : 代表這Job是否有被啟動
--Job Name : 代表Job名稱
--aDescription : Job的描述
--Next Run Time : 代表下次此Job執行時間，若是出現兩筆相同資料，表示此Job被設定兩個執行時間
--Job ID : 代表Job在資料庫的唯一代碼

SELECT SB.Enabled
    ,SB.NAME AS Job_Name
    ,SB.Description AS aDescription
    ,CASE Next_Run_Date
        WHEN '0' THEN '0'
        ELSE Cast(LEFT(Next_Run_Date, 4) AS CHAR(4)) + '/' + Cast(Substring(Cast(Next_Run_Date AS CHAR(8)), 5, 2) AS CHAR(2)) + '/' + Cast(RIGHT(Next_Run_Date, 2) AS CHAR(2))
        END + ' '
        + LEFT(Replicate('0', 6 - Len(sc.Next_Run_Time)) + Cast(sc.Next_Run_Time AS VARCHAR(6)), 2)
        + ':'
        + Substring(Replicate('0', 6 - Len(sc.Next_Run_Time)) + Cast(sc.Next_Run_Time AS VARCHAR(6)), 3, 2)
        + ':'
        + RIGHT(Replicate('0', 6 - Len(sc.Next_Run_Time)) + Cast(sc.Next_Run_Time AS VARCHAR(6)), 2) AS Next_Run_Time
    ,SB.Job_ID
FROM msdb.dbo.sysjobschedules AS sc
LEFT OUTER JOIN msdb.dbo.sysjobs AS sb ON sc.Job_ID = SB.Job_ID
```

有上面資訊後，就可以去查詢每個 Job 的執行狀況跟該 Job 內執行那些 Step，更重要的是若是發現其中有些 Step 執行時間有越來越長時

```
SELECT SH.instance_id
    ,SH.SERVER AS oserver
    ,SB.NAME AS job_name
    ,SH.step_id
    ,SH.step_name
    ,Cast(LEFT(SH.run_date, 4) AS CHAR(4)) + '/'
    + Cast(Substring(Cast(SH.run_date AS CHAR(8)), 5, 2) AS CHAR(2))
    + '/' + Cast(RIGHT(SH.run_date, 2) AS CHAR(2)) AS rundate
    ,LEFT(Replicate('0', 6 - Len(SH.run_time))
    + Cast(SH.run_time AS VARCHAR(6)), 2)
    + ':'
    + Substring(Replicate('0', 6 - Len(SH.run_time))
    + Cast(SH.run_time AS VARCHAR(6)), 3, 2)
    + ':'
    + RIGHT(Replicate('0', 6 - Len(SH.run_time))
    + Cast(SH.run_time AS VARCHAR(6)), 2) AS runtime
    ,LEFT(Replicate('0', 6 - Len(SH.run_duration))
    + Cast(SH.run_duration AS VARCHAR(6)), 2)
    + ':'
    + Substring(Replicate('0', 6 - Len(SH.run_duration))
    + Cast(SH.run_duration AS VARCHAR(6)), 3, 2)
    + ':'
    + RIGHT(Replicate('0', 6 - Len(SH.run_duration))
    + Cast(SH.run_duration AS VARCHAR(6)), 2) AS cotime
    ,CASE run_status
        WHEN 0 THEN 'Failed'
        WHEN 1 THEN 'Succeeded'
        WHEN 2 THEN 'Retry'
        WHEN 3 THEN 'Canceled'
        WHEN 5 THEN 'Unknown'
        END AS jobstatus
    ,SH.message AS omessage
    ,SH.operator_id_emailed
    ,SH.operator_id_netsent
    ,SH.operator_id_paged
    ,SH.retries_attempted
FROM msdb.dbo.sysjobhistory AS sh
LEFT OUTER JOIN msdb.dbo.sysjobs AS SB ON SH.job_id = SB.job_id
WHERE SB.NAME = 'XXXX'
```

## 使用 DBCC LOG 來檢視交易記錄檔內容。

`DBCC LOG`: This command is used to view the transaction log for the specified database.

Syntax: `DBCC log ({dbid|dbname}, [, type={-1|0|1|2|3|4}])`

Where: dbid or dbname - Enter either the dbid or the name of the database

type - is the type of output, and includes these options:

- 0 - minimum information (operation, context, transaction id)
- 1 - more information (plus flags, tags, row length, description)
- 2 - very detailed information (plus object name, index name, page id, slot id)
- 3 - full information about each operation
- 4 - full information about each operation plus hexadecimal dump of the current transaction log's row.
- -1 - full information about each operation plus hexadecimal dump of the current transaction log's row, plus Checkpoint Begin, DB Version, Max XDESID by default, type = 0

To view the transaction log for the master database, run the following command: `DBCC log (master)`

## 雜項

```sql
--若有大批新增或修改資料，建議執行更新統計資料和更新資料列計數,以避免查詢資料會有效能緩慢的問題
--參考資料網站http://msdn.microsoft.com/en-us/library/ms174384.aspx
--更新單一桶資料庫統計資料
USE 資料庫名稱;
GO
EXEC sp_updatestats;
GO
```

```sql
--參考資料網站http://msdn.microsoft.com/en-us/library/ms187348.aspx
--更新單一資料表統計資料
USE 資料庫名稱;
GO
UPDATE STATISTICS 資料表名稱;
GO
```

```sql
--參考資料網站http://msdn.microsoft.com/en-us/library/ms188414.aspx
--參考資料網站http://msdn.microsoft.com/zh-tw/library/ms188414.aspx
--更新單一資料庫中所有物件的資料列計數(Updating page or row counts or both for all objects in the current database)
USE 資料庫名稱;
GO
DBCC UPDATEUSAGE (0);
GO
--更新某一資料表的資料列計數(Updating page or row count information for a table)
USE 資料庫名稱;
GO
DBCC UPDATEUSAGE ('資料庫名稱','資料表名稱');
GO
--更新某一資料表的索引頁面或資料列計數，可透過EXEC sp_help '資料表名稱';取得索引名稱
USE 資料庫名稱;
GO
DBCC UPDATEUSAGE ('資料庫名稱','資料表名稱','索引名稱');
GO
```

```sql
--顯示或變更目前伺服器執行個體的全域組態設定
sp_configure 'show advanced options',1;--設定顯示進階選項，預設為 0
GO
RECONFIGURE WITH OVERRIDE;--使用RECONFIGURE使系統使用新的設定值，當使用 RECONFIGURE WITH OVERRIDE 時，請特別小心。
GO
--RECONFIGURE 和 RECONFIGURE WITH OVERRIDE 都會使用每個組態選項。
--不過，基本 RECONFIGURE 陳述式會拒絕在合理範圍之外或可能造成選項衝突的任何選項值。
--例如，如果 recovery interval 值超出 60 分鐘，或 affinity mask 值與 affinity I/O mask 值重疊，RECONFIGURE 就會產生錯誤。
--相對地，RECONFIGURE WITH OVERRIDE 會接受任何資料類型正確的選項值，且會強迫利用指定的值來重設組態。

sp_configure 'max degree of parallelism',8;--設定執行單一陳述式所要採用8個處理器。
GO
RECONFIGURE WITH OVERRIDE;--使用RECONFIGURE使系統使用新的設定值，當使用 RECONFIGURE WITH OVERRIDE 時，請特別小心。
GO
--若要讓伺服器判斷平行處理原則的最大程度，請將此選項設定為 0 (預設值)。
--將平行處理原則的最大程度設定為 0 就會允許 SQL Server 使用所有可用的處理器 (最多 64 個處理器)。
--若要抑制平行計畫的產生，請將 max degree of parallelism 設成 1。
--將這個值設成大於 1 的數字 (最大值 64)，則會限制單一查詢執行所使用的最大處理器個數。
--如果指定的數值大於可用的處理器數目，就會使用可用處理器的實際數目。
--如果電腦只有一個處理器，則會忽略 max degree of parallelism 值。
--您可以在查詢陳述式中指定 MAXDOP 查詢提示，藉以覆寫查詢中的 max degree of parallelism 值。
```

```sql
--檢查資料結構(check the database structure)
USE 資料庫名稱;
GO
DBCC CHECKFILEGROUP;
GO
DBCC CHECKALLOC;
GO
DBCC CHECKTABLE ('資料表名稱'); --Checks the integrity of all the pages and structures that make up the table or indexed view
GO
DBCC CHECKDB('資料庫名稱')--To perform DBCC CHECKTABLE on every table in the database, use DBCC CHECKDB.
GO
```

```sql
--顯示統計資訊內容
DBCC SHOW_STATISTICS('資料表名稱','統計資訊名稱');
GO
-- 或
DBCC SHOW_STATISTICS('資料表名稱',統計資訊名稱);
GO
--備註:如何取得統計資訊名稱
--統計資訊名稱包含索引鍵和主鍵名稱，還有系統預設資料表統計資訊
--假如一個資料表myTable有索引鍵IX_indexkey001、資料主鍵PK_primary001
--那麼要顯示IX_indexkey001的統計資訊可執行DBCC SHOW_STATISTICS('myTable','IX_indexkey001');
```

```sql
--刪除統計資訊
DROP STATISTICS 資料表名稱.統計資訊名稱;
GO
```

```sql
--顯示資料庫資訊
EXEC SP_HELPDB; --列出資料庫Instance中所有資料庫的資訊
GO
EXEC SP_HELPDB 資料庫名稱; --指令資料庫名稱可以獲得單一資料庫詳細資料
GO
EXEC SP_DATABASES; --顯示資料庫Instance中所有資料庫的使用磁碟空間大小
GO

--使用SP_SPACEUSED顯示資料列的數目、所保留的磁碟空間和資料表所用的磁碟空間、索引檢視，
--或目前資料庫中的 Service Broker 佇列，或顯示整個資料庫所保留和使用的磁碟空間。
--當您卸除或重建大型索引時，或卸除或截斷大型資料表時，
--Database Engine 會延遲取消配置實際的頁面及其相關聯鎖定，直到認可交易之後。
--延遲的卸除作業並不會立即釋出已配置的空間。
--因此，在卸除或截斷大型物件之後，sp_spaceused 立即傳回的值不一定能反映實際可用的磁碟空間。
--參考資料網站http://msdn.microsoft.com/zh-tw/library/ms188776.aspx
USE 資料庫名稱;
GO
EXEC SP_SPACEUSED;--顯示目前資料庫所用的磁碟空間
GO
EXEC SP_SPACEUSED '資料表';--顯示目前資料表所用的磁碟空間
GO
EXEC SP_SPACEUSED @updateusage = N'TRUE';--指出應該執行 DBCC UPDATEUSAGE 來更新空間使用方式資訊
GO
```

```sql
--顯示資料庫相關資訊
SELECT * FROM master.dbo.sysdatabases;--列出所有資料庫
GO
SELECT * FROM master.dbo.sysxlogins;--列出所有登入帳戶，只適用於SQLServer 2000
GO
SELECT * FROM master.dbo.sysprocesses;--列出目前Instance中的連線資訊
GO
SELECT * FROM master.dbo.sysservers;--列出目前每個連結或已註冊的遠端伺服器，各包含一個資料列，以及含有一個資料列代表 server_id = 0 的本機伺服器。
GO
SELECT * FROM master.dbo.sysconfigures; --列出SQL Server Instance設定，同執行sp_configure相同
GO
EXEC sp_configure --同執行 SELECT * FROM sysconfigures
GO
--查詢使用者自定資料庫
SELECT name AS 'DATABASENAME' FROM master.dbo.sysdatabases
WHERE name NOT IN ('master','model','msdb','tempdb','distrbution')
ORDER BY 1;
GO
```

```sql
--顯示單一資料庫的資訊，在每一桶資料庫中皆有下列系統資料表
SELECT * FROM sysfiles;--顯示該桶資料庫資料檔與交易紀錄檔案資訊,詳細資訊可使用EXEC SP_HELPDB 資料庫名稱;
GO
SELECT * FROM sysfilegroups;--顯示該桶資料庫的檔案群組
GO
SELECT * FROM sysobjects;--顯示該桶資料庫裏面所有物件，如資料表、檢視表、預儲程序、使用者自定函式
GO
SELECT * FROM syscolumns;--顯示該桶資料庫所有資料表的欄位
GO
SELECT * FROM sysindexes;--顯示該桶資料庫所有Index
GO
SELECT * FROM sysusers;--顯示該桶資料庫的使用者
GO
--當下連線資料庫的使用者權限
SELECT * FROM syspermissions;--顯示該桶資料庫的使用者權限
GO
```

```sql
--顯示資料庫物件資訊
--參考資料網站http://msdn.microsoft.com/en-us/library/ms187335.aspx
EXEC sp_help;--列出所有資料庫物件
GO
--列出資料表的資訊
USE 資料庫名稱;
GO
EXEC sp_help '資料表名稱';
GO
```

```sql
----[以下指令SQL SERVER 2005 以上版本才可以使用]----
SELECT * FROM sys.databases;--列出Instance中所有使用者自定的資料庫metadata,SQLServer 2005版本以上適用
GO
SELECT * FROM sys.sysdatabases;--列出Instance中所有系統資料庫metadata,SQLServer 2005版本以上適用
GO

--估計執行壓縮後,資料表的大小
EXEC sp_estimate_data_compression_savings 'Production', 'WorkOrderRouting', NULL, NULL, 'ROW' ;--估計 Production.WorkOrderRouting 資料表的大小 (如果使用 ROW 壓縮來將它壓縮)。
GO
EXEC sp_estimate_data_compression_savings 'Production', 'WorkOrderRouting', NULL, NULL, 'PAGE' ;--估計 Production.WorkOrderRouting 資料表的大小 (如果使用 PAGE 壓縮來將它壓縮)。
GO

--壓縮資料表
ALTER TABLE Production.WorkOrderRouting REBUILD WITH (DATA_COMPRESSION=ROW);--使用ROW壓縮Production.WorkOrderRouting資料表(Enable row compression on the Production.WorkOrderRouting table)
GO
ALTER TABLE Production.WorkOrderRouting REBUILD WITH (DATA_COMPRESSION=PAGE);--使用PAGE壓縮Production.WorkOrderRouting資料表(Enable page compression on the Production.WorkOrderRouting table)
GO


--The following example returns information for all tables and indexes within the instance of SQL Server. Executing this query requires VIEW SERVER STATE permission.
SELECT * FROM sys.dm_db_index_operational_stats(DB_ID(N'QuantamCorp'), OBJECT_ID(N'QuantamCorp.Production.WorkOrderRouting'), NULL, NULL);--回傳QuantamCorp.Production.WorkOrderRouting資料表的資料表與索引資訊
GO
SELECT * FROM sys.dm_db_index_operational_stats(NULL, NULL, NULL, NULL);--回傳所有資料表與索引資訊(Returning information for all tables and indexes)
GO

--參考資料網站http://technet.microsoft.com/zh-tw/library/ms176013.aspx
--針對 SQL Server 上經過驗證的各個工作階段傳回一個資料列。
--sys.dm_exec_sessionssys.dm_exec_sessions 是伺服器範圍檢視表，
--會顯示所有作用中使用者連接和內部工作的相關資訊。
--這個資訊包含用戶版本、用戶程式名稱、用戶登錄時間、登錄使用者、目前工作階段設定、還有更多。
--使用 sys.dm_exec_sessions 來首先檢視目前系統載入及定義感興趣的工作階段，
--然後以使用其他動態管理檢視或動態管理函式來學習更多關於工作階段的資訊。
--sys.dm_exec_connections、sys.dm_exec_sessions 和 sys.dm_exec_requests 動態管理檢視對應到 sys.sysprocesses 系統資料表。
SELECT * FROM sys.dm_exec_sessions;--回傳各個工作階段
GO

--參考資料網站http://technet.microsoft.com/zh-tw/library/ms181509
--傳回有關與這個 SQL Server 執行個體建立之連接及每一個連接之詳細資料的資訊。
SELECT * FROM sys.dm_exec_connections;--回傳執行個體建立之連接及每一個連接之詳細資料的資訊
GO

--參考資料網站http://technet.microsoft.com/zh-tw/library/ms177648
--傳回在 SQL Server 內部執行之每個要求的相關資訊。
SELECT * FROM sys.dm_exec_requests;--回傳內部執行之每個要求的相關資訊
GO

--參考資料網站http://technet.microsoft.com/zh-tw/library/ms181929
--傳回 SQL 陳述式的文字以及前五項查詢的平均 CPU 時間。
SELECT TOP 5 total_worker_time/execution_count AS [Avg CPU Time],
SUBSTRING(st.text, (qs.statement_start_offset/2)+1,
((CASE qs.statement_end_offset
WHEN -1 THEN DATALENGTH(st.text)
ELSE qs.statement_end_offset
END - qs.statement_start_offset)/2) + 1) AS statement_text
FROM sys.dm_exec_query_stats AS qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS st
ORDER BY total_worker_time/execution_count DESC;
GO
--傳回以批次方式執行的 SQL 查詢之文字並提供有關這些查詢的統計資訊。
SELECT s2.dbid,
s1.sql_handle,
(SELECT TOP 1 SUBSTRING(s2.text,statement_start_offset / 2+1 ,
((CASE WHEN statement_end_offset = -1
THEN (LEN(CONVERT(nvarchar(max),s2.text)) * 2)
ELSE statement_end_offset END) - statement_start_offset) / 2+1)) AS sql_statement,
execution_count,plan_generation_num,last_execution_time,
total_worker_time,last_worker_time,min_worker_time,
max_worker_time,total_physical_reads,last_physical_reads,
min_physical_reads,max_physical_reads,total_logical_writes,
last_logical_writes,min_logical_writes,max_logical_writes
FROM sys.dm_exec_query_stats AS s1
CROSS APPLY sys.dm_exec_sql_text(sql_handle) AS s2
WHERE s2.objectid is null
ORDER BY s1.sql_handle, s1.statement_start_offset, s1.statement_end_offset;
GO

--參考資料網站http://technet.microsoft.com/zh-tw/library/ms189741
--傳回平均 CPU 時間之前五項查詢的相關資訊。 此範例會根據查詢雜湊彙總查詢，讓邏輯上相同的查詢能夠依據其累計資源耗用量進行分組。
USE AdventureWorks2012;
GO
SELECT TOP 5 query_stats.query_hash AS "Query Hash",
SUM(query_stats.total_worker_time) / SUM(query_stats.execution_count) AS "Avg CPU Time",
MIN(query_stats.statement_text) AS "Statement Text"
FROM
(SELECT QS.*,
SUBSTRING(ST.text, (QS.statement_start_offset/2) + 1,
((CASE statement_end_offset
WHEN -1 THEN DATALENGTH(ST.text)
ELSE QS.statement_end_offset END
- QS.statement_start_offset)/2) + 1) AS statement_text
FROM sys.dm_exec_query_stats AS QS
CROSS APPLY sys.dm_exec_sql_text(QS.sql_handle) as ST) as query_stats
GROUP BY query_stats.query_hash
ORDER BY 2 DESC;
GO
--傳回查詢的資料列計數彙總資訊 (資料列總數、最小資料列數目、最大資料列數目及上次傳回的資料列數目)。
SELECT qs.execution_count,
SUBSTRING(qt.text,qs.statement_start_offset/2 +1,
(CASE WHEN qs.statement_end_offset = -1
THEN LEN(CONVERT(nvarchar(max), qt.text)) * 2
ELSE qs.statement_end_offset end -
qs.statement_start_offset
)/2
) AS query_text,
qt.dbid, dbname= DB_NAME (qt.dbid), qt.objectid,
qs.total_rows, qs.last_rows, qs.min_rows, qs.max_rows
FROM sys.dm_exec_query_stats AS qs
CROSS APPLY sys.dm_exec_sql_text(qs.sql_handle) AS qt
WHERE qt.text like '%SELECT%'
ORDER BY qs.execution_count DESC;
GO

--參考資料網站http://technet.microsoft.com/zh-tw/library/cc280701
--傳回平均經過時間所識別之前 10 項預存程序的相關資訊。
SELECT TOP 10 d.object_id, d.database_id, OBJECT_NAME(object_id, database_id) 'proc name',
d.cached_time, d.last_execution_time, d.total_elapsed_time, d.total_elapsed_time/d.execution_count AS [avg_elapsed_time],
d.last_elapsed_time, d.execution_count
FROM sys.dm_exec_procedure_stats AS d
ORDER BY [total_worker_time] DESC;
GO

--設定資料庫自動更新統計資訊、建立統計資訊、更新統計資訊為非同步更新(Enable auto update statistics, auto create statistics, and auto update statistics async)
ALTER DATABASE 資料庫名稱 SET AUTO_UPDATE_STATISTICS ON,
AUTO_CREATE_STATISTICS ON,
AUTO_UPDATE_STATISTICS_ASYNC ON;
GO

--縮減資料庫檔案大小(shrink a file and a database)
--利用將資料庫設為簡易模式來壓縮資料記錄檔(Truncate the log by changing the database recovery model to SIMPLE.)
ALTER DATABASE 資料庫名稱 SET RECOVERY SIMPLE;
GO
DBCC SHRINKFILE (QuantamCorp_Log,1);--指定記錄檔壓縮截斷到1MB的檔案大小(Shrink the truncated log file to 1 MB.)
GO
ALTER DATABASE QuantamCorp SET RECOVERY FULL;--將資料庫設為完整模式 (Reset the database recovery model.)
GO

USE QuantamCorp;
GO
SELECT file_id, name FROM sys.database_files;--取出資料庫檔案代碼與名稱
GO
DBCC SHRINKFILE (1,TRUNCATEONLY);
GO
DBCC SHRINKDATABASE (QuantamCorp,TRUNCATEONLY);
GO

--列出資料表
USE 資料庫名稱;
SELECT * FROM INFORMATION_SCHEMA.TABLES;
GO
SELECT * FROM sys.syslogins;--列出所有登入帳戶，只適用於SQLServer 2005以上版本
GO
```

---

參考資料：

- [Some Useful Undocumented SQL Server 7.0 and 2000 DBCC Commands](http://www.sql-server-performance.com/ac_sql_server_2000_undocumented_dbcc.asp)
