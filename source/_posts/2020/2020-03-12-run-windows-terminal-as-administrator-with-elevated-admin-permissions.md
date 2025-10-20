---
layout: post
title: 使用系統管理員身分開啟 Windows Terminal 分頁
date: 2020-03-12 22:52
author: Poy Chang
comments: true
categories: [PowerShell, Tools]
permalink: run-windows-terminal-as-administrator-with-elevated-admin-permissions/
---

如果你曾經使用過 [cmder](https://cmder.net/) 你一定對讚譽有佳，我也不例外，不過自從我改用 [Windows Terminal](https://github.com/microsoft/terminal) 之後，除了無法只將其中一個 Tab 分頁用系統管理員開啟外，我再也沒有想念 cmder 了，而最近好同事教了我一招，讓我能用系統管理員身分開啟 Windows Terminal 分頁，我想我真的可以忘記 cmder 了（謝謝 cmder 曾經讓我重拾打指令的快感）。

從這篇討論 [microsoft/terminal #632](https://github.com/microsoft/terminal/issues/632) 可以知道，基於安全性的考量，尚無計畫讓 Windows Terminal 同時開啟**提升權限的分頁**（具系統管理者權限的分頁）以及**一般分頁**。

>但 [2020/02/14 從討論串的更新](https://github.com/microsoft/terminal/issues/632#issuecomment-491033558)發現，事情是忽有一點曙光，雖然還是非計畫內，但開發團隊似乎找到了解法。

如果你曾經使用過 Linux 或 Unix base 的系統，那你一定對 `sudo` 這個指令很熟悉，這是一隻允許使用者透過安全的方式使用特殊的權限來執行程式的指令，那我們能不能在 Windows 用類似的方法，讓我們將 Windows Terminal 的分頁，在啟動 Shell 的時候，用像 `sudo` 這樣的指令來賦予系統管理者權限呢？

[gerardog/gsudo](https://github.com/gerardog/gsudo) 這個開源專案就是這次的主角！

## 試試看

首先當然是先來安裝 `gsudo` 這支第三方的程式，他提供 3 種安裝方式 [Scoop](https://scoop.sh/)、[Chocolatey](https://chocolatey.org/install) 以及 PowerShell 指令來安裝，這邊我用 PowerShell 指令來處理，安裝指令如下：

```powershell
PowerShell -Command "Set-ExecutionPolicy RemoteSigned -scope Process; iwr -useb https://raw.githubusercontent.com/gerardog/gsudo/master/installgsudo.ps1 | iex"
```

使用 PowerShell 安裝 `gsudo` 的時候，不用使用系統管理者權限即可安裝，安裝的過程中，他會問你要不要使用 `sudo` 作為 `gsudo` 的別名，這點就看你的喜好了，安裝完成的畫面如下：

![安裝 gsudo](https://i.imgur.com/jL9OCsD.png)

接著我們開啟 Windows Terminal 的設定檔，在 `list` 陣列中加入如下的設定：

```json
"list": [
  {
      "guid": "{41dd7a51-f0e1-4420-a2ec-1a7130b7e950}",
      "name": "Windows PowerShell Elevated",
      "commandline": "gsudo.exe powershell.exe",
      "hidden": false,
      "icon" : "https://i.imgur.com/kZeD6EN.png"
  },
  //...
]
```

最關鍵的設定就是 `commandline` 這個屬性，他使用 `gsudo` 去啟動 `powershell.exe` 使之有系統管理者的權限，想當然而的，使用此分頁的時候，會跳出 Windows 的 UAC 確認視窗，確認你真的要用系統管理者權限開啟，但這個確認視窗只會跳出一次，在同一個 Windows Terminal 底下，只需要做一次 UAC 的確認。

另外，我為了區分是否是使用 `gsudo` 來啟動具有系統管理者權限的 PowerShell，我改了 PowerShell 圖示的顏色，方便我識別。

這樣我的 Windows Terminal 的 Shell 清單，就會有使用系統管理者權限啟動 PowerShell 的選項，畫面如下：

![清單中有使用系統管理者權限啟動 PowerShell 的選項](https://i.imgur.com/oIDcqw9.png)

除了啟動時會出現 UAC 的確認是窗外，可以怎樣驗證該分頁是具有系統管理者權限的呢？以 PowerShell 來說，我們可以透過執行 `net session` 這個指令來判別，如果執行解決是 `There are no entries in the list.` 則帶表有系統管理者權限來使用 `net` 指令，如果沒有權限了話，則會看到 `Access is denied.` 的提示訊息。

下圖左邊就是一般權限的執行結果，右邊則是具有系統管理者權限的執行結果：

![比較圖](https://i.imgur.com/Nk4lnXp.png)

## 後記

下面這兩個 PowerShell 圖示，就留給各位，有需要的人使用。

![標準 PowerShell 藍色圖示](https://i.imgur.com/zXh2xU7.png)

![自訂 PowerShell 紅色圖示](https://i.imgur.com/kZeD6EN.png)

----------

參考資料：

* [microsoft/terminal #632](https://github.com/microsoft/terminal/issues/632)
