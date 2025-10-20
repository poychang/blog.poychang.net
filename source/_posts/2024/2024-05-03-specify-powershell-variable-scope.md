---
layout: post
title: 明確指定 PowerShell 變數作用域
date: 2024-05-3 15:54
author: Poy Chang
comments: true
categories: [PowerShell]
permalink: specify-powershell-variable-scope/
---

絕大多數的程式語言都有變數作用域（Scope）的概念，而且通常變數作用域會分成全域和區域兩種作用域，PowerShell 也不例外，這篇文章將會介紹如何在 PowerShell 中明確指定變數的作用域。

首先，先來了解一下 PowerShell 中變數的作用域。藉由作用域可以保護不同範圍的變數，避免被其他專案修改，同時也提供不同範圍的讀取能力。PowerShell 具有以下作用域：

- Global 全域作用域：開啟 PowerShell 工作階段時，啟動選項和設定檔所定義的變數、別名、函數都在此作用域內
- Script 腳本作用域：執行腳本時所建立的作用域，腳本中定義的變數僅適用於此腳本作用域，不適用於全域作用域或上層作用域
- Local 本地作用域：當前執行命令或腳本的當前作用域。例如，在腳本作用域中定義的變數被視為其局部作用域
- Private 私有：技術上這不是一種作用域，是用於保護變數在作用域之外的可見性

在 PowerShell 環境中使用變數的時候，由於變數有繼承關係，也就是位於下層的範圍可以讀取到上層的變數，但下層無法修改上層的變數。

當需要修改上層作用域的變數時，可以透過 PowerShell 所提供的明確指定變數作用域的修飾詞，如下：

| 作用域修飾詞 (Scope Modifier) | 用途                                           |
| --------------------------- | ---------------------------------------------- |
| `global:`                   | 全域作用域 (global scope) 的變數                 |
| `local:`                    | 區域作用域 (local scope) 的變數                  |
| `private:`                  | 嚴格來說不是作用域，用於讓該變數僅在當前作用域可見 |

透過這些修飾詞，可以在使用變數的時候，明確的告訴 PowerShell 要存取的是來自全域還是區域的變數。

例如，有一個 script.ps1 檔案，明確的指定要使用全域範圍的 `hello` 變數：

```powershell
# script.ps1 檔案
# 使用 global: 修飾詞明確指定要使用全域範圍的 hello 變數
$global:hello = "Hello and Modify form local!"
```

當我們開啟 PowerShell 工作階段，指定一個 `$hello` 變數並輸出，這時候會輸出該變數的值，也就是 `Hello Global!`。當我們執行 script.ps1 檔案之後，再重新輸出 `$hello` 變數，則會發現該存在全域的值在腳本作用域中的指令給修改了。

```powershell
PS> $hello = "Hello Global!"
PS> $hello
Hello Global!
PS>
PS> # 執行 script.ps1 檔案
PS> .\script.ps1
PS> $hello
PS> Hello and Modify form local!
```

除了使用作用域修飾詞 (Scope Modifier) 之外，還可以使用[點來源](https://learn.microsoft.com/zh-tw/powershell/module/microsoft.powershell.core/about/about_scripts?view=powershell-7.4#script-scope-and-dot-sourcing) (Dot Sourcing) 的方式，合併兩者的作用域，將腳本中的變數帶入到當前的作用域中，這樣就可以在腳本中修改上層作用域的變數。

例如，有一個 script.ps1 檔案，沒有使用作用域修飾詞，直接指定 `$hello` 變數：

```powershell
# script.ps1 檔案
# 沒有使用作用域修飾詞
$hello = "Hello and Modify form local!"
```

當開啟 PowerShell 工作階段，

```powershell
PS> # 直接輸出 $hello 變數，會發現內容值是 null (空值)
PS> $hello
PS>
PS> # 使用點來源的方式執行 script.ps1 檔案
PS> # 注意！這邊使用 . 來執行 .\script.ps1 檔案
PS> . .\script.ps1
PS> $hello
PS> Hello and Modify form local!
```

透過這樣的方式，可以在 PowerShell 中明確指定變數的作用域，讓變數的使用更加清晰，或者透過點來源的執行技巧，來將作用域合併，達成相同的處理目的。

---

參考資料：

* [PowerShell Variable Scope Guide: Using Scope in Scripts and Modules](https://www.varonis.com/blog/powershell-variable-scope)
* [MS Learn - PowerShell 腳本範圍和點來源](https://learn.microsoft.com/zh-tw/powershell/module/microsoft.powershell.core/about/about_scripts?view=powershell-7.4#script-scope-and-dot-sourcing?WT.mc_id=DT-MVP-5003022)
