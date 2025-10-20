---
layout: post
title: 在持續整合階段中讓 .NET Framework 專案總是使用最新版本的 NuGet Package
date: 2019-12-04 17:37
author: Poy Chang
comments: true
categories: [Dotnet, Develop]
permalink: continuous-integration-with-latest-nuget-package-in-dotnet-framework-project/
---

這是一個逼不得已的做法，為了要讓 .NET Framework 專案總是使用最新的 NuGet 套件，讓每次部屬都用最新的套件功能，試出了這樣的處理方式。

## 如果是 .NET Core 專案

如果你是開發 .NET Core 的專案，要達成每次建置都使用最新版的 NuGet 套件是很簡單的，你可以直接在 `.csproj` 專案中，透過以下方式來修改 `PackageReference` 來限制還原套件時，所安裝的版本，甚至你可以直接在 `Version` 屬性中設定 `*` 來還原最新的套件版本：

```xml
<!-- 僅接受 6.1 版以前的版本 -->
<PackageReference Include="ExamplePackage" Version="6.1" />

<!-- 下面這兩種方式都是只接受 6.x.y 版本 -->
<PackageReference Include="ExamplePackage" Version="6.*" />
<PackageReference Include="ExamplePackage" Version="[6,7)" />

<!-- 接受比 4.1.3 還新的版本，但不包含 4.1.3 -->
<PackageReference Include="ExamplePackage" Version="(4.1.3,)" />

<!-- 接受比 5.x 還舊的版本，此方法可避免使用到重大變更的版本，但不建議這樣寫，因為無法確定你最就可以用到哪一個版本 -->
<PackageReference Include="ExamplePackage" Version="(,5.0)" />

<!-- 接受 1.x 或 2.x 的版本 -->
<PackageReference Include="ExamplePackage" Version="[1,3)" />

<!-- 接受 1.3.2 至 1.4.x 的版本 -->
<PackageReference Include="ExamplePackage" Version="[1.3.2,1.5)" />

<!-- 使用最新的套件版本 -->
<PackageReference Include="ExamplePackage" Version="*" />
```

版本限制所使用的運算符號意思：

- `[` 大於等於
- `]` 小於等於
- `(` 大於
- `)` 小於

相關資訊可以參考官方文件的[套件版本控制](https://docs.microsoft.com/zh-tw/nuget/concepts/package-versioning#examples?WT.mc_id=DT-MVP-5003022)

## .NET Framework 專案

傳統的 .NET Framework 專案，其 NuGet 套件會被記錄在兩個地方，一個是 `packages.config` 檔案中，另一個是 `.csproj` 專案檔內，前者是給 nuget.ext 使用，用於下載並還原套件，後者專案檔裡面所設定的，則是該專案會參考的套件 dll 相關資訊。

當你打開 `packages.config` 的時候，你會看到像是下面這樣的套件清單，裡面標註了套件名成、版本及目標框架，如果將 `version` 屬性設定成 `*`，想說應該可以抓到最新的套件，但這樣的作法會讓 Visual Studio (2019 版本) 還原套件時，因為找不到版本號，就跟你抱怨了。

```xml
<?xml version="1.0" encoding="utf-8"?>
<packages>
  <package id="Dapper" version="1.50.4" targetFramework="net48" />
</packages>
```

>Visual Studio 在解析版本的時候會使用**語意化版本**的規定，使用 `主版號.次版號.修訂號` 這樣的方式來解析版號，**語意化版本**詳參考這裡 [https://semver.org/lang/zh-TW/](https://semver.org/lang/zh-TW/)。

而如果想從專案檔下手，你會發現 `HintPath` 這個屬性你根本無法動態改變，因為每個套件的路徑會直接相依版本號和支援的框架版本，這個情況下，我們完全無法自動化調整。

```xml
<ItemGroup>
  <Reference Include="Dapper, Version=1.50.4.0, Culture=neutral, processorArchitecture=MSIL">
    <HintPath>..\packages\Dapper.1.50.4\lib\net451\Dapper.dll</HintPath>
  </Reference>
</ItemGroup>
```

>看到這裡就很想把整個專案翻掉，改用 .NET Core 的方式來滿足需求。

## .NET Framework 專案 + DevOps

其實 NuGet 有一個 `update` 指令，可以讓你用下指令的方式來將指定的套件升級，而且可以直接升級到最新版，指令如下：

```bash
nuget update "MyProject.sln" -Id "MyNuGetPackage"
```

NuGet update 指令的相關資訊可以參考官方文件的[update 命令 (NuGet CLI)](https://docs.microsoft.com/zh-tw/nuget/reference/cli-reference/cli-ref-update?WT.mc_id=DT-MVP-5003022)。

有了指令來將傳統的 .NET Framework 專案升級 NuGet 套件版本，這時只要在 DevOps 中持續整合 (CI) 的任務上，在每次建置任務前，執行一次上述的指令，就可以先將指定的套件更新到最新版了。

## 後記

雖然眼前的問題是解決的，但這個做法其實並不完美，因為這個做法會在 CI 的過程中更動到原本 check in 進版控的程式碼，`.csproj` 和 `packages.config` 都會被更動到，而且開發人員在自己電腦本機上所 check out 下來最新的程式碼，會和 CI 上所建置的程式碼有些不同，這樣個過程是會讓人覺得怪怪的。

如果你有更優秀的作法，也請你留言給我，讓我心裡有這"怪怪的"疙瘩，謝謝。

----------

參考資料：

* [如何重新安裝和更新套件](https://docs.microsoft.com/zh-tw/nuget/consume-packages/reinstalling-and-updating-packages?WT.mc_id=DT-MVP-5003022)
* [NuGet update 命令 (NuGet CLI)](https://docs.microsoft.com/zh-tw/nuget/reference/cli-reference/cli-ref-update?WT.mc_id=DT-MVP-5003022)
* [專案檔中的套件參考 (PackageReference)](https://docs.microsoft.com/zh-tw/nuget/consume-packages/package-references-in-project-files?WT.mc_id=DT-MVP-5003022)
* [NuGet 如何解析套件相依性](https://docs.microsoft.com/zh-tw/nuget/concepts/dependency-resolution#floating-versions?WT.mc_id=DT-MVP-5003022)
* [使用浮動 (萬用字元) 來設定套件的版本](https://stackoverflow.com/questions/49895182/meaning-of-the-in-nuget-4-6-2?WT.mc_id=DT-MVP-5003022)
