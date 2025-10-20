---
layout: post
title: 在 Windows 中使用指令來切換使用者
date: 2021-08-05 16:40
author: Poy Chang
comments: true
categories: [PowerShell, Tools]
permalink: run-program-as-different-user-in-windows/
---

有時候需要用管理者或其他帳號的權限來開啟應用程式，如果是使用介面操作了話，使用上都滿直覺的，但有時候還是需要使用指令的方式來切換使用者權限，這時候 Windows 內建的 runas.exe 就派上用場了。

最常見的情境，應該是要在終端機中切換成管理者權限，指令很簡單，簡單筆記一下。

```bat
RUNAS [/profile] [/env] [/netonly] /user:<UserName> program
```

- `/profile` 如果需要加載用戶的配置文件
- `/env`     要使用當前環境，而不是用戶的環境。
- `/netonly` 只在指定的憑據限於遠程訪問的情況下才使用
- `/user`    <UserName> 請使用 `USER@DOMAIN` 或 `DOMAIN\USER` 形式
- `program`  要執行的 EXE 程式

例如，要用 `poy` 這個帳號開啟 `notepad.exe` 記事本程式，可以這樣執行：

```bat
runas /user:poy "C:\Windows\notepad.exe"
::或者要指定網域使用者時，可以這樣執行
runas /user:poy@DOMAIN "C:\Windows\notepad.exe"
```

詳請見官方文件 [Runas](https://docs.microsoft.com/zh-tw/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc771525(v=ws.11)?WT.mc_id=DT-MVP-5003022)。

----------

參考資料：

* [MS Docs - Runas](https://docs.microsoft.com/zh-tw/previous-versions/windows/it-pro/windows-server-2012-r2-and-2012/cc771525(v=ws.11)?WT.mc_id=DT-MVP-5003022)
* [How to Run a Program as a Different User (RunAs) in Windows 10?](http://woshub.com/run-program-as-different-user-windows/)
