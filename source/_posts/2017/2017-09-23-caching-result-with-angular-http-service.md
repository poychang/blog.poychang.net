---
layout: post
title: 在 Angular 中使用 RxJS 建立 Http 服務的暫存
date: 2017-09-23 01:25
author: Poy Chang
comments: true
categories: [Typescript, Angular]
permalink: caching-result-with-angular-http-service/
---
前端向後端 API 要資料是稀鬆平常的事，而且前端可能會針對一份資料，依據不同商業邏輯做處理。然而每次處理都要發一次 HTTP Request 和 API 要資料嗎？這樣是不實際的，同一份資料為什麼要發兩次 Request 呢，因此前端需要暫存資料的需求油然而生。

>這裡假設每次向後端要的資料都是一樣的，沒有變化。如果每次要的資料都會不一樣時，不適用這篇文章。

## 測試區域

這裡內嵌了一個 iframe，以下的說明可以開啟瀏覽器的**開發人員工具**後，在這裡進行測試。

<iframe src="https://stackblitz.com/edit/angular-http-with-replaysubject?embed=1&file=app/services/regular-data.service.ts&hideExplorer=1&hideNavigation=1&view=preview" height="250" width="100%" frameborder="0"></iframe>

## 傳統做法

在 Angular 中要呼叫後端 API，只要簡單使用 HttpClient 就可以發起 HTTP Request，問題同一份 API 資料除非你在第一次呼叫時，在前端另外儲存起來，不然每次都要重新要一次。

一個 API 呼叫多次的情境我用 setInterval 來模擬。

點擊 `Regular Http Call` 按鈕後你會在 Console 中發現，在點擊 `STOP INTERVAL` 前，會一直向 API 要資料。

![Console - Regular Http Call](https://i.imgur.com/5PWf7Ey.png)

而且在 Network 中也會看到真的發出了同樣數量的 HTTP Request。

![Network - Regular Http Call](https://i.imgur.com/JDXtwuB.png)

每一次的 HTTP Request 都會耗用連線資源，如果同樣的資料只需要發一次連線需求了話，多好。

## ReplaySubject

透過 RxJS 的 Subject 可以建立一個可以被多個 Observer 訂閱的物件，並對訂閱的 Observer 們，進行組播（multicast）。

>想進一步了解 Subject 可以參考洪大的[30 天精通 RxJS(22): 什麼是 Subject？](http://ithelp.ithome.com.tw/articles/10188633)

Subject 有 4 種樣貌：

1. `Subject` 內部管理一份 Observer 的清單，並在接收到值時依據這份清單並送出值
2. `BehaviorSubject` 新訂閱時立即給出最新的值
3. `ReplaySubject` 新訂閱時重新發送最後 n 個值
4. `AsyncSubject` 在 Subject 結束後送出最後一個值

這樣我們可以使用 `ReplaySubject` 來讓訂閱他的 Observer 取得最後 1 筆資料。

>呼叫 API 所返回的資料，對 RxJS 來說不管大小、樣貌，就是 1 筆資料。 

<iframe src="https://stackblitz.com/edit/angular-http-with-replaysubject?embed=1&file=app/services/replay-subject-data.service.ts&hideExplorer=1&hideNavigation=1&view=editor" height="500" width="100%" frameborder="0"></iframe>

從上面的程式碼中主要有 3 個地方需要注意。

1. 建立 `dataObservable$` 作為 ReplaySubject，並設定會發送給訂閱者 Observer 最後 1 筆資料。
2. 使用 HttpClient 呼叫完 API 後，將取回的值透過 `next()` 交給 `dataObservable$`，意即告訴 `dataObservable$` 最新一筆資料是什麼。
3. 回傳的是 `dataObservable$`，這樣之後不管是誰取到這個 Observable 回傳值，都會是 ReplaySubject 所提供的同一筆資料。

來看看執行結果。

點擊 `ReplaySubject Http Call` 按鈕後你會在 Console 中發現，吐回了 5 次來自 API 的資料。

![Console - ReplaySubject Http Call](https://i.imgur.com/6pcR00S.png)

但是在 Network 中，卻只發出一次 HTTP Request。

![Network - ReplaySubject Http Call](https://i.imgur.com/ph9xF0p.png)

這代表之後不管是哪個 Observer 在執行訂閱時，ReplaySubject 會回放他所擁有的最後 1 筆資料，而不用是重新發起 HTTP Request。 

## ShareReplay

上面的 ReplaySubject 實作方法，是很完整的觀念實作，而 RxJS 有提供很方便用的 ShareReplay Operator，

<iframe src="https://stackblitz.com/edit/angular-http-with-replaysubject?embed=1&file=app/services/share-replay-data.service.ts&hideExplorer=1&hideNavigation=1&view=editor" height="500" width="100%" frameborder="0"></iframe>

從上面的程式碼中，寫法一是正確的，是不是簡短很多。

執行結果就跟上面 ReplaySubject 一樣，你可以動手試試看。

>如果去看 RxJS 的 [ShareReplay 原始碼](https://github.com/reactivex/rxjs/blob/master/src/operators/shareReplay.ts)，會發現他其實也是使用 ReplaySubject 來實作。

### 無效的寫法

寫法二和寫法三，分別是使用 method 和使用 getter 的方式回傳 Observable，這兩種方式都會是無效的寫法。

這裡有個重要的觀念，在使用 ShareReplay 時，Observer 觀察的 Observable 對象必須是同一個。

而使用 method 或 getter 的方式，每次回傳的 Observable 都會是不同的物件實體，這樣 Observer 的觀察對象就不一樣了，所以就每次執行時，都會發出新的 HTTP Request。

實驗看看。

點選 `Is same from wrongWayFunction?` 按鈕，在 Console 中你會看到兩個長的一模一樣的 Observable 物件，但是去比對是否為相同物件時，則會回傳 `false`。

![Is same from wrongWayFunction?](https://i.imgur.com/YQKCn2E.png)

這代表雖然他們兩個長的一樣，但是在記憶體中是不同的實體。

點選 `Is same form ShareReplay?` 按鈕，在 Console 中也是看到一模一樣的 Observable 物件，但因為這兩個物件在記憶體中是同一個實體，所以回傳 `true`。

![Is same form ShareReplay?](https://i.imgur.com/F2Yj6cE.png)

### 結論

實作 Http 服務的暫存，用 ShareReplay 要了解其背後的原理不難，同時程式碼也最簡潔。

使用 ShareReplay 時，要使用 property 建立，不能使用 method 或 getter 的回傳值。

經過上面這一連串的探討，除了知道如何在 Angular 中使用 RxJS 建立 Http 服務的暫存外，對 RxJS 又有了更深一層的了解。

----------

參考資料：

* [caching results with angular2 http service](https://stackoverflow.com/questions/34104277/caching-results-with-angular2-http-service?answertab=votes)
* [What is the correct way to share the result of an Angular 2 Http network call in RxJs 5?](https://stackoverflow.com/questions/36271899/what-is-the-correct-way-to-share-the-result-of-an-angular-2-http-network-call-in/36296015#36296015)
* [使用angular2 http服务缓存结果](https://gxnotes.com/article/129694.html)
