---
layout: post
title: Cmder 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note]
permalink: note-cmder/
---

本篇作為書籤用途，記錄網路上的 Cmder 參考資料

>直接到 Cmder 官網（[http://cmder.net/](http://cmder.net/)）下載此工具。

## Cmder 相關設定

* 修改預設的命列列提示符號
    * 將 `C:\Program Files\cmder\vendor\clink.lua` 第 41 行的 `{lamb}` 修改成 `$`
    * 該行原始程式碼：`local cmder_prompt = "\x1b[1;32;40m{cwd} {git}{hg} \n\x1b[1;30;40m{lamb} \x1b[0m"`
* 修改\建立 aliases
    * 超級漂亮的呈現當前目錄的內容，加入 `ll=ls -la --show-control-chars -F --color $*`
    * 檔案路徑 `C:\Program Files\cmder\config\aliases`
    * 如果發生 aliases 無作用，請調整 `cmd.exe`（命令提示字元）的 `Properties`（屬性），勾選 `Use legacy console`（使用舊版控制台）
* 設定中文環境
    * 使用 ls 的時候，中文會變成 Unicode 的格式
    * 在 `Settings`(Win+Alt+P) > `Startup` > `Environment` 中加入下列命令
        * `set LANG=zh_TW.UTF-8`
        * `set LANG=C.UTF-8` 此為 UTF-8 的泛型設定

## aliases 範例

檔案位置：`C:\Program Files\cmder\config\user-aliases.cmd`

```bash
e.=explorer .
gl=git log --oneline --all --graph --decorate  $*
ls=ls --show-control-chars -F --color $*
pwd=cd
clear=cls
history=cat %CMDER_ROOT%\config\.history
unalias=alias /d $1
vi=vim $*
cmderr=cd /d "%CMDER_ROOT%"
ll=ls -al --show-control-chars -F --color $*
```

## 建立 bash

請先安裝 Windows Subsystem for Linux，方法請[參考此文章](https://msdn.microsoft.com/zh-tw/commandline/wsl/install_guide)

* 在 `Settings`(Win+Alt+P) > `Startup` > `Tasks` 中新增 `Bash::Ubuntu`
* Task parameters 設定值
    * `/icon "%USERPROFILE%\AppData\Local\lxss\bash.ico"`
* Commands 設定值
    * `cmd /k "%SYSTEMROOT%\System32\bash.exe" -new_console:d:%USERPROFILE%`

## GNU utilities for Win32

>在 cmd 很好用，但似乎和 cmder 很不合，alias 一直會有問題，以後再試試看

[GNU utilities for Win32](http://unxutils.sourceforge.net/) 將 Linux 好用的工具帶進 Windows 中，可以從網站中下載安中，或執行 choco 指令 `choco install unxutils` （推薦使用）進行安裝。

安裝完成後建議在 cmd 中設定 alias，讓操作更方便，透過 `DOSKEY` 工具設定

```batch
DOSKEY clear=cls
DOSKEY ll=ls -al --show-control-chars -F --color $*
DOSKEY e=explorer .
```

不過這個設定並不會自動儲存，下次再開啟 cmd 後就會消失。因此我們需要把設定存在一個設定檔中，來自動設定，步驟如下：

1. 把 alias 存成一個檔案，這邊假設把檔案存在 `c:\cmd_alias.cmd`
2. 建立一個 batch 檔，來設定自動執行所建立的指令，檔名取為 `cmd_alias_autoruns.cmd`，檔案內容如下 
    ```batch
    :: 注意！這裡要修正檔案路徑
    reg add "HKEY_CURRENT_USER\Software\Microsoft\Command Processor" /v Autorun /t reg_sz /d c:\cmd_alias.cmd
    ```
3. 點擊剛才建立的 batch 檔，完成設定

## WSL 整合至 Cmder

在選單的地方選 settings，找到 Startup > Tasks，這裡會有系統預設的 cmd 與 powershell 設定，我們可以任意去增減 Shell 的設定。

來加入一組設定：

- Name：`WSL::zsh`
- Icon：`-icon "%LOCALAPPDATA%\wsltty\wsl.ico"`
- Command：`%LOCALAPPDATA%\wsltty\bin\mintty.exe --WSL= --configdir="%APPDATA%\wsltty" -o Font="Ubuntu Mono derivative Powerline" -~`

如果想要加入原始 Ubuntu Shell：

- Name：`WSL::Ubuntu`
- Icon：`-icon "%LOCALAPPDATA%\wsltty\wsl.ico"`
- Command：`%LOCALAPPDATA%\Microsoft\WindowsApps\ubuntu1804.exe -cur_console:p`

---

參考資料：

- [介紹好用工具：Cmder ( 具有 Linux 溫度的 Windows 命令提示字元工具 )](https://blog.miniasp.com/post/2015/09/27/Useful-tool-Cmder)
- [介紹好用工具：WSLtty (Mintty as a terminal for WSL)](https://blog.miniasp.com/post/2019/02/09/Useful-tool-WSLtty-Mintty-as-a-terminal-for-WSL)
- [以WSL+UBUNTU+ZSH打造WINDOWS上高富帥的命令列模式](https://blog.kkbruce.net/2019/03/wsl-ubuntu-zsh-windows-command-line.html#.XO3Q6j7iuUk)
- [命令列的藝術](https://github.com/jlevy/the-art-of-command-line/blob/master/README-zh-Hant.md)
