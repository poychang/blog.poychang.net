---
layout: post
title: 建立 PowerShell 指令檔/模組檔並發行到 PowerShell Gallery
date: 2020-04-06 16:11
author: Poy Chang
comments: true
categories: [PowerShell]
permalink: create-and-publish-powershell-module-to-powershell-gallery/
---

我們可以將寫好的 PowerShell 指令碼或模組發行到 [PowerShell Gallery](https://www.powershellgallery.com/) 上，供其他人下載使用，這篇將教你如何建立 PowerShell 指令檔和模組檔，以及如何發行到 PowerShell Gallery 上。

首先，PowerShell 提供兩種模式，**指令檔**和**指令碼模組檔**，前者使用 `.ps1` 附檔名，後者使用 `.psm1`，裡面的指令碼內容是沒有差異的，但兩種模式的功能描述資訊方式有些不同，這裡會分別對這兩種模式的建立做說明。

## 建立 Powershell Script 指令檔

你可以建立一個 `.ps1` 的檔案，直接在裡面撰寫指令碼，這樣是 OK 的，但會建議使用 PowerShellGet 這個 Windows 內建模組的 `New-ScriptFileInfo` cmdlet 來建立指令檔，因為透過此 cmdlet 所建立的檔案，內容會包含指令檔的說明資訊註解區塊 `<#PSScriptInfo#>`，可以在這區塊中增加作者、描述等資訊。

我在我的環境中，先建立 `scripts` 資料夾，並使用下列指令在該資料夾中建立 `sample-script.ps1` PowerShell 指令碼檔：

```powershell
New-ScriptFileInfo -Path .\scripts\sample-script.ps1
```

此指令碼的詳細說明請參考 [New-ScriptFileInfo](https://docs.microsoft.com/en-us/powershell/module/powershellget/new-scriptfileinfo) 官方文件，而執行所產生的檔案內容如下，我在各欄位上加上一些說明和一個測試用的指令：

```powershell
<#PSScriptInfo
.VERSION 1.0
.GUID 2d065b5b-f647-427f-8556-4b1e2b61c4be
.AUTHOR 作者名稱，通常會用電子郵件來表示
.COMPANYNAME 公司名稱
.COPYRIGHT 版權說明
.TAGS 標籤
.LICENSEURI 版權網址連結
.PROJECTURI 專案網址連結
.ICONURI 圖示連結
.EXTERNALMODULEDEPENDENCIES 相依的外部模組
.REQUIREDSCRIPTS 相依的指令碼
.EXTERNALSCRIPTDEPENDENCIES 相依的指令碼
.RELEASENOTES 發行說明
.PRIVATEDATA 私有的指令碼資料
#>

<#
.DESCRIPTION 
 指令碼描述
#> 
Param( $name = '')

Write-Output "Hello! $($name)"
```

## 建立 Powershell Script Module 指令碼模組檔

若是要建立指令碼模組檔，只要將 PowerShell 檔案的副檔名從 `.ps1` 修改成 `.psm1`，這樣就是指令碼模組檔，例如 `sample-module.psm1`。

我在我的環境中，先建立 `modules` 資料夾，並在該資料夾中建立 `sample-module.psm1` PowerShell 指令碼檔，另外，你可以針對該模組建立模組資訊檔（選用），透過 `New-ModuleManifest` cmdlet 為相同檔案名稱的模組檔新增模組資訊，指令如下：

```powershell
New-ModuleManifest -Path .\modules\sample-module.psd1
```

透過修改所建立的 `.psd1` 檔案，顯示該模組的相關資訊，詳細的說明請直接參考 [New-ModuleManifest](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/new-modulemanifest) 官方文件。

## 發行至 Powershell Gallery

建立好指令檔或指令碼模組檔後，要將其發行至 [Powershell Gallery](https://www.powershellgallery.com/)，必須要到 Powershell Gallery 網站中取得 API 金鑰。

![取得 API 金鑰](https://i.imgur.com/ORCmWRv.png)

點選 `Create` 後，會要你輸入此金鑰的相關資訊，金鑰有效時間、適用的功能範圍、可處理的套件有哪些，請參考下圖所示：

![設定金鑰相關資訊](https://i.imgur.com/KNThoGR.png)

請注意！完成後務必點選 `Copy` 複製金鑰，該金鑰只能在這時候取得，若沒複製了話，只能重新產生新的。

![請記得複製金鑰](https://i.imgur.com/LN5asSV.png)

有了金鑰之後，在我們本機可以使用下面兩種指令來發行，第一個是發行指令檔，第二個是發行指令碼模組檔：

```powershell
Publish-Script -Path <scriptPath> -NuGetApiKey <apiKey> -WhatIf -Verbose
Publish-Module -Name <moduleName> -NuGetApiKey <apiKey> -WhatIf -Verbose
```

>請注意！上述指令我有使用 `WhatIf` 來模擬執行發行命令，所以如果要正式發行，請將該參數移除。

完成發行指令後，就可以在 Powershell Gallery 找到上架的指令檔/指令碼模組了。

![完成上架](https://i.imgur.com/DRGbMGT.png)

>本篇完整範例程式碼請參考 [poychang/powershell-module-starter](https://github.com/poychang/powershell-module-starter)。

## 指令碼分析工具

附帶一提，為了提升 PowerShell 指令碼品質，可以透過 [PSScriptAnalyzer](https://github.com/PowerShell/PSScriptAnalyzer) 來幫忙，這是 PowerShell 指令碼和模組的靜態程式碼檢查器，使用 PowerShell 團隊與社群所的最佳做法當作規則，檢查程式碼以維持程式碼的品質。此工具可產生 DiagnosticResults（錯誤和警告），以告知開發者潛在的程式碼缺陷，並提出可能的改進方案。

你可以參考本篇 [poychang/powershell-module-starter](https://github.com/poychang/powershell-module-starter) 範例專案的 `tests` 資料夾，裡面的 `InvokeScriptAnalyzer.ps1` 指令檔，用此指令檔來檢查指定檔案是否符合品質規範，執行命令範例如下：

```powershell
InvokeScriptAnalyzer.ps1 -path .\scripts\sample-script.ps1
```

----------

參考資料：

* [How to Publish Your First PowerShell Gallery Package](https://www.jeffbrown.tech/post/how-to-publish-your-first-powershell-gallery-package)
* [使用 PowerShell 库平台分享自己的脚本](https://www.pstips.net/share-script-on-powershell-gallery.html)
