---
layout: post
title: 使用 .NET Core 封裝 NuGet 套件並輸出靜態檔案
date: 2018-12-04 19:11
author: Poy Chang
comments: true
categories: [Dotnet, Develop, Tools]
permalink: output-static-content-file-to-project-in-dotnet-core-nuget-pack/
---

自從 .NET CLI 內建了建立 NuGet 套件的功能後，要將自己寫好的類別庫專案打包成 NuGet 套件就變得非常容易，[快速入門請看這裡](https://docs.microsoft.com/zh-tw/nuget/quickstart/create-and-publish-a-package-using-the-dotnet-cli?WT.mc_id=DT-MVP-5003022)，如果今天想要在安裝你用 .NET Core 寫好的 NuGet 套件時，除了加入寫好的類別庫參考外，還要輸出靜態檔案到專案中，可以參考這篇教學。

首先要注意一件事情，如果你是使用 `packages.config` 來建立 NuGet 套件了話，要輸出的靜態檔案是要放在套件中的 `content` 資料夾，如果是用 PackageReference 的方式來處理，也就是寫在 `.csproj` 專案的中了話，則是要將靜態檔案放在 `contentFiles` 資料夾中。

一般來說，在用 .NET Framework 來建立 NuGet 套件時，常會用 `packages.config` 來做設定，若是使用 .NET Core 建立 NuGet 套件時，官方教學則是採用 PackageReference 的作法，這時就要注意兩種情境下，靜態檔案要放的位置並不一樣。

>NuGet 3.3 之後才開始支援使用 `contentFiles` 來管理套件中的靜態檔案或 `.pp` 檔。

知道 NuGet 會從套件中哪個資料夾來複製檔案到專案資料夾後，當你真的實作時你會發現...完全沒有動作！

若要用 .NET Core 來封裝 NuGet 套件並且提供靜態檔案了話，要使用下面這樣的設定：

```xml
<ItemGroup>
    <None Include="YOUR_STATIC_FILE.txt">
        <Pack>true</Pack>
        <PackageCopyToOutput>true</PackageCopyToOutput>
        <PackagePath>contentFiles\any\any\</PackagePath>
    </None>
</ItemGroup>
```

重點在 `PackagePath` 中所設定的輸出位置，上面的範例使用 `contentFiles\any\any\` 這代表 `contentFiles\<language>\<target_framework>`，表示此套件只會安裝在指定語言、平台的專案中，如果你的套件適用於各種語言和平台，就參考範例的設定方式都用 `any` 就好了。

此外，`PackagePath` 是可以設定多個目標路徑的，多個目標路徑時，只要用分號分隔即可，因此建議你可以把舊的 NuGet 套件輸出靜態檔案的用法也加上去，就是變成 `<PackagePath>contentFiles\any\any\;content\any\any</PackagePath>` 這樣。

如果你要明確設定，可以參考下列選項：

- Language: `vb`、`cs`、`fs` 分別代表 Visual Basic、C#、F# 三種語言
- Target Framework: `netcoreapp2.1`、`net471` 等（詳請參考[官方文件](https://docs.microsoft.com/zh-tw/dotnet/standard/frameworks?WT.mc_id=DT-MVP-5003022)所列的 TFM）

---

參考資料：

- [NuGet package's content files are not copied to .NET Core project but are copied to .NET Framework project](https://github.com/NuGet/Home/issues/6548#issuecomment-364278875)
- [NuGet ContentFiles Demystified](https://blog.nuget.org/20160126/nuget-contentFiles-demystified.html)
- [Distributing Content and Showing a ReadMe file in a .NET Core Nuget Package](https://weblog.west-wind.com/posts/2018/Jan/29/Distributing-Content-and-Showing-a-ReadMe-file-in-a-NET-Core-Nuget-Package)
- [dotnet core nuget package copying content files on restore](https://stackoverflow.com/questions/49425012/dotnet-core-nuget-package-copying-content-files-on-restore)
- [NuGet 封裝和還原為 MSBuild 目標 - 在套件內包含內容](https://docs.microsoft.com/zh-tw/nuget/reference/msbuild-targets?WT.mc_id=DT-MVP-5003022#including-content-in-a-package)
