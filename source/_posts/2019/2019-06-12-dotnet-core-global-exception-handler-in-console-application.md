---
layout: post
title: 在 .NET Core 主控台應用程式中全域捕捉未處理的例外
date: 2019-06-12 12:53
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop]
permalink: dotnet-core-global-exception-handler-in-console-application/
---

開發 .NET 應用程式時，我們可以在程式碼中使用 `try...catch` 語法來捕捉例外，並對異常進行處理，但有時候總會有漏網之魚，最常見的作法是在程式碼的最外層來加上 `try...catch` 語法來捕捉例外，但這樣程式碼有點不夠優雅，如果能在應用程式定義域中來處理，程式碼會變得更漂亮。

舉個例子，下面是一個簡單的 Console 應用程式，裡面使用一組 `try...catch` 來捕捉可以預期的例外，但沒想到最後一行竟然吐出了非預期的例外，這時候這個 Console 應用程式就掛掉了。

```csharp
void Main()
{
    try
    {
        throw new Exception("Exception!!");
    }
    catch (Exception e)
    {
        Console.WriteLine($"Catch: {e.Message}");
    }

    throw new Exception("Unhandled Exception!!");
}
```

在 .NET 應用程式有個 `AppDomain` 的類別，表示應用程式定義域，也就是應用程式執行的獨立環境。而在 .NET Framework 中，這個應用程式定義域有個事件類別 `AppDomain.UnhandledException` 可以讓我們輕鬆對全域加上處理未被我們程式碼捕捉到的例外。

在 .NET Core 中也有同樣的 API，只不過要 .NET Core 2.0 以上版本才有支援此 API，詳請參考[官方文件](https://docs.microsoft.com/zh-tw/dotnet/api/system.appdomain.unhandledexception?view=netcore-2.1&WT.mc_id=DT-MVP-5003022#%E9%81%A9%E7%94%A8%E6%96%BC)。

>官方為了讓開發者更輕鬆地可以從 .NET Framework 移轉至 .NET Core，因此在 .NET Standard 2.0 開放了 `AppDomain` 這個 API 接口，但不是所有 API 都可以使用，在 .NET Core 執行環境下使用某些 API 會擲出 `PlatformNotSupportedException` 例外，一般來說建議盡量少用 `AppDomain` 這個 API。詳參考[這篇討論](https://stackoverflow.com/questions/27266907/no-appdomains-in-net-core-why)以及[這篇官方文章](https://docs.microsoft.com/zh-tw/dotnet/core/porting/net-framework-tech-unavailable)。

那麼要如何讓上面的 Console 應用程式使用這個 API 來做全域的例外處理呢？其實也很簡單，請參考下列程式碼：

```csharp
static void GlobalExceptionHandler()
{
    AppDomain.CurrentDomain.UnhandledException += new UnhandledExceptionEventHandler(ExceptionHandler);

    void ExceptionHandler(object sender, UnhandledExceptionEventArgs args)
    {
        var exception = (Exception)args.ExceptionObject;
        Console.WriteLine("Global Exception Handler Caught: " + exception.Message);
    }
}
```

這個 `GlobalExceptionHandler()` 函式透過設定目前正在執行的應用程式定義域 (`AppDomain.CurrentDomain`)，把未處理的例外事件加上我們自訂的處理程序，也就是印出例外訊息。因為式直接在應用程式定義域中做設定，所以使用上非常簡潔，直接在 `Main()` 中直接呼叫 `GlobalExceptionHandler()` 函式即可，如下程式碼所示，是不是非常優雅。

```csharp
void Main()
{
    GlobalExceptionHandler();
    
    try
    {
        throw new Exception("Exception!!");
    }
    catch (Exception e)
    {
        Console.WriteLine($"Catch: {e.Message}");
    }

    throw new Exception("Unhandled Exception!!");
}
```

使用 LINQPad 來執行此範例程式的畫面如下：

![範例程式執行畫面](https://i.imgur.com/swxgrHL.png)

----------

參考資料：

* [.NET Core Global exception handler in console application](https://stackoverflow.com/questions/43639601/net-core-global-exception-handler-in-console-application)
* [.NET Core 2.1 Doc - AppDomain.UnhandledException Event](https://docs.microsoft.com/zh-tw/dotnet/api/system.appdomain.unhandledexception?view=netcore-2.1&WT.mc_id=DT-MVP-5003022)
* [如何正確捕捉 Task 例外](https://dotblogs.com.tw/sean_liao/2018/01/09/taskexceptionshandling)
