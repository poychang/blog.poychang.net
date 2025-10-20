---
layout: post
title: Android 支援多語系 App 名稱（含自動化程式碼）
date: 2016-06-13 13:53
author: Poy Chang
comments: true
categories: [App, Develop]
permalink: cordova-android-localized-app-name/
---

要讓 App 邁向國際，多語系是一定要做的。透過 [angular-translate](https://github.com/angular-translate/angular-translate) 可以輕鬆讓 App 做到 i18n 的服務。內容搞定了，那 App 名稱呢，也能依據語系而且不同的名稱嗎？答案是肯定的。

在[官方文件](https://developer.android.com/training/basics/supporting-devices/languages.html)裡面就有提到支援多語系的做法，處理方式很簡單，只要在特定的資料夾下建立對應的檔案就 OK了。

以下是以 Cordova 專案為例。

假設我們有兩種語系，分別要有不同的 App 名稱

* 英文：Hello World
* 中文：哈囉世界

## 步驟一

首先要到專案目錄下的 `platforms` 資料夾地下找到 `res` 資料夾，這是個存放 Android 資源的地方，我們要建立不同語系的 App 名稱設定檔就是要在這個資料夾底下。

## 步驟二

在 `res` 資料夾底下，依照你需要的語系建立不同名稱的資料夾	

* 英文：`values`
* 中文：`values-zh`

![語系資料夾](http://i.imgur.com/kLpcXFd.png)

專案預設就有 `values`，我們用來存放預設是英文的設定檔，而 `values-zh` 用來存放中文的設定檔。

這裡資料夾的命名是有規則的，新增對應語系的資料夾必須是 `values-` 加上二字元的 ISO 639-1 codes 語系代碼，常用的如下：

* Chinese (zh)
* English (en)
* French (fr)
* Japanese (ja)
* Korean (ko)

詳細表格請參考：[Wiki - List of ISO 639-1 codes](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes)

其中有一點比較尷尬，就是這個語系代碼中，中文是沒有分簡、繁體的，所以這部份就自行斟酌了。

## 步驟三

在對應語系的資料夾中，各別新增一個 `string.xml` 的檔案並增加 XML 程式碼，範例如下：

```xml
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<resources>
  <string name="app_name">哈囉世界</string>
  <string name="launcher_name">@string/app_name</string>
  <string name="activity_name">@string/launcher_name</string>
</resources>
```

很明顯的可以找到 `name="app_name"` 的屬性，把這個屬性值修改成你要的名稱，例如：哈囉世界。

## 最後

對應的語系資料建立完成之後，在 Android 執行的時候，會去針對裝置的語系設定，去讀取 App 特定位置的設定檔，這樣就達成依據語系的不同，顯示不一樣的 App 名稱。

## 自動化

如果每次重建專案，都要手動去資加這些資料夾和檔案了話，其實也滿累人的。

因此我寫了段程式，利用 Crodova Hook 在 `after_compile` 階段，自動去產生所需要的檔案，這樣之後就會在編譯完成後，自動加入寫死的設定，有興趣的可以參考下面的[完整程式碼](#samplecode)。

這段程式碼是 Android 專用的，而且希望在最後在做 release 的時後才執行，所以執行指令要下 `cordova build android --release` 才能觸發這段程序。

----------

## samplecode

[poychang/addAndroidResource.js](https://gist.github.com/poychang/bd065ce5b118752338926ae6c45e3054)

```javascript
#!/usr/bin/env node

/* jshint esversion: 6 */

// ref: https://developer.android.com/training/basics/supporting-devices/languages.html

// Save hook under `project-root/hooks/after_compile/`
//
// Don't forget to install xml2js using npm
// `$ npm install xml2js`

// Modules
var fs = require('fs');
var xml2js = require('xml2js');

// Process
var cliCommand = process.env.CORDOVA_CMDLINE;
var isRelease = (cliCommand.indexOf('--release') > -1);
var isBuildAndroid = (cliCommand.indexOf('build') > -1) && (cliCommand.indexOf('android') > -1);

// Exit
if (!isRelease) {
    return;
}

// Run add Android resource
run();

function run() {
    if (isBuildAndroid) addAndroidResource();
}

function addAndroidResource() {
    var files = [{
        folder: 'platforms/android/res/values-zh/',
        file: 'string.xml',
        data: `
            <?xml version='1.0' encoding='utf-8'?>
            <resources>
                <string name="app_name">App Name</string>
                <string name="launcher_name">@string/app_name</string>
                <string name="activity_name">@string/launcher_name</string>
            </resources>
            `
    }];

    files.forEach(function (obj) {
        var path = obj.folder + obj.file;
        console.log(path);
        if (checkDirectory(obj.folder)) {
            xml2js.parseString(obj.data, function (err, result) {
                // Build XML from JS Obj
                var builder = new xml2js.Builder();
                var xml = builder.buildObject(result);
                // Write to file
                fs.writeFile(path, xml, function (err) {
                    if (err) throw err;
                    console.log('Save ' + path);
                });
            });
        } else {
            console.log('Faild to check directory.');
        }
    }, this);
}

function checkDirectory(path) {
    if (isDirectoryExists(path)) return true;
    try {
        fs.mkdirSync(path);
        return true;
    }
    catch (err) {
        return false;
    }
}

function isDirectoryExists(path) {
    try {
        return fs.statSync(path).isDirectory();
    }
    catch (err) {
        return false;
    }
}
```

----------

參考資料：

* [Android Developer - Supporting Different Languages](https://developer.android.com/training/basics/supporting-devices/languages.html)
