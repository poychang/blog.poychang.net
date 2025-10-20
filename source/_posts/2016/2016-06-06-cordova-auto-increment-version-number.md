---
layout: post
title: 讓 Codrova 自動增加版本號
date: 2016-06-06 12:34
author: Poy Chang
comments: true
categories: [Javascript, App, Develop]
permalink: cordova-auto-increment-version-number/
---

更新版本號這個小動作總是讓人忽略，如果能自動更新就好了。

在 Cordova 專案中，有一個工具叫做 [cordova-build-increment](https://www.npmjs.com/package/cordova-build-increment) 可以在執行 `cordova build` 時，加上下列三種指令，控制版本號的產生

1. `--no-inc` - no increments processed for this build (overrides other option flags)
2. `--inc-version` - the version tag will be incremented for this build
3. `--no-platform-inc` - platform specific version tags will not be incremented for this build

這工具可以用來增加 `config.xml` 中的 android-versionCode、ios-CFBundleVersion、osx-CFBundleVersion或windows-packageVersion 的版本號。

但我想要控制的不是這個，而是 config.xml 和 package.json 中的 version。

![config.xml 中的 version](http://i.imgur.com/btijPgf.png)
![package.json 中的 version](http://i.imgur.com/Idq070p.png)

再加上我想把這動作放在 hook 的 before prepare 階段中執行，因此有了最下面的[完整程式碼](#samplecode)，只要將該程式碼複製到 `before_prepare` 資料夾中，就 OK 了。

當要做發布的時候，我的動作會先執行 `cordova propare`，檢查 JSHint 等動作，這時這段程式碼就會自動幫你的 config.xml 和 package.json 的 version 加 `1`，此後只有比較重大的版本更新，你才會需要手動去變更版號了。 

![執行 cordova prepare 起動更新版號功能](http://i.imgur.com/eG7FQna.png)

----------

### sample code

[poychang/010_increment_build_number.js](https://gist.github.com/poychang/b38051ae3f2402fe7900e202afffa913)

```javascript
#!/usr/bin/env node

// Save hook under `project-root/hooks/before_prepare/`
//
// Don't forget to install xml2js using npm
// `$ npm install xml2js`

var fs = require('fs');
var xml2js = require('xml2js');

// Read config.xml
fs.readFile('config.xml', 'utf8', function (err, data) {
  console.log('-----------------------------------------');
  console.log('Increment config.xml build number');
  if (err) {
    return console.log(err);
  }

  // Get XML
  var xml = data;

  // Parse XML to JS Obj
  xml2js.parseString(xml, function (err, result) {
    if (err) {
      return console.warn(err);
    }

    // Get JS Obj
    var obj = result;

    if (typeof obj.widget.$.version === 'undefined') {
      obj.widget.$.version = '0.0.1';
    } else {
      var currentVersion = obj.widget.$.version;
      var curVer = String(obj.widget.$.version).split('.');
      var versionObj = {
        major: Number(curVer[0]),
        minor: Number(curVer[1]),
        build: Number(curVer[2])
      };
      console.log('Current Version: ', versionObj);
      // Increment build numbers
      versionObj.build += 1;
      console.log('Target Version: ', versionObj);
      var targetVersion = versionObj.major + '.' + versionObj.minor + '.' + versionObj.build;
      obj.widget.$.version = targetVersion;
      console.log(currentVersion + ' -> ' + targetVersion);
    }

    // Build XML from JS Obj
    var builder = new xml2js.Builder();
    var xml = builder.buildObject(obj);

    // Write config.xml
    fs.writeFile('config.xml', xml, function (err) {
      if (err) { return console.warn(err); }
      console.log('config.xml build number successfully incremented');
    });

  });
});

fs.readFile('package.json', 'utf8', function (err, data) {
  console.log('-----------------------------------------');
  console.log('Increment package.json build number');
  if (err) {
    return console.warn(err);
  }

  // Get JSON
  var json = JSON.parse(data);

  if (typeof json.version === 'undefined') {
    json.version = '0.0.1';
  } else {
    var currentVersion = json.version;
    var curVer = String(json.version).split('.');
    var versionObj = {
      major: Number(curVer[0]),
      minor: Number(curVer[1]),
      build: Number(curVer[2])
    };
    console.log('Current Version: ', versionObj);
    // Increment build numbers
    versionObj.build += 1;
    console.log('Target Version: ', versionObj);
    var targetVersion = versionObj.major + '.' + versionObj.minor + '.' + versionObj.build;
    json.version = targetVersion;
    console.log(currentVersion + ' -> ' + targetVersion);
  }

  // Write package.json
  fs.writeFile('package.json', JSON.stringify(json, null, 4), function (err) {
    if (err) { return console.warn(err); }
    console.log('package.json build number successfully incremented');
  });
});
```

----------

參考資料：

* [Automatic build numbering](https://forum.ionicframework.com/t/automatic-build-numbering/9283)
* [Cordova Config.xml](https://cordova.apache.org/docs/en/latest/config_ref/)
