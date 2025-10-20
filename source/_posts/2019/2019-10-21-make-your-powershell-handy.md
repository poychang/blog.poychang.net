---
layout: post
title: 透過 Alias 和 Function 讓你的 PowerShell 變得順手、更好用
date: 2019-10-21 19:32
author: Poy Chang
comments: true
categories: [PowerShell, Tools]
permalink: make-your-powershell-handy/
---

最近愛上使用 [Windows Terminal](https://github.com/microsoft/terminal) 來當作終端機工具，讓你可以將多種 Shell 整合在一起使用，包括 Windows 內建的 cmd，在 Windows 運行 Linux 環境的 WSL，用於管理 Azure 資源的 Azure Cloud Shell，以及本篇想要分享的 PowerShell，然而經常在各種 Shell 切換的過程中，難免會有些指令工具覺得好用，卻在另一個 Shell 中沒那個指令可以用，這篇將分享如何讓你的 PowerShell 變得順手、更好用。

在我的日常操作中，`grep` 是一個在 Linux 環境中經常使用的搜尋輸出字串的指令工具，在 PowerShell 中所對應用的指令是 `Select-String`，當然 `Select-String` 所提供的功能也是相當完整，但是我的手指肌肉記憶就是習慣打 `grep` 來搜尋所輸出的字串（畢竟字比較少比較好打），以這個需求開始了可製化 PowerShell 命令之路。.

## PowerShell 啟動設定檔

首先要知道 PowerShell 有 4 個啟動設定檔，啟動時候會自動從以下這 4 個檔名路徑**依序載入**設定檔，如果找不到檔案也會自動跳過：

1. `%windir%\system32\WindowsPowerShell\v1.0\profile.ps1`
   - 這個設定檔 `profile.ps1` 會載入到**所有使用者**與所有 Shell 執行環境
2. `%windir%\system32\WindowsPowerShell\v1.0\Microsoft.PowerShell_profile.ps1`
   - 這個設定檔 `Microsoft.PowerShell_profile.ps1` 會載入到**所有使用者**，但僅限於使用 Microsoft.PowerShell 的 Shell 執行環境
3. `%UserProfile%\Documents\WindowsPowerShell\profile.ps1`
   - 這個設定檔 `profile.ps1` 會載入到目前登入的使用者，且會套用到該使用者所有 Shell 執行環境
4. `%UserProfile%\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`
   - 這個設定檔 `Microsoft.PowerShell_profile.ps1` 會載入到目前登入的使用者，但僅限於使用 Microsoft.PowerShell 的 Shell 執行環境

>你可能會找不到這些設定檔，因為他預設不會被產生，你可以自己建立一個對應的檔案即可。

從上面路徑我們可以將設定檔分成兩類：

- 放在 `%windir%` 下的設定檔，會套用至所有使用者
- 放在 `%UserProfile%` 下的設定檔，會套用至當前使用者

或者參考下面這表格：

![PowerShell 設定檔分類](https://i.imgur.com/fPhMEM7.png)

因此如果只是要讓自己使用，可以新增/修改第 3 個設定檔（`%UserProfile%\Documents\WindowsPowerShell\profile.ps1`），把一些自己用起來順手的指令寫在這裏面。

## Alias

自訂指令的別名是所有 Shell 都會提供的功能，PowerShell 當然也可以自訂，透過 `Set-Alias` 指令就可以辦到，例如要建立一個別名叫做 `ll`（這是在 Linux 中常看到的 `ls -l` 縮寫），用來表示 PowerShell 中 `Get-ChildItem` 指令，指令就是：

```powershell
Set-Alias ll Get-ChildItem
```

請注意，如果你是在 Shell 中執行此指令，這個別名的生命週期只有這一次的 Session 有效，要永久生效，請將要設定的別名寫在上面的啟動設定檔中，這樣我們每次 Shell 的執行環境就會有順手的別名可以用。

## Functions

如果 PowerShell 有提供你期望中的對應指令，例如 `ls -l` 對應到 `Get-ChildItem`，那透過 Alias 設定別名的方式即可，但有時候所想要的指令沒有對應的指令可以用，又或者所想要的功能比較複雜，就可以透過 Functions 來建立對自己順手的指令。

>你可以新增/修改個人的 PowerPoint 初始設定檔來在自己本機玩玩看。

要建立一個簡單的 Functions 如下：

```powershell
function Hello {
     param($Name, $Message)                 # 接收 -Name 和 -Message 這個兩個參數的值
     Write-Host "Hello, $Name. $Message"    # 將內容印出來
}
```

如此一來，我們就可以是使用 `Hello -Name 'Poy Chang' -Message 'How are you'` 這樣的命令來在 Shell 中呼叫此功能。

>關於輸入的參數，除了透過 `param()` 來指定接收的參數名稱外，也可以使用 PowerShell 內建的 `$args` 變數來傳遞，而 `$args` 的值會是一組陣列值，你可以使用 `$args[0]` 的方式來取得第一組參數值，依此類推。

### 範例：Grep

`grep` 是一個在 Linux 環境中經常使用的搜尋輸出字串的指令工具，在 PowerShell 中對應的指令是 `Select-String`，你可以用 Alias 的方式將 `grep` 對應到 `Select-String` 來做，但這裡透過 Functions 的方式來處理。

在執行 `grep` 之前，通常會先執行另一個指令，將得到的執行結果，透過 `|` 管道，將結果交給 `grep` 去做過濾。而在 PowerShell Functions 中，我們可以使用 `$input` 內建變數當作輸入，它可接收指令碼區塊（Script Block），這也可以作為管線（`|`）之前的執行結果，使用時必須注意，這 `$input` 內建變數只能**被讀一次**。

>所謂的指令碼區塊（Script Block）是指：以大括號括住的 PowerShell 陳述式，通常可以將重要、經常需要修改的程式碼放進指令碼區塊，並將指令碼區塊指定給變數。

接著先把取得的執行結果轉成文字 Stream，確保前面指令所回傳的結果是文字類型的值，避免因為是物件類型的值而造成問題，再交給 `Select-String` 來處理過濾的動作。

最後這個 PowerShell Functions 就長這樣：

```powershell
function grep {
    $input | out-string -stream | select-string -pattern $args
}
```

如此一來，我就可以輕鬆用的 `ll | grep KEYWORD` 來過濾所輸出的內容了（`ll` 為前面設定的 Alias）。

### 範例：檔案總管

有一個功能我很喜歡，就是直接在 Shell 中使用檔案總管來開啟當前路徑的資料夾，不管你是在 cmd 還是 PowerShell，都可以用 `explorer.exe .` 這指令來開啟，但如果能縮寫成 `e.` 就可以加速我少打很多字，多方便呀！

可是 `e.` 指令因為有 `.` 無法使用 `Set-Alias` 來設定別名，但我們可以使用 Functions 來達成這目標，寫法很簡單請參考下面的程式碼：

```powershell
function e. {
    cmd /c explorer.exe .
}
```

這裡其實直接用 `explorer.exe .` 當作 Functions 的執行內容即可，但如果你想用到一些 cmd.exe 所提供的舊指令時，就可以用 `cmd /c` 這個指令來呼叫。

### 範例：Docker Commands

如果你有在玩 Docker，你一定會經常操作 Docker CLI 的指令，為了簡化日常的操作，我自訂了一些 Docker 命令工具，參考下面的程式碼：

```powershell
# 方便操作遠端的 Docker 
function vtdocker1 { cmd /c docker -H=VTDocker1.poychang.net $args }
function vtdocker2 { cmd /c docker -H=VTDocker2.poychang.net $args }
function vtdocker3 { cmd /c docker -H=VTDocker3.poychang.net $args }

# 將遠端三台 Docker 的 PS 資訊一次吐回來
function vtps {
    cmd /c echo "-----VT01-----"
    cmd /c docker -H=VTDocker1.poychang.net ps
    cmd /c echo "-----VT02-----"
    cmd /c docker -H=VTDocker2.poychang.net ps
    cmd /c echo "-----VT03-----"
    cmd /c docker -H=VTDocker3.poychang.net ps
}
```

有了上面的功能後，我還可以搭配剛建立的 `grep` PowerShell Functions 來做過濾 Docker PS 輸出的資訊。

## 後記

PowerShell 有很多強大的功能，也提供了很多彈性空間，讓我們自訂我們需要的功能，[官方的 PowerShell 文件](https://docs.microsoft.com/zh-tw/powershell/?WT.mc_id=DT-MVP-5003022)也有很多完整的介紹，相當一讀，當然很多功能都是要用到時，才會去找，但有時間的時候稍微掃過一輪，也能讓我們對某個功能有一點印象，讓之後要找的時候也快一些。

----------

參考資料：

* [黑暗執行緒 - Powershell 學習筆記](https://blog.darkthread.net/blog/powershell-learning-notes/)
* [Instead of copying and pasting the same code over and over again, create a PowerShell func](https://www.business.com/articles/functions-in-powershell/)
* [PowerShell: how to grep command output?](https://stackoverflow.com/questions/1485215/powershell-how-to-grep-command-output)
* [用新PowerShell 运行旧的CMD命令](https://www.pstips.net/using-windows-powershell-to-run-old-command-line-tools-and-their-weirdest-parameters.html)