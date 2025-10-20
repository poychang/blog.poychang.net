---
layout: post
title: 如何使用 BrowserSync 啟動開發用網頁伺服器
date: 2017-11-01 12:00
author: Poy Chang
comments: true
categories: [Tool]
permalink: how-to-use-bowser-sync/
---
當我們在製作前端網頁時，經常會需要將程式碼運行在瀏覽器中，這時候通常需要一個網頁伺服器來執行程式碼，BrowserSync 就是一個輕巧的工具，讓我們能在開發時期，啟動一個小型網頁伺服器，而且還能根據檔案異動，自動刷新畫面，相當方便。

[Browser-Sync 官方網站](https://www.browsersync.io/)

## 安裝

這裡使用 npm 套件管理工具進行安裝，請先確認您的環境有安裝 [Node.js](https://nodejs.org/en/)。

請在終端機中執行以下安裝指令，這會將 BrowserSync 套件裝在全域環境中。

```
npm install -g browser-sync
```

## 執行

啟動 BrowserSync 網頁伺服器非常簡單，只要在您的專案資料夾下執行 `browser-sync start --server` 即可，預設會使用 `http://localhost:3000` 作為網站位置。

通常我會使用以下指令：

```
browser-sync start --server --files="*"
```

這裡加上了 `--files="*"` 的參數，這代表 BrowserSync 在執行期間，會持續監看該專案目錄下的檔案是否有變更，若有變更則自動刷新網頁，省去我們手動 `Ctrl` + `R` 或按 `F5` 的動作，這裡你也可以設定成指定監看的路徑。

另外如果預設所使用的 3000 埠已經被用掉了話，可使用 `--port=9999` 的方式選用你要的埠號。

另外，你可以開啟網址 `http://localhost:3001`，這會開啟 BrowserSync 的管理介面，裡面許多細項設定可以調整，這部分就留給需要的人自行研究。

>BrowserSync 詳細指令請參考[官方文件](https://www.browsersync.io/docs/command-line)。

----------

參考資料：

* [Browser-Sync 官方網站](https://www.browsersync.io/)

