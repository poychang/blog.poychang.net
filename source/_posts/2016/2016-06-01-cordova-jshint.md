---
layout: post
title: 使用 JSHint 檢查 Cordova 專案程式碼
date: 2016-06-01 16:23
author: Poy Chang
comments: true
categories: [Javascript, App, Develop]
permalink: cordova-jshint/
---

JavaScript 是一個好好先生，總是包容我們程式碼的小瑕疵，不和我們計較語法結尾是否有 `;` 或是一些奇怪的打字錯誤，但總不能因為這樣的包容性，就讓程式碼老是髒髒的，不管程式碼品質這件事。

在 Cordova 專案中，可以在 hooks 中自訂一些建置流程，常用的 hooks 類別有下面四個

* before_prepare
* after_prepare
* before_build
* after_build

詳細的 hooks 類別可以參考 [Cordova Hooks](https://cordova.apache.org/docs/en/latest/guide/appdev/hooks/)

其中官網中有說明 before_prepare 這個階段會在執行下面這四個指令時觸發

* cordova prepare
* cordova platform add
* cordova build
* cordova run

## 建立 JSHint 檢查機制

這篇文章希望能在 before_prepare 這個階段中去建立 JSHint 檢查機制。

首先在 Cordova 專案中的 `hooks` 資料夾中，新增 `before_prepare` 資料夾，並在該資料夾內新增 `010_jshint.js` 檔案。

這裡你可能會覺得檔名怪怪的，為什麼前面要加 `010` 呢？這是因為 Cordova Hooks 會透過 `hooks` 底下的資料夾名稱來判斷在哪個階段執行，並且該階段執行程序的順序，就是藉由檔名來安排。

### 依序執行的小測試

因此如果你在 `before_prepare` 資料夾下建立 `010_test01.js`、`020_test01.js`、`030_test01.js` 三個 JS 檔，每個檔案內依序寫入下列程式碼

```javascript
#!/usr/bin/env node
// 不同檔名輸入不同的數字
console.log('test 1/2/3');
```
然後執行 `cordova prepare` 時，就會看到依序輸出 `test 1/2/3`

![依序執行的小測試](http://i.imgur.com/UwUzPnq.png)

### 程式碼

直接將下列程式碼複製至 `010_jshint.js` 中，之後執行 `cordova prepare` 時，就會檢查 `www/js` 這個資料夾底下的所有 JS 程式碼。

如果要檢查其他不在 `www/js` 這個資料夾的 JS 檔，請在 `foldersToProcess` 這個陣列中去添加即可。

如果不想每次都遞迴資料夾做檢查，那就把 `recursiveFolderSearch` 設定成 `false` 即可。

## code

[poychang/010_jshint.js](https://gist.github.com/poychang/e9273db6f08833905c8e7dae14e2d897)

```javascript
#!/usr/bin/env node

var fs = require('fs');
var path = require('path');
var jshint = require('jshint').JSHINT;
var async = require('async');

var recursiveFolderSearch = true;
var foldersToProcess = [
    'js'
];

foldersToProcess.forEach(function (folder) {
    processFiles("www/" + folder);
});

function processFiles(dir, callback) {
    var errorCount = 0;
    fs.readdir(dir, function (err, list) {
        if (err) {
            console.error('Directory Error: ' + err);
            return;
        }
        async.eachSeries(list, function (file, innercallback) {
            file = dir + '/' + file;
            fs.stat(file, function (err, stat) {
                if (!stat.isDirectory()) {
                    if (path.extname(file) === ".js") {
                        lintFile(file, function (hasError) {
                            if (hasError) {
                                errorCount++;
                            }
                            innercallback();
                        });
                    } else {
                        innercallback();
                    }
                } else {
                    if (stat.isDirectory() && recursiveFolderSearch) {
                        processFiles(file, callback);
                    } else {
                        innercallback(); 
                    }
                    innercallback();
                }
            });
        }, function (error) {
            if (errorCount > 0) {
                console.error('Get ' + errorCount + ' error(s) by JSHint.');
                process.exit(1);
            }
        });
    });
}

function lintFile(file, callback) {
    console.log("Linting " + file);
    fs.readFile(file, function (err, data) {
        if (err) {
            console.log('Error: ' + err);
            return;
        }
        if (jshint(data.toString())) {
            console.log('File ' + file + ' has no errors.');
            console.log('-----------------------------------------');
            callback(false);
        } else {
            console.log('Errors in file ' + file);
            var out = jshint.data(),
                errors = out.errors;
            for (var j = 0; j < errors.length; j++) {
                console.log(errors[j].line + ':' + errors[j].character + ' -> ' + errors[j].reason + ' -> ' +
                    errors[j].evidence);
            }
            console.log('-----------------------------------------');
            callback(true);
        }
    });
}
```

### 檔案編碼的雷，我踩了好幾次

如果在執行過程中，一直出現 `Error: Hook failed with error code 1:` 這樣的錯誤訊息，很有可能是你的 JS 檔的編碼格式不是用 Unicode (UTF-8 無簽章) 的格式，因此無法正確地執行檔案，變更一下檔案編碼就搞定了。

----------

參考資料：

* [Minifying Your App’s Source Code](http://blog.ionic.io/minifying-your-source-code/)
