---
layout: post
title: PowerShell 模組有 4 種
date: 2020-04-03 00:51
author: Poy Chang
comments: true
categories: [PowerShell]
permalink: powershell-module-types-you-should-know/
---

PowerShell 有模組化的概念，模組化的概念幫助開發者寫出比較容易維護的程式，但在 PowerShell 的世界裡，模組有 4 種，雖然大多數的時候你只會使用某一種做開發，不過知道一下這 4 種模組的差別，能幫助我們理解一下所使用到的模組背後，他是怎麼運作的。

PowerShell 模組有 4 種形式：

1. Script Modules 指令碼模組
2. Binary Modules 二進制模組
3. Dynamic Modules 動態模組
4. Manifest Modules 模組資訊清單

## Script Module 指令碼模組

這是最主要，也是最常用到的模組模式，對於 PowerShell 來說，只要副檔名是 `.psm1` 就是模組檔，而裡面的內容程式碼就是一般我們在寫的 PowerShell 指令碼，沒有特別規定裡面要怎麼寫，這個模組模式也是第一個需要學習使用的模組方式。

因此我們可以使用 `Import-Module` 指令來匯入 `.psm1` 檔，將裡面撰寫的 Function 方法載入到當前的 PowerShell 執行階段中。

>更多關於如何撰寫 PowerShell 指令碼模組，請參考[官方文件](https://docs.microsoft.com/zh-tw/powershell/scripting/developer/module/how-to-write-a-powershell-script-module)。

>更多關於匯入 `.psm1` 檔的方法，請參考[簡單使用 Import-Module 匯入 PowerShell 模組指令碼](./import-powershell-script-with-import-module/)這篇文章。

## Binary Module 二進制模組

PowerShell 使用 .NET Framework 來開發，而 PowerShell Core 則是使用 .NET Core 來開發的，因此 PowerShell 可以使用 `Import-Module` 指令來匯入 C# 開發的 `.dll` 檔，因為 `.dll` 檔已經編譯過了，所以使用這種模組檔的執行效能會比 Script Module 還好。

通常這種模組模式會由開發者建立、使用，而非 IT Pro。

>更多關於如何撰寫 PowerShell 二進位模組，請參考[官方文件](https://docs.microsoft.com/zh-tw/powershell/scripting/developer/module/how-to-write-a-powershell-binary-module)。

>更多關於 PowerShell 載入 dll 檔的方法，請參考[在 PowerShell 中執行 C# 程式碼或 DLL 檔的方法](./using-csharp-code-in-powershell-scripts/)這篇文章。

## Dynamic Module 動態模組

當你在 PowerShell 指令碼中使用 `New-Module` 指令時，你就會在當前 PowerShell 執行階段建立一個暫時的模組，這種模組模式不會儲存任何檔案到系統中，這個模組模式其實用到的機會很少。

## Manifest Module 模組資訊清單

這個模組模式不包含可執行的 PowerShell 程式碼，主要是拿來描述另一個模組檔。通常會用 `New-ModuleManifest` 指令來產生 `.psd1` PowerShell 資料檔。

>更多關於如何撰寫 PowerShell 模組資訊清單，請參考[官方文件](https://docs.microsoft.com/zh-tw/powershell/scripting/developer/module/how-to-write-a-powershell-module-manifest)。

## 後記

因此要開發 PowerShell 模組，原則上會使用 Script Module 指令碼模組的模式，然後再加上 Manifest Module 模組資訊清單來增加模組的描述資訊，若有 C# 開發者提供好用的 dll 給 PowerShell 使用，則將該 dll 當作 Binary Module 二進制模組，在 PowerShell 執行環境中使用。

----------

參考資料：

* [4 Powershell module types you should know](https://poshland.pro/powershell-module-types-you-should-know/)
* [How and When to Create and Use PowerShell Modules](https://www.business.com/articles/powershell-modules/)
