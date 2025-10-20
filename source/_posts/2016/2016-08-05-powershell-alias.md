---
layout: post
title: 設定 PowerShell 的 Alias
date: 2016-08-05 09:26
author: Poy Chang
comments: true
categories: [PowerShell, Tools]
permalink: powershell-alias/
---

不管使用哪一種 Command Line Tool 都會遇到的問題，自訂指令的別名。PowerShell 當然可以自訂，方法也很簡單，使用 `Set-Alias` 指令就可以辦到，只是這個別名的生命週期只有這一次的 Session 有效，那要怎麼讓它成為永久的別名呢？。

假設我們今天要建立一個別名叫做 `ll`，用來取代 `Get-ChildItem`（為什麼會取 `ll`？因為我習慣使用 bash 的 `ls -l` 指令...）。

首先，透過下列指令找到 PowerShell 的設定檔 `Microsoft.PowerShell_profile.ps1` 儲存位置

```powershell
Get-Variable profile | Format-List
```

![Find PS1 File Location](http://i.imgur.com/SufCXTz.png)

接者用文字編輯器開啟該檔案，加入下列程式碼

```powershell
Set-Alias ll Get-ChildItem
```

這樣我就可以不改變習慣的使用 `ll` 來顯示資料夾內容了～ohyeah

----------

參考資料：

* [Using the New-Alias Cmdlet](https://technet.microsoft.com/en-us/library/ee176913.aspx?f=255&MSPPError=-2147217396)
