---
layout: post
title: 完整移除 Viusal Studio 相關工具
date: 2017-06-21 11:10
author: Poy Chang
comments: true
categories: [Tools]
permalink: total-clean-uninstall-visual-studio/
---
**警告！**這篇介紹的 Visual Studio 完整移除工具，建議用在**你真的沒辦法了**的時候再用，因為當你按下 `Y` 他真的會把**所有** Visual Studio 相關的工具都移除，務必小心使用。

開發環境總是在經歷了很長一段時間後，安裝很多有的沒的開發工具，甚至一套工具存在很多個版本，當環境很亂的時候，難免奇怪的事情就會發生。

在 Visual Studio 是可以各個版本共存的，所以有可能一台電腦裝了 RC、Preview、RTM...不同版本的開發工具，環境因此就亂糟糟的，看了難免心煩意亂，而 Microsoft 很貼心的提供並開源了 Visual Studio 移除工具 [Microsoft/VisualStudioUninstaller](https://github.com/Microsoft/VisualStudioUninstaller)，讓你可以一個 `Y` 鍵就把環境清乾淨。

>WARNING: This executable is designed to cleanup/scorch all Preview/RC/RTM releases of Visual Studio 2013, Visual Studio 2015 and Visual Studio vNext.
>It should be used as the last resort to clean up the user's system before resorting to reimaging the machine.

## 操作方式

1. 從該 Github 專案中[下載 Release 版本](https://github.com/Microsoft/VisualStudioUninstaller/releases)的程式
2. 解壓縮後會在資料夾看到如下圖：
![解壓縮後的檔案清單](http://i.imgur.com/g6BAnOM.png)
3. 主要檔案是 `Setup.ForcedUninstall.exe`，請用管理者權限執行，會出現如下畫面：
![執行畫面](http://i.imgur.com/tSoB1Jp.png)
4. 請務必看仔細他的警告訊息，主要意思是：**這會解除安裝很多工具，這動作應該是最後你真的沒辦法了，才來執行！**
5. 按下 `Y` 繼續執行
6. 接著跑一段時間，把你的開發工具一個一個的解除安裝...

## 心得

這個移除工具很方便，真的把所有工具都解除安裝了，不只是 Visual Studio，連 SQL Server Management Studio、.NET Framewoerk SDK...都刪了（但是 Visual Stduio Code 不會被移除:)），所以執行前真的要三思！

我這打這篇的時候，之前安裝的開發工具都被刪光光了，所以現在在一個個裝回來...

補一個移除畫面，不是我的，但差不多。

![移除畫面](http://i.imgur.com/cZDLLkf.png)

----------

參考資料：

* [Microsoft/VisualStudioUninstaller](https://github.com/Microsoft/VisualStudioUninstaller)