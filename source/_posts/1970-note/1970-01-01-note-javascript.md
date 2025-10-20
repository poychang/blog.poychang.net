---
layout: post
title: Javascript 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Javascript, Note]
permalink: note-javascript/
---

本篇作為筆記用途，記錄 JavaScript 參考資料

## JavaScript 模組匯入匯出

基本上分兩種，具名(name)和預設(default)，前者必須有指定的名稱做匯入匯出(但可以用as變更)，後者匯出時不指定名稱，而在匯入時由開發者自訂。

![JavaScript 模組匯入匯出](https://i.imgur.com/1IUxxHG.jpg)

參考資料：[Module Cheatsheet](https://www.samanthaming.com/tidbits/79-module-cheatsheet/)

## Javascript Array Cheat Sheet

使用 javascript 操作 JSON 時，使用內建陣列的操作功能，不管是在陣列上的資料儲存、過濾、排序、組合，都是超級無敵好用

<a href="http://i.imgur.com/Jsb9NrZ.jpg" target="_blank">
  ![Javascript-Array-Cheat-Sheet](http://i.imgur.com/Jsb9NrZ.jpg)
</a>

[完整的 Array 用法可以看 MDN 官網](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array)

## 日期加減運算

這題提供最原始的日期加減運算方案，而不用套件或用 prototype 的擴充寫法，來達成常見的日期計算

```javascript
// 取得 90 天前的日期
var today = new Date();
var at90DaysAgoTicks = today.getDate() - 90; // Number 型別
var at90DaysAgo = new Date(at90DaysAgoTicks); // Date 型別

console.log(at90DaysAgo.toISOString().substring(0, 10));
// 輸出：2020-10-10
```

```javascript
// 簡化上面程式碼，取得 90 天前的日期
var at90DaysAgo = new Date(new Date().setDate(new Date().getDate() - 90));

console.log(at90DaysAgo.toISOString().substring(0, 10));
```

## Fetch

MDN - [使用 Fetch 發送請求](https://developer.mozilla.org/zh-TW/docs/Web/API/Fetch_API/Using_Fetch)

```javascript
fetch('https://domain.url/api', {
    body: JSON.stringify({
        payloadProperty: 'hello world',
    }),
    headers: {
      'content-type': 'application/json'
    },
    method: 'POST',
});
```

## 推薦使用 [Lodash](https://lodash.com/)

- Lodash 提供很多我們平常 coding 會用到的工具函式，部分函式的效能甚至比原生 JavaScript 函式還要快。
- 常用到的 Lodash 函式有以下四種分類：
  - Arrays
  - Collections
  - Objects
  - Utilities
- 若在 AngularJS 中使用，推薦將 Lodash 封裝成一個 module，程式碼如下：

```javascript
angular.module('Lodash', []).factory('lodash', function($window) {
  return $window._; // Lodash 一定要先 include 進來
});

app.module('myApp', ['Lodash']);

app.controller('myCtrl', [
  '$scope',
  'lodash',
  function($scope, _) {
    /* 這邊的 _ 代表 Lodash */
  }
]);
```

## 原生操作

### join

將陣列元素用固定符號串成字串 ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/join))

```javascript
var arr = ['jack', 'john', 'may', 'su', 'Ada'];
var str = arr.join('、');
// str 為 jack、john、may、su、Ada
```

### arr.length = 0;

清除或增加陣列長度 (清除陣列很好用)

```javascript
var arr = [1, 2, 3, 4, 5, 6];
arr.length = 2;
//  [1,2]
arr.length = 0;
//  []
arr.length = 5;
// [,,,,]
```

### delete

刪除陣列元素([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete))

```javascript
var arr = [1, 2, 3, 4, 5, 6];
delete arr[1];
// [1,,3, 4, 5, 6]
```

### form

將字串或輸入參數組成陣列 (非常方便) ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from))

```javascript
// Array-like object (arguments) to Array
(function() {
  var args = Array.from(arguments);
  return args;
})(1, 2, 3); // [1, 2, 3]

// Any iterable object...
// Set
Array.from(new Set(['foo', window])); // ["foo", window]

// Map
var m = new Map([[1, 2], [2, 4], [4, 8]]);
Array.from(m); // [[1, 2], [2, 4], [4, 8]]

// Strings are both array-like and iterable
Array.from('foo'); // ["f", "o", "o"]  //<-- 超方便

// Using an arrow function as the map function to
// manipulate the elements
Array.from([1, 2, 3], x => x + x); // [2, 4, 6]

// Generate a sequence of numbers
Array.from({ length: 5 }, (v, k) => k); // [0, 1, 2, 3, 4]
```

### sort

陣列排序 (很好用) ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort))

```javascript
var arr = [5, 9, 1, 3, 2, 6];
arr.sort();
// [1,2,3,5,6,9]
//也可以這樣寫
arr.sort(function(a, b) {
  return a - b;
});
// [1,2,3,5,6,9]

//如果要反過來排序的話
arr.sort(function(a, b) {
  return b - a;
});
// [9,6,5,3,2,1]
```

### push

新增元素或元素組到陣列 (想不用到都不行) ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/push))

```javascript
var arr = {
  name: [],
  data: []
};
arr.name.push('jack');
arr.name.push('john');
arr.data.push({ weight: 60, height: 170 });
arr.data.push({ weight: 62, height: 175 });
JSON.stringify(arr);
/*
{
  "name":["jack","john"],
    "data":[
    {"weight":60,"height":170},
      {"weight":62,"height":175}
  ]
} */
```

### splice

改變陣列內容，移除或新增元素 ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice))

```javascript
array.splice(index , howMany[, element1[, ...[, elementN]]])
```

**參數**

- index : 要從哪個索引位置開始改變
- howMany : 用來指出要移除多少個元素. 如果 howMany 等於 0，則沒有任何元素被移除
- element1, ..., elementN : 要加入陣列的元素，如果省略則表示不加入只刪除

**官網範例**

```javascript
var myFish = ['angel', 'clown', 'mandarin', 'surgeon'];
//removes 0 elements from index 2, and inserts "drum"
var removed = myFish.splice(2, 0, 'drum');
//myFish is ["angel", "clown", "drum", "mandarin", "surgeon"]
//removed is [], no elements removed
//removes 1 element from index 3
removed = myFish.splice(3, 1);
//myFish is ["angel", "clown", "drum", "surgeon"]
//removed is ["mandarin"]
//removes 1 element from index 2, and inserts "trumpet"
removed = myFish.splice(2, 1, 'trumpet');
//myFish is ["angel", "clown", "trumpet", "surgeon"]
//removed is ["drum"]
//removes 2 elements from index 0, and inserts "parrot", "anemone" and "blue"
removed = myFish.splice(0, 2, 'parrot', 'anemone', 'blue');
//myFish is ["parrot", "anemone", "blue", "trumpet", "surgeon"]
//removed is ["angel", "clown"]
//removes 2 elements from index 3
removed = myFish.splice(3, Number.MAX_VALUE);
//myFish is ["parrot", "anemone", "blue"]
//removed is ["trumpet", "surgeon"]
```

### some

陣列比對，只要有一個元素是 true，就返回 true (很好用) ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/some))

```javascript
var arr = ['jack', 'john', 'may', 'su', 'Ada'];
var flag = arr.some(function(value, index, array) {
  return value == 'may' ? true : false;
});
//  flag 為 true
```

### every

陣列比對，所有元素都是 true 才是 true (很好用) ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/every))

```javascript
var arr = ['jack', 'john', 'may', 'su', 'Ada'];
var flag = arr.every(function(value, index, array) {
  return value.length > 2;
});
// flag 為 false
```

### filter

陣列過濾，透過 filter 的過濾條件返回一個新陣列 (非常好用)

```javascript
var arr = ['jack', 'john', 'may', 'su', 'Ada'];
var arr2 = arr.filter(function(value) {
  return value.length > 3;
});
arr2.join('、');
//  jack、john
```

### map

對陣列中的各元素進行操作，操作後的值**會被寫入新的陣列中並返回** ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map))

```javascript
var arr = [1, 2, 3, 4, 5, 6];
var arr2 = arr.map(function(element, index, array) {
  return element * 2;
});
arr2.join('、');
// 2、4、6、8、10、12
```

### forEach

會給陣列內的每個元素，都執行給定的函式一次 ([MDN](https://developer.mozilla.org/zh-TW/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach))

```javascript
var a = ['a', 'b', 'c'];

a.forEach(function(element, index, array) {
  console.log(element);
});

// a
// b
// c
```

### concat

會將兩個陣列合併產生新的陣列，原陣列不改變 (不常用，但很簡單就記一下吧) ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/concat))

```javascript
var alpha = ['a', 'b', 'c'];
var numeric = [1, 2, 3];
var alphaNumeric = alpha.concat(numeric);
// creates array ["a", "b", "c", 1, 2, 3]; alpha and numeric are unchanged
```

### reduce

陣列中的每一個元素都會呼叫一次 callback 函數，唯一不同的是，函數的回傳值會當作下一次呼叫的傳入值，方向為索引 0 到 陣列尾端 (冷門，幾乎可以不用記) ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce))

```javascript
var arr = [1, 2, 3, 4, 5, 6];
var flag = arr.reduce(function(previousValue, currentValue, index, array) {
  return previousValue + currentValue;
});
// 所以 flag 為 1 + 2 + 3 + 4 + 5 + 6 = 21
```

### reduceRight

與 reduce 相同，只是是從陣列尾端到索引 0 的位置 (冷門，幾乎可以不用記) ([MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/ReduceRight))

---

## 別人寫的好用程式碼

### 陣列的 distinct

取得陣列中不重複的元素值，輸出成新陣列 (有用到 jQuery)

```javascript
function GetUnique(inputArray) {
  var outputArray = [];
  for (var i = 0; i < inputArray.length; i++) {
    if (jQuery.inArray(inputArray[i], outputArray) == -1) {
      outputArray.push(inputArray[i]);
    }
  }
  return outputArray;
}
```

---

參考資料：

- [Lodash](https://lodash.com/)
