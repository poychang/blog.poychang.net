---
layout: post
title: JavaScript ES6 模組系統
date: 2025-11-14 23:23
author: Poy Chang
comments: true
categories: [Javascript]
permalink: javascript-module-system/
---

當程式越寫越多，應用程式的規模也越來越大時，我們需要一個用於管理組織程式碼的方式，在 JavaScript 的開發環境中，可以使用 ES6 的 Module System 特性，特別是目前所有主流的瀏覽器都已經內建支援這樣的特性，這篇將說明基本的模組系統的輸出與匯入相關語法與使用方式。

最早，有人發展出使用 IIFE 的語法來進行區分作用域，藉此做到簡易的模組管理，但這在複雜、大型的應用程式中，卻顯得難以使用，像是無法再程式中做為模組來載入，更別說延遲載入模組的特性。

後來有人發展出，可說是第二代的模組系統，CommonJS 和 AMD (Asynchronous Module Definition) 專案，前者是設計給伺服器端，也就是 Node.js 使用，而後者的目標對象則是瀏覽器端。兩者的設計方向不同，也因此無法彼此相容。

接著，ES6 標準加入模組系統的支援，它學習了 CommonJS 和 AMD 的優點，而且是 JavaScript 語言內建的模組系統，這樣的前提讓 ES6 的模組系統有了廣大的開發者使用。

## 開始使用

ES6 的模組系統中，各模組有自己獨立的作用域，避免了作用域汙染的問題，而使用上有三個大重點：

1. ES6 模組的程式碼會自動變成嚴格模式 (strict mode)，即便沒有在程式碼開頭加上 `use strict`
2. ES6 模組的隔離原則是以一個檔案為一個模組
3. ES6 模組使用 `import` 語句進行匯入，使用 `export` 語句進行輸出，通常會在檔案的最前面做匯入，在檔案的最後做匯出

由於是以一個檔案作為一個模組為基礎，因此通常檔案名稱就會是**模組名稱**，例如 `MyModule` 這個模組的檔案命名就會是 MyModule.js。基本上不需要擔心大小寫的問題，這件事通常會交給編譯工具做最後編譯，然後經由打包工具將所有所需模組打包在一起。

**模組名稱**所指的不只是檔案名稱，而是由**目錄路徑**與**檔案名稱**的字串組合，通常會省略副檔名（例如 .js 或 .jsx）。目錄路徑會使用 Linux 的語法來指向，不過如果是使用 npm 套件管理工具所安裝的模組，只需要提供模組名稱即可，在專案執行或編譯時，會自動從 node_modules 資料夾中搜尋模組檔案。

以下是匯入自訂模組檔案的使用方式：

- 如果要匯入的模組叫做 `utils`，且是在相同的目錄下，則使用 `import` 語句配上 `./utils`
- 如過要匯入的模組位於相對目錄 `components` 資料夾底下，怎使用相對路徑來匯入，如 `./components/utils`

## 輸出與匯入

有輸出才有匯入。我們可以使用 `export` 語句來輸出物件、類別、函式或原始資料類型（變數或常數），如下：

```javascript
// ./demo.js
export const str = 'demo-string';
export function func = () => { console.log('hello world'); };
export const obj = { name: 'Poy Chang', age: '20' };
export class demoClass {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }
};
```

有了輸出模組的檔案，可以使用以下兩種方式來匯入，第一種是將每個要匯入的名稱都定義在大括號之中，如下：

```javascript
import { str, func, obj, demoClass } form './demo.js';
```

另一種是使用萬用字元 `*`，用此代表所有的輸出，不過要寫法上要幫他加上一個額外的模組名稱，避免命名空間發生衝突，如下：

```javascript
import * as myModule form './demo.js';
console.log(myModul.str);
```

### 單一輸出

如果模組程式碼相對單純，只有一個輸出，通常會使用 `default` 關鍵字，藉此可以直接在定義時寫上輸出語句，如下：

```javascript
// ./demo2.js
// 寫法一
function func = (name) => { console.log(`hello ${name}`); };
export default func;
// 寫法二，使用匿名函式
export default function (name) => { console.log(`hello ${name}`); };
```

當需要匯入上述以 `default` 所定義的輸出時，可以使用自訂的模組名稱，如下

```javascript
// 寫法一
import func from './demo2.js';
// 寫法二，自訂名稱
import myFunc from './demo2.js';
// 寫法三，第二種寫法相當於這樣
import { default as myFunc } from './demo2.js';
```

由於 `default` 是一個特別的輸出識別字，因特別注意它只能用在以下幾種情況：

- 值
- 函式
- 類別
- 表達式

不過如果使用 `var`、`let` 或 `const` 時，是不能使用 `export default` 的。

### 混用輸出

在同一個模組檔案中，可能會出現標準輸出與 `dafault` 輸出兩這共存的情況，這時候請特別小心，很容易混亂。

例如模組檔案中出現以下的程式碼：

```javascript
// ./module.js
export const x = 10;
export const y = 20;
export default function (a, b) => a + b;
```

這時候在匯入的時候，可能出現以下的寫法：

```javascript
import sum, { x, y } from './module';
```

這時，前面的 `sum` 是從 `export default` 來的，而後面的大括號則是標準輸出的部分。上面這樣的匯入寫法和下面是等效的：

```javascript
// 寫法一
import { default as sum, x, y } from './module';
// 寫法二，拆成兩行比較清楚
import sum from './module';
import { x, y } from './module';
```

## 語法參考

輸出與匯入的語法有很多種寫法，不過常見的只有那幾種，藉由下面的範例，能讓我們比較容易上手 ES6 的模組系統。

```javascript
// 常見的輸出語法
export let x = 10;
export function foo() {};
export default 20;
export default function foo() {};
export { decrypt as dec }; // 輸出一個已存在的識別名，並改用新的識別名
```

```javascript
// 常見的匯入語法
import func from './module';
import { foo, bar } from './module';
import { foo as xFoo } from './module';
import * as myModule from './module';
```

---

參考資料：

- [MDN - JavaScript modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
