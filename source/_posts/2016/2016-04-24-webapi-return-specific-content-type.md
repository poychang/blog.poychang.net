---
layout: post
title: WebAPI 直接回傳指定的檔案格式
date: 2016-04-24 15:25
author: Poy Chang
comments: true
categories: [WebAPI, App]
permalink: webapi-return-specific-content-type/
---

最近在測試 [Cordova-App-Loader](https://github.com/markmarijnissen/cordova-app-loader)，他可以透過 `manifest.json` 去判斷 App 是否有檔案需要更新，再向遠端的 Server 要下載資料，原本套件的做法是可以透過 HTTP 去檢查遠端的 `manifest.json` 是否和 App 內部所記錄的有差異，然後再透過同一組 HTTP URL 去抓取要更新的檔案。

而我打算透過 WebAPI 提供這樣的資源服務，因此寫了一個 `UpdateController` ，去檢查 `manifest.json` ，以其之後可以增加權限控制，避免任何知道此連結的人都可以下載的到相關的檔案，也避免暴露網站資料夾結構。

```csharp
//GET api/Update/Manifest
[Route("api/Update/Manifest")]
[HttpGet]
public HttpResponseMessage GetManifest()
{
    var filePath = HostingEnvironment.MapPath(@"~/Update/manifest.json");
    if (File.Exists(filePath))
    {
        var fileJson = File.ReadAllText(filePath);
        response = Request.CreateResponse(HttpStatusCode.OK);
        response.Content = new StringContent(fileJson, Encoding.UTF8, "application/json");
        return response;
    }
    response = Request.CreateResponse(HttpStatusCode.NotFound);
    return response;
}
```

另外，在下載更新檔案的動作也用類似的作法，但 filename 可能包含了資料夾路徑，且會回應正確 MIME 型別的檔案

```csharp
//GET api/Update/js/app.js
[Route("api/Update/{*filename}")]
[HttpGet]
public HttpResponseMessage GetUpdateFile(string filename)
{
    var filePath = HostingEnvironment.MapPath(@"~/Update/" + filename);
    var mimeType = System.Web.MimeMapping.GetMimeMapping(filename);
    if (File.Exists(filePath))
    {
        var fs = new FileStream(filePath, FileMode.Open);
        response = Request.CreateResponse(HttpStatusCode.OK);
        response.Content = new StreamContent(fs);
        response.Content.Headers.ContentType = new MediaTypeHeaderValue(mimeType);
        return response;
    }
    response = Request.CreateResponse(HttpStatusCode.NotFound);
    return response;
}
```

在這兩個下載檔案的動作中，有兩點需要特別注意：

1. 檔案 MIME 型別
2. 路由參數的參數包含 `/` 和 `.`

# 檔案 MIME 型別

每個檔案類型都有自己對應的 MIME 型別，如果你不指定回傳的 MIME 型別，只想說丟一串 string 回傳，那麼需求發起者會預設的型別 `text/html` ，而不是預期的 JSON 格式（雖然那串字串長得跟 JSON 一模一樣），就不遑論其他的檔案類型了。

所幸 .NET Framework 4.5 的 `System.Web.dll` 中，有可以幫我們輕鬆找出對應的 MIME 型別的功能 [MimeMapping.GetMimeMapping Method](http://msdn.microsoft.com/en-us/library/system.web.mimemapping.getmimemapping.aspx)，透過下面這段範例程式碼，即可輕鬆取得該檔案的 MIME 類型。

```csharp
string mimeType = System.Web.MimeMapping.GetMimeMapping(fileName);
```

如果你使用的是 IIS 整合管線模式（integrated pipeline，大部分的人都是用此模式吧），那麼你可以比對到 IIS 中所有的 MIME 清單，若是傳統模式（classic mode），則是會參考內建的對照檔，約可以比對出常用的300多筆 MIME 型別。

# 路由參數的參數包含 `/` 和 `.`

另外一個注意事項「路由參數的參數包含 `/` 和 `.`」，我們都知道 WebAPI 會將 `/` 視為資源 URI 的分隔符號，而 `.` 則是 URI 的檔案副檔名符號。當我們想要將 `js/app.js` 當作是參數傳給 Controller 時，就必須要特別注意了。

## 首先解決 `/` 的問題

解法很簡單，只要在參數前面加一個萬用字元 `*` 就可以了。

```csharp
[Route("api/Update/{*filename}")]
```

但這樣的用法是因為這次 Cordova-App-Loader 才會這樣用，因為使用萬用字元了話，上面這段就會被解釋成：`api/Update/` 之後接的字串都當成參數值傳給 `filename`，因此就不能在後面接其他路由設定了。

## 另一個問題 `.`

這問題主要是因為我們預期這段 `api/Update/js/app.js` URL 應該會經過 WebAPI 做檢查，但以執行周期來說，IIS 會先對此 URL  做檢查，檢查是否有這個檔案資源，如果沒有了話，就吐 404 錯誤。這樣的執行週期，就不是我們預期的了。

比較通用的解法是設定這個 Web 應用程式，任何的 request 都經由 ASP.NET 去做處理，這代表所有靜態的檔案（圖片、PDF...）都會經過 ASP.NET 去處理，當然這樣的動作其實是不必要的，因此會損失一些系統效能。

這通用的做法很輕鬆，在 web.config 的 `<system.webServer>` 加入一行設定即可。

```xml
<configuration>
    <system.webServer>
        <modules runAllManagedModulesForAllRequests="true" />
```

另外還有一種解法，就比較精確，透過修改 HTTP handler 指定特定路徑被請求時，轉由 ASP.NET 去處理。

這種不修改 RAMMFAR （runAllManagedModulesForAllRequests）的方式是比較優秀的解法，可以避免效能的損失，也可精確的針對特定 URI 做控制。

```xml
<add name="ApiURIs-ISAPI-Integrated-4.0"
     path="/people/*"
     verb="GET,HEAD,POST,DEBUG,PUT,DELETE,PATCH,OPTIONS"
     type="System.Web.Handlers.TransferRequestHandler"
     preCondition="integratedMode,runtimeVersionv4.0" />
```

----------

參考資料：

* [Attribute Routing in ASP.NET Web API 2](http://www.asp.net/web-api/overview/web-api-routing-and-actions/attribute-routing-in-web-api-2)
* [Return a JSON string explicitly from Asp.net WEBAPI?](http://stackoverflow.com/questions/17097841/return-a-json-string-explicitly-from-asp-net-webapi)
* [Get MIME Type by File Extension](http://www.c-sharpcorner.com/blogs/get-mime-type-by-file-extension1)
* [URLs with slash in parameter?](http://stackoverflow.com/questions/6328713/urls-with-slash-in-parameter)
* [Dot character '.' in MVC Web API 2 for request such as api/people/STAFF.45287](http://stackoverflow.com/questions/20998816/dot-character-in-mvc-web-api-2-for-request-such-as-api-people-staff-45287)
* [Dots in URL causes 404 with ASP.NET mvc and IIS](http://stackoverflow.com/questions/11728846/dots-in-url-causes-404-with-asp-net-mvc-and-iis)
