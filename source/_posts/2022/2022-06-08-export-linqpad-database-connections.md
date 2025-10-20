---
layout: post
title: 匯出 LINQPad 資料庫連線至新機器
date: 2022-06-08 15:30
author: Poy Chang
comments: true
categories: [App, Develop, Tools]
permalink: export-linqpad-database-connections/
---

[LINQPad](https://www.linqpad.net/) 是 C# 開發者好用的工具，除了可以讓你隨手寫一些程式碼，還可以讓你透過 LINQPad 連線並查詢資料庫，不過它本身沒有匯出資料庫連線清單的功能，所以當移轉到另一台電腦上時，就需要重新設定，這篇來看一下如何快速處理這件事。

>順帶一提，LINQPad 上我最喜歡搭配使用 [LINQ to DB](https://linq2db.github.io/) 這套 LINQPad Driver，他能支援的資料庫連線相當廣泛，這裡就不贅述了，請至 [LINQ to DB LINQPad Driver](https://github.com/linq2db/linq2db.LINQPad) 這個開源專案查看。

Windows 應用程式通常會在使用這帳戶下建立 `AppData` 資料夾來存放應用程式的資料和設定，LINQPad 也是如此。

由於 `AppData` 是一個隱藏的資料夾，你可能需要在檔案總管的工具列中開啟這個設定，"資料夾選項 > 檢視 > 開啟"顯示隱藏的檔案、資料夾及磁碟機"，或者，我建議你直接在路徑列上輸入 `%APPDATA%\LINQPad`，這樣就可以直接開啟儲存 LINQPad 設定檔的資料夾。

關鍵檔案是 `ConnectionsV2.xml`，這檔案裡面的內容就是 LINQPad 的資料庫連線管理視窗所需要的資訊。

[LINQPad 上的資料庫連線管理視窗](https://i.imgur.com/BnwCK19.png)

打開檔案內容你可能會看到類似以下的內容，這裡以 SQL Server 為範例：

```xml
<?xml version="1.0" encoding="utf-8"?>
<Connections>
  <Connection>
    <ID>c188f9b7-da85-4a8c-9e61-07e1e4daac9d</ID>
    <NamingServiceVersion>2</NamingServiceVersion>
    <Persist>true</Persist>
    <Driver Assembly="linq2db.LINQPad" PublicKeyToken="no-strong-name">LinqToDB.LINQPad.LinqToDBDriver</Driver>
    <Server>YOUR_DB_SERVER</Server>
    <Database>DB_NAME</Database>
    <CustomCxString>YOUR_DB_CONNECTION_STRING</CustomCxString>
    <IsProduction>true</IsProduction>
    <DisplayName>DISPLAY_NAME</DisplayName>
    <DriverData>
      <providerName>SqlServer</providerName>
      <excludeRoutines>false</excludeRoutines>
      <excludeFKs>false</excludeFKs>
      <optimizeJoins>true</optimizeJoins>
      <allowMultipleQuery>false</allowMultipleQuery>
      <commandTimeout>0</commandTimeout>
    </DriverData>
  </Connection>
<Connections>
```

幾個比較關鍵的屬性如下：

- `ID` 為資料的識別碼，就是一組 GUID
- `Driver` 告訴 LINQPad 要使用哪一個 LINQPad Driver，這裡當然是我愛用的 LINQ to DB
- `Server` 資料庫的伺服器位置
- `Database` 資料庫伺服器中的哪顆資料庫
- `CustomCxString` 資料庫連線字串
- `IsProduction` 是否為正式環境
- `DisplayName` 在 LINQPad 上要顯示的名稱
- `DriverData` 會根據所使用的資料庫類型而有不同的屬性

有了這些基礎資訊，你甚至可以寫隻程式自動化產生給 LINQPad 使用的資料庫連線資訊囉！

## 後記

竟然都找到 LINQPad 設定檔的存放位置，你可能還會對 `RoamingUserOptions.xml` 這個檔案有興趣，這檔案是你使用 LINQPad 的偏好設定，如果你要連偏好設定一起匯出了話，別忘記這個檔案。

----------

參考資料：

* [How do I copy my connections to a new PC?](https://forum.linqpad.net/discussion/2074/how-do-i-copy-my-connections-to-a-new-pc)
* [LINQ to DB LINQPad Driver](https://github.com/linq2db/linq2db.LINQPad)
