---
layout: post
title: 使用 SSH 且免用密碼登入遠端 Linux
date: 2024-05-31 11:37
author: Poy Chang
comments: true
categories: [PowerShell, Tools]
permalink: configure-ssh-for-login-without-a-password/
---

要登入遠端的 Linux 進行操作的時候，基本上都是使用 SSH 的方式進行登入，在使用 SSH 登入的時候，會需要先做身分認證，也就是輸入帳號密碼來做驗證。不過透過輸入帳號密碼的方式可能會增加帳密遺失或盜用的可能，或者單純覺得經常操作要一直打帳密太辛苦，這時候可以使用公開金鑰（Public Key）和私密金鑰（Private Key）的方式，做到免密碼的登入，藉此降低帳密被竊取的可能，又達到操作的簡化。

## 在 Windows 使用 SSH 免密碼登入 Linux

要在 Windows 中要使用免密碼的方式登入，需要對每一台 Linux 設定 SSH 可接受的金鑰，以下為使用 PowerShell 的做法：

1. 在 Windows 產生 SSH Key，通常存放位置會在 `C:\Users\USERNAME\.ssh` 底下，`id_rsa` 為私鑰 `id_rsa.pub` 為公鑰。執行以下指令：

    ```powershell
    ssh-keygen
    ```

2. 將公鑰檔案複製到目標 Linux 系統。執行以下指令：

    ```powershell
    type C:\Users\USERNAME\.ssh\id_rsa.pub | ssh user@linuxhost "umask 077; test -d .ssh || mkdir .ssh ; cat >> .ssh/authorized_keys || exit 1"
    ```

3. 檢查 Linux 系統的 `.ssh/authorized_keys` 內容，應該如下：

    ```powershell
    ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAnvYlVooXXXXX略XXXXXX
    ```

4. 測試。執行以下指令應該要列出 /tmp 的內容，且不需要輸入密碼：

    ```powershell
    ssh user@linuxhost "ls -al /tmp/"
    ```

## 在 Linux 使用 SSH 免密碼登入 Linux

若使用的是 Linux 系統，上面的 SSH 免密碼登入，可以使用 ssh-copy-id 指令來完成，執行以下指令：

1. 產生 SSH Key。執行以下指令：

    ```bash
    ssh-keygen
    ```

2. 複製公鑰到目標 Linux 系統。執行以下指令：

    ```bash
    ssh-copy-id user@linuxhost
    ```

3. 測試。執行以下指令應該要列出 /tmp 的內容，且不需要輸入密碼：

    ```bash
    ssh user@linuxhost "ls -al /tmp/"
    ```

## 後記

改用 SSH 公私鑰的方式登入，要注意的是，你的帳號密碼雖然不會被洩漏，但私鑰的安全性也是很重要的，不要讓私鑰外洩，以免被人拿去登入你的系統。

---

參考資料：

* [Configure SSH for login without a password](https://www.pragmaticlinux.com/2021/05/configure-ssh-for-login-without-a-password/)
* [SSH 免用密碼登入(key)](https://ithelp.ithome.com.tw/articles/10080136)
* [MS Learn - 適用於 Windows 的 OpenSSH 中的金鑰型驗證](https://learn.microsoft.com/zh-tw/windows-server/administration/openssh/openssh_keymanagement?WT.mc_id=DT-MVP-5003022)