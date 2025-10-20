---
layout: post
title: 透過預存 SSH 登入認證免除執行遠端指令還要輸入密碼
date: 2024-03-17 16:08
author: Poy Chang
comments: true
categories: [PowerShell, Tools]
permalink: automating-ssh-login-for-remote-commands/
---

要遠端在 Linux 主機上執行指令，可以透過 SSH 來處理，不過每次執行指令都需要做身分認證，這讓操作上變得繁瑣，這裡提供一種方式，使用 `ssh-keygen` 建立一組身分認證的金鑰，藉此讓 SSH 遠端執行指令時，直接藉此做身分認證，讓操作更順暢。

> SSH 金鑰和密碼一樣是一種身份驗證憑據，請做好保存及管理，避免遭到竊取、盜用。

以下以 Windows 為使用者的操作系統作範例，有四個步驟：

## 1 建立身分憑證

在 Windows 10 以上的作業系統，都內建了 `ssh-keygen` 這個工具，可以在終端機中執行以下指令：

```bash
ssh-keygen
```

預設情況下，這工具會在你的使用者主目錄下的 `.ssh` 資料夾中建立 SSH 金鑰，而這個金鑰檔案的名稱會根據所使用的加密演算法做命名，例如使用 RSA 演算法時，公鑰檔名會叫做 `id_rsa.pub` 私鑰叫做 `id_rsa`。

> 請注意！請妥善保管這兩個檔案，尤其是私鑰。

## 2 將公鑰複製到遠端主機

接著我們要將公鑰複製到遠端 Linux 主機，讓之後的連線可以藉此做身份認證。

你可以用任何方式將 `id_rsa.pub` 公鑰的內容複製到遠端主機，要記得複製之後會登入的帳號下的家目錄中的 `.ssh` 資料夾中的 `authorized_keys` 檔案中。

這裡提供一個透過指令寫入的方式：

```powershell
type C:\Users\USERNAME\.ssh\id_rsa.pub | ssh user@linux-host "umask 077; test -d .ssh || mkdir .ssh ; cat >> .ssh/authorized_keys || exit 1" 
```

這行指令會先使用 `type` 取得 `C:\Users\USERNAME\.ssh\id_rsa.pub` 這個公鑰檔案的內容，再透過 `|` 管線指令傳送給 ssh，ssh 會使用 `user@linux-host` 這組遠端主機的帳號做登入，並將前面取得的內容寫入到 `authorized_keys` 檔案中。

過程中會需要輸入登入密碼。

這個步驟的路徑 (`C:\Users\USERNAME\.ssh\`)、登入帳號 (`user`)、遠端主機位置 (`linux-host`)，請根據你的需求自行變更。

## 3 檢查是否有成功複製

檢查一下遠端主機的 `.ssh/authorized_keys` 內容是否有我們的公鑰，基本上應該會長得像下面這樣：

```text
ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAnvYlVooXXXXXXXXXXXX
```

## 4 測試

最後，我們可以簡單測試一下，執行下面這個指令應該要能列出所有 `/tmp` 資料夾下的所有內容，而且過程中不用輸入密碼！

```bash
ssh user@linux-host "ls -al /tmp/"
```

---

參考資料：

* [Is there an equivalent to ssh-copy-id for Windows?](https://serverfault.com/questions/224810/is-there-an-equivalent-to-ssh-copy-id-for-windows)
