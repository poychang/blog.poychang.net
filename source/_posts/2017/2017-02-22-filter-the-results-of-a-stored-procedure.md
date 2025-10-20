---
layout: post
title: 使用 OPENROWSET 過濾來自 Store Procedure 的資料
date: 2017-02-22 10:12
author: Poy Chang
comments: true
categories: [SQL, Tools]
permalink: filter-the-results-of-a-stored-procedure/
---
有在碰資料庫的人應該都知道，我們可以透過預存程序（Store Procedure）來封裝資料查詢，讓資料服務更效率且更容易被管理，但做成預存程序後，就無法用簡單的查詢語法 `SELECT * FROM TableName` 來做基本的資料檢視。Google 了許久，發現一招，透過 `OPENROWSET` 來簡單達成查詢需求，真的又快又方便（但不建議用在 Production）。

## 用函數來封裝

如果是用函數（Function）的方式來封裝，那就沒有查詢的問題了，可以直接用 `SELECT * FROM FunctionName()` 來達成。 

[這篇文章](https://technet.microsoft.com/zh-tw/library/ms187650%28v=sql.105%29.aspx?f=255&MSPPError=-2147217396)建議我們在預存程序符合下列條件時，可以將預存程序重寫為函數。

* 單一 `SELECT` 陳述式中的邏輯是屬於可運算的，但因為它需要參數，所以是預存程序而非檢視。這個情況可以利用內嵌資料表數值函數來處理。
* 預存程序不執行更新作業 (資料表變數除外)。
* 不需要動態的 `EXECUTE` 陳述式
* 預存程序會傳回一個結果集。
* 預存程序的主要目的是要建立載入暫存資料表的立即結果，以便在 `SELECT` 陳述式中接受查詢。

>Stored Procedures 與 Functions 的差異

<table class="table table-striped">
  <tr>
    <td></td>
	<td>CALL</td>
	<td>In Expression</td>
	<td>Return</td>
  </tr>
  <tr>
    <td>Stored Procedures</td>
	<td>O</td>
	<td>X</td>
	<td>X</td>
  </tr>
  <tr>
    <td>Functions</td>
	<td>X</td>
	<td>O</td>
	<td>O</td>
  </tr>
</table>

## 常見的做法

最直覺的做法就是把預存程序吐出來的資料，存放在一個暫存的資料表，然後我們再對暫存的資料表做查詢。參考作法如下：

```sql
CREATE TABLE #temp (...);

INSERT INTO #temp
EXEC [sproc];
```

但缺點是你要先建出一張欄位和來源相同的資料表，有點麻煩。

## 使用 `OPENROWSET`

從 [MSDN 文件](https://msdn.microsoft.com/zh-tw/library/ms190312%28v=sql.90%29.aspx?f=255&MSPPError=-2147217396)可以查到，從 SQL Server 2005 開始就支援 `OPENROWSET` 這函數
，這是 `OPENQUERY` 外，另一個存取連結伺服器資料表的方法，而且是使用 OLE DB 來連接和存取資料的單次特定方法。

透過 `OPENROWSET` 可以讓查詢語法變得很簡單，如下：

```sql
SELECT * 
FROM OPENROWSET ('SQLOLEDB', 'Server=(local);TRUSTED_CONNECTION=YES;', 'EXEC MyStoredProcedure')
```

* 第一個參數是 Provider Name，表示使用 'SQLOLEDB' 來連結資料庫
* 第二個參數是連線字串，這裡表示使用本地端的伺服器並使用整合式驗證
* 第三個參數是我們要執行的 SQL

這樣的做法是根據 OLE DB Provider 的能力而定，有可能會有效能或安全上的疑慮，因此**不建議使用在正式環境上**。

>`OPENQUERY` 也是一種類似的作法，但 `OPENQUERY` 只能對 LinkedServer 來做查詢，你必須先建立好連結。

----------

參考資料：

* [Use SQL to filter the results of a stored procedure](http://stackoverflow.com/questions/2567141/use-sql-to-filter-the-results-of-a-stored-procedure)
* [OPENROWSET (Transact-SQL)](https://msdn.microsoft.com/zh-tw/library/ms190312.aspx?f=255&MSPPError=-2147217396)
* [將預存程序重寫為函數](https://technet.microsoft.com/zh-tw/library/ms187650%28v=sql.105%29.aspx?f=255&MSPPError=-2147217396)
* [SQL - 05. Stored Procedures and Functions](http://forum.slime.com.tw/thread222603.html)
* [讓 Execute 可以搭配 Select Into，而不再只有 Insert into](https://dotblogs.com.tw/rainmaker/2015/02/02/148355)