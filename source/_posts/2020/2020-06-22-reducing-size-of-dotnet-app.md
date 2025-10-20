---
layout: post
title: 封裝 .NET Core 應用程式成單一可執行檔並優化檔案大小
date: 2020-06-22 15:50
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: reducing-size-of-dotnet-app/
---

發行 .NET Core 應用程式的時候有兩種方式，一種叫做 FDD (Framework Dependent Deployment 框架相依部署)，另一種叫 SCD (Self Contained Deployment 自封式部署)，後者可以將應用程式封裝成單一可執行檔，這篇將分享一些 .NET Core 應用程式封裝成單一可執行檔時，我們可以用於優化檔案大小的設定。

以下範例會用一個單純的主控台應用程式來示範，順便比較一下幾種設定所封裝出來的檔案大小為何，程式碼如下：

```csharp
class Program
{
    static void Main(string[] args)
    {
        Console.WriteLine("Hello World!");
        Console.ReadKey();
    }
}
```

## 執行模式

作為可以跨平台的 .NET Core 的應用程式，如果我們要發行到不同平台環境時，在編譯前是需要先指定之後要在那些平台環境執行，在做自封式部署時也是需要同樣的設定，而這裡所稱的「平台」代表兩件事情：

1. .NET 執行時期所需要的環境，例如 .NET Framework、.NET Core
2. 執行 .NET 應用程式時的作業系統環境，例如 Windows X64、MacOS、Linux

對應到 `.csproj` 專案檔內的設定，就是指 `TargetFramework` 和 `RuntimeIdentifier` 這兩個設定，各種對應不同環境的設定值請參考下面設定值參考資料：

- 設定 `<TargetFramework>` 設定值參考資料：[TFM 目標 Framework](https://docs.microsoft.com/zh-tw/dotnet/standard/frameworks)
- 設定 `<RuntimeIdentifier>` 設定值參考資料：[.NET Core RID Catalog](https://docs.microsoft.com/zh-tw/dotnet/core/rid-catalog)

>如果要設定多目標或多執行環境時，可將名稱修改成 `<TargetFrameworks>` 和 `<RuntimeIdentifiers>`，設定值可以用 `;` 區隔，代表多個設定值。

設定的範例如下：

```xml
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <OutputType>Exe</OutputType>
        <TargetFramework>netcoreapp3.1</TargetFramework>
        <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    </PropertyGroup>
</Project>
```

## 封裝成單一可執行檔

封裝成單一可執行檔的優點就不贅述了，基本就是一個檔案帶著走，到哪都可以執行，不用擔心該環境有沒有對應版本的 .NET Runtime。

要將專案設定成自封式部署並封裝成單一可執行檔，基本做兩件事情，設定執行時期的環境，以及設定發行時使用單一檔案，因此我們在 `.csproj` 專案檔內加上 `PublishSingleFile` 設定即可，程式碼如下：

```xml
<Project Sdk="Microsoft.NET.Sdk">

    <PropertyGroup>
        <OutputType>Exe</OutputType>
        <TargetFramework>netcoreapp3.1</TargetFramework>

        <!-- Identify Target Platforms -->
        <RuntimeIdentifier>win-x64</RuntimeIdentifier>
        <!-- Self Contained -->
        <PublishSingleFile>true</PublishSingleFile>
    </PropertyGroup>
</Project>
```

>如果想在發行時使用指令的方式設定也可以，`dotnet publish -r win-x64 -p:PublishSingleFile=true` 此指令和上面修改專案檔的效果式一樣的。

這種方式將 .NET 執行環境以及該應用程式封裝成單一執行檔，編譯後的檔案約為 67 MB，以一個 HelloWorld 應用程式來說，檔案大小老實說滿大的，但他畢竟將整個執行環境封裝進去了。

![67MB](https://i.imgur.com/CFyM4mY.png)

## 移除沒用到的部分

前面之所以檔案會這麼大，他除了把整個 .NET 執行環境都包進去外，也包進了不少應用程式根本沒用到的功能，所以實際上是有一點虛胖的，所幸我們可以增加一個設定，使用 Assembly Trimming 的方式，透過 IL Linker 取出應用程式所需要的部分，藉此塑身一下。

設定方式只要在 `.csproj` 專案檔內加上 `PublishTrimmed` 設定即可：

```xml
<Project Sdk="Microsoft.NET.Sdk">

    <PropertyGroup>
        <OutputType>Exe</OutputType>
        <TargetFramework>netcoreapp3.1</TargetFramework>

        <!-- Identify Target Platforms -->
        <RuntimeIdentifier>win-x64</RuntimeIdentifier>
        <!-- Self Contained -->
        <PublishSingleFile>true</PublishSingleFile>
        <!-- Trimming Dependencies -->
        <PublishTrimmed>true</PublishTrimmed>
    </PropertyGroup>
</Project>
```

如此一來編譯後的檔案就縮小成 25.8 MB，算是還可以了。

![25.8MB](https://i.imgur.com/ZjYExAc.png)

另外在 .NET Core 3 之後，多了一個 `PublishReadyToRun` 設定，這個設定會將應用程式編譯成 Ahead-Of-Time (AOT) 模式的格式，讓應用程式啟動得更快，這個方式減少 Just-In-Time (JIT) 編譯器在應用程式載入時所需執行的工作量，藉此來改善啟動效能。

但 AOT 模式有個缺點，就是編譯後的檔案會稍微大一點，因為他保留了 JIT 會用到的 IL 碼，確保在某些執行情境不用出問題。

設定 `PublishReadyToRun` 後的編譯大小約為 26 MB，如下：

![26MB](https://i.imgur.com/lm2BPxJ.png)

## CoreRT

封裝成單一可執行檔的最終幻想就是編譯成 Native 程式，並享有檔案夠小、執行夠快的可執行檔，目前 .NET 團隊是有一個開放原始碼專案 [CoreRT](https://github.com/dotnet/corert)，可以將 .NET Core 編譯為沒有相依 CLR 的 Native 程式，簡單說就是編譯成機器碼（如同 C 和 C++ 一樣），而不是 IL 碼，因此 CoreRT 不是 CLR/CoreCLR，因為他不是虛擬機器也不包含 JIT，這代表它沒有即時產生、執行程式碼的功能。

要將目前執行的範例改用 CoreRT 來編譯，要做一些調整，首先 `.csproj` 專案檔要將上面加入的自封式部屬設定拿掉，但要保留目標執行環境的設定，接著安裝 `Microsoft.DotNet.ILCompiler` 套件，這個套件在 NuGet.org 是找不到的，你必須先增加 `https://dotnetfeed.blob.core.windows.net/dotnet-core/index.json` 這個 NuGet 套件來源，我這邊是直接在專案資料夾中加入 `nuget.config` 檔來做設定。

完成後的 `.csproj` 專案檔內容如下：

```xml
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <OutputType>Exe</OutputType>
        <TargetFramework>netcoreapp3.1</TargetFramework>
        <!-- Identify Target Platforms -->
        <RuntimeIdentifier>win-x64</RuntimeIdentifier>
    </PropertyGroup>

    <ItemGroup>
        <PackageReference Include="Microsoft.DotNet.ILCompiler" Version="1.0.0-alpha-*" />
    </ItemGroup>
</Project>
```

>你應該會注意到 `Microsoft.DotNet.ILCompiler` 的版本號有 `alpha` 關鍵字，目前還是有多限制，因此請不要用在正式環境中。

![6.9MB](https://i.imgur.com/XZJFIgE.png)

使用 CoreRT 來編譯的檔案大小出乎意料的還可以要 6.9 MB（畢竟如果是 C 了話檔案應該只有幾 K），但這和前面的結果相比已經只剩下 1/4 左右的大小了，期待它未來的發展。

如果你對 CoreRT 最佳化有興趣了化，可以參考官方這份文件 [Optimizing programs targeting CoreRT](https://github.com/dotnet/corert/blob/master/Documentation/using-corert/optimizing-corert.md)，裡面還有一些設定可以玩，例如我加上 `IlcInvariantGlobalization` 這組移除文化特性的設定，可以再少個 100 KB 左右 😄

![6.8MB](https://i.imgur.com/vpyeBNu.png)

>目前 CoreRT 還沒有邁入正式發行的計畫，因此連 Roadmap 都沒有，用在個人 Side Project 無所謂，但建議不要用在正式環境中。

以上就是最近在玩自封式部屬的一些心得筆記。

>本篇完整範例程式碼請參考 [poychang/Demo-Reducing-Size-App](https://github.com/poychang/Demo-Reducing-Size-App)。

## 後記

上面有提到在專案資料夾中加入 `nuget.config` 檔，來增加 NuGet 套件來源，就是增加下面 `dotnet-core` 這組來源，這同時也式 .NET Team 在使用的每日建置版本，當然除了 .NET Core 有這樣每日建置的來源外，還有其他各種框架的搶鮮版套件來源，請考下面 `nuget.config` 檔內容：

```json
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <packageSources>
    <!--To inherit the global NuGet package sources remove the <clear/> line below -->
    <clear />
    <add key="nuget" value="https://api.nuget.org/v3/index.json" />
    <add key="dotnet-core" value="https://dotnetfeed.blob.core.windows.net/dotnet-core/index.json" />
    <add key="extensions" value="https://dotnetfeed.blob.core.windows.net/aspnet-extensions/index.json" />
    <add key="entityframeworkcore" value="https://dotnetfeed.blob.core.windows.net/aspnet-entityframeworkcore/index.json" />
    <add key="aspnetcore-tooling" value="https://dotnetfeed.blob.core.windows.net/aspnet-aspnetcore-tooling/index.json" />
    <add key="aspnetcore" value="https://dotnetfeed.blob.core.windows.net/aspnet-aspnetcore/index.json" />
  </packageSources>
</configuration>
```

----------

參考資料：

* [Reducing the size of self-contained .NET Core applications](https://ianqvist.blogspot.com/2018/01/reducing-size-of-self-contained-net.html)
* [CoreRT 初體驗：將 .NET Core 應用程式封裝成單一可執行檔](https://blog.miniasp.com/post/2019/01/30/How-to-use-CoreRT-SCD-compile-your-NET-Core-App)
* [使用 .NET Native 編譯應用程式](https://docs.microsoft.com/zh-tw/dotnet/framework/net-native/)
* [Intro to CoreRT](https://github.com/dotnet/corert/blob/master/Documentation/intro-to-corert.md)
