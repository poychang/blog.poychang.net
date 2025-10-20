---
layout: post
title: 在 PowerShell 中使用 Try/Catch 捕捉錯誤訊息
date: 2020-06-18 15:20
author: Poy Chang
comments: true
categories: [PowerShell]
permalink: using-exception-messages-with-try-catch-in-powershell/
---

如果能保證程式不會發生什麼意外，Try/Catch 對你來說沒什麼用，但誰能做出這種保證呢？在寫 PowerShell 的時候，我們可以透過 Try/Catch 的語法，來捕捉程式運行時所發生的例外事件，而 PowerShell 寫法和寫 C# 程式差不多，但又有點不太一樣，來看看我們可以怎樣使用它吧。

## 基本用法

```ps1
try {
    # 主要程式邏輯
}
catch {
    # 當發生例外時要執行的處理程式邏輯
}
```

基本語法很簡單，就像上面的寫法一樣，但你會發現在 `catch` 沒有接收任何參數作為例外事件，這樣我要怎麼知道發生了怎樣的例外事件呢？

在 PowerShell 中使用 Try/Catch 語法時，當 `try` 範圍內的程式發生例外的時候，會將例外事件保存到一個名為 `$Error` 變數裡面，而這個變數是一個陣列，會暫存 PowerSell 當前 Session 中曾經發生過的例外錯誤訊息，因此要取得最新一個例外訊息，則必須要 `$Error[0]` 取得最新一筆例外資訊。

因此基本的 Try/Catch 會寫成這樣將例外訊息印出來：

```ps1
try {
    # 主要程式邏輯
}
catch {
    Write-Output $Error[0]
}
```

>也可以在 `catch` 裡面用 `Write-Output $_.Exception.Message` 來取得當下的例外訊息。

## 關於 $Error

如果你想要知道 `$Error` 這個變數裡面有哪些資料，可以用下面這個指令來看看，這指令會將 `$Error` 轉成 JSON 格式，讓我們比較容易閱讀，然後另存成檔案，畢竟這變數裡面的資料很多，直接印在終端機上不是那麼好看。

```ps1
ConvertTo-Json $Error | Out-File -FilePath C:\Users\poychang\Desktop\log.json
```

另外，不是只有 Try/Catch 會將例外事件的資料加入 `$Error` 變數中，如果你使用 `Write-Error` 來輸出訊息，這個指另也會將相關資訊加入到 `$Error` 變數，要稍微注意一下。

## 針對特定例外處理

例外事件的型別有很多種，例如 `System.NotSupportedException`、`System.IO.DirectoryNotFoundException` 等很多種，如果要針對某一已知的例外類型做出對應的處理方式，可以參考下面的寫法：

```ps1
try {
    # 主要程式邏輯
}
catch [System.NotSupportedException] {
    Write-Output "不支援"
}
catch [System.IO.DirectoryNotFoundException] {
    Write-Output "找不到資料夾"
}
catch {
    Write-Output "通用的例外處理"
}
```

可以看到，我們可以在 `catch` 後面接指定的例外型別，用來區分發生例外事件時，該例外的類型是哪一種，進而做出對應的處理，而通常會在最後面加上通用的 `catch` 來處理未預期例外問題。

## 後記

在 PowerShell 中善用 Try/Catch 捕捉錯誤訊息，能夠幫助我們更清楚的了解程式發生例外的當下，究竟是發生什麼樣的例外事件，幫助我們更快速的調查是哪裡發生錯誤，原因為何。

----------

參考資料：

* [Using Exception Messages with Try/Catch in PowerShell](https://jeffbrown.tech/using-exception-messages-with-try-catch-in-powershell/)
