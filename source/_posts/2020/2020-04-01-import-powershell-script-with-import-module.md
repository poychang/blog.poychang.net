---
layout: post
title: 簡單使用 Import-Module 匯入 PowerShell 模組指令碼
date: 2020-04-01 00:35
author: Poy Chang
comments: true
categories: [Develop, PowerShell]
permalink: import-powershell-script-with-import-module/
---

PowerShell 提供模組化使用方式，讓你可以將各種功能模組化後，根據需求匯入使用，通常我們會將 PowerShell 的模組安裝在固定的位置，你可以在 PowerShell 環境中執行 `$Env:PSModulePath` 來查看 PowerShell 會自動從那些地方載入模組，但有時候我們不想安裝在全域，只是想在我當前的 `.ps1` 檔中簡單的匯入使用，這時候你可以參考這篇的做法。

>如果你的模組想長期在電腦中使用，請參考比較正規的 PowerShell 模組的[撰寫](https://docs.microsoft.com/zh-tw/powershell/scripting/developer/module/writing-a-windows-powershell-module)、[安裝](https://docs.microsoft.com/zh-tw/powershell/scripting/developer/module/installing-a-powershell-module)和[匯入](https://docs.microsoft.com/zh-tw/powershell/scripting/developer/module/importing-a-powershell-module)官方文件。

## 模組化架構

講架構感覺有點太高尚，其實也就是整理指令碼的管理方式，我這邊先建立了一個專案資料夾，並在裡面建立 `modules` 模組資料夾，然後在 `modules` 資料夾中建立兩個 PowerShell 模組指令檔 `.psm1`，指令碼內容如下：

```powershell
# ./modules/module1.psm1
function Get-Something1() {
    Write-Output "This is a Get-Something1"
}
```

```powershell
# ./modules/module2.psm1
function Get-Something2() {
    Write-Output "This is a Get-Something2"
}
```

>注意！指令碼模組的附檔名一定要是 `.psm1`，若你使用 `.ps1` 則會造成指令第二次執行時發生找不到 cmdlet 的錯誤訊息。

接著在專案根目錄中建立一個 `main.ps1` 指令檔，在裡面匯入上面這兩個模組並執行他們，指令碼如下：

```powershell
Import-Module ".\modules\module1.psm1"
Import-Module ".\modules\module2.psm1"

Get-Something1
Get-Something2
```

你應該比較常看到 `Import-Module SOME-MODULE` 這樣的用法，這寫法是會去 `$Env:PSModulePath` 這裡有註冊的位置找模組來載入，其實是用 `Import-Module` 模組載入是可以直接使用路徑來指定模組位置的。

如此一來，我們就可以把 PowerShell 專案的資料夾結構規劃的漂亮些，甚至把功能切小，方便之後重複使用。

執行 `main.ps1` 的結果如下：

![執行結果](https://i.imgur.com/IYcs1E8.png)

## 把 .ps1 指令檔當成模組匯入，會怎樣？

前面有提到 PowerShell 模組指令檔的附檔名是 `.psm1`，如果你使用 `Import-Module` 載入模組指令碼的時候，載入到 `.ps1` 的時候，會發生甚麼事呢？

我們來實驗一下，把 `main.ps1` 改成下面這樣：

```powershell
Import-Module ".\modules\module1.ps1"

Get-Something1
```

同時把模組檔的副檔名改成 `.ps1`，然後執行 `main.ps1` 看看，結果如下：

![執行結果](https://i.imgur.com/5Hy11zB.png)

你會發現第一次執行 `main.ps1` 的時候是成功的，但第二次執行時卻抱錯，說找不到 `Get-Something1` 這個名稱的 cmdlet。

```log
The term 'Get-Something1' is not recognized as the name of a cmdlet, function, script file, or operable program. Check the spelling of the name, or if a path was included, verify that the path is correct and try again.
```

為什麼會有這種差別呢？這時候我們使用 `Get-Module` 查看已匯入至目前工作階段的模組看看。

![Get-Module 查詢當前有載入的模組](https://i.imgur.com/7EXUbSm.png)

圖中紅框的 `module1` 就是我們載入的模組，之所以是這個名稱，是 PowerShell 在匯入模組檔案時，會自動用檔案名稱作為模組名稱，[這篇官方文件](https://docs.microsoft.com/zh-tw/powershell/scripting/developer/module/installing-a-powershell-module?view=powershell-7)有提到這件事，PowerShell 對模組資料夾和名稱是有一定規範的。

這時候會覺得奇怪，`Get-Module` 裡面明明有顯示該模組，為什麼會找不到呢？

因為只有 `.psm1` 檔才能正確註冊進 PowerShell 模組中，而 `Get-Module` 所顯示的只是載入的模組檔案名稱而已。

那位甚麼第一次執行會成功呢？

第一次之所以會執行成功，是因為當前工作階段的 `Get-Module` 沒有 `module1` 這個模組，所以 `Import-Module` 會真的執行 `module1.ps1` 這個指令檔內的指令碼，這時候就讓 `main.ps1` 可以執行 `Get-Something1` 這個 cmdlet 了。

而第二次執行的時候，`Get-Module` 裡面已經有 `module1` 這個模組的設定，因此會去找 `module1.psm1` 來執行，但因為沒有這個檔案呀，所以當然找不到所需要的 cmdlet。

## 後記

這篇其實就兩個重點：

1. `Import-Module` 可以使用路徑來載入模組指令碼
2. 撰寫模組指令碼請用 `.psm1` 副檔名

----------

參考資料：

* [PowerShell Import-Module with .ps1 quirk](https://gist.github.com/magnetikonline/2cdbfe45258c0cc3cf1530548baf30a7)
* [如何撰寫 PowerShell 指令碼模組](https://docs.microsoft.com/zh-tw/powershell/scripting/developer/module/how-to-write-a-powershell-script-module)

