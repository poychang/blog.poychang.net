---
layout: post
title: 使用 oh-my-posh 美化 PowerShell 樣式
date: 2020-03-05 09:12
author: Poy Chang
comments: true
categories: [Develop, PowerShell, Tools]
permalink: setting-powershell-theme-with-oh-my-posh/
---

之前一直很羨慕 Mac OS 的使用者有 [iTerm2](https://iterm2.com/) + [oh-my-zsh](https://ohmyz.sh/) 可以讓終端命令列介面變得美美的，自從 Microsoft 官方推出 [Windows Terminal](https://github.com/microsoft/terminal)，讓我弭補了沒有 iTerm2 的缺憾後，再加上 [oh-my-posh](https://github.com/JanDeDobbeleer/oh-my-posh) 這個 Powershell 樣式套件，終於可以在 Windows 環境下輕送設定美美的 PowerShell 樣式了！這篇紀錄如何輕鬆使用 oh-my-posh 美化 PowerShell 樣式。

## 安裝

>如果你也對 Windows Terminal 有興趣了話，可以直接從 [Microsoft Store 中安裝](https://www.microsoft.com/zh-tw/p/windows-terminal-preview/9n0dx20hk701)，雖然撰文的時候還在 Preview 預覽版，但再過一陣子就會有正式版推出了。

開啟 Windows PowerSell 後執行下面兩個安裝指令，這會從 [PowerShell Gallery](https://www.powershellgallery.com/) 下載並安裝 `posh-git` 和 `oh-my-posh` 這兩個模組，前者是在命令列中顯示 Git 專案的相關資訊，後者則是美美的樣式套件。

```powershell
Install-Module posh-git -Scope CurrentUser
Install-Module oh-my-posh -Scope CurrentUser
```

接著我們要修改 PowerShell 啟動時所載入的設定檔，在 PowerShell 中輸入 `$PROFILE` 可得到當前使用者啟動 PowerShell 時，會載入的個人設定檔位置。

你的電腦可能沒有這個實體檔案，這時可以執行下面的指令，如果沒有該設定檔，則建立一個，然後使用 notepad 來開啟該設定檔。

```powershell
if (!(Test-Path -Path $PROFILE )) { New-Item -Type File -Path $PROFILE -Force }
notepad $PROFILE
```

最後在該設定檔中加入下列指令：

```powershell
Import-Module posh-git
Import-Module oh-my-posh
Set-Theme Paradox
```

這樣就會在 PowerShell 啟動時，自動啟動 oh-my-posh 並套用指定的樣式 `Paradox`，這樣就大功告成了。

## 樣式

oh-my-posh 內建了很多樣式，你也可以使用 `Get-Theme` 這個 Cmdlet 指令取得 oh-my-posh 有提供的所有樣式及相關檔案位置，部分樣式參考下圖：

![oh-my-posh 樣式](https://i.imgur.com/8U4FwZf.png)

如果你發現命令列中有些亂碼，這通常是終端機所使用的字型不支援某些符號，我個人是使用 [FiraCode](https://github.com/tonsky/FiraCode)，你也可以試試看 [Nerd Fonts](https://www.nerdfonts.com/)。

----------

參考資料：

* [How to make a pretty prompt in Windows Terminal with Powerline, Nerd Fonts, Cascadia Code, WSL, and oh-my-posh](https://www.hanselman.com/blog/HowToMakeAPrettyPromptInWindowsTerminalWithPowerlineNerdFontsCascadiaCodeWSLAndOhmyposh.aspx)
* [PowerShell 美化：oh my posh](https://ppundsh.github.io/posts/ad6e/)
* [将美化进行到底，把 PowerShell 做成 oh-my-zsh 的样子](https://blog.walterlv.com/post/beautify-powershell-like-zsh.html)

