---
layout: post
title: 無法在 Windows Server 中使用 Invoke-WebRequest PowerShell 指令
date: 2020-06-23 13:53
author: Poy Chang
comments: true
categories: [PowerShell]
permalink: invoke-webrequest-response-cannot-be-parsed-because-ie-engine-is-not-available/
---

在 Windows Server 使用 `Invoke-WebRequest` Cmdlet 的時候，你可能會因為沒有安裝或啟動 Internet Explorer 不完整，而出現無法使用的錯誤訊息，這時候有幾種處理方式可以參考。

如果你看到以下的錯誤訊息，則代表 PowerShell 在執行 `Invoke-WebRequest` 的時候，因為預設會用到 Internet Explorer 的網頁解析引擎去解析回應的網頁內容，並處理 HTML 成為 DOM 物件，再將其存入 `ParsedHtml` 這個屬性裡面，因此如果 Windows Server 沒有 Internet Explorer 或設定未完成的時候，就會跳出例外訊息。

```log
Invoke-WebRequest : The response content cannot be parsed because the Internet Explorer engine is not available, or Internet Explorer's first-launch configuration is not complete. Specify the UseBasicParsing parameter and try again.
```

## 解法一 -UseBasicParsing

很貼心的是，上面這個錯誤訊息有跟你說怎麼處理，只要簡單的在 `Invoke-WebRequest` Cmdlet 後面加上 `-UseBasicParsing` 參數即可，有這個參數設定，`Invoke-WebRequest` 就不會去解析所得到的 HTML 成 DOM，只會單純的作文字處理而已。

## 解法二 Invoke-RestMethod

如果你使用的情境比較偏向呼叫 Web API 而不在意 HTML 了話，建議你可以改用 `Invoke-RestMethod`，這隻 Cmdlet 的用法和參數和 `Invoke-WebRequest` 基本上一模一樣，但更關注的是 RESTful API 的使用情境。

![Invoke-WebRequest 和 Invoke-RestMethod 的參數比較](https://i.imgur.com/YtQLI3R.png)

官方文件也清楚的說明，`Invoke-WebRequest` 是 Gets content from a web page on the Internet，而 `Invoke-RestMethod` 是 Sends an HTTP or HTTPS request to a RESTful web service。

這裡你應該會想問，那差別在哪裡？簡單說一下差別，`Invoke-WebRequest` 返回的一定是 `Microsoft.PowerShell.Commands.HtmlWebResponseObject` 這個資料類型。

`Invoke-RestMethod` 則會根據 HTTP 所回傳的資料格式，返回不同的資料類型，如 `Microsoft.PowerShell.Commands.HtmlWebResponseObject`、`System.Xml.XmlDocument`、`System.String`，如果是 JSON 資料格式則返回 `PSObject`。

----------

參考資料：

* [The response content cannot be parsed because the Internet Explorer engine is not available](https://stackoverflow.com/questions/38005341/the-response-content-cannot-be-parsed-because-the-internet-explorer-engine-is-no)
* [Microsoft Docs - Invoke-WebRequest](https://docs.microsoft.com/en-us/previous-versions/powershell/module/Microsoft.PowerShell.Utility/Invoke-WebRequest?view=powershell-5.0#description)
* [Microsoft Docs - Invoke-RestMethod](https://docs.microsoft.com/en-us/previous-versions/powershell/module/microsoft.powershell.utility/invoke-restmethod?view=powershell-5.0)
* [Powershell: Invoke-RestMethod vs Invoke-WebRequest](https://www.systemcenterautomation.com/2018/05/invoke-restmethod-vs-invoke-webrequest/)
