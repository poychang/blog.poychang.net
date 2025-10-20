---
layout: post
title: package.json 套件版本控制
date: 2016-11-28 15:57
author: Poy Chang
comments: true
categories: [Javascript, Develop, Tools]
permalink: package-json-version/
---

在 `package.json` 中，每個套件都有自己的版本號，預設在 `npm install package-name --save` 的時候，會預設使用最新版當作相依的版本號，但當專案發展到一定程度的時候，因應相依性的需求做好套件版本管理，就是一項相當重要的工作。

## 語意化版本

在建立版本號時，是有規範可以參考的，我們可以參考[語意化版本](http://semver.org/lang/zh-TW/)來做規劃，摘要如下：

版本格式：**主版號.次版號.修訂號**

版號遞增規則如下：

1. **主版號**：當你做了不相容的 API 修改
2. **次版號**：當你做了向下相容的功能性新增
3. **修訂號**：當你做了向下相容的問題修正

有了這樣的版本依據，可以依此作判斷套件相依性問題，一般來說只要在同一個主板號內的，都可以有不錯的相容性。

## package.json 版本管理

`package.json` 裡面的 `dendencies` 和 `devDendencies` 段落（如下），在控制專案所使用的套件及其版本

```json
{
  "devDendencies": {
    "browser-sync": "^2.16.0",
    "gulp": "^3.9.1",
    "gulp-concat": "^2.6.0",
    "jshint": "^2.9.3",
    "require-dir": "^0.3.0",
    "streamqueue": "^1.1.1"
  }
}
```

其中 `^` 符號就是在控制該套件的版本，npm 有[官方文件](https://www.npmjs.com/package/semver)在說明這些控制方法，以下為常用的方法說明。

* `1.2.1`
    * 指定版本，限定只使用 `1.2.1` 版本
* `^1.0.0`
    * 可使用 `>=1.0.0` 且 `<2.0.0` 的版本
    * `^` 意義：與指定版本相容的版本
    * `^` 作用：此前綴最左邊的非 0 版號段不允許改變，之後的版號段可為更高的版本，範例：
        * `^1.1.0` 可使用 `>=1.1.0` 且 `<2.0.0`
        * `^0.0.3` 可使用 `>=0.0.3` 且 `<0.0.4`
* `latest`
    * 當前發布的版本
    * 這是一個通用的標記，詳請參考 [dist-tag 官方文件](https://docs.npmjs.com/cli/dist-tag)，在預設情況下，使用 npm install 所安裝的就是標記 `latest` 的版本
    * 常見的標記有：next、stable、beta、canary
* `^5.x`
    * 可使用 `>=5.0.0` 且 `<6.0.0` 的版本
    * `X`、`x` 及 `*` 為萬用字元
    * 版本號尾部省略的版號段，作用等同於萬用字元，範例：
        * `*` 可使用 `>=0.0.0`
        * `1` 可使用 `>=1.0.0` 且 `<2.0.0`
        * `1.2` 可使用 `>=1.2.0` 且 `<1.3.0`
* `~0.1.1`
    * 可使用 `>=0.1.1` 且 `<0.2.0` 的版本
    * `~` 意義：約等於這個版本
    * `~` 作用：如果有**次版號**，則允許**修訂號**為更高的版本，否則允許**次版號**為更高的版本，範例：
        * `~1` 可使用 `>=1.0.0` 且 `<2.0.0`
* `>=3.0.0`
    * 指定基礎版本，可使用 `3.0.0` 以上版本
    * 其他操作符有：`<`、`<=`、`>`、`>=`、`=`
    * 可使用`空格`表示 `AND`，`||` 表示 `OR`，範例：
        * `1.2.7 || >=1.2.9 <2.0.0` 表示可包含 `1.2.7`、`1.2.9` 和 `1.4.6`，不可包含 `1.2.8` 或 `2.0.0`
* `1.30.2 - 2.30.2`
    * 可使用 `>=1.30.2` 且 `<=2.30.2`
    * 如果尾部有缺少版本段，先被替換成 `0` 後再進行比對，範例：
        * `1.30 - 2.30.2` 同 `1.30.0 - 2.30.2`
* `git://github.com/user/project.git#commit-ish`
    * 以 Git URL 的形式表示相依性
    * 還支援 URL、GitHub URL、本機 URL，詳請參考 [URLs as Dependencies](https://docs.npmjs.com/files/package.json#urls-as-dependencies)

----------
#  #
參考資料：

* [npm package.json](https://docs.npmjs.com/files/package.json)
* [npm semver](https://docs.npmjs.com/misc/semver)
* [package.json文件dependencies中的各种版本号形式](http://blog.kankanan.com/article/package.json-65874ef6-dependencies-4e2d7684540479cd7248672c53f75f625f0f.html)
