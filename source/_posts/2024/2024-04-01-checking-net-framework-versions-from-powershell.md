---
layout: post
title: 使用 PowerShell 查詢電腦安裝的 .NET Framework 版本
date: 2024-04-01 09:23
author: Poy Chang
comments: true
categories: [Dotnet, Develop, PowerShell]
permalink: checking-net-framework-versions-from-powershell/
---

.NET Framework 仍然是許多現有應用程式的開發選項，特別是在伺服器應用中，因此 .NET Framework 並不會在伺服器應用程式中被 .NET 所取代。也因此，了解安裝在系統上的 .NET Framework 版本對於確保應用程序兼容性和系統安全性都至關重要，本文介紹了一種使用 PowerShell 快速檢測系統中安裝的 .NET Framework 版本的方法。

在 Windows 系統中，基本上都有 PowerShell 可以直接執行，以下的腳本是直接從 Windows 注冊表中讀取信息，分析系統中安裝的 .NET Framework 的版本，並寫成函式，以便放到共用函式庫中使用。

```powershell
function Get-DotNetVersionFromRegistry {
    $ndpKeyPath = "HKLM:\SOFTWARE\Microsoft\NET Framework Setup\NDP\v4\Full\"
    $ndpKey = Get-ItemProperty -Path $ndpKeyPath -ErrorAction SilentlyContinue

    if ($null -eq $ndpKey) {
        return "No 4.5 or later version detected"
    }

    # Hashtable mapping release keys to .NET Framework versions
    $versionMap = @{
        533320 = "4.8.1 or later";
        528040 = "4.8 or later";
        461808 = "4.7.2 or later";
        461308 = "4.7.1 or later";
        460798 = "4.7 or later";
        394802 = "4.6.2 or later";
        394254 = "4.6.1 or later";
        393295 = "4.6 or later";
        393273 = "4.6 RC or later";
        379893 = "4.5.2 or later";
        378675 = "4.5.1 or later";
        378389 = "4.5 or later";
    }

    $releaseKey = [int]$ndpKey.Release
    foreach ($key in $versionMap.Keys | Sort-Object -Descending) {
        if ($releaseKey -ge $key) {
            return $versionMap[$key]
        }
    }

    return "No 4.5 or later version detected"
}

# Main script execution
$version = Get-DotNetVersionFromRegistry
Write-Host ".NET Framework Version: $version"
```

這裡直接用了查表法，根據官方這篇文章[如何：判斷安裝的 .NET Framework 版本](https://docs.microsoft.com/zh-tw/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed?WT.mc_id=DT-MVP-5003022)所提供的 .NET Framework 版本 `Release` 值，來判斷系統中安裝的 .NET Framework 版本。

## 後記

如果你是要偵測 .NET Framework 1.0 到 4.0 的版本，由於這些版本的機碼位置不同，判斷方式也有差異，若有需要，可以參考下表作為參考：

| Framework 版本   | 登錄子機碼                                                   | 值                                  |
| ---------------- | ------------------------------------------------------------ | ----------------------------------- |
| 1.0              | `HKLM\Software\Microsoft\.NETFramework\Policy\v1.0\3705`     | `Install` REG_SZ 等於 `1`           |
| 1.1              | `HKLM\Software\Microsoft\NET Framework Setup\NDP\v1.1.4322`  | `Install` REG_DWORD 等於 `1`        |
| 2.0              | `HKLM\Software\Microsoft\NET Framework Setup\NDP\v2.0.50727` | `Install` REG_DWORD 等於 `1`        |
| 3.0              | `HKLM\Software\Microsoft\NET Framework Setup\NDP\v3.0\Setup` | `InstallSuccess` REG_DWORD 等於 `1` |
| 3.5              | `HKLM\Software\Microsoft\NET Framework Setup\NDP\v3.5`       | `Install` REG_DWORD 等於 `1`        |
| 4.0 用戶端設定檔 | `HKLM\Software\Microsoft\NET Framework Setup\NDP\v4\Client`  | `Install` REG_DWORD 等於 `1`        |
| 4.0 完整設定檔   | `HKLM\Software\Microsoft\NET Framework Setup\NDP\v4\Full`    | `Install` REG_DWORD 等於 `1`        |

---

參考資料：

* [MS Learn - 伺服器應用程式的 .NET 與 .NET Framework](https://learn.microsoft.com/zh-tw/dotnet/standard/choosing-core-framework-server?WT.mc_id=DT-MVP-5003022)
* [MS Learn - 如何：判斷安裝的 .NET Framework 版本](https://docs.microsoft.com/zh-tw/dotnet/framework/migration-guide/how-to-determine-which-versions-are-installed?WT.mc_id=DT-MVP-5003022)