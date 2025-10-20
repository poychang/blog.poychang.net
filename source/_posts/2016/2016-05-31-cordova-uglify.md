---
layout: post
title: 保護 Cordova 專案的程式碼
date: 2016-05-31 17:07
author: Poy Chang
comments: true
categories: [App, Develop]
permalink: cordova-uglify/
---

使用 Cordova 來做 Hybrid App 的缺點之一就是程式碼很容易就曝光，例如 Android 的 apk 封裝檔，只要用解壓縮軟體，就可以看到專案的結構，只要開啟裡面的 `assets\www` 資料夾就可以把你的程式碼看光光了。

![APK 檔案結構](http://i.imgur.com/zeQ7a9u.png)

Hybrid App 本質上就是使用前端的技術，JavaScrip、CSS、HTML，因此可以透過類似前端 UglifyJS 工具來保護我們的程式碼（讓程式碼變得很難很難讀懂...），而在 Cordova 專案下，可以使用 [rossmartin/cordova-uglify](https://github.com/rossmartin/cordova-uglify) 來達成保護程式碼的目的，而且這工具也適用於 Ionic 框架。

cordova-uglify 主要使用下列三個套件來對檔案做壓縮

* [mishoo/UglifyJS2](https://github.com/mishoo/UglifyJS2) 用來壓縮 JavaScript 檔案
* [GoalSmashers/clean-css](https://github.com/GoalSmashers/clean-css) 用來壓縮 CSS 檔案
* [imagemin/imagemin](https://github.com/imagemin/imagemin) 用來壓縮 jpeg、png、gif、svg 圖片

## 使用 cordova-uglify

安裝方式很簡單，到你的 Cordova 專案資料夾底下，執行

```bash
npm install cordova-uglify --legacy-bundling
``` 

就會將 `cordova-uglify` 和相依的套件給裝起來，在準備或封裝時加上 `--release` 參數，就會在封裝時執行醜化（壓縮）的動作。

```bash
# 準備
cordova prepare <platform> --release
# 建置
cordova build <platform> --release
```

就會將你的程式碼做醜化（壓縮）的動作。下圖左邊是醜化（壓縮）前，右邊是醜化醜化（壓縮）後的樣貌。

![使用 cordova-uglify 的前後樣貌](http://i.imgur.com/2sJ24Di.png)

## cordova-uglify 設定檔

在 Cordova 專案中的 `hooks` 資料夾中，會有個 `uglify-config.json` 檔案，這就是 cordova-uglify 套件的設定檔，如果不想每次要做醜化（壓縮）的動作，都要加上 `--release` 參數了話，可以修改這個設定檔中 `alwaysRun` 的值為 `true`，如此一來每次 `prepare` 或 `build` 都會執行這個動作。

這個設定檔裡面還有很多設定可以去調整

```javascript
{
    "alwaysRun": false, // 每次都要執行醜化（壓縮）時，設定成 true
    "recursiveFolderSearch": true, // 是否遞迴處理 foldersToProcess 資料夾中的 JS 和 CSS 檔
    "foldersToProcess": [ // 要執行醜化（壓縮）的資料夾
        "js",
        "css",
        "img",
        "build" // 使用於 Ionic 2 專案
    ],
    "uglifyJsOptions": { // 傳遞參數給 UglifyJS2
        "compress": {
            "drop_console": true
        },
        "fromString": true,
        "mangle": true // 使用 Ionic 2 專案時需設定成 false
    },
    "cleanCssOptions": { // 傳遞參數給 CleanCSS
        "noAdvanced": true,
        "keepSpecialComments": 0
    },
    "imageminOptions": { // 傳遞參數給 imagemin
        "jpeg": {
            "progressive": true,
            "arithmetic": false
        },
        "png": {
            "optimizationLevel": 2
        },
        "gif": {
            "interlaced": false
        },
        "svg": {
            "pretty": false
        }
    }
}
```

## 醜化（壓縮）的好處多多

* 可以降低程式碼被找出突破口的風險（連註解都不見了，超難讀懂的....）
* 降低程式碼的體積，在網路傳輸時也比較節省頻寬
* 發布的 APK、IPA 檔案也比較小
 
但有一點要注意，醜化（壓縮）的動作會自動更改程式碼中的變數名稱，因此在開發時最好搭配 IIFE 的方式來寫 JavaScript，避免變數汙染整個專案，產生變數衝突的問題。

## 後記

* 安裝在開發中的專案上時，加上 `--save-dev` 是個明智的做法，確保之後的專案在回復套件時，將這個保護也建置起來。

```bash
npm install cordova-uglify --legacy-bundling --save-dev
``` 

* 2016/10/26 [rossmartin/cordova-uglify](https://github.com/rossmartin/cordova-uglify) 作者將用於壓縮圖片的 `imagemin` 移除了，如果舊專案中有用到相關的功能，需要另外寫一個 `hook` 去替代。

* 2016/12/06 補"坑"筆記，使用 cordova-uglify 時出現路徑問題，需增加 process.cwd() 取得執行路徑，才能正常運作。可參考 [poychang/uglify.js](https://gist.github.com/poychang/eaf206e79e8094e7fd00d4979a0641d1)

----------

參考資料：

* [Minifying Your App’s Source Code](http://blog.ionic.io/minifying-your-source-code/)
* [260+ Ionic Framework Resources](http://mcgivery.com/100-ionic-framework-resources/)
