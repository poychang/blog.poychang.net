---
layout: post
title: Visual Studio Tools for Office 簡介
date: 2021-07-30 00:42
author: Poy Chang
comments: true
categories: [CSharp, Dotnet]
permalink: vsto-introduction/
---

Microsoft Office 大概是辦公室軟體中最常用的軟體之一，而 Visual Studio Tools for Office，簡稱 VSTO，則是開發 Microsoft Office 中的一套框架，可以讓我們使用同一套框架就能擴充例如 Excel、Word、PowerPoint 等辦公室應用程式。

## 選擇

除了 VSTO 之外，你可能還會聽過 Visual Basic for Applications，簡稱 VBA，以及新一代的 Microsoft Office 的增益集開發框架 Web Add-in，VBA 使用 Visual Basic .NET 進行開發，擅長用於應用程式操作自動化，如果有使用巨集（Macro）的功能了話，你多少會有接觸到。

VSTO Add-in（VSTO 增益集）和 Web Add-in（Web 增益集）最大的差別在於，VSTO 使用的是 C#，而 Web Add-in 使用的是 JavaScript，因此技術線可以這樣選擇：

>如果想要建立以 Windows 為基礎的應用程式，並且需要存取 Windows 作業系統的話，則使用 VSTO Add-in。

>如果想要建立並可以上架到 Microsoft Office Store 中，且可以在任何版本的 Office 中執行，則需要使用 Web Add-in。

Web Add-in 還有個重點特性是，可以在瀏覽器中執行，也就是用在 Office 365 網頁版之中。

## 基礎架構

![基本的操作架構](https://i.imgur.com/Ak2rgwM.png)

VSTO 本身是架構在 .NET Framework 之上，通過 Primary Interop Assembiles (PIA) 這個 Interop 組件來在 Office 應用程式中直接操作。

因此你可以把 VSTO 看作一組允許 Office 應用程式所託管的 .NET CLR 開發工具。

在執行時期的架構分成兩種：

- 應用程式層級的啟動架構 Application-level Architecture
- 檔案層級的啟動架構 Document-level Architecture

### 應用程式層級的啟動架構

應用程式層級的啟動架構是在 Office 應用程式啟動時，主動去搜尋曾經註冊並啟用的 VSTO 增益集，相關的啟動流程可以參考下圖 Office 應用程式層級啟動架構或這份[官方文件](https://docs.microsoft.com/zh-tw/visualstudio/vsto/architecture-of-vsto-add-ins?WT.mc_id=DT-MVP-5003022)

![應用程式層級的啟動架構](https://i.imgur.com/zEhtsEX.png)

特性如下：

- 每個開啟檔案的應用程式使用同一個增益集
- 增益集有各自的 AppDomain
- 必須處理各種檔案類型及版本
- 增益集將登錄到註冊表中
  - `Root\HKEY_CURRENT_USER\SOFTWARE\Microsoft\Office\[應用程式名稱]\Addins\[增益集 ID]`
  - Visual Studio 或 ClickOnce 會自動執行此動作

### 檔案層級的啟動架構

啟動流程基本上大同小異，但不會在 Office 應用程式啟動時載入 VSTO 增益集，而是會根據開啟的檔案判斷是否適用於該增益集再進行啟動，相關的啟動流程可以參考下圖 Office 檔案層級的啟動架構或這份[官方文件](https://docs.microsoft.com/zh-tw/visualstudio/vsto/architecture-of-document-level-customizations?view=vs-2019?WT.mc_id=DT-MVP-5003022)

![檔案層級的啟動架構](https://i.imgur.com/TEDfbll.png)

特性如下：

- 根據檔案來判斷是否啟動增益集
- 每個開啟檔案的應用程式實體都會個別啟動增益集
- 增益集有各自的 AppDomain
- 記憶體空間使用量會有所增加

### 如何建立不同層級的增益集

至於增益集要如何建立不同層級的啟動架構，其實很簡單，若要建立檔案層級的專案，選擇 `Excel VSTO Workbook` 的專案範本即可，下圖以 Excel 為例：

![選擇開發專案](https://i.imgur.com/CQHRv8d.png)

至於如何選擇，如果是想要建立一個通用型的增益集，則選擇應用程式層級的架構，也就是 `Excel VSTO Add-in`。如果是要建立一個專用的檔案，所提供的功能只限於該檔案內使用，則選擇 `Excel VSTO Workbook`。

### 客製功能

而 VSTO 能開發 Office 應用程式中以下功能的擴充：

- 位於應用程式上方的 **Ribbon 功能表**
    ![Ribbon 功能表](https://i.imgur.com/Kqx3YxD.png)
- 透過滑鼠右鍵呼叫顯示的**操作功能表**
    ![操作功能表](https://i.imgur.com/qYIgYZZ.png)
- 出現在應用程式右側的**自訂工作窗格**
    ![自訂工作窗格](https://i.imgur.com/LLZMn9E.png)
- Backstage 檢視頁面
    ![Backstage 檢視頁面](https://i.imgur.com/5jZwrnZ.png)

## 物件模型

Office 內包含了多款應用程式，而每一個應用程式都有自己的物件模型，這些物件模型可以讓我們在開發 VSTO Add-in 時去操作。

各個 Office 應用程式的物件模型的文件說明如下：

- [Excel 物件模型總覽](https://docs.microsoft.com/zh-tw/visualstudio/vsto/excel-object-model-overview?WT.mc_id=DT-MVP-5003022)
- [Word 物件模型總覽](https://docs.microsoft.com/zh-tw/visualstudio/vsto/word-object-model-overview?WT.mc_id=DT-MVP-5003022)
- [Outlook 物件模型總覽](https://docs.microsoft.com/zh-tw/visualstudio/vsto/outlook-object-model-overview?WT.mc_id=DT-MVP-5003022)
- [Visio 物件模型總覽](https://docs.microsoft.com/zh-tw/visualstudio/vsto/visio-object-model-overview?WT.mc_id=DT-MVP-5003022)

不過舊版本的文件有提供物件架構圖，可以看得更清楚一些，詳細的[說明連結](https://docs.microsoft.com/en-us/previous-versions/office/developer/office-xp/aa141044(v=office.10))，這裡以 Excel 物件模型為例：

![舊版的 Excel 物件模型總覽](https://i.imgur.com/trAG2D8.png)

當然，上面舊版的 Excel 物件模型總覽會和新版的有一點出入，但大致上差不了太多，基本結構是相似的，還是可以做為參考使用。

## 佈署

在開發時期，Visual Studio 會幫我們處理好背後所需要的所有工作，包括修改/清除註冊表之類的動作。

當要發布至正式環境時，有兩種方式可以選擇：

- ClickOnce
- Windows Installer

基本上，除非你有其他要附帶的程式或特殊功能，否則可以選擇 ClickOnce，這也內建在 Visual Studio 中，讓你可以透過設定的方式就可以輕鬆佈署。ClickOnce 唯一比較需要注意的，倒是發布檔案的位置，是要能讓使用者都能存取到的地方，不論是用網路芳鄰的方式，還是透過 IIS 或 FTP 來提供更新檔案的位置，都是可以的。

----------

參考資料：

* [Pluralsight - Introduction to Visual Studio Tools for Office](https://app.pluralsight.com/library/courses/vsto/table-of-contents)
* [YouTube - VSTO Tutorial](https://www.youtube.com/playlist?list=PL1Ni1fuY_1u8LDEnZVs9PjxVIxp29lKpL)
* [MS Docs - Excel 物件模型總覽](https://docs.microsoft.com/zh-tw/visualstudio/vsto/excel-object-model-overview?WT.mc_id=DT-MVP-5003022)
* [MS Docs - Word 物件模型總覽](https://docs.microsoft.com/zh-tw/visualstudio/vsto/word-object-model-overview?WT.mc_id=DT-MVP-5003022)
* [MS Docs - Outlook 物件模型總覽](https://docs.microsoft.com/zh-tw/visualstudio/vsto/outlook-object-model-overview?WT.mc_id=DT-MVP-5003022)
* [MS Docs - Visio 物件模型總覽](https://docs.microsoft.com/zh-tw/visualstudio/vsto/visio-object-model-overview?WT.mc_id=DT-MVP-5003022)
