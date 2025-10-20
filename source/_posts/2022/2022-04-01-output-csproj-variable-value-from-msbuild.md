---
layout: post
title: 輸出 .NET 專案檔的變數訊息
date: 2022-04-01 21:12
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop]
permalink: output-csproj-variable-value-from-msbuild/
---

要對 `.csproj` 專案檔進行偵錯，其實是可行的（參考這篇很久以前的(官方文章)[https://devblogs.microsoft.com/visualstudio/debugging-msbuild-script-with-visual-studio/]），但是有些時候，我們只是想輸出變數的值，在建置過程中稍微檢查一下專案檔的設定或變數值，這篇來看一下怎麼做。

## 專案檔基本概念

我們常見到的 `.csproj` 專案檔，就是交給 MSBuild.exe （Microsoft Build Engine） 這隻程式讀取並執行建置的。而這個以 XML 為基礎所撰寫出來的專案檔，有一些基本結構要先認識一下，主要的元素結構會長的像下面這樣：

```
Project
├─ PropertyGroup
|   └─ Property
├─ ItemGroup
|   └─ Item
|       └─ ItemMetadata
└─ Target
    ├─ Task
    ├─ PropertyGroup
    |   └─ Property
    └─ ItemGroup
        └─ Item
            └─ ItemMetadata
```

其中特別要知道的元素用途如下：

- `Property` 用來管理建置過程中會使用到的變數
- `Item` 用來識別建置過程中的輸入值，例如程式碼檔案名稱、路徑等等
- `Target`、`Task` 用來提供給 MSBuild 要如何執行建置程序

專案檔的內容還有很多細節，詳請參考[瞭解專案檔](https://docs.microsoft.com/zh-tw/aspnet/web-forms/overview/deployment/web-deployment-in-the-enterprise/understanding-the-project-file?WT.mc_id=DT-MVP-5003022)這份官方文件。

## 關於輸出訊息

知道專案檔的結構後，不難發現要在哪裡處理輸出訊息，關鍵就是在 `Target`、`Task` 這兩個元素中。`Target` 可以看成較大的執行區塊，而 `Task` 則是某一個執行動作。

因此我們可以在專案檔中寫一個 `Target` 標籤，然後從[MSBuild 工作參考](https://docs.microsoft.com/zh-tw/visualstudio/msbuild/msbuild-task-reference?WT.mc_id=DT-MVP-5003022)這份官方文件種，找到預設所有可以使用的 `Task`，例如 [`Message`](https://docs.microsoft.com/zh-tw/visualstudio/msbuild/message-task)。

`Message` 這個 `Task` 使用方式相當簡單 `<Message Text="$(TestProperty)" Importance="high"/>`，其中 `Importance` 是在指定訊息的重要性，可以是 `high`、`normal` 或 `low`，預設值是 normal。在一些輸出視窗中，會使用這個屬性來調整輸出的顏色。

所以如果要在 MSBuild 執行的過程中，將專案檔內的資訊輸出，則可以參考以下寫法：

```xml
<Project Sdk="Microsoft.NET.Sdk">
    <PropertyGroup>
        <TestProperty>Property Value</TestProperty>
    </PropertyGroup>

    <Target Name="OutputMessage" AfterTargets="Build" >
        <Message Text="$(TestProperty)" Importance="high"/>
    </Target>
</Project>
```

輸出結果如下：

```
Property Value
```

這樣當碰到一些建置過程中用到的預設變數時，例如 `$(Configuration)`、`$(BaseOutputPath)`、`$(VisualStudioVersion)` 等專案屬性的值，就可以藉此輸出出來，方便確定建置過程的正確性。

>如果想知道 MSBuild 預設會有那些變數和專案屬性，可以參考這份[一般 MSBuild 專案屬性](https://docs.microsoft.com/zh-tw/visualstudio/msbuild/common-msbuild-project-properties?WT.mc_id=DT-MVP-5003022)官方文件。

>本篇完整範例程式碼請參考 [poychang/output-project-variable-from-msbuild](https://github.com/poychang/output-project-variable-from-msbuild)。

## 後記

關於 `Target` 還有一件很重要的設定，就是**甚麼時候執行**。

由於 `Target` 只會被 MSBuidl 執行一次，在過去 .NET Framework 的時代，我們可以直接把 Target Name 設定成預設的名字，例如 `Build`、`Compile` 等（更多 Target 預設名字請參考[MSBuild 目標](https://docs.microsoft.com/zh-tw/visualstudio/msbuild/msbuild-targets?WT.mc_id=DT-MVP-5003022)），來覆蓋原本的行為（因為後者覆蓋前者）。

到了 .NET （.NET Core）時代，專案檔已經改用 SDK 風格的寫法，因此你無法直接覆蓋，而是建議你使用 `AfterTargets` 和 `BeforeTargets` 兩個屬性來將你的 `Target` 加到指定執行順序中，例如上面的範例就是在 `Build` 之後執行。

如果你真的要覆蓋某一個 `Target` 的時候，可以參考以下寫法：

```xml
<Project>
    <Import Project="Sdk.props" Sdk="Microsoft.NET.Sdk.Web" />
    <!-- 專案會用到的設定，例如專案屬性、套件位置等內容 -->

    <Import Project="Sdk.targets" Sdk="Microsoft.NET.Sdk.Web" />
    <Target Name="Build">
        <!-- 將你要覆蓋的行為寫在這裡，這會覆蓋 Build 預設的行為 -->
    </Target>
</Project>
```

之所以這樣會可行，是因為你寫的 Target 會在 `Sdk.targets` 之後執行，所以可以覆蓋掉預設的行為。

---

參考資料：

- [How to output a variable value to the log from MSBuild](https://stackoverflow.com/questions/4771913/how-to-output-a-variable-value-to-the-log-from-msbuild)
- [.NET Core - override default build targets](https://stackoverflow.com/questions/47179705/net-core-override-default-build-targets)
- [MS Docs - Understanding the project file](https://docs.microsoft.com/zh-tw/aspnet/web-forms/overview/deployment/web-deployment-in-the-enterprise/understanding-the-project-file?WT.mc_id=DT-MVP-5003022)
- [MS Docs - MSBuild Target](https://docs.microsoft.com/zh-tw/visualstudio/msbuild/msbuild-targets?WT.mc_id=DT-MVP-5003022)
- [MS Docs - MSBuild Message task](https://docs.microsoft.com/zh-tw/visualstudio/msbuild/message-task?WT.mc_id=DT-MVP-5003022)
