---
layout: post
title: 使用 oak 框架建立 Deno 網頁應用程式
date: 2020-05-26 00:29
author: Poy Chang
comments: true
categories: [Typescript, Javascript, WebAPI]
permalink: build-deno-web-app-with-oak/
---

[Deno](https://deno.land/) 是 Node.js 作者 Ryan Dahl 所打造的新的語言執行環境，可以用來執行 JavaScript 和 TypeScript 程式碼，且預設情況擁有較高的安全機制保護，在 Node.js 環境中可以使用 Express 來架設網頁應用程式，而在 Deno 環境中，官方的第三方套件庫中有個 [oak](https://deno.land/x/oak) 框架，用來讓開發者建置出小巧靈活的網頁應用程式，這篇將簡單實作範例。

oak 是一個以 Middleware 為框架主體的網頁應用程式開發框架，在 Middleware 架構下，你可以建置出多層的中介程序，而從客戶端發送至伺服器的 Http Request，則會有順序的一層一層的通過該中介程序，然後再一層一層有順序的返回 Http Response 至客戶端，完成一次 Http 呼叫。

下面來看 3 個網頁應用程式範例。

## 基本網頁

要使用 oak 來建立基本的 Deno 網頁應用程式，不用 10 行程式碼，將 oak 的 `Application` 模組匯入之後，建立一個網頁應用程式實體 `app`，並使用 `app.use()` 增加一層 Middleware 中介程序，下面範例程式碼的中介程序很簡單，就只是當伺服器收到 Http Request 時，返回的 Http Response 內容是 `Hello World` 字串。

最後一行就是在啟動此應用程式時，會監聽指定的 TCP 埠，範例中視設定 `3000`，當有人呼叫此埠號時，就會啟動此網頁應用程式。

詳細程式碼如下：

```typescript
// basic-server.ts
import { Application } from 'https://deno.land/x/oak/mod.ts';

const app = new Application();
const port = 3000;

app.use((context) => {
    context.response.body = "Hello World";
});
app.listen({ port });
```

要使用 Deno 啟動此 `basic-server.ts` 檔案的指令如下：

```bash
deno run --allow-net ./basic-server.ts
```

>Deno 預設是不准存取任何檔案、網路等資源的，因此執行 `deno run` 時，必須加上 `--allow-net` 讓執行時有存取網路的權限。

## 中介程序

接著這個範例只增加了一層 Middleware 中介程序，讓每一次 Http Request 進來時，會在將呼叫的 Http 方法和路徑輸出至終端機視窗中。

詳細程式碼如下：

```typescript
// middleware-server.ts
import { Application } from 'https://deno.land/x/oak/mod.ts';

const app = new Application();
const port = 3000;

app.use(async (context, next) => {
    console.log(`${context.request.method} ${context.request.url}`);
    await next();
});
app.use((context) => {
    context.response.body = "Hello World";
});
app.listen({ port });
```

執行時，當有使用者開啟該網頁時，終端機會記錄相關資訊，幫助我們確認 Http 呼叫的狀態，畫面如下：

![middleware-server.ts 執行時終端機所記錄的資訊的畫面](https://i.imgur.com/rE0wvkz.png)

## 路由機制

上面是基本的使用方式，通常在建立網頁應程式時，路由機制會是很重要的環節，oak 內建 `Router` 模組，讓我們輕鬆建立網頁路由，以下我們來建立簡單的 Web API 網頁應用程式。

從 oak 模組中匯入 `Router`，我們就可以建立一個路由器實體 `router`，藉此來建立各種路由設定。

Http 的七種基本方法都有支援，設定方式相當直覺，方法名稱就是函數名稱，然後傳入路徑字串和該路由要怎麼處理 Http Context 的函數即可，比較需要注意的是，若要讀取 Http Request 的 Body 內容時，所使用的 `context.request.body()` 方法是 Promise 物件，你必須要用 async await 或 Promise 的處理方式來操作。

```typescript
router
    .get('/api', (context) => { context.response.body = "API Works!"; })
    .post('/api/movies', async (context) => {
        const data = await context.request.body();
        // 處理後續資料操作
    })
```

最後將路由設定 `router.routes()` 加入中介程序中，並且加入 `router.allowedMethods()` 讓路由機制能處理所有 Http 方法，包含 GET、POST、PATCH、DELETE、PUT、OPTIONS、HEAD。

```typescript
app.use(router.routes());
app.use(router.allowedMethods());
```

較詳細程式碼如下：

```typescript
// route-server.ts
import { Application, Router } from 'https://deno.land/x/oak/mod.ts';
import { movies } from './data-service.ts';

const app = new Application();
const port = 3000;
const router = new Router();

router
    .get('/api', (context) => { context.response.body = "API Works!"; })
    .get('/api/movies', (context) => { context.response.body = Array.from(movies.values()); })
    .get('/api/movies/:id', (context) => {
        if (context.params && context.params.id && movies.has(context.params.id)) {
            context.response.body = movies.get(context.params.id);
        } else {
            context.response.body = [];
        }
    })
    .post('/api/movies', async (context) => {
        const data = await context.request.body();
        movies.set(data.value.id.toString(), { ...data.value });
        context.response.body = Array.from(movies.values());
    });

app.use(async (context, next) => {
    await next();
    console.log(`${context.request.method} ${context.request.url}`);
});
app.use(router.routes());
app.use(router.allowedMethods());
app.listen({ port });
```

如此一來用 Deno 來建置 Web API 網頁應用程式就完成了。

>本篇完整範例程式碼請參考 [poychang/demo-deno-webapp](https://github.com/poychang/demo-deno-webapp)。

## 後記

在執行 Deno 程式碼的時候，Deno 會下載程式碼中有匯入的模組，然後存放在 `C:\Users\[USER]\AppData\Local\deno\gen` 中，而且會用網址來建立就是資料夾路徑，因此如果想看看所匯入的模組程式碼，可以去這個地方查看。

另外 Deno 現在雖然才 1.0 版，但玩起來的感覺還不錯，拿來 Side Project 玩玩挺有趣的，而且他的核心特色大部分我都還滿喜歡的，有時間可以多多關注，看這個全新的生態圈能不能發展起來。

----------

參考資料：

* [10 Things I Regret About Node.js - Ryan Dahl](https://www.youtube.com/watch?v=M3BM9TB-8yA)
* [Deno Oak Tutorial | Deno REST API](https://www.youtube.com/watch?v=BAu7fnCbxAs)
