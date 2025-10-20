---
layout: post
title: 自動更新本機的 Git 專案儲存庫
date: 2020-04-02 00:51
author: Poy Chang
comments: true
categories: [Develop, PowerShell]
permalink: use-powershell-to-automatic-pull-git-project/
---

Git 版控工具是大多數開發者每天都會使用到的工具之一，每位開發者電腦裡面，一定都會有很多從遠端拉下來的 Git 專案，每個專案裡面可能還會做分支來管理，同時在協作開發的過程中，要一直同步多個專案的版本，是一件繁瑣的事情，而且這件事你絕對不會想用介面來處理，用指令有簡單一些，但步驟還是有點多，如果能寫成一個指令，執行他，就能幫我們自動更新所有 Git 專案的版本，而且每個分支都能憶起更新，是不是就可以留下更多時間可以寫 Code 了呢，這篇用 PowerShell 來製作一個能夠自動更新本機 Git 專案儲存庫的指令。

首先來處理核心功能，取得 Git 專案下的所有分支名稱，然後逐一執行 `git pull` 將遠端最新版本的資料拉下來，：

```powershell
function Receive-GitAllBranches() {
    # 取得所有分支名稱
    $branches = git branch

    # 逐一處理每個分支
    foreach ($branch in $branches) {
        # 整理一下分支名稱，移除前面 2 個不需要的字元
        $fixedBranch = $branch.Substring(2, $branch.Length - 2)

        # 檢查是否有設定遠端分支
        $trackedExpression = "branch." + $fixedBranch + ".merge"
        $trackedBranch = git config --get $trackedExpression
        if (![string]::IsNullOrEmpty($trackedBranch)) {
            Write-Output "Pulling branch: $($fixedBranch)"
            # 切換分支
            git checkout "$fixedBranch" | Out-Null
            # 同步遠端分支
            git pull 
        }
        else {
            Write-Output "Branch '$($fixedBranch)' has no tracked remote"
        }
    }
}
```

如果我要把所有 Git 專案都執行上面的同步遠端分支功能，我必須先知道所有 Git 專案的資料夾路徑，通常我們會將所有 Git 專案放在同一個資料夾中管理（至少我是這樣子做），因此這動作相對簡單，如果你的 Git 專案資料夾是分散的，那你可能要自己想個辦法來彙整。

因此下面這段程式碼，動作流程如下：

1. 切換到根目錄
2. 取得所有 Git 專案的路徑
3. 逐一切換到該專案目錄下執行上面同步遠端分支的功能

程式碼如下：

```powershell
function Sync-GitAllBranches() {
    param (
        [String]
        $Target
    )
    $Target = [string]::IsNullOrEmpty($Target) ? "C:\Users\poychang\Code\Kingston" : $Target;
    Write-Output "Sync git repo under '$Target'"

    # 指定根目錄位置，並切換到該路徑下
    Set-Location -Path $Target

    # 找出所有 Git 專案的資料夾路徑
    $folders = Get-ChildItem -Recurse -Depth 1 -Directory -Force -Filter .git | Foreach-Object {
        Write-Output $_.FullName.Replace(".git", [string]::Empty)
    }
    Write-Output $folders;

    # 逐一處理每個 Git 專案資料夾
    foreach ($folder in $folders) {
        if (![string]::IsNullOrEmpty($folder)) {
            Write-Host("Change to folder '" + $folder + "'")
            Set-Location -Path $folder
            # 執行同步遠端分支的功能
            Receive-GitAllBranches

            # 切回平常預設會使用的分支
            $DefaultBranch = "Develop"
            git checkout $DefaultBranch
        }
    }
}
```

這樣我們就有 `Sync-GitAllBranches` 指令可以用，透過這個 PowerShell Script 檔，就可以批次自動更新本機的 Git 專案儲存庫。

接下來只要每天早上去到咖啡之前，執行這隻指令，就可以在你拿咖啡回座位上之前，把電腦上的 Git 專案都更新到最新的版本了了。

----------

參考資料：

* [PullAllLocalBranches.ps1](https://gist.github.com/jeffhollan/2c6afc3d53b815bd7825cd3013a258a7)
