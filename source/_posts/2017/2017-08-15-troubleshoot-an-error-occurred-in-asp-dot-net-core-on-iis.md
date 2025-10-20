---
layout: post
title: 如何查找 IIS 中的 ASP.NET Core 錯誤訊息
date: 2017-08-15 17:00
author: Poy Chang
comments: true
categories: [Dotnet, WebAPI, Develop]
permalink: troubleshoot-an-error-occurred-in-asp-dot-net-core-on-iis/
---
當架設在 IIS 下的 ASP.NET Core 網站出現不知道怎麼查錯誤的時候，可以試試這個方法。

![An error occurred while starting the application](http://i.imgur.com/uZ3EYe2.png)

今天在測試專案佈署的時候，出現這完全看不出所以然的錯誤訊息，只知道應用程式打不開了，這麼籠統誰知道發生甚麼事呀，而且如果連使用 Windows 的事件檢視器（Event Viewer）也找不到錯誤訊息了話，那也真的很難查。

一般來說，會出現這錯誤訊息，很有可能是遺失了 DLL 檔，或是 `Program.cs`/`Startup.cs` 在執行中發生了問題，這時候可以透過下面的設定來查看看。

1. 修改 `web.config` 將 `stdoutLogEnabled` 設定成 `true`
2. 手動建立 `logs` 資料夾
	* 預設 Log 資料夾設定為 `stdoutLogFile=".\logs\stdout"`
	* 但在手動建立 `logs` 資料夾前，AspNetCoreModule 不會自己建立資料結，也不會產生任何 Log 檔
	* 設定值中的 `stdout` 代表 Log 檔名的前綴（這滿容易誤解的）
3. 重新執行網頁請求，並觀察 `logs` 資料夾中是否產生 `stdout_*.log` 的檔案

修改後的 `web.config` 大致如下圖：

![修改後的 web.config](http://i.imgur.com/PqWNrRo.png)

執行網頁請求後，會產生 Log 檔，如下圖：

![產生 Log 檔](http://i.imgur.com/QWiis0z.png)

>為避免影響執行效能，記得在查完錯誤後將 `stdoutLogEnabled` 設定成 `false`

## 後記

最後查看 Log 檔後發現，只是忘記將 Swagger 所需要的加入 `Document.xml` 加進去，所以無法正確啟動。

----------

參考資料：

* [How to troubleshoot: “An error occurred while starting the application” in ASP.NET Core on IIS](https://scottsauber.com/2017/04/10/how-to-troubleshoot-an-error-occurred-while-starting-the-application-in-asp-net-core-on-iis/)