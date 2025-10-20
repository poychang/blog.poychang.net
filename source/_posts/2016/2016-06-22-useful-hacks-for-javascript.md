---
layout: post
title: 有趣的 JavaScript 小技巧
date: 2016-06-22 17:17
author: Poy Chang
comments: true
categories: [Javascript]
permalink: useful-hacks-for-javascript/
---

偶然在逛到一篇在講 JavaScript 的 hack 小技巧，有幾項覺得滿實用的，寫下來筆記。

## 使用 `!!` 將變數轉型成 Boolean

JavaScript 有一種特性，稱為 Truthy and Falsy，他會預期下列的值為 `false`

* `undefined`, `null`
* Boolean: `false`
* Number: `0`, `NaN`
* String: `''`

其他所有值，都會被視為 `true`，而且像是空物件 `{}` 或是空陣列 `[]`，也是會視為 `true`唷！

因此在有些情境下，我們會想要透過這樣的規則來定義某變數是否存在，就可以藉由這樣的特性，搭配 `!!`（兩個驚嘆號）來設定變數的值。

```javascript
function Account(cash) {
    this.cash = cash;
    this.hasMoney = !!cash;
}
var account = new Account(100);
console.log(account.cash);      //100
console.log(account.hasMoney);  //true

var emptyAccount = new Account(0);
console.log(emptyAccount.cash);      //0
console.log(emptyAccount.hasMoney);  //false
```

## 使用 `+` 將變數轉型成 Number

如果要手動將 String 轉換成 Number 普遍來說會使用 `Number(value)` 來處理（我比較偏好這樣的處理方式，維護起來比較明確知道要做什麼），但有另一種特別的作法可以知道一下，就是利用 `+` 加號運算子來做隱性轉型。

透過 `+` 加號運算子來做字串轉型成數字時，如果字串有包含非數字類型的資料，例如 `ABC`，則會返回 `NaN` Not a Number 的物件。

```javascript
function toNumber(strNumber) {
    return +strNumber;
}
console.log(toNumber('3.14'));  //3.14
console.log(toNumber('ABC'));   //NaN
```

## 使用 `||` 設定預設值

這個小技巧非常實用，利用 `||` OR 運算子來設定變數的預設值。

```javascript
function User(name, age) {
    this.name = name || "Poy Chang";
    this.age = age || 27;
}
var user1 = new User();
console.log(user1.name); // Poy Chang
console.log(user1.age);  // 27
```

小技巧們，好玩又不黏手:)

----------

參考資料：

* [12 extremely useful hacks for JavaScript](https://blog.jscrambler.com/12-extremely-useful-hacks-for-javascript/?utm_source=javascriptweekly&utm_medium=email)
