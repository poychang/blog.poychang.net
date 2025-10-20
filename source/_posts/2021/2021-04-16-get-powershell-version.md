---
layout: post
title: 如何檢查當前系統使用的 PowerShell 版本
date: 2021-04-16 12:01
author: Poy Chang
comments: true
categories: [PowerShell]
permalink: get-powershell-version/
---

PowerShell 現在已經發展到 7.1 版，而且還有 PowerShell Core 這個跨平台的版本，我們如何確認當前系統上的 PowerShell 版本呢？方法其實還滿多的。

先提一下，Windows PowerShell 內建在幾乎所有的 Windows 作業系統中，但預設安裝的版本會有些不同，以當前最普遍作為預設安裝的 PowerShell 5.1 來說，以下作業系統版本都是預設內建用 5.1 的 PowerShell：

- Windows Server 2019
- Windows Server 2016
- Windows Server 2012 R2
- Windows Server 2012
- Windows Server 2008 R2 (含 Service Pack 1)
- Windows 10 1607 版和更新版本
- Windows 10 1507 版和 1511 版
- Windows 8.1
- Windows 7 (含 Service Pack 1)

其他預設安裝版本資訊，可以參考這份[Windows PowerShell 系統需求](https://docs.microsoft.com/zh-tw/powershell/scripting/windows-powershell/install/windows-powershell-system-requirements)官方文件。

## 檢查當前版本

在使用 PowerShell cmdlet 的時候，有時要注意執行環境是否支援該 cmdlet，而且有些 cmdlet 可能在新的版本已經不支援了，像是 `Register-ScheduledJob` 這支註冊成 PowerShell 排程的 cmdlet 在 7.1 版已經沒有了。

檢查當前 PowerShell 版本的方法，基本上有以下 4 種：

1. `(Get-Host).Version`
2. `$host.Version`
3. `$PSVersionTable.PSVersion`（建議用此方法）
4. 查看 Registry 註冊表

第 1 種方式是先使用 `Get-Host` 取得執行 PowerShell Engine 的宿主環境，然後取出記錄在宿主中的 `Version` 屬性資訊，這方法相當容易理解，但有時候宿主可能會用到不同版本的 PowerShell Engine，而且用這支 cmdlet 來取得遠端伺服器的 PowerShell 版本時，會有些奇怪，這要稍微注意。

第 2 種方式是使用 PowerShell 啟動時自動建立的變數 `$host`，基本上這就是用 `Get-Host` 取得資訊的，所以狀況會跟他一樣。

第 3 種方式是使用 `$PSVersionTable` 這個自動建立的變數，這個變數是唯讀且會回傳當前 PowerShell Engine 版本 `PSVersion`，而且除了 PowerShell 版本之外，還會提供 `PSEdition` 告訴你是哪一種類型的 PowerShell，例如是 `Desktop` (Windows PowerShell) 還是 `Core` (PowerShell Core)。

第 4 種方式是直接去 Windows Registry 註冊表查詢，基本上就是去註冊表找 `HKLM:\SOFTWARE\Microsoft\PowerShell\3\PowerShellEngine` 路徑下的 `PowerShellVersion` 設定值，也因為是去註冊表查，所以這方法可以不用 PowerShell 指令也查得到，例如用 `reg` 或直接開啟 Windows Registry 視窗介面查詢。

## 後記

看到這裡其實不難發現，如果是要用 PowerShell 查詢當前環境的 PowerShell 版本，使用 `$PSVersionTable.PSVersion` 是最好用的方法，避免了不少問題。

----------

參考資料：

* [How to Check your PowerShell Version](https://adamtheautomator.com/powershell-version/)
* [關於 PowerShell 版本](https://docs.microsoft.com/zh-tw/powershell/module/microsoft.powershell.core/about/about_powershell_editions?WT.mc_id=DT-MVP-5003022)
