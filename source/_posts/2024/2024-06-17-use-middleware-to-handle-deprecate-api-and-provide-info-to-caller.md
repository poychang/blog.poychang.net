---
layout: post
title: 為 WebAPI 加上棄用 API 的處理機制
date: 2024-06-17 15:13
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, WebAPI, Develop]
permalink: use-middleware-to-handle-deprecate-api-and-provide-info-to-caller/
---

在 .NET 中有提供 [Obsolete Attribute](https://learn.microsoft.com/zh-tw/dotnet/api/system.obsoleteattribute?WT.mc_id=DT-MVP-5003022)，可以標記方法或類別為棄用，當其他程式呼叫這些被標記為棄用的方法或類別時就會收到警告，但在現代化的系統中，會有許多 API 呼叫是透過 Web API 的方式，也就是 HTTP 呼叫，這時候就沒有現成的機制來幫助我們處理這些棄用的 API 了，這時候我們可以透過 Middleware 來幫助我們處理這些情況。

首先，我參考了 [Obsolete Attribute 原始碼](https://github.com/dotnet/runtime/blob/main/src/libraries/System.Private.CoreLib/src/System/ObsoleteAttribute.cs)，建立了一個用於定義 API 是否為棄用的 Attribute，這個 Attribute 會提供一個訊息，讓呼叫端知道這個 API 即將棄用，並可以設定是否強制報錯，使該 API 的呼叫無法繼續執行。程式碼如下：

```csharp
/// <summary>
/// 定義 API 即將棄用的訊息
/// </summary>
[AttributeUsage(AttributeTargets.Method | AttributeTargets.Class, AllowMultiple = false)]
public class DeprecatedAttribute : Attribute
{
    /// <summary>
    /// 通知呼叫端此 API 即將棄用，並提供相關訊息
    /// </summary>
    public string Message { get; }
    /// <summary>
    /// 設定此呼叫是否應該被視為錯誤
    /// </summary>
    public bool IsError { get; }

    /// <summary>
    /// 盡量在訊息中提供替代方案
    /// </summary>
    /// <param name="message"></param>
    public DeprecatedAttribute(string message)
    {
        Message = message;
    }

    public DeprecatedAttribute(string message, bool error)
    {
        Message = message;
        IsError = error;
    }

    public DeprecatedAttribute()
    {
        Message = "This API is deprecated, and it may cause to failed.";
    }
}
```

接著，我們要設定 Middleware 來處理這些被標記成即將棄用的 API，這個 Middleware 會檢查每個請求是否有被標記棄用，如果是的話，就會回應的 Header 中，加上 `X-API-Deprecation-Message` 標頭，並提供相對應的訊息。

如果我們有設定 `IsError` 使之強制報錯，則該呼叫會直接回應 HTTP 405 狀態，並提供對應的錯誤訊息。程式碼如下：

```csharp
/// <summary>
/// 檢查每個請求是否是呼叫即將棄用的 API
/// </summary>
public class ApiDeprecationMiddleware
{
    private readonly RequestDelegate _next;

    public ApiDeprecationMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var endpoint = context.GetEndpoint();
        if (endpoint != null)
        {
            var deprecatedAttribute = endpoint.Metadata.GetMetadata<DeprecatedAttribute>();
            if (deprecatedAttribute != null)
            {
                if (deprecatedAttribute.IsError)
                {
                    context.Response.StatusCode = StatusCodes.Status405MethodNotAllowed;
                    context.Response.Headers.Add("X-API-Deprecation-Message", deprecatedAttribute.Message);
                    await context.Response.WriteAsync(deprecatedAttribute.Message);
                    return;
                }
                else
                {
                    context.Response.Headers.Add("X-API-Deprecation-Message", deprecatedAttribute.Message);
                }
            }
        }

        await _next(context);
    }
}
```

接著，我們要在 `Program.cs` 中設定啟用此 Middleware 的啟用，如下列程式碼：

```csharp
app.UseMiddleware<ApiDeprecationMiddleware>();
```

在使用上，我們可以在 `Controller` 或 `Action` 上標記 `DeprecatedAttribute`，端看你是要從哪個層級做棄用，以下是棄用特定 API 的範例：

```csharp
[Route("api/[controller]")]
[ApiController]
public class DemoController : ControllerBase
{
    public DemoController() { }

    // api/demo
    [Deprecated("This API is deprecated, please use 'api/XXX' instead")]
    public IActionResult Get()
    {
        return Ok("Demo");
    }
}
```

呼叫棄用的 API 會在 Headers 中加上對應的棄用訊息，如下圖：

![呼叫棄用的 API 會在 Headers 中加上對應的棄用訊息](https://i.imgur.com/yryzk5u.png)

若有設定 `IsError` 使之強制報錯，則呼叫該 API 會直接回應 HTTP 405 狀態，並提供對應的錯誤訊息，如下圖：

![強制報錯](https://i.imgur.com/ggAhxd4.png)

---

參考資料：

* [MS Learn - ObsoleteAttribute 類別](https://learn.microsoft.com/zh-tw/dotnet/api/system.obsoleteattribute?WT.mc_id=DT-MVP-5003022)
