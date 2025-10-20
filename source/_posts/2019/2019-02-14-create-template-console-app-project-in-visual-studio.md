---
layout: post
title: 如何在 Visual Studio 快速建立自己的 Console App 專案範本
date: 2019-02-14 12:00
author: Poy Chang
comments: true
categories: [Tools]
permalink: create-template-console-app-project-in-visual-studio/
---

預設的 Console 應用程式範本太過於簡單，只會印出 `Hello World`，每次都要再重新建立常用的專案架構有點繁瑣，透過 Visual Studio 的匯出範本功能，可以讓我們快速打造出貼近工作或團隊需求的專案範本。

>這裡使用 Visual Studio 2017 進行操作。

我預計最後能打造出具有依賴注入（Dependency Injection）架構，以及具有 `appsettings.json` 設定檔的 .NET Core Console App 專案範本

>實作依賴注入架構請參考：[在 .NET Core 主控台應用程式中使用內建的依賴注入](../dotnet-core-console-app-with-dependency-injection/)，加入 `appsettings.json` 設定檔的實作方式請參考：[在 .NET Core 主控台應用程式中使用 appsettings.json 設定檔](../dotnet-core-console-app-with-configuration/)。

首先使用 Visual Studio 內建的 `Console App (.NET Core)` 專案範本建立一個全新的專案，這裡請注意專案名稱請將預設產生的 `ConsoleApp1` 改成 `ConsoleApp`，這樣之後你所產生出的範本名稱才會比要漂亮。

![建立全新的 .NET Core Console App 專案](https://i.imgur.com/Tz9awIL.png)

接著就開始寫程式吧！可以參考這個 [poychang/Demo-Project-Template-Console-App](https://github.com/poychang/Demo-Project-Template-Console-App) 根據我預期要做的 Console App 架構，預設會有一個 `HelloService` 執行畫面如下圖。

![執行 Demo Console App 的畫面](https://i.imgur.com/9j85SnQ.png)

當你寫完範本程式碼之後，可以透過 Visual Studio 工具列上 [專案] > [匯出範本] 開啟匯出範本精靈，將當前的專案匯出成專案範本。

![匯出範本](https://i.imgur.com/9Gr7v1W.png)

這個匯出範本精靈可以在當前方案中任選一個專案匯出成專案範本，這裡有兩個選項 `Project template` 專案範本和 `Item template` 項目範本，這兩個用途簡單說明如下：

- 專案範本：用在建立新專案時所選用的範本
- 項目範本：當建立好專案後，可以在工具列上選擇 [專案] > [加入新項目]，或者在方案總管中對要加入的資料夾上按滑鼠右鍵，也可做新增項目，這裡新增項目所使用的範本，就是項目範本

這裡我們要的是在建立新專案時使用，所以這裡我們選擇 `Project template` 專案範本，並選定來源專案。

![匯出範本精靈中選擇 Project template 專案範本](https://i.imgur.com/FG6SDUB.png)


>本篇完整範例程式碼請參考 [poychang/Demo-Project-Template-Console-App](https://github.com/poychang/Demo-Project-Template-Console-App)。

----------

參考資料：

* [HOW TO：建立專案範本](https://docs.microsoft.com/zh-tw/visualstudio/ide/how-to-create-project-templates?view=vs-2017)
* [自訂 Visual Studio 專案範本](https://shunnien.github.io/2017/07/16/custom-project-template-for-visual-studio/)
* [打造自己的template-建立一致性程式碼](https://blog.alantsai.net/tags/%E3%80%8C%E6%89%93%E9%80%A0%E8%87%AA%E5%B7%B1%E7%9A%84template-%E5%BB%BA%E7%AB%8B%E4%B8%80%E8%87%B4%E6%80%A7%E7%A8%8B%E5%BC%8F%E7%A2%BC%E3%80%8D)
* [[Visual Studio] 使用Visual Studio 2017快速建立專案範本(Project Template)，並上架至Visual Studio Marketplace](https://dotblogs.com.tw/maduka/2017/04/04/2)
