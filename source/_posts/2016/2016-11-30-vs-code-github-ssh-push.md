---
layout: post
title: 從 VS Code 中提交版控至 GitHub
date: 2016-11-30 08:42
author: Poy Chang
comments: true
categories: [Tools]
permalink: vs-code-github-ssh-push/
---

版控很重要，所以 Visual Studio Code 內建 Git 版控工具，方便開發時提交程式碼到本機的版控庫，如果使用 SSH 的方式和 Github 溝通了話，在 Visual Studio Code 直接操作了話，會遇到`Permission denied` 拒絕存取的問題，這是因為還沒有做 SSH 驗證的關係。

在 Visual Studio Code 使用 SSH 的步驟很簡單，只有兩個步驟：

1. 開啟`命令提示字元`，執行 `start-ssh-agent` 啟動 `SSH-AGENT` 並輸入密碼
2. 使用`命令提示字元`，執行 `code` 開啟 VS Code

這樣就完成了！

附註一個小技巧：執行 `code` 是開啟 VS Code，執行 `code .` 是使用資料夾模式開啟 VS Code。

----------

參考資料：

* [VS Code IDE with Passphrased Git SSH Keys](ㄒhttp://blog.alner.net/archive/2015/08/24/vs_code_with_git_ssh_keys_that_use_passphrases.asp)
