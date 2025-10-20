---
layout: post
title: IIS Express 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note]
permalink: note-iis-express/
---

# 手動啟動 IIS

## 好處

使用指定啟動 IIS Express 可在命令列中顯示所有 HTTP Request 和 Response 的內容，便於查看網站運作時的 log 資訊

在開發 WebAPI 的時候特別好用，可以從中看到每動作的 HTTP 狀態碼以及 Request, Response

## 設定設定檔

設定檔路徑

```bash
C:\Users\12258\Documents\IISExpress\config\applicationhost.config
```

在此設定中，於<sites>標籤內，手動加入要註冊進去的網站資訊，參考範本如下：

```xml
<site name="iAppAPI" id="2">
  <application path="/">
    <virtualDirectory path="/" physicalPath="C:\Users\12258\Documents\Code\Gitlab\iAppAPI\iAppAPI" />
  </application>
  <bindings>
    <binding protocol="http" bindingInformation="*:63592:localhost" />
    <binding protocol="http" bindingInformation="*:63592:172.16.2.138" />
  </bindings>
</site>
```

## 查詢已註冊站台

### IIS Express

執行檔位於 C:\Program Files\IIS Express，切換至此目錄後，執行下列指令

```bash
$ appcmd.exe list site
```

執行後會列出所有有註冊在 applicationhost.config 中的站台列表

### IIS

執行檔位於 C:\Windows\System32\inetsrv，切換至此目錄後，執行下列指令

```bash
$ appcmd.exe list site
```

## 手動啟動

### IIS Express

執行檔位於 c:\Program Files\IIS Express，切換至此目錄後，執行下列指令

```bash
$ iisexpress /site:{WebsiteName}
```

上列指令請自行變更 `{WebsiteName}` 成已註冊的站台名稱

### 移除已註冊的 IIS Express 的站台

開啟並修改下列檔案：

```bash
C:\Users\{UserName}\Documents\IISExpress\config\applicationhost.config
```

開啟此檔案後，找到 `<sites>` 段落，將不再需要的站台移除，請注意區塊是由整個 `<site>` 所標示，例如：

```xml
<site name="WebSite1" id="1" serverAutoStart="true">
  <application path="/">
    <virtualDirectory path="/" physicalPath="%IIS_SITES_HOME%\WebSite1" />
  </application>
  <bindings>
    <binding protocol="http" bindingInformation=":8080:localhost" />
  </bindings>
</site>
```

### IIS

- 需先安裝 [Advanced Logging](http://www.iis.net/downloads/microsoft/advanced-logging) 擴充模組
  - 它可以整合現有在 IIS 上的 W3C 記錄檔的內容，同時也可以允許管理人員由不同的來源的資料寫入記錄檔中，以備日後可能的問題追踪之用
  - 適用於 IIS 7, IIS 7.5, IIS 8
- 參考[此篇開啟 Real-Time Logging 即時記錄](http://www.iis.net/learn/extensions/advanced-logging-module/advanced-logging-for-iis-real-time-logging#module)

開啟命令提示自元後，可使用下列指令來及時顯示檔案的變化

```bash
$ tail -f <File Path>
```

此做法尚不完美，因為只能讀取特定檔案，而 IIS Log 檔案是已日期做區分

## VS2015 + IISExpress 10 注意事項

注意！從 VS2015 開始，開發團隊把原本集中式管理的 applicationHost.config 改為**分散式管理**。未來由 VS2015 新增的網站專案都會多一個.vs 目錄，裡面會存放此專案的 applicationHost.config 組態檔。

> [VS2015 的 IISEXPRESS 10 的 APPLICATIONHOST.CONFIG 換位置](http://blog.kkbruce.net/2015/07/where-vs2015-iisexpress-10-applicationhostconfig.html#.Vsm6HZx96M8)

在還沒有更簡單的啟動方法前，可使用下列方式啟動：

```bash
$ iisexpress /config:config-file
```

其中 `config-file` 為每個專案內 .vs 目錄下的 appicationhost.config 檔案位置，執行範例：

```bash
$ iisexpress /config:C:\Users\poypo\Documents\Code\poycode\Personal\PCWebAPI\.vs\config\applicationhost.config /siteid:2
```

---

參考資料：

- [設定本機 Web 伺服器以允許連接到本機行動服務](https://azure.microsoft.com/zh-tw/documentation/articles/mobile-services-dotnet-backend-how-to-configure-iis-express/)
- [Running IIS Express from the Command Line](http://www.iis.net/learn/extensions/using-iis-express/running-iis-express-from-the-command-line)
