---
layout: post
title: 使用 Requires 陳述式限制 PowerShell 執行
date: 2020-04-07 12:31
author: Poy Chang
comments: true
categories: [PowerShell]
permalink: use-powershell-requires-statement-to-restrict-running-requirement/
---

有些 PowerShell 指令是需要先安裝某些模組，或需要特定權限才能執行，我們如何限制某個 PowerShell 指令檔或模組，在執行前先去檢查環境是否符合該指令碼的需求，透過 `#Requires` 陳述式，可以幫我們做到相關限制。

透過使用 `#Requires` 陳述式，可以現在該 PowerShell 指令碼是否符合指定的 PowerShell 版本、環境是否安裝必要的模組、執行權限是否為系統管理員，如果不符合必要條件，則指令碼將無法執行。

`#Requires` 陳述式只能用在 Script 指令碼中，可以寫在指令碼中的任何一行，但必須是從該行的第一個陳述式，而一般建議寫在檔案的開頭，方便閱讀，同時你也可以寫多行來做限制，基本使用方式如下：

```powershell
#Requires -Assembly { <Path to .dll> | <.NET assembly specification> }
#Requires -Version <N>[.<n>]
#Requires -Modules { <Module-Name> | <Hashtable> }
#Requires -PSEdition <PSEdition-Name>
#Requires -PSSnapin <PSSnapin-Name> [-Version <N>[.<n>]]
#Requires -ShellId <ShellId> -PSSnapin <PSSnapin-Name> [-Version <N>[.<n>]]
#Requires -RunAsAdministrator
```

`#Requires` 用到的參數說明：

- `-Assembly` 限制 dll 的使用路徑或 [].NET Assembly 的組件版本名稱](https://docs.microsoft.com/zh-tw/dotnet/standard/assembly/names)
- `-Version` 限制 PowerShell 最低版本
- `-Modules` 限制 PowerShell 執行階段必須安裝所相依的模組
- `-PSEdition` 限制 PowerShell 版本，設定值為 `Core` 代表 PowerShell Core，`Desktop` 代表 Windows PowerShell
- `-PSSnapin` 指定 [Snap-in 嵌入式管理單元](https://docs.microsoft.com/zh-tw/powershell/scripting/developer/cmdlet/modules-and-snap-ins)
- `-ShellId` 指定 Shell 環境，必須搭配 `-PSSnapin` 一起設定，可以在 PowerShell 中執行 `$ShellId` 來查詢當前 Shell 名稱
- `-RunAsAdministrator` 限制執行此指令碼必須要有系統管理員權限

>完整的使用方式及範例請參考 [Microsoft PowerShell Docs - About Requires](https://docs.microsoft.com/zh-tw/powershell/module/microsoft.powershell.core/about/about_requires)。

## 常見用法

最常使用到的，應該是以下 3 種，留下範例供參考：

```powershell
# 限制執行時必須要有系統管理者權限
#Requires -RunAsAdministrator
# 限制 PowerShell 最低版本為 6.0
#Requires -Version 6.0
# 限制 PowerShell 執行環境必須安裝 AzureRM.Netcore 和 PowerShellGet 模組
#Requires -Modules AzureRM.Netcore, PowerShellGet
# 限制 PowerShell 執行環境必須安裝 AzureRM.Netcore v0.13 以上版本
#Requires -Modules @{ ModuleName="AzureRM.Netcore"; ModuleVersion="0.13.0" }
```

----------

參考資料：

* [Microsoft PowerShell Docs - About Requires](https://docs.microsoft.com/zh-tw/powershell/module/microsoft.powershell.core/about/about_requires)
* [PowerShell 技能连载 - 探讨 Windows PowerShell 和 PowerShell Core](https://blog.vichamp.com/2017/07/18/dealing-with-windows-powershell-and-powershell-core/)
