---
layout: post
title: Linux 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Uncategorized]
permalink: note-linux/
---

本篇作為書籤用途，記錄網路上的 Linux 參考資料

## Linux 系統目錄用途

![Linux 系統目錄用途](https://i.imgur.com/TuqtUxI.png)

REF: [https://www.tecmint.com/linux-directory-structure-and-important-files-paths-explained/](https://www.tecmint.com/linux-directory-structure-and-important-files-paths-explained/)

## 檢查系統資訊

```bash
# 查詢與修改系統主機名以及其他相關設置
hostnamectl
# 查詢Linux 散佈版本資訊
lsb_release -a
# 查詢詳細硬體資訊工具
lshw
```

## 更新系統

```bash
# 更新系統
sudo apt dist-upgrade
# 檢查可以升級的版本
sudo do-release-upgrade -c
# 更新前先重開機
sudo reboot
# 使用此指令
sudo do-release-upgrade
```

## 更新套件

請不時執行以下指令進行系統及套件更新：

```bash
# 取得遠端更新伺服器的套件檔案清單
sudo apt update
# 更新清單後安靜的安裝要更新的套件
sudo apt update && sudo apt upgrade -y
# 清除更新時所下載回來的更新(安裝)檔案
sudo apt clean
# 自動清除更新後用不到的舊版本檔案（例如舊的核心程式）
sudo apt autoremove
```

>若不定時移除舊核心檔案，容易造成 /boot 空間不足，嚴重時將無法開機

## 空間使用量

```bash
# 查詢各個檔案系統的使用量
df -h

# 查詢根目錄下各個資料夾的使用量
sudo du -h --max-depth=1 / | sort -h
```

## 清空

```bash
# 清空螢幕畫面
ctrl+l
# 清空指令行 (before cursor)
ctrl+u
```

## 設定 alias

在 bash 環境，會透過 `.bash_profile` 或 `.bashrc` 設定檔來存放 alias 設定。兩個設定檔的差異簡單來說，假設是透過帳號密碼或 ssh 登入系統，登入時會去自動讀取 `.bash_profile`，而 `.bashrc` 則是讓非登入的操作命令使用。如果不想兩個檔案都做重複設定，可以在 `.bash_profile` 中引用 `.bashrc` 中的設定，如下：

```bash
if [ -f ~/.bashrc ]; then
    source ~/.bashrc
fi
```

## 查看 port 被程式佔用的方法

使用 `lsof` 指令如下：

```bash
lsof -i -P -n | grep LISTEN
lsof -i -P -n | grep :80
```

使用 `netstat` 指令如下：
```bash
apt install net-tools

netstat -tulpn | grep LISTEN
netstat -tulpn | grep :80
```

## 使用 Zsh

Zsh 會讀取 `.zprofile` 來當設定檔，像是 `.zsh_profile` 或 `.bash_profile` 那樣。

安裝請參考下列步驟：

```bash
# 安裝 zsh
sudo apt install zsh
# 將預設的 Shell 改成 zsh
sudo chsh -s $(which zsh) $(whoami)
# 將預設的 Shell 改回 bash
sudi chsh -s /bin/bash
# 安裝 oh-my-zsh
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### 使用 powerlevel9k 主題

[powerlevel9k](https://github.com/Powerlevel9k/powerlevel9k)

```bash
# 安裝 powerlevel9k
git clone https://github.com/bhilburn/powerlevel9k.git ~/.oh-my-zsh/custom/themes/powerlevel9k

## 到 `.zshrc` 裡更改主題設定
# 更改主題設定
ZSH_THEME="powerlevel9k/powerlevel9k"
# 左邊顯示的狀態
POWERLEVEL9K_LEFT_PROMPT_ELEMENTS=(context dir vcs)
# 右邊顯示的狀態
POWERLEVEL9K_RIGHT_PROMPT_ELEMENTS=(status root_indicator background_jobs history time)
```

### 好用套件

- [Zsh-autosuggestions](https://github.com/zsh-users/zsh-autosuggestions/blob/master/INSTALL.md) 自動幫你把過去輸入過的資訊提示出來

```bash
# 下載套件至 Zsh 的 plugin 裡
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

## 到 `.zshrc` 裡更改設定
# 啟用套件
plugins=(zsh-autosuggestions)
```

- [zsh-syntax-highlighting](https://github.com/zsh-users/zsh-syntax-highlighting) 將指令上色，讓你知道自己是不是輸入正確的指令

```bash
# 下載套件至 Zsh 的 plugin 裡
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting

## 到 `.zshrc` 裡更改設定
# 啟用套件
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

## nano editor

```bash
## 到 `.nanorc` 裡更改設定
# 開啟行號
set linenumbers
```

## WSL

安裝及檢查 Windows Subsystem for Linux，根據[這篇官方部落格](https://devblogs.microsoft.com/commandline/install-wsl-with-a-single-command-now-available-in-windows-10-version-2004-and-higher/)可以使用一個簡單的命令就可以安裝 WSL，或者參考下列指令：

```bash
# 安裝預設發行版本（Ubuntu）的 WSL
wsl.exe --install
# 查看可安裝的 Linux 發行版本
wsl --list --online
# 安裝指定版本的 WSL
wsl --install -d <DistroName>
# 更新 WSL Linux kernel
wsl --update
# 退回上一版的 WSL Linux kernel
wsl --update rollback
```

```bash
# 檢查當前 WSL 所使用的版本，列表中的 VERSION 代表所使用的 WSL 的版本
wsl --list --verbose
# 檢查當前 WSL 所使用的 Linux 發行版本及核心版本
wsl --status
```


---

參考資料：

- [使用 WSL 2 打造優質的多重 Linux 開發環境](https://blog.miniasp.com/post/2020/07/26/Multiple-Linux-Dev-Environment-build-on-WSL-2)