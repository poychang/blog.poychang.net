---
layout: post
title: 在 Visual Studio 中自訂檔案巢狀結構
date: 2022-07-26 14:40
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: file-nesting-in-visual-studio/
---

Visual Studio 的方案總管（Solution Explorer）內建了將檔案做巢狀結構的功能，可以讓我們更清楚的查看相依的檔案關係，這個內建的功能主要是做給 ASP.NET Core 專案使用，但我們也可以套用到其他類型的專案中。

網站開發者應該會在 ASP.NET Core 的專案中，發現 `appsettings.json` 這類的檔案會有巢狀結構，當我們想要在其他類型的專案，例如 Console App，也使用這樣的檔案巢狀結構時，你會發現預設是沒有效果的，這時候你可以調整 `.csproj` 專案檔來達到這樣的效果。

## 調整專案檔

我們期待的專案的檔案結構會像是下圖右邊，`appsettings.json` 會有檔案階層，讓檔案結構看起來比較順眼。

![建立 appsettings.json 的檔案階層](https://i.imgur.com/KINKSQo.png)

要做到檔案階層的收折，要來調整 `.csproj` 專案檔，請參考下列程式碼：

```xml
<Project Sdk="Microsoft.NET.Sdk">
    <!-- 略... -->
    <ItemGroup>
        <None Update="appsettings.json">
            <CopyToOutputDirectory>Always</CopyToOutputDirectory>
        </None>
        <None Update="appsettings.*.json">
            <CopyToOutputDirectory>Always</CopyToOutputDirectory>
            <DependentUpon>appsettings.json</DependentUpon>
        </None>
    </ItemGroup>
</Project>
```

接著把每個檔案都加進去 `ItemGroup` 並做對應的設定，或者可以使用 `*` 萬用字元來將多個檔案一起做設定。這裡有兩個屬性要知道：

- `CopyToOutputDirectory` 設定是否複製至輸出資料夾，有以下三個設定值
  - `Never` 不複製至輸出資料夾
  - `Always` 總是複製至輸出資料夾
  - `PreserveNewest` 有更新時才複製至輸出資料夾
- `DependentUpon` 設定此檔案依賴於哪個主要檔案

如此一來，我們的專案的檔案結構就變得漂亮多了。

## 使用 .filenesting.json

如果你所開發的專案沒有像是 `.csproj` 的專案檔，或者不想要改動專案檔內的設定時，要怎樣啟動 Visual Studio 方案總管所提供的檔案巢狀功能呢？這時可以在專案資料夾中加入一個 `.filenesting.json` 設定檔，內容不需要做任何修改，Visual Studio 方案總管的檔案巢狀功能也會自動啟動。

當然你也可以在這個檔案中做一些客製設定，例如，我只想針對 `.cs` 的檔案做檔案巢狀設定，那麼可以在 `.filenesting.json` 設定檔中加入下列程式碼：

```json
{
    "help": "https://go.microsoft.com/fwlink/?linkid=866610",
    "dependentFileProviders": {
        "add": {
            "pathSegment": {
                "add": {
                    ".*": [
                        ".cs"
                    ]
                }

            }
        }
    }
}
```

更詳細的設定選項，請參考 [File nesting in Solution Explorer](https://docs.microsoft.com/zh-tw/visualstudio/ide/file-nesting-solution-explorer)。

## 後記

我個人在寫 .NET 專案的時候，對於功能多又複雜的 Class 類別檔，喜歡用 `partial` 部分類別關鍵字修飾詞來拆分成多個檔案，如此一來可以讓我更容易管理檔案內的方法與屬性，而且可以更容易的根據使用目的來分門別類。

以下就是使用 `partial` 部分類別搭配檔案巢狀來整理程式碼檔案，即使是在同一個類別下，可以更清楚的根據用途來分出每個方法或屬性的群組。

![使用 partial 部分類別搭配檔案巢狀來整理程式碼檔案](https://i.imgur.com/USlZjju.png)

----------

參考資料：

* [File nesting in Solution Explorer](https://devblogs.microsoft.com/dotnet/file-nesting-in-solution-explorer/)
* [MS Docs - 方案總管中的檔案巢狀](https://docs.microsoft.com/zh-tw/visualstudio/ide/file-nesting-solution-explorer?WT.mc_id=DT-MVP-5003022)
* [MS Docs - 部分類別和方法](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/classes-and-structs/partial-classes-and-methods)
