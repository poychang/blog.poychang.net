---
layout: post
title: 快速找到 RxJS 的 import 路徑的方法 
date: 2017-05-23 21:12
author: Poy Chang
comments: true
categories: [Typescript, Angular, Develop]
permalink: angular-rxjs-operaror-location/
---
Angular 專案環境是一個 RxJS friendly 的環境，可以透過 RxJS 幫我們完成很多任務，而如果你和我一樣總是傻傻分不清楚所使用的 RxJS 是來自 operator 和 observable 了話，然後總是背不起來運算子到底在哪裡，可以試試看下面這種查詢方式。

>如果是使用 RxJS 5.5 之後的版本，[建議使用這種方式 Import RxJS 的各項功能](https://blog.poychang.net/import-rxjs-correctly/)。

在專案資料夾中，`node_modules/rxjs/` 這裡路徑下，有個 `Rx.d.ts` 檔案，裡面 import 了所有 Rx 方法，在裡面你會看到像下面這段程式碼：

```typescript
...
import './add/observable/using';
import './add/observable/throw';
import './add/operator/catch';
import './add/operator/filter';
...
```

我們只要把所需的運算子，複製該行至你的程式碼裡面，然後把 `./` 改成 `rxjs/` 就 OK 了。

如果覺得這樣還是很麻煩了話，可以直接在你的程式碼上面使用

```
import 'rxjs/Rx';
```

這樣也是 OK 的，只是這樣等於加入所有的運算子。

但是經過我手邊的項目實測，使用 `import 'rxjs/Rx';` 和明確指定相比較，這兩種作法會使的編譯後的
`vendor.bundle.js` 差了將近 500kb，在意檔案大小的朋友們可以測試看看。

## 後記

* 如果之前有 `import 'rxjs';` 這種寫法了話，執行 `ng lint` 的時候，會提示你這寫法已列入黑名單 `This import is blacklisted, import a submodule instead`，建議改成明確指定（或也可以用 `import 'rxjs/Rx';` 這個方式），這樣才不會報錯。

* 糟糕，我懶到連 `node_modules/rxjs/Rx.d.ts` 這個檔案都不想開，直接在這邊查就好...

```typescript
export { Subject, AnonymousSubject } from 'rxjs/Subject';
export { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/bindCallback';
import 'rxjs/add/observable/bindNodeCallback';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/concat';
import 'rxjs/add/observable/defer';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/fromEventPattern';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/observable/generate';
import 'rxjs/add/observable/if';
import 'rxjs/add/observable/interval';
import 'rxjs/add/observable/merge';
import 'rxjs/add/observable/race';
import 'rxjs/add/observable/never';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/onErrorResumeNext';
import 'rxjs/add/observable/pairs';
import 'rxjs/add/observable/range';
import 'rxjs/add/observable/using';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/zip';
import 'rxjs/add/observable/dom/ajax';
import 'rxjs/add/observable/dom/webSocket';
import 'rxjs/add/operator/buffer';
import 'rxjs/add/operator/bufferCount';
import 'rxjs/add/operator/bufferTime';
import 'rxjs/add/operator/bufferToggle';
import 'rxjs/add/operator/bufferWhen';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/combineAll';
import 'rxjs/add/operator/combineLatest';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/concatMapTo';
import 'rxjs/add/operator/count';
import 'rxjs/add/operator/dematerialize';
import 'rxjs/add/operator/debounce';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/defaultIfEmpty';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/delayWhen';
import 'rxjs/add/operator/distinct';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/distinctUntilKeyChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/exhaust';
import 'rxjs/add/operator/exhaustMap';
import 'rxjs/add/operator/expand';
import 'rxjs/add/operator/elementAt';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/finally';
import 'rxjs/add/operator/find';
import 'rxjs/add/operator/findIndex';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/groupBy';
import 'rxjs/add/operator/ignoreElements';
import 'rxjs/add/operator/isEmpty';
import 'rxjs/add/operator/audit';
import 'rxjs/add/operator/auditTime';
import 'rxjs/add/operator/last';
import 'rxjs/add/operator/let';
import 'rxjs/add/operator/every';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/mapTo';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/max';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/mergeAll';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/mergeMapTo';
import 'rxjs/add/operator/mergeScan';
import 'rxjs/add/operator/min';
import 'rxjs/add/operator/multicast';
import 'rxjs/add/operator/observeOn';
import 'rxjs/add/operator/onErrorResumeNext';
import 'rxjs/add/operator/pairwise';
import 'rxjs/add/operator/partition';
import 'rxjs/add/operator/pluck';
import 'rxjs/add/operator/publish';
import 'rxjs/add/operator/publishBehavior';
import 'rxjs/add/operator/publishReplay';
import 'rxjs/add/operator/publishLast';
import 'rxjs/add/operator/race';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/repeat';
import 'rxjs/add/operator/repeatWhen';
import 'rxjs/add/operator/retry';
import 'rxjs/add/operator/retryWhen';
import 'rxjs/add/operator/sample';
import 'rxjs/add/operator/sampleTime';
import 'rxjs/add/operator/scan';
import 'rxjs/add/operator/sequenceEqual';
import 'rxjs/add/operator/share';
import 'rxjs/add/operator/shareReplay';
import 'rxjs/add/operator/single';
import 'rxjs/add/operator/skip';
import 'rxjs/add/operator/skipLast';
import 'rxjs/add/operator/skipUntil';
import 'rxjs/add/operator/skipWhile';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/subscribeOn';
import 'rxjs/add/operator/switch';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/switchMapTo';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/takeLast';
import 'rxjs/add/operator/takeUntil';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/throttle';
import 'rxjs/add/operator/throttleTime';
import 'rxjs/add/operator/timeInterval';
import 'rxjs/add/operator/timeout';
import 'rxjs/add/operator/timeoutWith';
import 'rxjs/add/operator/timestamp';
import 'rxjs/add/operator/toArray';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/window';
import 'rxjs/add/operator/windowCount';
import 'rxjs/add/operator/windowTime';
import 'rxjs/add/operator/windowToggle';
import 'rxjs/add/operator/windowWhen';
import 'rxjs/add/operator/withLatestFrom';
import 'rxjs/add/operator/zip';
import 'rxjs/add/operator/zipAll';
import { Operator } from 'rxjs/Operator';
import { Observer } from 'rxjs/Observer';
import { Subscription } from 'rxjs/Subscription';
import { Subscriber } from 'rxjs/Subscriber';
import { AsyncSubject } from 'rxjs/AsyncSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ConnectableObservable } from 'rxjs/observable/ConnectableObservable';
import { Notification } from 'rxjs/Notification';
import { EmptyError } from 'rxjs/util/EmptyError';
import { ArgumentOutOfRangeError } from 'rxjs/util/ArgumentOutOfRangeError';
import { ObjectUnsubscribedError } from 'rxjs/util/ObjectUnsubscribedError';
import { TimeoutError } from 'rxjs/util/TimeoutError';
import { UnsubscriptionError } from 'rxjs/util/UnsubscriptionError';
import { TimeInterval } from 'rxjs/operator/timeInterval';
import { Timestamp } from 'rxjs/operator/timestamp';
import { TestScheduler } from 'rxjs/testing/TestScheduler';
import { VirtualTimeScheduler } from 'rxjs/scheduler/VirtualTimeScheduler';
import { AjaxRequest, AjaxResponse, AjaxError, AjaxTimeoutError } from 'rxjs/observable/dom/AjaxObservable';
import { AsapScheduler } from 'rxjs/scheduler/AsapScheduler';
import { AsyncScheduler } from 'rxjs/scheduler/AsyncScheduler';
import { QueueScheduler } from 'rxjs/scheduler/QueueScheduler';
import { AnimationFrameScheduler } from 'rxjs/scheduler/AnimationFrameScheduler';
```

----------

參考資料：

* [RxJS - Operators 使用說明](http://reactivex.io/rxjs/manual/overview.html#operators)
* [快速找到 RxJS 的 import 路徑的方法](https://forum.angular.tw/t/rxjs-import/356)