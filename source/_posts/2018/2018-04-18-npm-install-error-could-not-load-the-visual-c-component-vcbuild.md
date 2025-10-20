---
layout: post
title: 輕鬆解決 NPM 的 Could not load the Visual C++ component "VCBuild.exe" 錯誤訊息
date: 2018-04-18 21:37
author: Poy Chang
comments: true
categories: [Tools]
permalink: npm-install-error-could-not-load-the-visual-c-component-vcbuild/
---
有時候使用 npm 安裝或還原套件的時候，出現 `MSBUILD : error MSB3428: Could not load the Visual C++ component "VCBuild.exe"` 的錯誤訊息，這是因為所相依的工具需要系統額外的工具所造成，這裡記錄一下解決方法。

![錯誤畫面](https://i.imgur.com/fuQQldb.png)

這個錯誤訊息其實寫得很清楚，是因為無法載入 Visual C++ 组件 VCBuild.exe 造成的，解決方法如下：

1. 安裝 .NET Framework 2.0 SDK
2. 安装 Microsoft Visual Studio 2005

如果 VCBuild.exe 組件安裝在其他位置了話，請在系統環境變數中加入該路徑。

這些工具是讓 Node 可以在安裝時期順利執行套件所需的建置動作，只是為了要安裝某個套件，卻要安裝整套 Microsoft Visual Studio 2005，也太悲催了吧！

所以有人把在 Windows 編譯 Node 模組所需要建置工具封裝起來，包成一個套件 [Windows-Build-Tools](https://www.npmjs.com/package/windows-build-tools)，這樣我們就可以輕鬆安裝 Windows-Build-Tools 套件，相關的建置工具就一併裝上了。

## 安裝方式

用**系統管理者權限**開啟 PowerShell，並執行下列指令安裝：

```bash
npm install --global --production windows-build-tools
```

這包套件主要會下載並安裝 Visual C++ Build Tools 和 Python 2.7 工具。

預設此套件會安裝 Visual Studio 2015 的 Build Tools，因為 Node 底層尚不完整支援 Visual Studio 2017 的 Build Tools，但如果你想要透過此套件安裝 2017 的版本也是可以的，只要在指令後面加上 `--vs2017` 即可進行安裝。

>安裝 `windows-build-tools` 會需要一段時間，畢竟 Visual Studio Build Tools 滿大包的。

----------

參考資料：

* [npm install error - MSB3428: Could not load the Visual C++ component "VCBuild.exe"](https://stackoverflow.com/questions/21658832/npm-install-error-msb3428-could-not-load-the-visual-c-component-vcbuild-ex)
