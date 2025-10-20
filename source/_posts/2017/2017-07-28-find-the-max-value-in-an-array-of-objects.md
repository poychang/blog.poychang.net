---
layout: post
title: 使用 JavaScript 找到物件陣列中某屬性的最大值
date: 2017-07-28 00:23
author: Poy Chang
comments: true
categories: [Typescript, Javascript]
permalink: find-the-max-value-in-an-array-of-objects/
---
這是個小技巧，使用 JavaScript/TypeScript 找到物件陣列中某項屬性的最大值，或者最小值也 OK。

假設我們有個兩個陣列如下：

```javascript
var numArray = [1, 2, 3, 4];
var objArray = [
    { id: 1, name: 'A1' },
    { id: 2, name: 'A2' },
    { id: 3, name: 'A3' },
    { id: 4, name: 'A4' }
];
```

## ES5

在 JavaScript ES5 中，可以使用這樣的寫法，找出陣列中的最大值

```javascript
Math.max.apply(null, numArray) //4
```

首先 `Math.max()` 並利用 `apply` 的特性，將 `numArray` 陣列解構成一個一個的參數給 `Math.max` 去執行，藉此找到陣列中的最大值。

>`call` 跟 `apply` 的差別在於 `apply` 第二個參數是陣列，而 `call` 是連續指定的參數

如果是要找物件陣列中某個屬性（例如 `id`）的最大值，可以搭配 `Array.map()` 改寫成這樣

```javascript
Math.max.apply(null, objArray.map(function (o) {
    return o.id;
})) //4
```

## ES6

在 JavaScript ES5 的時候，可以透過 `apply` 的特性來處理這次的問題，而到了 ES6 的時候，可以透過解構子 `...` 來更優雅的處理這個問題，讓寫法變得更精簡。

找出陣列中的最大值

```javascript
Math.max(...numArray) //4
```

找出物件陣列中的最大值，這裡使用 Arrow function 來改寫 `Array.map()` 的 CallBack function

```javascript
Math.max(...objArray.map(p => p.id)) //4
```

越來越優雅且精簡的寫法，看起來好舒服唷～

----------

參考資料：

* [MDN - Math.max()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max#Examples)
* [MDN - Destructuring assignment](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment)
* [MDN - Arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)