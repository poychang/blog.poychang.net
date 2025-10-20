---
layout: post
title: Windows Terminal 啟動時自動分割視窗給 NTop 即時監控系統資源
date: 2021-06-22 12:03
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: windows-terminal-use-startupActions-to-default-open-ntop-on-new-tab/
---

在 Linux 的終端機中有 `top` 和 [htop](https://htop.dev/) 系統資源狀態的即時監控指令可以玩，若想在 Windows 中呈現類似效果，[gsass1/NTop](https://github.com/gsass1/NTop) 是一隻可以玩玩看得工具。這時候我就想要在開啟 Windows Terminal 的時候自動分割視窗並執行 `NTop`，要達成這樣的效果，可以這樣玩設定。

先來看一下最後的效果：

![開啟 Windows Terminal 啟動時自動分割視窗給 NTop 即時監控系統資源](https://i.imgur.com/9X5UspZ.png)

## NTop

首先，要先下載 [NTop](https://github.com/gsass1/NTop) 這隻工具程式，可以用 Chocolatey `choco install ntop.portable` 或 Scoop `scoop install ntop` 來安裝，或者也可以直接到 [NTop 的 Release 頁面](https://github.com/gsass1/NTop/releases) 下載預先編譯好的版本到本機，並設定好環境變數，使之可以直接在終端機上執行該程式。

通常我在執行這個工具的時候，會再搭配排序參數 `-s`，因此我這邊會用的指令是下面這樣，根據記憶體使用量排序：

```powershell
ntop -s "MEM"
```

## Windows Terminal 命令列

這裡才是這篇的重點，要如何在 Windows Terminal 啟動時，自動分割視窗並執行指定的程式。

Windows Terminal 有提供使用[命令列](https://docs.microsoft.com/zh-tw/windows/terminal/command-line-arguments?WT.mc_id=DT-MVP-5003022)的方式來開啟，使用方式如下：

```powershell
wt.exe [options] [command ; ]
```

指令中的 options 設定參數，是用來設定啟動的視窗尺寸、要執行的 Profile 等設定，後面可接開啟後要執行的 command 命令，並用 `;` 來分隔指令，因此可以串接執行多個命令。

為了要達到本文想要的效果，可以執行下面的命列：

```powershell
wt.exe --maximized --profile PowerShell; split-pane --horizontal --size 0.2 --profile PowerShell /k ntop -s "MEM"
```

各個命令和設定的用途如下（依參數順序說明）：

- `wt.exe` 啟動 Windows Terminal
  - `--maximized` 最大化視窗
  - `--profile PowerShell` 載入 PowerShell 這個 Profile
- `split-pane` 分割視窗
  - `--horizontal` 用水平的方式分割
  - `--size 0.2` 新的分割視窗佔 20% 的原視窗比例
  - `--profile PowerShell /k ntop -s "MEM"` 載入 PowerShell 並執行 `ntop` 命令

如此一來就可以達到想要的效果。

更多關於 Windows Terminal 命令列的使用方式，可以參考這篇官方文件：[使用 Windows 終端機的命令列引數](https://docs.microsoft.com/zh-tw/windows/terminal/command-line-arguments?WT.mc_id=DT-MVP-5003022)。

## Windows Terminal 設定檔

如果想要每次啟動 Windows Terminal 視窗時，都呈現這樣的效果，可以修改 Windows Terminal 的 `settings.json` 設定檔（目前尚未有設窗介面可以修改，必須開啟檔案編輯），在裡面加入 `startupActions` 這個設定屬性，這個設定是用來客製化啟動時的執行令命，因此就可以將上面所要執行的 command 命令搬進去，修改後如下：

```json
{
    "startupActions":"split-pane --horizontal --size 0.2 --profile PowerShell /k ntop -s \"MEM\"",
    "launchMode": "maximized",
    // 略...
}
```

這邊我額外設定 `launchMode` 使其啟動時最大化視窗尺寸。

這樣之後啟動 Windows Terminal，就會自動分割視窗給 NTop 即時監控系統資源，方便我們查看當前系統資源的使用狀況了。

更多關於啟動設定，請參考這篇官方文件：[Windows 終端機中的啟動設定](https://docs.microsoft.com/zh-tw/windows/terminal/customize-settings/startup?WT.mc_id=DT-MVP-5003022)。

----------

參考資料：

* [Windows Terminal Preview 1.6 Release](https://devblogs.microsoft.com/commandline/windows-terminal-preview-1-6-release/)
* [MS Docs - Windows 終端機中的啟動設定](https://docs.microsoft.com/zh-tw/windows/terminal/customize-settings/startup?WT.mc_id=DT-MVP-5003022)
* [MS Docs - 使用 Windows 終端機的命令列引數](https://docs.microsoft.com/zh-tw/windows/terminal/command-line-arguments?WT.mc_id=DT-MVP-5003022)
