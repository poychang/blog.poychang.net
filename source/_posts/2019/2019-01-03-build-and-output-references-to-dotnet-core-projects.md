---
layout: post
title: 如何將專案中所參考的 DLL 函示庫跟著建置做輸出
date: 2019-01-03 12:54
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop]
permalink: build-and-output-references-to-dotnet-core-projects/
---

當我們要建立一個隨插 (DLL) 即用 (Method) 的系統的時候，我們會使用類別函式庫專案來建置 DLL，但預設建置類別函式庫專案只會輸出你所寫的程式（通常只有一隻 DLL），不會包含額外參考的 DLL 函示庫檔案（例如 NuGet 的套件），這時會造成一些小困擾，我們可以怎樣優雅的處理這個問題呢？

>撰寫類別函式庫專案建議使用 .NET Standard 來做，讓之後跨平台時能輕鬆銜接。這裡的平台指的是 .NET Framework、.NET Core、Xamarin 等 .NET 家族的平台實作（[參考這裡](https://docs.microsoft.com/zh-tw/dotnet/standard/net-standard?WT.mc_id=DT-MVP-5003022#net-implementation-support)）。

## 情境

假設我們有個 Plug-in System，根據需要動態載入 DLL，當我們要新增加功能時，只要把包含新功能的 DLL 複製至指定的資料夾位置即可，系統會利用 .NET 的反射機制（[System.Reflection](https://docs.microsoft.com/zh-tw/dotnet/framework/reflection-and-codedom/reflection?WT.mc_id=DT-MVP-5003022)）來調用新功能。

這時如果你使用類別函式庫專案寫好新功能，而這個專案裡面安裝了許多 NuGet 套件，建置的時候你會發現輸出的檔案只有少少的三個（如下圖）。

![標準的建置設定，只會輸出少少的檔案](https://i.imgur.com/AqO3RnK.png)

那些我們安裝的 NuGet 套件所提供的 DLL 檔案，都不會出現在這個資料夾中，他們會被記錄在 `.deps.json` 檔案中，這個產生的 JSON 檔案 (*.deps.json) 會列出你的應用程式所相依的套件及 runtime 環境。

在這樣的情況下，如果我們將此輸出的 DLL 複製至我們的 Plug-in System，有時候是可以正常運作的。

為什麼是有時候呢？要正常運作的前提是，這個 Plug-in System 本身有提供這個 DLL 所相依的所有套件，套件的版本也要正確，才能正確運行；如果有缺，那就需要在 Plug-in System 中，先把所需要的套件安裝上去。

這樣其實不是很方便，因為既然是 Plug-in System，就希望不要變動系統底層的東西，把變動封鎖在 Plug-in 本身才是最方便的。

## 作法

要做到將類別函式庫專案中所參考的 DLL 函示庫跟著建置做輸出，只需要一個設定。

透過修改 `.csproj` 專案檔，在 `<PropertyGroup>` 屬性中加入一行設定 `<CopyLocalLockFileAssemblies>true</CopyLocalLockFileAssemblies>`，完整程式碼如下：

```xml
<Project Sdk="Microsoft.NET.Sdk">

  <PropertyGroup>
    <TargetFramework>netstandard2.0</TargetFramework>
    <CopyLocalLockFileAssemblies>true</CopyLocalLockFileAssemblies>
  </PropertyGroup>

  <ItemGroup>
    <PackageReference Include="Dapper" Version="1.50.5" />
    <PackageReference Include="Microsoft.Extensions.DependencyModel" Version="2.1.0" />
    <PackageReference Include="Newtonsoft.Json" Version="12.0.1" />
  </ItemGroup>

</Project>
```

在範例專案我加入的兩個 NuGet 套件：Dapper 和 Newtonsoft.Json，而在修改設定並執行建置後，你會發現輸出資料夾中會多很多檔案（如下圖）：

![修改設定後會多很多檔案](https://i.imgur.com/7f2ZRu5.png)

多出來的檔案可以分成兩種，一種是 NuGet 套件本身的 DLL，另一種是 NuGet 套件相依的 DLL，例如 Newtonsoft.Json 套件就會多出一個 `Newtonsoft.Json.dll`，而 Dapper 套件除了會多出一個 `Dapper.dll` 外，還會出現其他相依的 DLL 檔。

如此一來我們就可以強制專案在建置時，將相依的套件整個複製至輸出資料夾了。

----------

參考資料：

* [How to get .NET Core projects to copy NuGet references to build output?](https://stackoverflow.com/questions/43837638/how-to-get-net-core-projects-to-copy-nuget-references-to-build-output)
* [專案檔中的套件參考 (PackageReference)](https://docs.microsoft.com/zh-tw/nuget/consume-packages/package-references-in-project-files?WT.mc_id=DT-MVP-5003022)
* [MSBuild tasks with dependencies](https://natemcmaster.com/blog/2017/11/11/msbuild-task-with-dependencies/)
* [Plug-in architecture on ASP.NET Core - Dependency problems and solutions](https://thienn.com/plug-in-architecture-on-aspnetcore-dependency-problems-solutions/)
