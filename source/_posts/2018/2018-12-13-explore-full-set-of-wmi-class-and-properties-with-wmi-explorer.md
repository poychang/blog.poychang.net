---
layout: post
title: 查詢 WMI 物件和屬性的好工具 WMI Explorer
date: 2018-12-13 22:43
author: Poy Chang
comments: true
categories: [Dotnet, PowerShell, Tools]
permalink: explore-full-set-of-wmi-class-and-properties-with-wmi-explorer/
---

WMI（Windows Management Instrumentation）是微軟根據 DMTF（Distributed Management Task Force）所制訂的 Web-based Enterprise Management（WBEM）為基礎的實作，藉此讓系統管理人員能方便管理系統，以及取得系統資訊。

## WMI 架構

簡單記錄一下 WMI 的架構，WMI 是一個三套式架構的模型，由上而下分別是 WMI 資料提供者（WMI Provider）、CIM 物件管理員（CIM Object Manager）以及 WMI 資訊請求者（WMI Consumer）。

![WMI 架構圖](https://i.imgur.com/DiNk2vQ.jpg)

>參考來源：[WMI (Windows Management Instrumentation) 介紹及應用](http://www.syscom.com.tw/ePaper_Content_EPArticledetail.aspx?id=76&EPID=159&j=4&HeaderName=%E7%A0%94%E7%99%BC%E6%96%B0%E8%A6%96%E7%95%8C)

### WMI 資料提供者（WMI Provider）

當需要得到某項被管理系統所管理的資訊時，會命令 WMI Provider 到被管理系統中取回資料，被 WMI 管理的物件可能是 Windows 作業系統的程序、服務，或者是安裝在 Windows 的硬體周邊設備。不論是 Windows 系統上的軟體或硬體資源，都必須透過各自的 WMI Provider，將相關的資訊或規格提供給 WMI Object Model，以便程式設計師或系統管理者藉以掌控。

另外 WMI Provider 除了可以從資料來源讀出資訊之外，必要時還可以寫入資訊。

### CIM 物件管理員（CIM Object Manager）

中間層 CIM 是上、下兩層以及 WMI repository 相互運作的媒介，例如自己寫的管理程式若要處理 WMI provider 提供的資訊，就要透過這一層的協助。因為資料來源種類太多，CIM 希望統一其呼叫方式會透過 WMI 所訂的統一資料格式，以查詢語言（WQL, 一種類似 SQL 的查詢語言）向 CIMOM 提出請求。

### WMI 資訊請求者（WMI Consumer）

一切需要借助於 WMI 來取得管理資訊的應用系統均屬於此一層。透過 Visual Basic、C/C++ 以及 .NET、ActiveX Scripting 所支援的語言撰寫程式來調用 WMI 管理程式，就可以取得中間層所回傳的管理資料。

## 使用 C# 查詢 WMI

首先必須加入 `System.Management` 這個參考。接著你可以直接建立 `ManagementClass` 來取得某一個 WMI 物件，藉此找到所管理的程序，例如像下面的程式碼，可以列出所有目前再執行的程序名稱。

```csharp
using System.Management;

var processClass = new ManagementClass("Win32_Process");
foreach (var instance in processClass.GetInstances())
{
    Console.WriteLine(instance["Name"]);
}
```

還有另一種方式是透過 WQL 來查詢，範例如下：

```csharp
using System.Management;

var searchResult = new ManagementObjectSearcher("SELECT * FROM Win32_Process")
    .Get()
    .Cast<ManagementObject>();
foreach (var managementObject in searchResult)
{
    Console.WriteLine(managementObject["Name"].ToString());
}
```

透過 WQL 我們可以使用類似 SQL 的查詢語法來直接取回 WMI 所管理的程序的屬性清單。

但在使用上會有一個盲點，就是我們不太可能記得 WMI 有那些物件和所提供的屬性欄位，例如你知道 `Win32_Process` 除了提供程序名稱外，還可以當前作業系統名稱及安裝在哪個磁碟的資訊嗎？這沒用過，不可能會知道吧，所以下面的工具就很方便了。

## 查詢 WMI 物件及屬性的工具

透過 [WMI Explorer](https://www.ks-soft.net/hostmon.eng/wmi/index.htm) 這個工具除了可以列出所有 WMI 的物件外，還可以得知當前程序透過該 Win32 API 所能取得的屬性值，讓你一看究竟，相當方便。

![WMI Explorer 介面](https://i.imgur.com/HtCogva.png)

WMI Explorer 上方可以看到所有 WMI 的物件，而下方就是該物件的所有屬性欄位，以及所選擇的程序屬性值。同時你還可以切換到查詢頁籤，透過 WQL 來查詢。

![WMI Explorer 查詢介面](https://i.imgur.com/2w09Lwa.png)

這個工具對於要查詢或操作 WMI 的開發者來說，是不是很方便呢！[下載連結](https://www.ks-soft.net/download/wmiexplorer.zip)在這 :)

----------

參考資料：

* [WMI (Windows Management Instrumentation) 介紹及應用](http://www.syscom.com.tw/ePaper_Content_EPArticledetail.aspx?id=76&EPID=159&j=4&HeaderName=%E7%A0%94%E7%99%BC%E6%96%B0%E8%A6%96%E7%95%8C)
* [程式範例 - 快速列出 Windows 執行中程式 CPU%、記憶體用量與執行身分](https://blog.darkthread.net/blog/get-task-manager-list-with-csharp/)
* [Microsoft Docs - ManagementObjectSearcher Class](https://docs.microsoft.com/zh-tw/dotnet/api/system.management.managementobjectsearcher?WT.mc_id=DT-MVP-5003022)
* [WMI Explorer](https://www.ks-soft.net/hostmon.eng/wmi/index.htm)
