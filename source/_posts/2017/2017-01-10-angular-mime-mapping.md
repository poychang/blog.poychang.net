---
layout: post
title: 在 Angular 中建立 MIME 對照表
date: 2017-01-10 10:07
author: Poy Chang
comments: true
categories: [Javascript, Angular, Develop]
permalink: angular-mime-mapping/
---
[MIME](https://zh.wikipedia.org/wiki/%E5%A4%9A%E7%94%A8%E9%80%94%E4%BA%92%E8%81%AF%E7%B6%B2%E9%83%B5%E4%BB%B6%E6%93%B4%E5%B1%95)（Multipurpose Internet Mail Extensions） 定義了媒體類型，在做檔案傳輸時經常會用檔案的附檔名去找對應的 MIME，我們可以寫一隻 Angular Service 方便我們使用。

這功能基本上就是個查詢對應字串的函數，給一個附檔名的 `key`，返回一組 MIME 字串，就這樣而已，可以直接看[完整程式碼](#code)。

其中有個寫法滿有趣的，用到 Javascript 物件的特性，如下：

```javascript
return {
	"mpeg": "video/mpeg",
	"mpg4": "video/mp4"
}[key];
```

在 Javascript 中，所有的物件都是以 `key`-`value` 的方式構成，其中 `value` 可以是任何 Javascript 的值，包含方法（methods）。

而且我們可以透過 Object Literals（物件字面值）的方式來建立物件，因此上面這段

```javascript
{
	"mpeg": "video/mpeg",
	"mpg4": "video/mp4"
}
```

可以看成建立一個匿名物件，裡面包含 `xls`、`xlsx` 兩個 properties（特性）。

再來我們可以使用兩種方法來取得該物件的特性，也就是「點號運算子（.）」和「方括號運算子（[]）」。

## 點號運算子（.）

這個方法我們常用，簡單說就是用 `.` 來存取物件的特性，就用範例來帶過：

```javascript
// 建立物件
var obj = {
	"mpeg": "video/mpeg",
	"mpg4": "video/mp4"
};
// 取得物件特性
obj.mpg4;    //video/mp4
```

## 方括號運算子（[]）

這個方法具有更大的彈性，可以在方括號運算子 `[]` 中，藉由運算式來設定要存取的物件鍵值，範例如下：

```javascript
// 建立物件
var obj = {
	"mpeg": "video/mpeg",
	"mpg4": "video/mp4"
};
// 取得物件特性
obj['mpg' + '4'];    //video/mp4
```

這方法也可以幫助我們存取非識別字的特性，範例如下：

```javascript
// 建立物件
var obj = {
	"I am propertie": 123
};
// 取得物件特性
obj['I am propertie'];    //123
```

如果該物件的特性（properties）是個方法（methods），可以透過下列範例來取用：

```javascript
// 建立物件
var obj = {
	myMethod: function() { return true}
};
// 取得物件特性
obj['myMethod']();    //true
```

看過上面的範例後，就可以理解[完整程式碼](#code)中，是如何取得對應的 MIME 字串。

在 `MIME.factory` 這個 Angular 服務中，回傳一個需要輸入參數 `key` 的 `service` 方法，而這方法會回傳一個匿名物件，並從這匿名物件中取得和 `key` 一樣的鍵值，藉此找到對應的 MIME 字串。 

----------

## code

```javascript
(function () {
    'use strict';

    angular.module('MIME.factory', [])
        .service('MIME', MIME);

    MIME.$inject = [];

    function MIME() {
        var service = function (key) {
            return {
                "3gp": "video/3gpp",
                "apk": "application/vnd.android.package-archive",
                "asf": "video/x-ms-asf",
                "avi": "video/x-msvideo",
                "bin": "application/octet-stream",
                "bmp": "image/bmp",
                "c": "text/plain",
                "class": "application/octet-stream",
                "conf": "text/plain",
                "cpp": "text/plain",
                "exe": "application/octet-stream",
                "gif": "image/gif",
                "gtar": "application/x-gtar",
                "gz": "application/x-gzip",
                "h": "text/plain",
                "htm": "text/html",
                "html": "text/html",
                "jar": "application/java-archive",
                "java": "text/plain",
                "jpeg": "image/jpeg",
                "jpg": "image/jpeg",
                "js": "application/x-javascript",
                "log": "text/plain",
                "m3u": "audio/x-mpegurl",
                "m4a": "audio/mp4a-latm",
                "m4b": "audio/mp4a-latm",
                "m4p": "audio/mp4a-latm",
                "m4u": "video/vnd.mpegurl",
                "m4v": "video/x-m4v",
                "mov": "video/quicktime",
                "mp2": "audio/x-mpeg",
                "mp3": "audio/x-mpeg",
                "mp4": "video/mp4",
                "mpc": "application/vnd.mpohun.certificate",
                "mpe": "video/mpeg",
                "mpeg": "video/mpeg",
                "mpg": "video/mpeg",
                "mpg4": "video/mp4",
                "mpga": "audio/mpeg",
                "msg": "application/vnd.ms-outlook",
                "ogg": "audio/ogg",
                "pdf": "application/pdf",
                "png": "image/png",
                "pps": "application/vnd.ms-powerpoint",
                "prop": "text/plain",
                "rar": "application/x-rar-compressed",
                "rc": "text/plain",
                "rmvb": "audio/x-pn-realaudio",
                "rtf": "application/rtf",
                "sh": "text/plain",
                "tar": "application/x-tar",
                "tgz": "application/x-compressed",
                "txt": "text/plain",
                "wav": "audio/x-wav",
                "wma": "audio/x-ms-wma",
                "wmv": "audio/x-ms-wmv",
                "wps": "application/vnd.ms-works",
                "xml": "text/plain",
                "xls": "application/vnd.ms-excel",
                "xlsx": "application/vnd.ms-excel",
                "doc": "application/msword",
                "docx": "application/msword",
                "ppt": "application/vnd.ms-powerpoint",
                "pptx": "application/vnd.ms-powerpoint",
                "z": "application/x-compress",
                "zip": "application/zip"
            }[key];
        }

        return service;
    }
})();
```

----------

參考資料：

* [ionic 项目文件下载总结](http://www.itdadao.com/articles/c15a618162p0.html)