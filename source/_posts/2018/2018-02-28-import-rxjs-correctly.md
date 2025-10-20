---
layout: post
title: 建議使用這種方式 Import RxJS 的各項功能
date: 2018-02-28 12:00
author: Poy Chang
comments: true
categories: [Typescript, Javascript, Angular]
permalink: import-rxjs-correctly/
---
在 RxJS 5.4 以前，常使用 `import 'rxjs/add/operator/map';` 這樣的方式來匯入 RxJS 的操作符，但這樣的做法是會有副作用的，如果使用 RxJS 5.5 以後的版本，建議使用 `import { map } from 'rxjs/operator/map';` 這樣的方式來匯入。

使用 RxJS 操作前的第一件事就是要匯入要使用的操作符，在以前我們會用下面這種方式匯入並使用：

```typescript
import { Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

Observable.of(1, 2, 3, 4)
    .map(o => o * 10)
    .subscribe(d => console.log(d))
```

第一行先匯入 `Observable` 原型，在第二行開始的地方做擴充，增加 `of` 和 `map` 操作符，然後再進行操作。

但這樣的做法 `Observable` 會存活在全域中，因此你只要在一個檔案匯入了操作符，其他檔案不用匯入同樣可以使用，這樣很難管理甚至很容易造成混亂。

因此在 RxJS 5.5 之後，改用 Pure Function 的方式來匯入操作符，藉此可以避免汙染 `Observable` 原型，同時做到**有用到才匯入**，避免編譯後的檔案莫名的增加。

```typescript
import { of } from 'rxjs/observable/of';
import { map } from 'rxjs/operator/map';

of(1, 2, 3, 4)
    .pipe(map(o => o * 10))
    .subscribe(d => console.log(d));  // OUTPUT: 10, 20, 30, 40
```

>個人覺得在 JavaScript 的世界裡，保持乾淨是一件很重要的事。

----------

參考資料：

* [学习 RxJS 操作符](https://rxjs-cn.github.io/learn-rxjs-operators/about/)

