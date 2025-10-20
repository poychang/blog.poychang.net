---
layout: post
title: 停用 Angular Debug 模式來增加效能
date: 2016-05-22 09:56
author: Poy Chang
comments: true
categories: [Javascript, App]
permalink: improving-angular-performance-for-production/
---

不多看文件不會知道，其實 Angular 裡面有很多地方可以調整效能，其中有一個方式可以一行 code 就提升整個 Angular App 效能的方法，你一定要知道。

在官方文件中 $compileProvider 有一個設定可以將關閉 Angular 提供的 debug 資訊 [debugInfoEnabled](https://docs.angularjs.org/api/ng/provider/$compileProvider#debugInfoEnabled)，程式碼就只需要一行，如下：

```javascript
myApp.config(['$compileProvider', function ($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);
```

在預設情況下，Angular 會開啟 debug 模式，當程式有問題時，會在 console 中顯示相對應的錯誤提醒（雖然很多時候這訊息有看沒有懂），此時 Angular 會在 DOM 文件中加上 `ng-scope` 或 `ng-isolate-scope` 的 HTML attribute，而這兩個屬性就只有提供給 Angular Debugger 使用而已，因此在 production 的程式碼中，我們可以將此功能關閉，以增進執行效能。

![ng-scope](http://i.imgur.com/8YhhkC0.png)

## 小記

在開發過程中，可能會使用 [kentcdodds/ng-stats](https://github.com/kentcdodds/ng-stats) 來查看頁面中 Angular digest/watches 的變化，以了解操作的執行效能，然而在設定關閉 `debugInfoEnabled` 後，此功能就不能使用了（同時也沒了聊勝於無的錯誤訊息），因此開發過程中還是將此功能打開比較方便。

----------

參考資料：

* [Improving Angular performance with 1 line of code](https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.7dpkiap7p)
