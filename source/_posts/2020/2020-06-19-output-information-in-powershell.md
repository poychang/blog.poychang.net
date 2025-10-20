---
layout: post
title: 常見的 PowerShell 輸出訊息的 5 種方法
date: 2020-06-19 16:03
author: Poy Chang
comments: true
categories: [PowerShell]
permalink: output-information-in-powershell/
---

PowerShell 提供了很多種輸出訊息的方式，各個 Cmdlet 用途、用法都稍有不同，這篇講一下輸出訊息常用的 5 種方法。

在輸出訊息到終端機時，通常會有以下 5 種 Cmdlet 可以選擇：

1. `Write-Host`
2. `Write-Output`
3. `Write-Warning`
4. `Write-Debug`
5. `Write-Error`

## Write-Host 和 Write-Output

最最常用的莫過於 `Write-Host` 和 `Write-Output` 了，而這兩者最大的差別在於，前者是直接將訊息輸出到終端機畫面，而後者則是將訊息傳遞出來，當外面沒有接收者時，就輸出到終端機畫面了。

看個範例會更清楚：

```powershell
Write-Host "直接輸出到終端機畫面"
Write-Output "這也會輸出到終端機畫面"
Write-Output "這會傳遞給下一個 Cmdlet 接續處理" | Out-File -FilePath C:\Users\poychang\Desktop\log.json
```

前面兩個範例無庸置疑的會將訊息印在終端機上，而第三個範例是使用 `|` 管線符號將 `Write-Output` 所輸出的資料交給 `Out-File` 然後寫到指定的檔案中，這過程中管線會透過 `$_`（也可以用 `$PSItem`）管線變數將前者的輸出傳遞給後者當作預期的輸入，而這樣的寫法就無法用 `Write-Host` 來達成。

或者在寫 PowerShell Function 的時候，你可以使用 `Write-Output` 來輸出 Function 的結果：

```powershell
function Get-DemoInfo() {
  Write-Output "從 Function 傳遞出來的資料"
}
Get-DemoInfo
Get-DemoInfo | Out-File -FilePath C:\Users\poychang\Desktop\log.json
```

單獨執行 `Get-DemoInfo` 時，你會看到終端機印出 `從 Function 傳遞出來的資料` 這樣的文字訊息，而如果你在 `Get-DemoInfo` 後面接紹 `|` 管線符號，就可以將 `Write-Output` 所輸出的資料再往下傳遞下去，這樣的效果是 `Write-Host` 無法做到的。

## 另外三個常用的 Write-

`Write-Warning`、`Write-Debug`、`Write-Error` 這三者看名字就大概猜得出來使用時機，稍微說明一下。

`Write-Warning` 和 `Write-Debug` 分別用於輸出警告訊息和偵錯訊息，會搭配執行時期的 `$WarningPreference` 和 `$DebugPreference` 偏好設定變數來設定是否輸出訊息，預設的情況下 `Write-Warning` 偏好設定變數是 `Continue` 因此會輸出訊息後繼續往下執行，而 `Write-Debug` 的編號設定變數是 `SilentlyContinue` 因此不會輸出訊息但會繼續往下執行。

你可以在 PowerShell 中使用 `$DebugPreference="Continue"` 來變更編號設定變數的值，達到你所預期的效果。

>更多關於偏好設定變數的預設值，請參考這份官方文件 [About Preference Variables](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_preference_variables)。

這兩個 Cmdlet 會自帶文字顏色（預設是黃色），讓輸出時更容易被辨識出來，善用這指令可以幫助事後的閱讀。

`Write-Error` 是一個特別的輸出 Cmdlet，他除了會自帶文字顏色（預設是紅色）輸出到終端機外，還會將錯誤訊息加入到 Error Stream （也就是 `$Error` 變數）中，而且他不會終止當前的執行動作，會繼續往下執行。

>如果你需要輸出錯誤又要中止執行，請使用 `Throw` 這個指令。

## 自訂顏色的輸出

能在終端機中看到附帶顏色的文字訊息，是能夠提升閱讀性的，因此善用上面的 Cmdlet 能達到這點，那如果我們想要自定顏色的時候，可以怎麼做呢？

如果你去看 `Write-Host` 的文件，他有個參數是可以設定輸出文字顏色的，寫法很簡單，參考下面範例：

```ps1
Write-Host "輸出訊息" -ForegroundColor Red -BackgroundColor White
```

其中 `ForegroundColor` 和 `BackgroundColor` 可以接受的值如下：

- Black
- DarkBlue
- DarkGreen
- DarkCyan
- DarkRed
- DarkMagenta
- DarkYellow
- Gray
- DarkGray
- Blue
- Green
- Cyan
- Red
- Magenta
- Yellow
- White

----------

參考資料：

* [Understanding the PowerShell $_ and $PSItem pipeline variables](https://4sysops.com/archives/understanding-the-powershell-_-and-psitem-pipeline-variables/)
* [Microsoft Docs - Write-Host](https://docs.microsoft.com/zh-tw/powershell/module/microsoft.powershell.utility/write-host)
* [Microsoft Docs - Write-Output](https://docs.microsoft.com/zh-tw/powershell/module/microsoft.powershell.utility/write-output)
* [Microsoft Docs - Write-Warning](https://docs.microsoft.com/zh-tw/powershell/module/microsoft.powershell.utility/write-warning)
* [Microsoft Docs - Write-Error](https://docs.microsoft.com/zh-tw/powershell/module/microsoft.powershell.utility/write-error)
* [Microsoft Docs - Write-Debug](https://docs.microsoft.com/zh-tw/powershell/module/microsoft.powershell.utility/write-debug)
* [Microsoft Docs - About Preference Variables](https://docs.microsoft.com/en-us/powershell/module/microsoft.powershell.core/about/about_preference_variables)
* [Microsoft Docs - About Throw](https://docs.microsoft.com/zh-tw/powershell/module/microsoft.powershell.core/about/about_throw)
