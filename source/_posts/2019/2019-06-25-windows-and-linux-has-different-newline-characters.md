---
layout: post
title: Windows 和 Linux 換行字元是不一樣的
date: 2019-06-25 22:15
author: Poy Chang
comments: true
categories: [Tools]
permalink: windows-and-linux-has-different-newline-characters/
---

最近在玩 Windows Terminal 搭配 WLS 的時候，遇到一件和換行字元有關的小狀況，讓我無法順利使用 `.bash_aliases`，簡單說就是 Windows 和 Linux 的換行字元是不一樣的。

情境是這樣的，有天在調整 WLS 環境的時候，想透過 `.bash_aliases` 來統一管理 alias，並讓 `.bashrc` 執行載入的動作，這樣的作法讓 alias 管理上變得清晰許多。

因此我在 WLS 中呼叫 VS Code 來建立並編輯 `.bash_aliases` 檔案，但只要我設定多個 alias 就會出現下面這兩種錯誤訊息：

![錯誤訊息1](https://i.imgur.com/siSEdwu.png)

![錯誤訊息2](https://i.imgur.com/bQ630wT.png)

眼尖的人看到第二張圖應該會注意到 `\r` 關鍵字，這個換行字元就是兇手！

因為 Linux 和 Windows 所使用的換行字元是不一樣的，一般來說在 Windows 底下是使用 `\r\n` 或叫 `CRLF` 來表示換行，但在 Linux 底下則是使用 `\n` 來表示換行，因此當你用 Windows 建立一個新檔案，要給 Linux 使用時，結尾就會出現 `\r` 這個多餘的符號，造成指令出現問題。

我平常使編輯器的時候，習慣會把**空白字元**顯示出來，VS Code 本身是有這樣設定，但換行字元就沒有了。

>想要在 VS Code 有選項可以設定是否顯示換行字元嗎？來這個 [microsoft/vscode issue#12223](https://github.com/microsoft/vscode/issues/12223) 發言/投票吧！

因此我找了一個不錯用的 VS Code 擴充套件：[Render CRLF Line Endings](https://marketplace.visualstudio.com/items?itemName=medo64.render-crlf)，這個套件的換行字元轉換圖示如下：

- `LF` = `↓`
- `CR` = `←`
- `CRLF` = `↵`

雖然 VS Code 介面右下角是有顯示當前檔案的換行字元是使用哪種模式，但透過這套件可以直接視覺化的成現在檔案中，讓我在編輯檔案內容的時候，可以非常直覺的知道我是在哪種換行模式下編輯 😎

![顯示換行字元](https://i.imgur.com/QWtzSCw.png)

----------

參考資料：

* [Linux和Windows的換行字元](http://swaywang.blogspot.com/2011/11/linuxwindows.html)
