---
layout: post
title: SQLite 操作筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note]
permalink: note-sqlite/
---

# SQLite

官方網站：[SQLite](https://www.sqlite.org/)

## 取得資料庫裡的 Table 名稱

- 相關欄位：type, name, tbl_name, rootpage, sql

```sql
SELECT * FROM sqlite_master Where Type In ('table','view')
```

- 取得 Table 裡的欄位資料

```sql
PRAGMA table_info(Table名稱)
```

## 建立資料表

```sql
CREATE TABLE IF NOT EXISTS TableName (
  ID INTEGER PRIMARY KEY,
  Title TEXT, Subtitle TEXT,
  Content TEXT,
  Icon TEXT,
  Date TEXT
)
```

## 新增資料但避免新增重複的資料

```sql
INSERT INTO Table(ID, ColumnName)
SELECT 5, 'Value'
WHERE NOT EXISTS (SELECT 1 FROM Table WHERE ID = '5');
```

# 使用 C# 操作 SQLite

專案加入 `System.Data.SQLite` 和 `System.Data` 參考

```powershell
Install-Package System.Data.SQLite
```

```csharp
/// <summary>建立資料庫連線</summary>
/// <param name="database">資料庫名稱</param>
/// <returns></returns>
public SQLiteConnection OpenConnection(string database)
{
    var conntion = new SQLiteConnection()
    {
        ConnectionString = $"Data Source={database};Version=3;New=False;Compress=True;"
    };
    if (conntion.State == ConnectionState.Open) conntion.Close();
    conntion.Open();
    return conntion;
}
```

```csharp
/// <summary>建立新資料庫</summary>
/// <param name="database">資料庫名稱</param>
public void CreateDatabase(string database)
{
    var connection = new SQLiteConnection()
    {
        ConnectionString = $"Data Source=Data/{database};Version=3;New=True;Compress=True;"
    };
    connection.Open();
    connection.Close();
}
```

```csharp
/// <summary>建立新資料表</summary>
/// <param name="database">資料庫名稱</param>
/// <param name="sqlCreateTable">建立資料表的 SQL 語句</param>
public void CreateTable(string database, string sqlCreateTable)
{
    var connection = OpenConnection(database);
    connection.Open();
    var command = new SQLiteCommand(sqlCreateTable, connection);
    var mySqlTransaction = connection.BeginTransaction();
    try
    {
        command.Transaction = mySqlTransaction;
        command.ExecuteNonQuery();
        mySqlTransaction.Commit();
    }
    catch (Exception ex)
    {
        mySqlTransaction.Rollback();
        throw (ex);
    }
    if (connection.State == ConnectionState.Open) connection.Close();
}
```

```csharp
/// <summary>新增\修改\刪除資料</summary>
/// <param name="database">資料庫名稱</param>
/// <param name="sqlManipulate">資料操作的 SQL 語句</param>
public void Manipulate(string database, string sqlManipulate)
{
    var connection = OpenConnection(database);
    var command = new SQLiteCommand(sqlManipulate, connection);
    var mySqlTransaction = connection.BeginTransaction();
    try
    {
        command.Transaction = mySqlTransaction;
        command.ExecuteNonQuery();
        mySqlTransaction.Commit();
    }
    catch (Exception ex)
    {
        mySqlTransaction.Rollback();
        throw (ex);
    }
    if (connection.State == ConnectionState.Open) connection.Close();
}
```

```csharp
/// <summary>讀取資料</summary>
/// <param name="database">資料庫名稱</param>
/// <param name="sqlQuery">資料查詢的 SQL 語句</param>
/// <returns></returns>
public DataTable GetDataTable(string database, string sqlQuery)
{
    var connection = OpenConnection(database);
    var dataAdapter = new SQLiteDataAdapter(sqlQuery, connection);
    var myDataTable = new DataTable();
    var myDataSet = new DataSet();
    myDataSet.Clear();
    dataAdapter.Fill(myDataSet);
    myDataTable = myDataSet.Tables[0];
    if (connection.State == ConnectionState.Open) connection.Close();
    return myDataTable;
}
```

使用上述程式碼做一個簡單範例

```csharp
public void Main()
{
    // 建立 SQLite 資料庫
    CreateDatabase("data.db");

    // 建立資料表 TestTable
    var createtablestring = @"CREATE TABLE TestTable (Foo double, Bar double);";
    CreateTable("data.db", createtablestring);

    // 插入資料到 TestTable 表中
    var insertstring = @"
        INSERT INTO TestTable (Foo, Bar) VALUES ('10', '100');
        INSERT INTO TestTable (Foo, Bar) VALUES ('20', '200');
    ";
    Manipulate("data.db", insertstring);

    // 讀取資料
    var dataTable = GetDataTable("data.db", @"SELECT * FROM TestTable");
}
```

## 使用 EF Core SQLite Provider 的限制

參考資料：[SQLite EF Core Database Provider Limitations](https://docs.microsoft.com/zh-tw/ef/core/providers/sqlite/limitations?WT.mc_id=DT-MVP-5003022)

使用 Entity Framework Core 來處理 SQLite 資料庫時，有一些 Migrations 的限制，請參考下表：

<table class="table table-striped">
<thead>
  <tr>
    <th>Operation</th>
  <th>Supported?</th>
  <th></th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>AddColumn</td>
  <td>✔</td>
  <td>增加欄位</td>
  </tr>
  <tr>
    <td>AddForeignKey</td>
  <td>✗</td>
  <td>增加外來鍵</td>
  </tr>
  <tr>
    <td>AddPrimaryKey</td>
  <td>✗</td>
  <td>增加主鍵</td>
  </tr>
  <tr>
    <td>AddUniqueConstraint</td>
  <td>✗</td>
  <td>增加唯一限制</td>
  </tr>
  <tr>
    <td>AlterColumn</td>
  <td>✗</td>
  <td>變更欄位</td>
  </tr>
  <tr>
    <td>CreateIndex</td>
  <td>✔</td>
  <td>新增索引</td>
  </tr>
  <tr>
    <td>CreateTable</td>
  <td>✔</td>
  <td>新增資料表</td>
  </tr>
  <tr>
    <td>DropColumn</td>
  <td>✗</td>
  <td>刪除欄位</td>
  </tr>
  <tr>
    <td>DropForeignKey</td>
  <td>✗</td>
  <td>刪除外來鍵</td>
  </tr>
  <tr>
    <td>DropIndex</td>
  <td>✔</td>
  <td>刪除索引</td>
  </tr>
  <tr>
    <td>DropPrimaryKey</td>
  <td>✗</td>
  <td>刪除主鍵</td>
  </tr>
  <tr>
    <td>DropTable</td>
  <td>✔</td>
  <td>刪除資料表</td>
  </tr>
  <tr>
    <td>DropUniqueConstraint</td>
  <td>✗</td>
  <td>刪除唯一限制</td>
  </tr>
  <tr>
    <td>RenameColumn</td>
  <td>✗</td>
  <td>變更欄位名稱</td>
  </tr>
  <tr>
    <td>RenameIndex</td>
  <td>✗</td>
  <td>變更索引名稱</td>
  </tr>
  <tr>
    <td>RenameTable</td>
  <td>✔</td>
  <td>變更資料表名稱</td>
  </tr>
</tbody>
</table>

## SQLite 批次 INSERT in C

SQLite [FAQ#19](http://www.sqlite.org/faq.html#q19) 提到，一秒最快能完成 50,000 筆以上的 INSERT，但一秒只能完成幾十筆 Transation，因此如果需要大量寫入資料，可參考[黑暗執行緒 - SQLite 批次 INSERT 的蝸牛陷阱](http://blog.darkthread.net/post-2017-07-16-sqlite-insert-slow.aspx)下列寫法。

```csharp
using (var cnSqlite = new SQLiteConnection(csSqlite))
{
    cnSqlite.Open();
    Stopwatch sw = new Stopwatch();
    sw.Start();
    using (SQLiteTransaction tran = cnSqlite.BeginTransaction())
    {
        var totalCount = list.Count;
        var index = 0;
        foreach (var voc in list)
        {
            Console.WriteLine(
                $"{index++}/{totalCount}({index * 100.0 / totalCount:n1}%) {voc.Word}");
            cnSqlite.Execute(
                "INSERT INTO Dictionary VALUES(@Word, @KKSymbol, @Explanation)", (object)voc);
        }
        tran.Commit();
    }
    sw.Stop();
    Console.Write($"Duration={sw.ElapsedMilliseconds:n0}ms");
}
```

參考資料：

- [How to do IF NOT EXISTS in SQLite](http://stackoverflow.com/questions/531035/how-to-do-if-not-exists-in-sqlite)
- [Finisar.SQLite](http://adodotnetsqlite.sourceforge.net/)
