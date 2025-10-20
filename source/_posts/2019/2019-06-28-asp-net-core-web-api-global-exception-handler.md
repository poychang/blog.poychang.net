---
layout: post
title: 在 ASP.NET Core 中使用 Middleware 全域處理例外
date: 2019-06-28 21:32
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop]
permalink: asp-net-core-web-api-global-exception-handler/
---

之前寫過一篇[在 .NET Core 主控台應用程式中全域捕捉未處理的例外](https://blog.poychang.net/dotnet-core-global-exception-handler-in-console-application/)，主要是透過 .NET 應用程式的 AppDomain 類別下的 `UnhandledException` 來添加客製的例外處理，然而在 ASP.NET Core 專案中，內部會是個小型 [Kestrel 網頁伺服器](https://docs.microsoft.com/zh-tw/aspnet/core/fundamentals/servers/kestrel)在運作，因此大多數的 Exception 是不會往上傳遞並被 `AppDomain.UnhandledException` 接收到，所以這個方式是行不通的。但我們可以透過 ASP.NET Core 專案架構中的中介程序，捕捉發生在 HTTP Context 下的例外錯誤，這篇來做看看如何在中介程序（Middleware）中全域處理例外。

>官方為了讓開發者更輕鬆地可以從 .NET Framework 移轉至 .NET Core，因此在 .NET Standard 2.0 開放了 `AppDomain` 這個 API 接口，但不是所有 API 都可以使用，在 .NET Core 執行環境下使用某些 API 會擲出 `PlatformNotSupportedException` 例外，一般來說建議盡量少用 `AppDomain` 這個 API。詳參考[這篇討論](https://stackoverflow.com/questions/27266907/no-appdomains-in-net-core-why)以及[這篇官方文章](https://docs.microsoft.com/zh-tw/dotnet/core/porting/net-framework-tech-unavailable)。

## 目標

>這裡會使用和這篇[收集 ASP.NET Core 網站所有的 HTTP Request 資訊](https://blog.poychang.net/logging-http-request-in-asp-net-core/)一樣的手法，都是透過 ASP.NET Core 中介程序來處理。

我們知道 ASP.NET Core 架構中，每個 Controller 是在處理每次 HTTP Context 的對應邏輯動作，當然我們可以在每個 Controller 中使用 `try...catch` 語法來捕捉 Exception 例外，不過這樣會讓我們寫很多重複的程式碼。

如果系統中有個地方是 HTTP Context 一定都會經過的地方，且可以在那裏統一處理捕捉到的 Exception 例外，ASP.NET Core 的 Middleware 中介程序就是符合這樣的前提。

## 實作概念

從下圖我們可以看到，整個 HTTP Context 會經過一個個中介程序，像是 Pipeline 的處理流程，在最後一層 HTTP Context 會交由 MVC 來處理網站的邏輯動作，處理完後，會再一個個逆向回傳回去，這時有個 ExceptionHandle 中介程序，在這裡捕捉應用程式的例外狀況，就可以達到全域處理例外的效果。

![HTTP Context 經過中介程序的處理流程](https://i.imgur.com/j8iNyw5.png)

## 實作 ExceptionHandleMiddleware 中介程序

>關於 ASP.NET Core 中介程序的用途說明及基本寫法，請參考[這篇官方文件](https://docs.microsoft.com/zh-tw/aspnet/core/fundamentals/middleware/write?WT.mc_id=DT-MVP-5003022)。

我們建立一個 `ExceptionHandleMiddleware.cs` 中介程序，這裡面將會是實作 HTTP Context 在 MVC 處理過程中發生例外時，要處理的對應動作。

```csharp
public async Task Invoke(HttpContext context)
{
    try
    {
        await _next(context);
    }
    catch (Exception exception)
    {
        await HandleExceptionAsync(context, exception);
    }
}
```

這段程式碼很簡單，就只是用 `try...catch` 語法將串聯中介程序的 `_next(context)` 包起來，並且在發生例外時，執行 `HandleExceptionAsync()` 方法。

而 `HandleExceptionAsync()` 方法的時做，你可以參考下面的程式碼，會根據你的需求做調整：

```csharp
private static Task HandleExceptionAsync(HttpContext context, Exception exception)
{
    context.Response.ContentType = "application/json";
    context.Response.StatusCode = StatusCodes.Status500InternalServerError;

    return context.Response.WriteAsync(
        $"{context.Response.StatusCode} Internal Server Error from the ExceptionHandle middleware."
    );
}
```

處理完中介程序的核心動作後，可以在 `Startup.cs` 檔案的 `Configure()` 要啟用 ExceptionHandleMiddleware 中介程序，你可以簡單用 `app.UseMiddleware<ExceptionHandleMiddleware>();` 這樣的寫法來調用，但我個人比較喜歡再包一層 `IApplicationBuilder` 的擴充方法，一來我可以再調用前多做一些處理，二來是可以更優雅且有語意的啟用我們客製的中介程序，請參考下面 `UseExceptionHandleMiddleware` 擴充方法程式碼：

```csharp
public static class ExceptionHandleMiddlewareExtensions
{
    public static IApplicationBuilder UseExceptionHandleMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ExceptionHandleMiddleware>();
    }
}
```

如此一來，在 `Startup.cs` 檔案的 `Configure()` 中，使用 `app.UseExceptionHandleMiddleware();` 這樣具有語意的寫法，可以讓程式碼讀起來更順暢。

在底下提供的範例專案中，如果開啟 `https://localhost:44381/api/values` 這個網址，則會丟出例外，並被中介程序捕捉到，畫面如下：

![中介程序捕捉到例外](https://i.imgur.com/JWEiLLc.png)

>本篇完整範例程式碼請參考 [poychang/Demo-Global-Exception-Handle-WebApp](https://github.com/poychang/Demo-Global-Exception-Handle-WebApp)。

## 後記

如果你要透果這個處理方式，將每次呼叫的 Request Body 所夾帶的資料（通常是 JSON）記錄下來

----------

參考資料：

* [Global Error Handling in ASP.NET Core Web API](https://code-maze.com/global-error-handling-aspnetcore/)
* [Centralized exception handling and request validation in ASP.NET Core](https://www.strathweb.com/2018/07/centralized-exception-handling-and-request-validation-in-asp-net-core/)
