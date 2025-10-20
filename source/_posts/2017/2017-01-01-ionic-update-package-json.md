---
layout: post
title: Ionic 不再自動更新 package.json
date: 2016-01-01 22:56
author: Poy Chang
comments: true
categories: [App, Tools]
permalink: ionic-update-package-json/
---
使用 [Ionic CLI](https://github.com/driftyco/ionic-cli) 執行 `ionic platform add android` 或 `ionic plugin add some-plugin` 指令，可以增加編譯平台或所需的套件，而且會在新增後自動更新 `package.json`，但最近不知道怎麼了，`package.json` 竟然不會自動更新了。

當然，我們可以直接修改 `package.json` 手動加入所需要的平台或套件，但這方法還是稍嫌麻煩。

目前有找到半手動的解法，在新增完平台或套件後，執行 `ionic state save` 指令，會將目前專案的狀態儲存起來，其中包含編譯平台和套件的相關資訊，會更新至 `package.json` 中。

----------

參考資料：

* [`ionic platform` commands not updating package.json](https://github.com/driftyco/ionic-cli/issues/1254#issuecomment-240962880)