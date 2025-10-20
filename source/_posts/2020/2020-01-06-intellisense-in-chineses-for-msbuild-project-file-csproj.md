---
layout: post
title: 在 MSBuild 專案檔中使用中文的 IntelliSense
date: 2020-01-06 13:50
author: Poy Chang
comments: true
categories: [Dotnet, Develop, Tools]
permalink: intellisense-in-chineses-for-msbuild-project-file-csproj/
---

若要說 Visual Stdio 最強大的武器，莫過於內建強大的 [IntelliSense](https://docs.microsoft.com/zh-tw/visualstudio/ide/using-intellisense) 了，提供列出成員、參數資訊、快速諮詢和自動完成文字等程式碼輔助工具，讓開發人員撰寫程式碼的速度提升了不少，而且藉由 IntelliSense 的提示，還可以在 IDE 中瀏覽當下使用的 API 的相關提示說明，而在 MSBuild 專案檔中（`.csproj`），也是可以使用中文的 IntelliSense 的唷！

>Visual Studio 建議使用英文語系來顯示，聽說雷會比較少一點，畢竟開發這套 IDE 的人幾乎都是用英文在作業。

在編輯 `.csproj` 專案檔的時候，我們可以使用快速鍵 <kbd>alt</kbd> + <kbd>→</kbd> 叫出 IntelliSense 提示視窗，或者在編輯的時候如下畫面，讓你選擇適合的 API 或功能來加速開發：

![編輯 .csproj 專案檔時只有英文的提示訊息](https://i.imgur.com/cnfOwvm.png)

因為我是使用英文版的 Visual Studio，所以提示會是英文的，如果想要有繁體中文的提示，就必須要做些調整了。

>單純將 Visual Studio 語系調整成繁體中文是沒有用的，這之間似乎有 bug。

我們知道 `.csproj` 專案檔其實是個 XML 描述的檔案，當你開啟 `.csproj` 的編輯模式時，在 Visual Studio 工具列上會有 `XML` 選單，你可以點選裡面的 `Schemas` 來查看所使用的 XML 結構描述，如下圖：

![查看所使用的 XML 結構描述](https://i.imgur.com/ZKJUDj4.png)

這裡主要用到 3 個 XML 結構描述檔：

1. Microsoft.Build.Core.xsd
2. Microsoft.Build.xsd
3. Microsoft.Build.CommonTypes.xsd

這 3 個檔案就是為什麼 Visual Studio 可以顯示 `.csproj` 專案檔中，各個屬性的相關訊息的關鍵了。

Visual Studio 在安裝時，會將所需要的 XML 結構描述快取存在 `%VsInstallDir%\xml\Schemas` 中（`%VsInstallDir%` 是 Visual Studio 的安裝路徑），關於 XML 結構描述快取請參考[這份官方文件](https://docs.microsoft.com/zh-tw/visualstudio/xml-tools/schema-cache?view=vs-2019&source=docs)，你可以從工具列上的 `Tooks` > `Options` > `Text Editor` > `XML` > `Miscellaneous` 中看到該設定，如下畫面：

![XML 結構描述的快取位置](https://i.imgur.com/qbxCkzo.png)

知道 IntelliSense 的資訊是從哪裡抓的，那如何取得繁體中文的提示訊息呢？

在 `%VsInstallDir%\xml\Schemas` 路徑下，有個 `1033` 資料夾，這是英文語系的提示訊息，要取得繁體中文的提示訊息，必須透過安裝 Visual Studio 繁體中文語言包才會有，下圖是透過 Visual Studio Installer 來安裝繁體中文的語言包：

![安裝繁體中文語言包](https://i.imgur.com/d83FsFH.png)

安裝完後，在 `%VsInstallDir%\xml\Schemas` 路徑下就有個 `1028` 資料夾，你可以打開該資料夾裡面的 `MSBuild\Microsoft.Build.Commontypes.xsd` 就可以看到很多繁體中文的提示了。

![1028 資料夾](https://i.imgur.com/eUmpafC.png)

但只是安裝語言包並不會讓你看到繁體中文的提示訊息，因為我的 Visual Studio 介面是使用英文語系，因此預設抓 `1033` 資料夾下的 XML 結構描述檔。

如果你跟我一樣想用英文語系的介面，但看到繁體中文的 IntelliSense 提示，可以將 `%VsInstallDir%\xml\Schemas\1028\MSBuild\Microsoft.Build.Commontypes.xsd` 這個檔案複製至 `1033` 資料夾中，但記得備份原本英文語系的檔案版本。

如此一來，你就可以在編輯 `.csproj` 專案檔的時候，看到 IntelliSense 的繁體中文提示了。

![繁體中文的提示](https://i.imgur.com/ph6Sy3Y.png)

----------

參考資料：

* [XML 結構描述快取](https://docs.microsoft.com/zh-tw/visualstudio/xml-tools/schema-cache)
* [microsoft/msbuild - msbuild/src/MSBuild/ProjectSchemaValidationHandler.cs](https://github.com/Microsoft/msbuild/blob/master/src/MSBuild/ProjectSchemaValidationHandler.cs)
* [microsoft/msbuild - msbuild/src/MSBuild/Microsoft.Build.CommonTypes.xsd](https://github.com/Microsoft/msbuild/blob/master/src/MSBuild/Microsoft.Build.CommonTypes.xsd)
