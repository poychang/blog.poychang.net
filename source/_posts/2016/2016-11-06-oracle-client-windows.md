---
layout: post
title: 在 Windows 中安裝 Oracle Client
date: 2016-11-06 12:07
author: Poy Chang
comments: true
categories: [Tools]
permalink: oracle-client-windows/
---

這篇是為公司寫的。如何在 Windows 環境下安裝支援 Oracle Database 8.1.7 的 Oracle Client。

要安裝 Oracle Client 前要先確認所安裝的版本是否支援該資料庫，可以先到 [Oracle Client/Server 支援對照表](https://blog.poychang.net/oracle-client-server-interoperability/)這裡確認資料庫所能支援的 Oracle Client 到哪一版，以目前環境來說，**Oracel Client 10.2.0 是最後可相容 Oracle Database 8.1.7 的版本**了。

## 下載 Oracle Client

在 Oracle 官網下載檔案，是必須要先註冊成會員，因此請先[這裡](https://login.oracle.com/mysso/signon.jsp)建立會員帳戶，方便下列操作。

![在 Oracle 網站中下載 Oracle Instant Client](http://i.imgur.com/Jav5yX3.png)

如上圖，首先到 [Oracle 官方網站](https://www.oracle.com/)下載 Oracle Instant Client，然後選擇對應你作業系統的下載分類，例如 Microsoft Windows 的版本。

一台電腦允許多種版本的 Oracle Client 並存，你可以下載並安裝多個版本，供不同資料庫使用，這裡主要下載 10.2 Basic 版，重點是要包含 Oracle Call Interface (OCI) 這個工具。

![Oracle Client Version 10.2.0.3 ](http://i.imgur.com/gSceeLv.png)

>這裡我通常會下載 x64 和 x86 兩個版本的 Oracle Instant Client，避免開發時遇到[詭異的 Oracle Client 32/64 版本錯誤](http://blog.darkthread.net/post-2016-05-21-weird-oracle-client-3264-error.aspx)

* [Microsoft Windows (x64)](http://www.oracle.com/technetwork/topics/winx64soft-089540.html)。
* [Microsoft Windows (x86)](http://www.oracle.com/technetwork/topics/winsoft-085727.html)。

## 安裝及設定

下載的檔案其實是個壓縮檔，只要解壓縮後就可以用，不過為了方便管理版本及使用，我會在 C 槽下建一個 `OracleClient` 資料夾，並依版本來存放壓縮檔的資料，如 `instantclient_10_2_x86` 或 `instantclient_10_2_x64`，解壓縮到這資料夾內，並將檔案位置加入環境變數 `path`。

>這裡推薦使用 [Rapid Environment Editor](http://www.rapidee.com/en/about) 修改系統環境變數

另外，為了讓各版本的 Oracle Client 能存取同一份 TNS 連線資訊，我會把相關檔案放在 `OracleClient` 資料夾下以便共用，因此我們資料夾結構會長的如下圖。

![OracleClient 資料夾結構](http://i.imgur.com/knx3JXE.png)

接著，還需要新增兩個**系統變數**：

<table class="table table-striped">
<thead>
  <tr>
    <th>變數名稱</th>
  <th>值</th>
  <th>備註</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>NLS_LANG</td>
  <td>TRADITIONAL CHINESE_TAIWAN.ZHT16MSWIN950</td>
  <td>設定語系</td>
  </tr>
  <tr>
    <td>TNS_ADMIN</td>
  <td>C:\OracleClient\NetWork\Admin</td>
  <td>TNS 連線資訊位置</td>
  </tr>
</tbody>
</table>

再來我們要設定 TNS 連線相關資訊，如同上一步所設定的 TNS_ADMIN，在 `C:\OracleClient\NetWork\Admin` 資料夾下新增 `TNSNAMES.ORA` 檔案，裡面輸入 TNS 連線資訊，基本格式如下：

```
PROD.WORLD = 
  (DESCRIPTION = 
    (ADDRESS = 
      (PROTOCOL = TCP)
      (HOST = 127.0.0.1)
      (PORT = 1521)
    )
    (CONNECT_DATA = 
      (SID = PROD)
    )
  )
```

這樣我們就設定完成了，可以開啟 Toad 或其他資料庫操作工具，使用 TNS 連線來測試看看。

## .NET 開發環境的插曲

![](http://i.imgur.com/B7omCy4.png)

新版的 Visual Studio 內建的 Oracle 資料庫 Provider 工具已經不支援了，需要下載其他連線工具來取代，可以到 Oracle 官網下載 [Oracle Data Access Components (ODAC) for Windows Downloads](http://www.oracle.com/technetwork/topics/dotnet/downloads/index.html) ，這裡要注意 Visual Studio 版本，安裝後即可在 Visual Studio 中使用 ODP.NET 連線工具了。

![](http://i.imgur.com/L7APtzo.png)

## .NET 開發環境的插曲 2

Unmanaged ODP.NET 的 `System.Data.OracleClient` 已經被微軟宣告為過時不建議使用了，所以如果你的環境是使用 Oracle 10.2 版以上的資料庫，可以改用 Managed ODP.NET 來開發，改用 `Oracle.ManagedDataAccess.Client`，這樣的好處是不用安裝 Oracle Client，只用一個 Oracle.ManagedDataAccess.dll 就可以連線，而且不用分 x86 跟 x64 了。

不過缺點就是，沒有支援身邊的資料庫版本 Oracle 8.1.7 呀...

----------

備份下載連結：

* [instantclient-basic-win32-10.2.0.5.zip](https://1drv.ms/u/s!Aiwtjhj5fofrjYpmOjbA_yhviebYoQ)
* [instantclient-basic-win64-10.2.0.5.zip](https://1drv.ms/u/s!Aiwtjhj5fofrjYplZ1LZAHZlomo07g)

----------

參考資料：

* [Oracle Offical Website](https://www.oracle.com/)
* [【茶包射手日記】詭異的 Oracle Client 32/64 版本錯誤](http://blog.darkthread.net/post-2016-05-21-weird-oracle-client-3264-error.aspx)
* [Oracle.ManagedDataAccess with Oracle 8.1.7 DB](http://stackoverflow.com/questions/27546383/oracle-manageddataaccess-with-oracle-8-1-7-db)
