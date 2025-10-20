---
layout: post
title: 用 100 行程式碼建立 JavaScript 路由功能
date: 2020-04-05 07:53
author: Poy Chang
comments: true
categories: [Typescript, Javascript]
permalink: create-simple-javascipt-router-under-100-lines/
---

為了讓 SPA (Single Page Application) 單一頁面應用程式能夠實現轉跳頁面的效果，各個 SPA 前端開發框架都包含了路由功能，這樣的路由功能非常的實用，這篇我們用不到 100 行的 TypeScript 來建立自己的路由功能。

我們可以想像要做一個網頁版的路由器，那麼路由器基本上有 3 個組成元素：

1. 路由表
2. 設定路由表的動作
3. 執行路由行為

## 基礎設定

在建立路由器的之前，先處理一下所需要的設定屬性。

要在瀏覽器中使用 JavaScript 操作路由有兩種做法，第一種是使用 `window.history` 這隻[操控瀏覽器歷史紀錄](https://developer.mozilla.org/zh-TW/docs/Web/API/History_API)的 API 來達成，另一種則是使用 `window.location` 來控制當前頁面的變化，通常這種會被稱為 hash tag 模式。

但其實不管是用 `window.history` 還是 `window.location`，兩者都是使用 [URL 錨點](https://developer.mozilla.org/zh-TW/docs/Web/HTML/Element/a#attr-href)的方式，也就是使用 `#` 來作為路由值的辨識。

>`window.history` 和 `window.location` 的差別是，前者使用瀏覽器歷史紀錄來操作轉跳動作，後者則是使用瀏覽器轉址的方式來處理。

因此在建立我們的路由器時，需要指定是使用哪種模式，所以先建立以下程式碼：

```typescript
// 路由模式
const enum RouterMode {
  // 使用瀏覽器的 window.history API
    History,
    // 使用 # 辨別路由
    Hash
}

// 路由器設定選項
interface Options {
  // 設定要使用 Hash 或 History 模式
    mode: RouterMode;
    // 使用 History 模式時，設定應用程式的根路徑在哪裡
    root: string;
}
```

而路由表的內容會是一筆一筆的路由資訊，這路由資訊主要需要紀錄兩個值，路由網址路徑和訪問到該路由時要執行的動作，建立以下程式碼：

```typescript
// 路由值
interface Route {
    // 路由網址路徑
    path: string;
    // 要執行的動作
    action: Function;
}
```

## 路由器

這個 `Router` 路由器類別會根據所提供的路由器設定選項來建立路由器實體，同時在底下內部建立空的路由表，並且提供操作路由表及執行路由的動作，程式碼如下：

```typescript
class Router {
    // 路由表
    routes: Route[] = [];
    // 路由器設定選項
    private options: Options;
    // 目前的路由值
    private current: string;
    // 監聽器
    private listener: any;

    constructor(options: Options) {}

    // 增加路由設定至路由表，path 是路由網址路徑，action 要執行的動作
    add(path: string, action: Function): Router {}

    // 刪除路由表中的路由設定，path 是路由網址路徑
    remove(path: string): Router {}

    // 清空路由表
    flush(): Router {}

    // 轉跳到指定路由值
    navigate(path: string = ''): Router {}

    // 執行路由行為
    action = () => {};
}
```

路由器動作的部分我們一個個來實做，先來處理關於路由表的操作，動作相當簡單，基本上就是修改 `routes` 這個路由表屬性值。

```typescript
// 增加路由設定至路由表，path 是路由網址路徑，action 要執行的動作
add(path: string, action: Function): Router {
    this.routes.push({ path, action });
    return this;
}

// 刪除路由表中的路由設定，path 是路由網址路徑
remove(path: string): Router {
    this.routes = [...this.routes.filter(r => r.path === path)];
    return this;
}

// 清空路由表
flush(): Router {
    this.routes = [];
    return this;
}
```

再來處理路由器遇到路由值的動作，這邊我們先實作一個方法讓我們的路由器可以使用 `navigate()` 來轉跳頁面，這裡就會根據你所設定的路由模式來做處理。

>其實用 `window.history` 還是 `window.location` 沒有太大差別，效果都一樣，但我偏好用 `window.location` 語意比較清晰，所以如果要再精簡程式碼，我會把 `window.history` 拿掉。

```typescript
// 轉跳到指定路由值
navigate(path: string = ''): Router {
    if (this.options.mode === RouterMode.History) {
        window.history.pushState(null, null, `${this.options.root}#${this.clearSlashes(path)}`);
    } else {
        window.location.href = `${window.location.href.replace(/#(.*)$/, '')}#${path}`;
    }
    return this;
}

// 移除路由網址前後的 / 字符
private clearSlashes(path: string): string {
    return path
        .toString()
        .replace(/\/$/, '')
        .replace(/^\//, '');
}
```

最後這個動作是路由器的重點，當路由發生變化的時候，執行路由器執行此方法，然後觸發該路由在路由表中註冊的動作。

```typescript
// 執行路由行為
action = () => {
    const fragment = window.location.hash.slice(2); // 取得路由值
    if (this.current === fragment) return;          // 路由沒變化則直接跳出

    this.current = fragment;
    this.routes.some(route => {                     // 檢查路由表中是否有符合條件的路由值
        if (fragment.match(route.path)) {
            route.action.apply({}, []);             // 執行所註冊的路由動作
            return true;
        }
        return false;
    });
};
```

請注意，這裡使用 `Array.some()` 的方法來檢查路由表，因此路由表的順序是很重要的，會依序從陣列的索引 0 開始，一路檢查到最後，中間如果有符合條件的路由，就會執行所註冊的動作，然後後面的路由設定就直接忽略了。

>這裡用到 `window.location.hash` 這組比較新一點的 API，請參考[ Can I Use 網站](https://caniuse.com/#feat=mdn-api_url_hash)看他相於那些瀏覽器。

## 監聽路由

完成路由器的實作之前，有個問題要先解決，那就是路由器如何持續監聽路由的變化？

這點我們可以使用 `setInterval()`，設定路由器每隔一段時間就去查看路由是否有變化，如果發生變化，就執行路由動作，這行為我們包在 `activateRouterListening()` 中，並設定每 100 ms 就去檢查一次。

>根據[人類反應極限統計](https://www.humanbenchmark.com/tests/reactiontime)，人的反應約在 200 - 250 ms，所以其實設定 200 ms 檢查一次就差不多了。

啟動監聽的時機就在路由器初始化 `constructor()` 的時候，就開始執行。

```typescript
constructor(options: Options) {
    this.options = options;
    this.activateRouterListening();
}

// 啟動路由器監聽
private activateRouterListening() {
    clearInterval(this.listener);
    const listenInterval = 100;
    this.listener = setInterval(this.action, listenInterval);
}
```

## 範例

使用方式相當簡單，建立一個路由器，然後使用路由器的 `add()` 方法，逐一添加路由資訊即可。

```typescript
const router = new Router({
    mode: RouterMode.Hash,
    root: '/'
});

router
    .add('home', () => {
        console.log(`In home page (${window.location.hash})`);
    })
    .add('', () => {
        console.log(`Using general route controller (${window.location.hash})`);
    })
    .navigate('home');
```

>完整的 `Router` 以及範例程式碼請參考 [poychang/url-navigate-web-app](https://github.com/poychang/url-navigate-web-app)。

## 後記

基本上在開發網站系統的時候，還是優先使用前端開發框架所提供的路由機制，但透過這次實作，可以更加了解路由機制背後的基本行為，或許應用在小型前端專案也是可行的。

----------

參考資料：

* [How to: Create a modern Javascript Router](https://medium.com/javascript-by-doing/create-a-modern-javascript-router-805fc14d084d)
* [A modern JavaScript router in 100 lines](https://krasimirtsonev.com/blog/article/A-modern-JavaScript-router-in-100-lines-history-api-pushState-hash-url)
* [krasimir/navigo](https://github.com/krasimir/navigo)
