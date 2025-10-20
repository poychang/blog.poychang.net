---
layout: post
title: 使用 Postman 取得 Token 並設定至環境變數中
date: 2019-09-16 12:00
author: Poy Chang
comments: true
categories: [Javascript, WebAPI, Tools]
permalink: using-postman-fetch-and-set-environment-variables/
---

Postman 幫助開發人員在開發時期能夠快速測試 Web API 的功能是否正確運作，而很多時候我們的 API 設計，會因為安全性的關係，在呼叫時必須夾帶 Token 資訊，以驗證呼叫端是否有權限使用該 API，所以會先呼叫一隻驗證身份並回傳 Token 的 API，再將該 Token 放到其他呼叫 API 的 HTTP Request 中去使用，這篇將介紹兩種在此情境下，加速測試時期使用 Token 的作法。

## 使用環境變數

在測試的時候，這個 Token 通常只會取一次，所以我們可以在 Postman 的環境變數中建立 Token 變數來存放，而呼叫 API 時直接在 HTTP Header 或 Body 中調用該變數即可。

我們可以從在下圖的右側點選齒輪符號，來建立屬於我們自己的環境變數，例如下圖的 `accessToken` 這個環境變數，便是每次呼叫 [Imgur](https://imgur.com) 的 API 時，要塞到 HTTP Header 中的 Token 變數。

![Postman 的環境變數](https://i.imgur.com/MblcVvs.png)

有了環境變數，我們就可以透過 <pre>{{accessToken}}</pre> 像這樣的方式來調用環境變數，從下圖的 HTTP Header 中可以看到我們調用了 `accessToken` 這個環境變數。

![使用 Postman 環境變數](https://i.imgur.com/BsL4m2O.png)

如此一來，我們只要做一次身分驗證，將取得的 Token 設定至環境變數中，就可以一直調用同一組 Token 了。

## 使用測試腳本

上面解決的重複使用的問題，但每隔一段時間，就要將取回的 Token 複製/貼上到環境變數中，還是會有點繁瑣，這時我們可以利用 Postman 的 `Tests` 測試腳本來製作自動化設定。

在 Postman 每次呼叫 API 前後，我們是可以使用 JavaScript 來撰寫要執行的動作腳本，你可以從下圖中間找到 `Pre-req.` 和 `Tests` 兩個頁籤，這分別代表**執行呼叫 API 前**以及**執行呼叫 API 後**，兩個階段的動作，我們就是藉由 `Tests` 會在執行呼叫 API 並取得所需的 JSON 資訊後，將所需要的 Token 設定至 `accessToken` 這個環境變數中。

![呼叫前後執行腳本](https://i.imgur.com/NnydvE5.png)

所使用的 JavaScript 語法很簡單，請參考下面程式碼：

```js
var data = pm.response.json();
pm.environment.set("accessToken", data.access_token);
```

基本上就是透過 `pm` 這個 Postman 的全域變數，取得呼叫 API 後的回應 JSON 資訊，並設定當前的環境中 `accessToken` 這個環境變數。

![使用測試腳本取得回傳的 JSON 資訊](https://i.imgur.com/Wfup1XE.png)

如此一來，在執行完取得 Token 的 API 後，就會自動更新環境變數中的值了，我們有就不用一直手動複製/貼上 Token 了。

----------

參考資料：

* [Using Postman Environment Variables & Auth Tokens](https://medium.com/@codebyjeff/using-postman-environment-variables-auth-tokens-ea9c4fe9d3d7)
