---
layout: post
title: Windows Terminal 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: note-windows-terminal/
---

本篇作為書籤用途，記錄網路上的 Windows Terminal 相關資訊

## Windows Terminal 快速鍵

- <kbd>alt</kbd> + <kbd>shift</kbd> + <kbd>+</kbd> 增加左右分割畫面
- <kbd>alt</kbd> + <kbd>shift</kbd> + <kbd>-</kbd> 增加上下分割畫面
- <kbd>alt</kbd> + <kbd>←</kbd> 或 <kbd>→</kbd> 移動焦點至另一個分割畫面

## WSL 設定

- [保哥的 Windows Subsystem for Linux (WSL) 終極開發人員配置 - 2018 版](https://blog.miniasp.com/post/2018/06/15/My-Windows-Subsystem-for-Linux-WSL-Setup-2018)
- [以WSL + Ubuntu + zsh打造Windows上高富帥的命令列模式](https://blog.kkbruce.net/2019/03/wsl-ubuntu-zsh-windows-command-line.html)
- [Windows Subsystem for Linux (WSL) 環境設定](https://hackmd.io/@tf-z1zFMTIC8ADhxEcGJEA/BJByCIUHf)

```bash
# 讓執行 sudo 的時候免輸入密碼
# 請記得將 poy 換成你自己的 WSL 登入帳號
echo "poy ALL = (root) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/poy

# 升級所有套件
sudo apt-get update && sudo apt-get upgrade

# 如果要安裝 Node.js 8.x 才需要執行以下命令
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs

# 如果要安裝 Node.js 10.x 才需要執行以下命令
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
sudo apt-get install -y nodejs

# Optional: install build tools
sudo apt-get install -y build-essential

# 升級 npm
sudo npm install -g npm
npm --version
```

## WSL 設定 Z shell (zsh)

設定前可以先在 Windows 系統中安裝 [Fira Code](https://github.com/tonsky/FiraCode) 和 [Powerline](https://github.com/powerline/fonts) 字型，Powerline 我選用 Ubuntu Mono 的版本。注意！請選擇 True Type 字型 (ttf) 進行安裝。

```bash
# 下載 zsh
sudo apt-get install zsh
zsh --version

# 將 zsh 設為預設 shell，完成後關掉 App 再重開，並直接按 0 建立空白含註解的 .zshrc
chsh -s $(which zsh)

# 安裝 oh-my-zsh（擇一）
#sh -c "$(wget https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh -O -)"
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

```bash
# 使用 agnoster 主題
ZSH_THEME="agnoster"

# 將以下設定附加到 .zshrc 檔案後

export TERM="xterm-256color"

# Alias definitions.
# You may want to put all your additions into a separate file like
# ~/.bash_aliases, instead of adding them here directly.
# See /usr/share/doc/bash-doc/examples in the bash-doc package.

if [ -f ~/.bash_aliases ]; then
    . ~/.bash_aliases
fi

# ========================================
# Welcome message
# ========================================
eval "$(dircolors ~/.dircolors)";
home
clear
echo -ne "Hello, $USER. Today is, "; date
```

## 調整 ls 資料夾背景顏色

[What causes this green background in ls output?](https://unix.stackexchange.com/questions/94498/what-causes-this-green-background-in-ls-output?newreg=e23f5b22156d4316a2dd522b69141684)

```bash
dircolors -p > ~/.dircolors
```

將下面這行

```
OTHER_WRITABLE 34;42 # dir that is other-writable (o+w) and not sticky
```

修改成

```
OTHER_WRITABLE 30;41 # dir that is other-writable (o+w) and not sticky
```

套用變更

```bash
eval "$(dircolors ~/.dircolors)";
```

如果要之後都套用此設定，可以修改 `~/.bashrc` 檔，在裡面執行 `eval "$(dircolors ~/.dircolors)";`，讓每次啟動時，自動套用設定。

![修改前](https://i.imgur.com/nRxt29o.png)

![修改後](https://i.imgur.com/MSpd6xz.png)

## WSL .bashrc 設定

原始的 `.bashrc` 有判斷如果家目錄下有 `.bash_aliases`，則會載入該檔案內的 aliases 設定，可以加入以下 aliases：

```bash
alias home='cd /mnt/c/Users/poypo/'
alias cls=clear
alias e.='explorer.exe .'
alias gl='git log --oneline --all --graph --decorate $*'
alias ll='ls -al --show-control-chars -F --color $*'
```

另外可以在 `.bashrc` 最後面加上下面的指令，讓啟動 WLS 後，會切換到 Windows 的家目錄，並清掉啟動過程中的訊息，然後顯示今天日期。

```bash
home
clear
echo -ne "Hello, $USER. Today is, "; date
```

## 自訂快捷鍵

```json
{
    "actions": 
    [
        {
            "command": "find",
            "keys": "ctrl+shift+f"
        },
        {
            "command": "paste",
            "keys": "ctrl+v"
        },
        {
            "command": 
            {
                "action": "copy",
                "singleLine": false
            },
            "keys": "ctrl+c"
        },
        {
            "command": 
            {
                "action": "closeTab"
            },
            "keys": "ctrl+w"
        },
        {
            "command": 
            {
                "action": "newTab"
            },
            "keys": "ctrl+t"
        },
        {
            "command": 
            {
                "action": "splitPane",
                "split": "auto",
                "splitMode": "duplicate"
            },
            "keys": "alt+shift+d"
        }
    ],
    // 略...
}
```

## 全域字型設定

在 `profiles` 底下的 `defaults` 屬性中，加入 `font` 屬性，設定字型名稱、大小、粗細。

```json
{
    "profiles": 
    {
        "defaults": 
        {
            "font": 
            {
                "face": "Fira Code",
                "size": 10,
                "weight": "normal"
            }
        },
        // 略...
    }
}
```

## Theme Scheme

修改 Windows Terminal 的終端機樣式，透過將下面的程式碼加到 `profiles.json` 中的 `schemes` 屬性，即可使用。

```json
{
    "background": "#282C34",
    "black": "#282C34",
    "blue": "#268BD2",
    "brightBlack": "#5A6374",
    "brightBlue": "#268BD2",
    "brightCyan": "#2AA198",
    "brightGreen": "#98C379",
    "brightPurple": "#D33682",
    "brightRed": "#E06C75",
    "brightWhite": "#FDF6E3",
    "brightYellow": "#C19C00",
    "cursorColor": "#FFFFFF",
    "cyan": "#2AA198",
    "foreground": "#FDF6E3",
    "green": "#98C379",
    "name": "PoyChang Theme",
    "purple": "#D33682",
    "red": "#E06C75",
    "selectionBackground": "#FFFFFF",
    "white": "#EEE8D5",
    "yellow": "#C19C00"
},
```

----------

參考資料：

* []()
