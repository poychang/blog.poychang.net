---
layout: post
title: Cordova 專案中儲存圖片至裝置中
date: 2016-04-28 09:25
author: Poy Chang
comments: true
categories: [Javascript, App]
permalink: save-image-to-camera-roll-in-cordova/
---

要控制裝置的相機進行拍照和儲存、讀取照片，可以透過 [apache/cordova-plugin-camera](https://github.com/apache/cordova-plugin-camera) 套件進行處理，那如果只是想將圖片做另存的動作呢？那可以選用 [devgeeks/Canvas2ImagePlugin](https://github.com/devgeeks/Canvas2ImagePlugin) 來達成這樣的目標。

首先你可以透過 npm 或是 cordova 來安裝此套件

```bash
# 使用 npm 安裝
$ npm install cordova-plugin-canvas2image
# 使用 cordova 安裝
$ cordova plugin add https://github.com/devgeeks/Canvas2ImagePlugin.git
```

然後參考 [getImageDataURL() by Raul Sanchez](http://appcropolis.com/blog/web-technology/javascript-encode-images-dataurl/) 的程式，來達成儲存特定圖片的動作。

其動作如下：

* 透過 Javascript 建立一個 Image DOM 物件
* 在圖片完全載入時（當設定此物件的 `src` 及完成下載時）會觸發 `onLoad` 方法
* onLoad 事件中會建立一個內容和 `Image` 物件一樣的 `canvas` 物件
* 最後在 `try catch` 中透過 `cordova.exec` 來執行 `Canvas2ImagePlugin` 套件的儲存動作

>Image DOM 物件的屬性及事件，可參考 [JAVASCRIPT IMAGE ELEMENT](http://blog.kkbruce.net/2012/02/javascript-image-element.html#.VyFvi2d96bh)。

```javascript
/**
 * 使用 Javascript 將圖片的 URLs 當作 Image 物件的資料來源，並於載入完成時觸發儲存動作
 *
 * @param {String} url 圖片的 URL 位置
 * @param {Function} success 成功後的回呼函式
 * @param {Function} error 失敗的 Error handler
 *
 * @example
 * saveImageToPhone(
 *      'myimage.png', 
 *      function onSuccess(msg) { console.info('success', msg); }, onError);
 *      function (err) { console.error('error', err);}
 * );
 */
function saveImageToPhone(url, success, error) {
    var canvas, context, imageDataUrl, imageData;
    var img = new Image();
    img.onload = function () {
        // 建立 canvas 物件
        canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        // Get '2d' context and draw the image.
        context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        // Get canvas data URL
        try {
            imageDataUrl = canvas.toDataURL('image/jpeg', 1.0);
            imageData = imageDataUrl.replace(/data:image\/jpeg;base64,/, '');
            cordova.exec(
                success,
                error,
                'Canvas2ImagePlugin',
                'saveImageDataToLibrary',
                [imageData]
            );
        }
        catch (e) {
            error(e.message);
        }
    };
    try {
        img.src = url;
    }
    catch (e) {
        error(e.message);
    }
}
```

接著在 Cordova 專案中，圖片的儲存位置通常會放在 `www` 資料夾底下，然而 iOS 和 Android 的 App 路徑有些不一樣，因此建議使用 `cordova.file.applicationDirectory` 來取得準確的路徑，比較不會有問題，執行範例如下：

```javascript
var imagepath = cordova.file.applicationDirectory + 'www/' + filepath;
saveImageToPhone(
    imagepath,
    function (msg) { console.info('success', msg); },
    function (err) { console.error('error', err);}
);
```

----------

參考資料：

* [Ionic Framework 教學 - 10. 使用 Cordova Plugin](http://sushiwens.blogspot.tw/2015/11/ionic-framework-10.html)
* [Save a web photo to camera roll in Phonegap](http://stackoverflow.com/questions/11618266/save-a-web-photo-to-camera-roll-in-phonegap)
