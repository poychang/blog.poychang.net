---
layout: post
title: 重新編譯 Ionic 1 的小插曲
date: 2017-06-29 11:44
author: Poy Chang
comments: true
categories: [App, Develop, Tools]
permalink: use-ionic-cli-3-build-ionic-1-project/
---

換了新筆電後，還沒有用他寫過 Ionic 專案，很多工具必須先裝起來，於是就裝了最新版的 Cordova 7.0 和 Ionic CLI 3.4，但就此無法編譯一年多前啟動的舊專案，錯愕呀！

直接說重點。

原本在 Ionic CLI 1 編譯的時候，會使用 `ionic build android` 的指令來啟動編譯，在 Ionic CLI 3 時須改用 `ionic cordova build android` 的方式，小改了指令。

然後如果你要使用 Ionic CLI 3 編譯 Ionic 1 的專案，請記得用 `ionic cordova build android --v1` 加上指定版本的方式，如果沒加了話，跑到天荒地老都編譯不出來的！

只能說，時代變遷如此之快，而舊專案無所不在，在新環境使用新工具，編譯的卻是舊專案，總是會有出乎意料之外的驚喜（嚇）。

----------

參考資料：

* [Can i run the ionic v1 project when i have ionic CLI 3.0.0](https://stackoverflow.com/questions/43908809/can-i-run-the-ionic-v1-project-when-i-have-ionic-cli-3-0-0)