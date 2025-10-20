---
layout: post
title: 動態產生 PowerShell Function
date: 2020-10-13 01:13
author: Poy Chang
comments: true
categories: [Develop, PowerShell]
permalink: dynamic-create-function-in-powershell/
---

寫了很多方便自己用的 PowerShell Function 指令後，發現有很多指令功能其實差不多，只有少部分不一樣，想說要來重構他們，但又不希望影響到既有使用方式，也就是 Function 名稱不改變，可以怎麼處理呢？想說能不能使用動態建立 Function 的方式來做，沒想到...還真的可以！

## 情境

前情提要一下，這樣之後看這篇文章的時候，比較能進入狀況。

假設我有一批 PowerShell Function 長得像這樣：

```ps1
function Func1($Description) { Write-Output "Result1 - $Description" }
function Func2($Description) { Write-Output "Result2 - $Description" }
function Func3($Description) { Write-Output "Result3 - $Description" }

# 執行方式
# Func1 "Hello World"
# 執行結果
# Result1 - Hello World
```

這三個 Function 動作長得很像，只有 Function 名稱和輸出的結果有些不同，如何在不影響其他地方的使用方式下，動態建立這些 Function 呢？

## 動態建立 Function

要動態建立 Function 比我想像中的簡單一些，先看最終用於動態建立 Function 的 Function 程式碼：

```ps1
function Add-DynamicFunction {
    Param(
        [Parameter(
            Mandatory = $true,
            Position = 0,
            HelpMessage = "Function name"
        )]
        [string]$FuncName,
        [Parameter(
            Mandatory = $true,
            Position = 1,
            HelpMessage = "Function action"
        )]
        [string]$FuncAction
    )

    Set-Variable -name Func -value "function global:$($FuncName)() { $($FuncAction) }"
    Invoke-Expression $Func
}
```

上面我使用 `Param` 的方式接收兩個參數，分別會是 Function 名稱，以及執行 Function 時的動作。

然後用 `Set-Variable` 建立變數的 Cmdlet 將要建立的 Function 用文字的方式組合並設定給 `Func` 變數，接著執行 `Invoke-Expression $Func` 即將組合好的文字 Function 拿去給 PowerShell 執行環境執行。

這裡有幾個注意事項：

* 傳進去的 Function 名稱和動作都是用純文字表示，並且是必要的參數（所以設定 `Mandatory = $true`）
* 組合的 Function 前面加上 `global:` 表示是全域使用的 Function，否則之後會找不到此建立的 Function

有了動態建立 Function 的 Function 之後，就可以使用如下的方式，來動態建立 Function：

```ps1
# 動態建立 Function
Add-DynamicFunction -FuncName 'Get-HelloFromDynamicFunction' -FuncAction 'Write-Output "Hello-Dynamic-Function..."'
# 執行
Get-HelloFromDynamicFunction
```

## 批量動態建立

有了基礎之後，就要來大量建立了 😀

在 PowerShell 中，有很多種建立物件的方式，我個人偏好使用 `[PSCustomObject]` 搭配 HashTable 來建立，這是最快速、畫面最清爽的建立方式。

然後只要把他們用 `@()` 括起來，就可以建立出陣列裡面包含多個物件的資料格式：

```ps1
$list = @(
    [PSCustomObject]@{ FuncName="Func1"; Description="3" },
    [PSCustomObject]@{ FuncName="Func2"; Description="3" },
    [PSCustomObject]@{ FuncName="Func3"; Description="3" }
);
```

這時候你可以用清單變數自帶的 `ForEach` 方法、`ForEach-Object` Cmdlet、或用 `foreach` 語法來遍巡 `$list` 清單變數，但我建議使用第三種 `foreach` 語法，因為前面兩者通常會使用 `$_` 來取得當前資料，而 `$_` 是參考內部的 [Scope](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_scopes)，比較容易出現不如預期的狀況，相對的第三種 `foreach` 語法則比較不容易有問題。

>如果還是偏好使用前兩個做法，可以先建立一個變數來接收 `$_` 資料，例如 `$list = $_`，這樣也可以避免 Scope 的問題。

```ps1
$list.ForEach({ Write-Output $_ })
$list | ForEach-Object { Write-Output $_ }

# 建議用這裡的寫法
$list.ForEach({ $l = $_; Write-Output $l; })
$list | ForEach-Object { $l = $_; Write-Output $l; }
foreach ($item in $list) { Write-Output $item }
```

OK！執行完 `ForEach` 之後，就完成了動態建立 Function 囉，這種靠資料驅動建立 Function 的感覺挺不錯的 😆

----------

參考資料：

* [How do I dynamically create functions that are accessible in a parent scope?](https://stackoverflow.com/questions/1123634/how-do-i-dynamically-create-functions-that-are-accessible-in-a-parent-scope)

