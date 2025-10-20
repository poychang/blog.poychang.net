---
layout: post
title: 在 .NET Core 主控台應用程式中使用內建的依賴注入
date: 2018-10-15 21:34
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: dotnet-core-console-app-with-dependency-injection/
---

透過 .NET Core 內建的依賴注入套件，除了可以讓我們輕鬆實現 Dependency Injection 依賴注入的設計模式，更可以幫助我們把程式碼寫得更職責分離，在 ASP.NET Core 的專案範架構中，已經被列為基礎架構，幾乎所有應用服務都是基於 DI 來設計，如果我們想要在自己的應用程式中加入這好用的工具，可以參考這篇作法，如何將內建的依賴注入工具整合至主控台應用程式中。

.NET Core 提供一套 `Microsoft.Extensions.DependencyInjection` 依賴注入套件，透過這個套件，我們可以輕鬆出搭建具 DI 功能的架構，並且擁有高效能的註冊、解析依賴物件的能力。

>有關 DI 套件的效能比較，可以參考 Daniel Palme 的這篇 IoC Container Benchmark - Performance comparison 文章所提供的數據。

這裡最終希望搭建出如下圖的架構，在高階模組 Host Program 之上，建立 DI Container 作為依賴注入物件的容器，並由 App 作為整個應用程式的起始點，將所相依的服務注入至 App 內使用，所有的功能都透過 DI 容器來幫我處理建立、注入的作業。

[!基本架構](https://i.imgur.com/xU8UGjE.png)

>本篇完整範例程式碼請參考 [poychang/Demo-DI-Console-App](https://github.com/poychang/Demo-DI-Console-App)。

## 建立專案

首先，使用 Visual Studio 預設的主控台應用程式(.NET Core)專案範本來建立一個空白的專案。

![建立主控台應用程式專案](https://i.imgur.com/pLsTG9S.png)

預設的主控台應用程式專案裡面很簡單，只有一個 `Program.cs` 檔案。

## 安裝套件

你可以透過指令的方式或 Visual Studio 的 NuGet 套件管理器，安裝微軟官方提供的依賴注入套件 `Microsoft.Extensions.DependencyInjection`，或者透過指令安裝 `Install-Package Microsoft.Extensions.DependencyInjection`。

這個套件就是 DI 框架，我們可以用他來建立 DI 容器，並透過他來註冊、解析依賴物件。

>如果你想看看這個 DI 框架是怎麼被實做出來的，可以直接到[官方在 GitHub 上的 Repo](https://github.com/aspnet/DependencyInjection) 查看他的原始碼。

## 撰寫程式架構

關注點分離能夠讓我們寫程式時，專注在特定的執行邏輯上，因此我們將**業務邏輯程式**與**主要用於執行應用程式的邏輯**分開，這裡建立一個 `App.cs` 作為主要執行應用程式邏輯的類別。

```csharp
public class App
{
    private readonly IService _service;

    public App(IService service)
    {
        _service = service;
    }

    public void Run()
    {
        _service.SayHello();
    }
}
```

在這個主要邏輯中，注入了一種具有 `SayHello` 方法的服務，我們希望這個服務可以切換成說中文或英文的。

因此我們建立了兩個業務邏輯程式叫做 `ChtService.cs` 和 `EngService.cs`，並且都實作了 `IService` 介面，這個介面定義了一個 `SayHello` 方法，就只會印出中文或英文的 Hello World。

程式碼很簡單，如下：

```csharp
public interface IService
{
    string SayHello();
}

public class ChtService : IService
{
    public void SayHello()
    {
        Console.WriteLine("哈囉世界！");
    }
}

public class EngService : IService
{
    public void SayHello()
    {
        Console.WriteLine("Hello World!");
    }
}
```

這兩個功能在之後的使用上，可以在不修改主要程式邏輯(`App.cs`)，只需要在註冊 DI 依賴物件的地方，透過抽換的方式來決定要使用哪一種服務。

接著我們在高階模組 `Program.cs` 上，主要做三件事：

1. 建立容器
2. 註冊依賴物件
3. 執行主要程式邏輯

```csharp
public static void Main(string[] args)
{
    // 1. 建立依賴注入的容器
    var serviceCollection = new ServiceCollection();
    // 2. 註冊服務
    serviceCollection.AddTransient<App>();
    serviceCollection.AddTransient<IService, ChtService>();
    // 建立依賴服務提供者
    var serviceProvider = serviceCollection.BuildServiceProvider();

    // 3. 執行主服務
    serviceProvider.GetRequiredService<App>().Run();
}
```

如此一來，這個主控台應用程式在執行時，就會先將 DI 容器建立好，也將整個應用程式會使用到的依賴物件也一併準備好，而且在建立的過程中，會根據各物件依賴的服務，藉由建構式注入的方式，將物件自動組合完成，像是一種 High Order Object 的感覺。

這樣具有 DI 架構的主控台應用程式就完成了。

### 註冊服務

這裡有一個關鍵是**註冊服務**這件事，註冊的同時會賦予服務生命週期，`ServiceCollection` 這個服務容器，會負責將所註冊的 Interface 與 Class 做對應，並依據生命週期來決定何時建立及注入，然而物件在使用注入的服務時，有時候會希望注入的是全應用程式共用的物件，或者總是全新的物件，這時我們就可以在註冊的時候，明確的指定依賴的服務生命週期為何。

Microsoft.Extensions.DependencyInjection 提供以下三種生命週期的註冊方式：

- `AddSingleton()` : 程式啟動後，會創建一個新的實體，也就是執行時期只有一個實體，基本上生命週期與應用程式一致
- `AddTransient()` : 每次注入時，都會重新創建一個新的實體，例如在不同的建構式中注入，都會取得新的實體
- `AddScoped()` : 在每個 Scope 中都會重新創建一個新的實體，用 ASP.NET Core 網站的角度來看，一個 Http Request 就是一個 Scope 級別，因此每次 Http Request 都會取得一個新的實體

>本篇完整範例程式碼請參考 [poychang/Demo-DI-Console-App](https://github.com/poychang/Demo-DI-Console-App)。

## 後記

一般來說，在建立有 DI 架構的應用程式時，會建議 DI 容器的建立時機要盡可能早，最好應用程式一啟動就執行，讓 DI 容器去管理物件的生命週期，我們只需要專注在商業邏輯如何運用就好。

----------

參考資料：

* [如何在 .NET Core 使用 DI ?](https://old-oomusou.goodjack.tw/netcore/di/)
* [在 Console 中使用内置 DI 组件](https://www.cnblogs.com/Wddpct/p/7219205.html)
* [Dependency Injection, Logging and Configuration In A .NET Core Console Application](https://pioneercode.com/post/dependency-injection-logging-and-configuration-in-a-dot-net-core-console-app)
* [Using dependency injection in a .Net Core console application](https://andrewlock.net/using-dependency-injection-in-a-net-core-console-application/)
* [Essential .NET - 使用 .NET Core 進行相依性插入](https://msdn.microsoft.com/zh-tw/magazine/mt707534.aspx?f=255&MSPPError=-2147217396)
