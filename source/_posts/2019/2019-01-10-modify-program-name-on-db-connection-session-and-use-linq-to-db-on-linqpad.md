---
layout: post
title: 從資料庫 Session 資訊中取得連線的程式名稱
date: 2019-01-10 12:55
author: Poy Chang
comments: true
categories: [Dotnet, SQL, Develop, Tools]
permalink: modify-program-name-on-db-connection-session-and-use-linq-to-db-on-linqpad/
---

連線 MS SQL Server 的資料庫時會記錄一些連線資訊，我們可以透過查詢這些 Session 連線資訊取得是用哪種工具做連線的，這篇講述一些查詢資料庫的小事情。

## 資料庫知道我們用甚麼工具

當我們使用資料庫管理工具連線至 MS SQL 資料庫的時候，在 `sys.dm_exec_sessions` 這張資料表會記錄連線的相關資訊，例如連線時間、使用者名稱、所用的工具名稱等等，從這張資料表我們可以得到滿多訊息的，有興趣的朋友，可以執行看看下面的 SQL 語法：

```sql
SELECT session_id, 
       login_time, 
       program_name, 
       client_interface_name
FROM sys.dm_exec_sessions;
```

例如我透過 Microsoft SQL Server Management Studio 來連線資料庫做管理時，使用上面的 SQL 可以看到所記錄下來的 Session 資訊，從這裡可以清楚的看到資料庫知道我們用的是哪套工具做連線的。

![使用 SSMS 連線所記錄的 Session 資訊](https://i.imgur.com/AeyhkQJ.png)

但 `program_name` 這個欄位是可以手動改掉的，如果你想要改掉這個程式名稱，以 SSMS 為例，你可以在 SSMS 設定連線前，在登入上窗中點選 `Additional Connection Parameters` 頁籤，並加入以下設定：

```
Application Name = 'Your Application Name'
```

![在 SSMS 連線前手動修改 Session 的程式名稱](https://i.imgur.com/WUSvJIN.png)

如此一來，在 `sys.dm_exec_sessions` 這張資料表的 `program_name` 欄位，就會記錄 `Your Application Name` 這個我們手動修改的程式名稱。

[Session 的程式名稱被手動改掉了](https://i.imgur.com/KKmDLqi.png)

## 使用 LINQPad 來連線

[LINQPad](https://www.linqpad.net/) 絕對是 C# 開發人員必備的好用工具，輕巧的它除了可以我們練習寫 LINQ 外，也可以拿來寫 C#、F#、VB 程式，甚至用它執行 SQL 查詢資料庫也是相當好用的工具。

當我們使用 LINQPad 內建的資料庫連線 Driver，這個 Driver 可以連 SQL Server 資料庫和 SQL Azure 資料庫，這時我們也可以使用上面查詢連線資訊的 SQL 看到，所執行的程式名稱是 `LINQPad`。

![內建連線 SQL Server 的 Driver](https://i.imgur.com/DglEqWP.png)

![使用 LINQPad 連線資料庫的 Session 資訊](https://i.imgur.com/P6KA9kp.png)

但是如果我們使用的是第三方的 Driver 來連線時，是會不一樣的。

### 安裝 LINQ to DB 第三方 Driver

這裡我們選用 [LINQ to DB LINQPad Driver](https://github.com/linq2db/linq2db.LINQPad) 這支 Driver 來試試看，這個 Driver 支援了超多種資料庫，從 MS SQL Server 到 MySQL 再到 SQLite，幾乎你想的到的資料庫都支援了，在 LINQPad 上安裝此 Driver 步驟也很簡單：

1. 點選左側的 `Add connection` 字樣開啟選擇連線 Driver 的視窗

![1](https://i.imgur.com/4wDODtB.png)

2. 從視窗左下角點選 `View more drivers`

![2](https://i.imgur.com/DHxxCbc.png)

3. 點選 `LINQ to DB Driver` 下面的 `Download & Enable Driver` 即可進行安裝

![3](https://i.imgur.com/cEJRYBK.png)

4. 安裝完成後就可以在選擇連線 Driver 的視窗中找到 `LINQ to DB`

![4](https://i.imgur.com/Q73JuZF.png)

### LINQ to DB 使用方式

基本使用方式基本上只要兩個動作，根據你要連線的資料庫選擇 Data Provider，接著填入連線字串就搞定了。

![LINQ to DB 連線設定視窗](https://i.imgur.com/jVxikmu.png)

>這個網站 [The Connection Strings Reference](https://www.connectionstrings.com/) 提供了各家資料庫連線字串的寫法，有需要的朋友可以參考看看。

此外有一個進階設定很值得一提，當連線很多又混雜著正式和測試環境的資料庫連線時，可以在設定視窗的最下面勾選 `Contains production data` 選項，如此一來連線右邊會出現 `PRODUCTION` 字樣，方便我們辨識。

![勾選 Contains production data 的連線右邊會出現 PRODUCTION 字樣](https://i.imgur.com/C9f4sq8.png)

### 資料庫 Session 沒有 LINQ to DB 工具名稱

當我們使用 LINQ to DB 這個 LINQPad Driver 做資料庫連線時，你會發現我們從 Session 是看不到程式名稱的。

![看不到連線工具的名稱](https://i.imgur.com/p5Tbjiq.png)

此時他會記錄所使用的 Data Provider Client 名稱，所以 `program_name` 跟 `client_interface_name` 這兩個欄位會是同樣的值 `.NET SqlClient Data Provider`，這是因為 LINQ to DB 他背後其實是個通用連線資料庫的 NuGet 函示庫套件([linq2db](https://www.nuget.org/packages/linq2db/))，因此在設計上他的不會有**程式名稱**，而是用 Data Provider Client 來替代。

>如果你想玩玩看這個 LINQ to DB 通用資料庫連線函示庫，可以看看她的官方網站 [https://linq2db.github.io/](https://linq2db.github.io/) 或者他在 GitHub上 的 [Wiki 文件](https://github.com/linq2db/linq2db/wiki/Introduction)，裡面各種用法寫得相當清楚。

## 連線字串也可以設定程式名稱

在最一開始的時候，我們透過 SSMS 的設定介面來手動修改連線 Session 的程式名稱，其實我們也可以從連線字串中去修改這個值。

例如，連線 MS SQL Server 的連線字串可能長這樣：

```
Server=myServerAddress;Database=myDataBase;User Id=myUsername;Password=myPassword;
```

我們只要在連線字串上加上 `Application Name=Your Application Name;` 這段設定：

```
Server=myServerAddress;Database=myDataBase;User Id=myUsername;Password=myPassword;Application Name=Your Application Name;
```

然後再用查詢連線資料庫的 Session 資訊的 SQL 去看看，你會發現這個程式名稱也可以被我們改掉。

----------

參考資料：

* [LINQPad 小技巧 - 連結正式環境提示功能](https://demo.tc/post/843)
* [How SQL Server detect program name in sys.dm_exec_sessions?](https://stackoverflow.com/questions/24385476/how-sql-server-detect-program-name-in-sys-dm-exec-sessions)
* [LINQ to DB Wiki](https://github.com/linq2db/linq2db/wiki/Introduction)
