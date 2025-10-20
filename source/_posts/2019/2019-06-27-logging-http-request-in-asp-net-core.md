---
layout: post
title: 收集 ASP.NET Core 網站所有的 HTTP Request 資訊
date: 2019-06-27 18:28
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, WebAPI]
permalink: logging-http-request-in-asp-net-core/
---

在開發 Web API 的時候你可能會遇到這種情境，想要收集所有對我們網站所發起的 HTTP 要求，從呼叫 API 的網址、HTTP 方法、甚至 HTTP 要求的內容（Request Body）等，要把這些資訊儲存下來，供之後分析使用，以前你可能會透過 IIS Log 來做，現在在 ASP.NET Core 的程式架構中，我們可以在專案架構的中介程序中，攔截 HTTP 資訊，來做任何我們想要做的事。

![HTTP Request 經過中介程序的處理流程](https://i.imgur.com/84xhdDE.png)

上圖是 ASP.NET Core 中介程序架構的簡單表示圖，而我們這次的目標像是在 ASP.NET Core 的中介程序中，加入一個我們客製的 Logging Middleware，讓所有進入此應用程式的 HTTP Request 都會被我們攔截，然後記錄下來。

## 啟動 Logging 記錄器

首先，我們可以在應用程式啟動時，加入 ASP.NET Core 內建支援的 [Logging 記錄器](https://docs.microsoft.com/zh-tw/aspnet/core/fundamentals/logging/?WT.mc_id=DT-MVP-5003022)，只要在 `Program.cs` 檔案中設定 Logging 的機制，寫法如下：

```csharp
public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
    WebHost.CreateDefaultBuilder(args)
        // 加入 Logging 的機制
        .ConfigureLogging((logging) =>
        {
            logging.AddDebug();
            logging.AddConsole();
        })
        .UseStartup<Startup>();
```

預設這個功能會使用 `appsettings.json` (或開發時期使用的 `appsettings.Development.json`) 裡面的設定值，為了讓這個記錄器能夠將 Trace (追蹤)等級的資訊記錄下來，要修改這個檔案 Logging 的 LogLevel 預設紀錄層級為 `Trace`，如下：

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Trace",
      "System": "Information",
      "Microsoft": "Information"
    }
  }
}
```

## 客製 Logging Middleware 中介程序

重點在這裡，接著我們增加一個 `LoggingMiddleware.cs` 中介程序，這裡面將會是實作整個處理 HTTP Request 並將其記錄下來的關鍵。

>關於 ASP.NET Core 中介程序的用途說明及基本寫法，請參考[這篇官方文件](https://docs.microsoft.com/zh-tw/aspnet/core/fundamentals/middleware/write?WT.mc_id=DT-MVP-5003022)。

我們預期的動作會像下圖這樣，request 進入到此中介程序時，會將該 request 複製一份給 Logger 記錄器做處理，同時也把一樣的 request 往下傳遞。

![Logging 中介程序的動作](https://i.imgur.com/NLMxwL9.png)

為什麼要複製一份呢？是因為在 ASP.NET Core 的 HttpContext 中，該 HTTP 的 `Request.Body` 屬性是 `Stream` 類型，且此屬性僅能被讀取一次，若不將其存留起來，後續的中介程序會拿不到完整的 HTTP Request，造成應用程式異常。

因此在這裡的處理有些地方需要特別注意，先看一下下面的程式碼：

```csharp
public async Task Invoke(HttpContext context)
{
    // 確保 HTTP Request 可以多次讀取
    context.Request.EnableBuffering();

    // 讀取 HTTP Request Body 內容
    // 注意！要設定 leaveOpen 屬性為 true 使 StreamReader 關閉時，HTTP Request 的 Stream 不會跟著關閉
    using (var bodyReader = new StreamReader(stream: context.Request.Body,
                                              encoding: Encoding.UTF8,
                                              detectEncodingFromByteOrderMarks: false,
                                              bufferSize: 1024,
                                              leaveOpen: true))
    {
        var body = await bodyReader.ReadToEndAsync();
        var log = $"{context.Request.Path}, {context.Request.Method}, {body}";
        _logger.LogTrace(log);
    }

    // 將 HTTP Request 的 Stream 起始位置歸零
    context.Request.Body.Position = 0;

    await _next.Invoke(context);
}
```

第一步，要確表 HTTP Request 可以被多次讀取，必須要執行 `context.Request.EnableBuffering();` 開啟緩存的機制。

第二步，在建立 StreamReader 來存取 HTTP Request 的時候，必須在 StreamReader 建構式中設定 `leaveOpen: true`，使 StreamReader 的來源（`Request.Body`）不會因為 StreamReader 關閉 Stream 而跟著關閉，這點很重要！如果沒有這樣做，你的應用程式會出現類似下面這樣的錯誤訊息：

```json
{
    "errors": {
        "": [
            "A non-empty request body is required."
        ]
    },
    "title": "One or more validation errors occurred.",
    "status": 400,
    "traceId": "8000001e-0001-ff00-b63f-84710c7967bb"
}
```

`A non-empty request body is required` 就是告訴你，後續要處理 HTTP Request 的中介程序，無法接受空的 `Request.Body`，因此出現錯誤。

第三步，使用 `StreamReader.ReadToEndAsync()` 來讀取資料，讀取到資料後，你可以做任何你想要做的事，例如上述情境所提到的，將所有 HTTP Request 儲存記錄下來。

第四步，透過 `context.Request.Body.Position = 0;` 將原本的 `Request.Body` 的 Stream 起始位置歸零。

## 啟用客製的 Logging Middleware 中介程序

為了優雅的啟用我們客製的 Logging Middleware 中介程序，在範例程式碼中做了一個 `LoggingMiddlewareExtensions` 擴充方法：

```csharp
public static class LoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseLoggingMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<LoggingMiddleware>();
    }
}
```

這個擴充方法是讓我們在 `Startup.cs` 檔案的 `Configure()` 要啟用 Logging Middleware 中介程序時，只需要使用 `app.UseLoggingMiddleware();` 這樣直覺的寫法，就能輕鬆啟動。

>本篇完整範例程式碼請參考 [poychang/Demo-Logging-Http-Request](https://github.com/poychang/Demo-Logging-Http-Request)。

## 後記

這個範例的核心精神還可以延伸處理很多事情，例如我可以透過這樣的處理方式，建立一個特定的 API Endpoint，只要 HTTP Request 進去這個中介程序，當網址路徑符合預期的位置，就執行特定功能，在往下接續處理；或是將限制來源 IP 的功能（參考[這裡](https://gist.github.com/poychang/980fd0bbf7148a6046f323ce5c7f4379)）封裝成一個中介程序，讓 ASP.NET Core 應用程式，能輕鬆地加上新功能。

----------

參考資料：

* [getting the request body inside HttpContext from a Middleware in asp.net core 2.0](https://stackoverflow.com/questions/47624938/getting-the-request-body-inside-httpcontext-from-a-middleware-in-asp-net-core-2)
* [Using Middleware in ASP.NET Core to Log Requests and Responses](https://exceptionnotfound.net/using-middleware-to-log-requests-and-responses-in-asp-net-core/)
* [Logging the Body of HTTP Request and Response in ASP .NET Core](http://www.palador.com/2017/05/24/logging-the-body-of-http-request-and-response-in-asp-net-core/)
* [Re-reading ASP.Net Core request bodies with EnableBuffering()](https://devblogs.microsoft.com/aspnet/re-reading-asp-net-core-request-bodies-with-enablebuffering/)
