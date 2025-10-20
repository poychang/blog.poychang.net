---
layout: post
title: 開發多個 .NET 目標框架的 NuGet 套件
date: 2022-01-05 15:49
author: Poy Chang
comments: true
categories: [Dotnet, Develop]
permalink: develop-nuget-package-for-multiple-target-framework/
---

在 "One .NET" 這個目標下，.NET 框架可以用來開發各種平台的程式，而除了執行環境的平台外，.NET 自己本身也有各種因時代演進而誕生的各種框架平台，在開發 .NET 的 NuGet 套件時，特別容易會遇到為了讓套件適用於各個 .NET 框架平台的情境，因此有些跨平台的開發技巧必須知道，才能在面對各個框架所支援的 API 差異。

>.NET 文件中所稱的"平台"有 2 種可能，一種是執行環境的平台，如 Windows、MacOS、Linux，另一種平台是 .NET 框架的平台，如 .NET Framework、.NET Core、.NET Standard 等，避免混亂，建議後者用**目標框架**來稱呼。

## 設定成可以建置多目標框架

打開 `.csproj` 專案檔，可以看到預設所使用的 `TargetFramework` 屬性，這指定了此專案要在哪個目標框架下執行。

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFramework>net6.0</TargetFramework>
  </PropertyGroup>
</Project>
```

如果要建置可以支援多個目標框架，只要把 `TargetFramework`（單數）改成 `TargetFrameworks`（複數），並在其中的設定中加上你要支援的目標框架名稱，並用 `;` 分隔就可以了。

以下設定就可以支援 .NET Framework 4.8 和 .NET 6 這兩個目標框架：

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFrameworks>net48;net6.0</TargetFrameworks>
  </PropertyGroup>
</Project>
```

### 支援的目標框架名稱

官方用 Target Framework Moniker (TFM) 來表示目標框架名稱，你可以參考下列簡表，或從[這份官方文件](https://docs.microsoft.com/zh-tw/dotnet/standard/frameworks#supported-target-frameworks?WT.mc_id=DT-MVP-5003022)中找到詳細列表：

| Name                    | TFM            |
| ----------------------- | -------------- |
| .NET Framework          | net46          |
|                         | net462         |
|                         | net47          |
|                         | net472         |
|                         | net48          |
| .NET Standard           | netstandard1.6 |
|                         | netstandard2.0 |
|                         | netstandard2.1 |
| .NET 5+ (and .NET Core) | netcoreapp3.1  |
|                         | net5.0         |
|                         | net6.0         |

如果你想要針對某一個特定執行環境，也就是特定作業系統的目標框架做設定，可以使用像是 `net 6.0-windows`、`net 6.0-macos`、`net 6.0-android` 這樣的設定方式，但其相容性要再檢查一下，或透過[平台相容性分析器](https://docs.microsoft.com/zh-tw/dotnet/standard/analyzers/platform-compat-analyzer?WT.mc_id=DT-MVP-5003022)幫助你檢查。

### 針對專案檔的設定做調整

專案檔內的設定也有可能會依目標框架的不同而有不同的設定，例如在 .NET Framework 需要某些套件，而 .NET Core 的需要另一種。

這時候可以使用 MSBuild 所提供的[條件式建構](https://docs.microsoft.com/zh-tw/visualstudio/msbuild/msbuild-conditional-constructs?WT.mc_id=DT-MVP-5003022)來處理。

最基本的用法就是使用 `Condition` 並針對當前要編譯的 `TargetFramework` 做條件判斷，程式碼範例如下：

```xml
<Project Sdk="Microsoft.NET.Sdk">
  <PropertyGroup>
    <TargetFrameworks>netstandard1.4;net40;net45</TargetFrameworks>
  </PropertyGroup>

  <!-- Conditionally obtain references for the .NET Framework 4.0 target -->
  <ItemGroup Condition=" '$(TargetFramework)' == 'net40' ">
    <Reference Include="System.Net" />
  </ItemGroup>

  <!-- Conditionally obtain references for the .NET Framework 4.5 target -->
  <ItemGroup Condition=" '$(TargetFramework)' == 'net45' ">
    <Reference Include="System.Net.Http" />
    <Reference Include="System.Threading.Tasks" />
  </ItemGroup>
</Project>
```

這最常見於不同目標平台需要使用不同的套件或版本。

## 前置處理器指示詞

如果你想要直接針對程式碼做處理呢？

對於某些 API 可能存在新版、舊版有不同的支援，例如在 .NET Framework 會用到 `WebClient` 這個類別，而較新的目標框架，則會建議使用 `HttpClient` 來處理。

這時候可以使用 C# 的前置處理器指示詞來修正程式碼，這會讓編譯器在編譯特定平台時，套用並編譯所指定的程式碼，藉此達到[條件式編譯](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/preprocessor-directives#conditional-compilation)的效果。

```csharp
#if NET40
    WebClient _client = new WebClient();
#else
    HttpClient _client = new HttpClient();
#endif
```

至於什麼目標平台要用什麼指示詞，你可以參考下列簡表，或從[這份官方文件](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/preprocessor-directives#conditional-compilation)中找到詳細列表：

| Target Frameworks | Symbols | Additional symbols available in .NET 5+ SDK |
| ------------------| ------- | ------------------------------------------- |
| .NET Framework    | `NETFRAMEWORK`, `NET48`, `NET472`, `NET471`, `NET47`, `NET462`, `NET461`, `NET46` | `NET48_OR_GREATER`, `NET472_OR_GREATER`, `NET471_OR_GREATER`, `NET47_OR_GREATER`, `NET462_OR_GREATER`, `NET461_OR_GREATER`, `NET46_OR_GREATER` |
| .NET Standard     | `NETSTANDARD`, `NETSTANDARD2_1`, `NETSTANDARD2_0`, `NETSTANDARD1_6` | `NETSTANDARD2_1_OR_GREATER`, `NETSTANDARD2_0_OR_GREATER`, `NETSTANDARD1_6_OR_GREATER` |
| .NET 5+ (and .NET Core) | `NET`, `NET6_0`, `NET6_0_ANDROID`, `NET6_0_IOS`, `NET6_0_MACOS`, `NET6_0_MACCATALYST`, `NET6_0_TVOS`, `NET6_0_WINDOWS`, `NET5_0`, `NETCOREAPP`, `NETCOREAPP3_1` | `NET6_0_OR_GREATER`, `NET6_0_ANDROID_OR_GREATER`, `NET6_0_IOS_OR_GREATER`, `NET6_0_MACOS_OR_GREATER`, `NET6_0_MACCATALYST_OR_GREATER`, `NET6_0_TVOS_OR_GREATER`, `NET6_0_WINDOWS_OR_GREATER`, `NET5_0_OR_GREATER`, `NETCOREAPP_OR_GREATER`, `NETCOREAPP3_1_OR_GREATER` |

## 後記

有了這些技巧，可以讓我們更好的處理多目標框架的專案。

不過用多了你會發現，程式碼變得相當雜亂，一點都不清爽，所以釐清所要相容的目標框架，並適度的使用，才是上策。

----------

參考資料：

* [MS Docs - SDK 樣式專案中的目標 framework](https://docs.microsoft.com/zh-tw/dotnet/standard/frameworks?WT.mc_id=DT-MVP-5003022)
* [MS Docs - MSBuild 條件式建構](https://docs.microsoft.com/zh-tw/visualstudio/msbuild/msbuild-conditional-constructs?WT.mc_id=DT-MVP-5003022)
* [MS Docs - C# 前置處理器指示詞](https://docs.microsoft.com/zh-tw/dotnet/csharp/language-reference/preprocessor-directives?WT.mc_id=DT-MVP-5003022)
