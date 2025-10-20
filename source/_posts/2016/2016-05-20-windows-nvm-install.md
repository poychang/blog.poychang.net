---
layout: post
title: 在 Windows 環境中使用 NVM 管理 Node.js 
date: 2016-05-20 00:09
author: Poy Chang
comments: true
categories: [Tools]
permalink: windows-nvm-install/
---

看完 [NativeScript 2.0 Launch Webinar](https://www.youtube.com/watch?v=efk_oeI58hc) 的影片，覺得 JavaScript 野心真的很強大，讓我也想玩玩看用 JavaScript (TypeScript) 來做 Native App 了。

使用 NativeScript 必然要裝 Node.js，而[官網文章](https://www.nativescript.org/blog/details/which-versions-of-node.js-should-you-use-today)表示他們對 Node.js LTS 有完整的支援，而最新的版本則不一定。因為我本機裝的是最新版的 Node.js，不是 LTS 版，因此有了管理 Node.js 版本的需求。

[Node.js LTS Roadmap](https://github.com/nodejs/LTS) 可以參考下圖：

![Node.js Long-term Support Schedule](https://i.imgur.com/pQpwEHb.png)

NVM 是管理 Node.js 版本的工具，但不同系統有對應的工具

* Windows 使用 [coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)
* Mac OS、Linux 使用 [creationix/nvm](https://github.com/creationix/nvm)

----------

如果已經有安裝過 Node.js，請先執行下列兩件事：

1. 務必先移除 Node.js
2. 將安裝 `npm` 套件的檔案移除（預設位置 `C:\Users\<user>\AppData\Roaming\npm`）

在完成安裝後再重新安裝您所需要的全域套件。

----------

Windows 版的安裝相對簡單，從網頁中[下載最新版](https://github.com/coreybutler/nvm-windows/releases)的安裝檔，解壓縮後就下一步、下一步，然後就安裝好了。

安裝完成後，你可以開啟命令提示字元，輸入 `nvm` 就會顯示相關的操作提示

![nvm command](http://i.imgur.com/Q3qDYFJ.png)

`nvm` 常用的命令如下：

* `nvm install latest`
  * 安裝最新版本的 Node.js
* `nvm install <版本號>`
  * 安裝特定版本號的 Node.js
* `nvm list`
  * 列出所有安裝過的 Node.js 清單
* `nvm use <版本號>`
  * 切換 Node.js 版本
