---
layout: post
title: 使用 Microsoft.Data.SqlClient 連線資料庫發生憑證錯誤
date: 2022-07-12 11:27
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, SQL]
permalink: the-certificate-chain-was-issued-by-an-authority-that-is-not-trusted/
---

在處理 Microsoft.Data.SqlClient 取代舊有的 System.Data.SqlClient 的專案時，發生憑證錯誤的狀況，錯誤訊息表示和資料庫的連線有成功，但過程中發生憑證不受信任的錯誤，這是怎麼回事呢？

基本上要將 System.Data.SqlClient 順利遷移到 Microsoft.Data.SqlClient 新的套件，並不複雜，兩者因為是不同的 namespace，可以直接參考後使用即可。

但隨著時間的推移，Microsoft.Data.SqlClient 漸漸補齊了許多功能，而到了 4.0 的時候，出現了一個 Breaking change。

在 Microsoft.Data.SqlClient 4.0 以上版本，會自動將連線字串的 `Encrypt` 屬性設定成 `true`。這是因為隨著雲端資料庫的使用量增加，為了確保這些連線是安全的，所以預設將此屬性設定成 `true`。

因此在做資料庫連線的時候，使用 Microsoft.Data.SqlClient 4.0 本身不會有問題，但在存取資料的時候，會因為連線字串被加上 `Encrypt` 加密屬性而去檢查 SQL Server 的授信任跟憑證，當 SQL Server 沒有被設定憑證的時候，SQL Server 很貼心的會自己建立一個 self-signed 憑證，而這個憑證在你的電腦上一般來說是不會有的。

所以你可以會看到類似下列的錯誤訊息：

```log
Error: Microsoft.Data.SqlClient.SqlException (0x80131904): A connection was successfully established with the server, but then an error occurred during the login process. (provider: SSL Provider, error: 0 - The certificate chain was issued by an authority that is not trusted.)
 ---> System.ComponentModel.Win32Exception (0x80090325): The certificate chain was issued by an authority that is not trusted.
   at Microsoft.Data.SqlClient.SqlInternalConnection.OnError(SqlException exception, Boolean breakConnection, Action`1 wrapCloseInAction) in D:\a\_work\1\s\src\Microsoft.Data.SqlClient\netcore\src\Microsoft\Data\SqlClient\SqlInternalConnection.cs:line 616
   at Microsoft.Data.SqlClient.TdsParser.ThrowExceptionAndWarning(TdsParserStateObject stateObj, Boolean callerHasConnectionLock, Boolean asyncClose) in D:\a\_work\1\s\src\Microsoft.Data.SqlClient\netcore\src\Microsoft\Data\SqlClient\TdsParser.cs:line 1322
   at Microsoft.Data.SqlClient.TdsParserStateObject.ThrowExceptionAndWarning(Boolean callerHasConnectionLock, Boolean asyncClose) in D:\a\_work\1\s\src\Microsoft.Data.SqlClient\netcore\src\Microsoft\Data\SqlClient\TdsParserStateObject.cs:line 985
   at Microsoft.Data.SqlClient.TdsParserStateObject.SNIWritePacket(PacketHandle packet, UInt32& sniError, Boolean canAccumulate, Boolean callerHasConnectionLock) in D:\a\_work\1\s\src\Microsoft.Data.SqlClient\netcore\src\Microsoft\Data\SqlClient\TdsParserStateObject.cs:line 3553
```

## 解法

假設我們的連線字串長這樣：

```
"server=MyDatabaseServer.corp;database=DEMO;user id=demo;trusted_connection=False;connection timeout=30;"
```

在使用 Microsoft.Data.SqlClient 4.0 的時候，連線字串會自動加上 `encrypt=true;` 變成：

```log
"server=MyDatabaseServer.corp;database=DEMO;user id=demo;trusted_connection=False;connection timeout=30;encrypt=true;"
```

簡單且直接但不建議的解法，就是直接在連線字串手動加上 `encrypt=false;`，這樣就可以避免這個錯誤訊息。

但這樣就失去了原本增加安全性的機會，因此我們也可以用另一種方式，在連線字串上加上 `TrustServerCertificate=True;` 主動信任 SQL Server 的憑證，來排除這個問題。

當然，這樣都是治標不治本，長期的解決方案還是在 SQL Server 和會連線到 SQL Server 的機器上，都安裝合法的憑證，這才是根本的解決方案。

只是，開發機誰會這樣做...😅

----------

參考資料：

* ["The certificate chain was issued by an authority that is not trusted" when connecting DB in VM Role from Azure website](https://stackoverflow.com/questions/17615260/the-certificate-chain-was-issued-by-an-authority-that-is-not-trusted-when-conn)
* [MS Docs - Release notes for Microsoft.Data.SqlClient 4.0](https://docs.microsoft.com/en-us/sql/connect/ado-net/introduction-microsoft-data-sqlclient-namespace?view=sql-server-ver15#breaking-changes-in-40?WT.mc_id=DT-MVP-5003022)
