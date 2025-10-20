---
layout: post
title: 如何在 Angular 初始化前，呼叫 API 取得設定檔
date: 2017-12-15 22:38
author: Poy Chang
comments: true
categories: [Angular, Develop]
permalink: execute-http-call-when-angular-initialize/
---
有時候我們希望能在應用程式執行前先取得設定檔，然後應用程式再根據設定檔去做對應的動作，Angular CLI 專案有準備 environment 設定檔讓我們使用，但有些情況我們希望從遠端，例如透過呼叫 API 的方式，取得設定值，這時候開怎麼做呢？

## Router Resolver

如果有使用路由模組，可以藉由實作一個 Resolver，讓使用者在進入該路由所導向的頁面前，先執行該 Resolver 內的 `resolve()` 方法，這裡就可以使用 HttpClient 呼叫 API，接著你就可以取得你想要的設定值做處理。

>相關使用方法請參考 [CK's Notepad - Angular Router Resolve](https://blog.kevinyang.net/2016/12/11/ng2-router-resolve/)。

但這方法必須要設定每個路由都要執行該 Resolver，然後在每個路由頁面都要寫取得該設定值的動作，而且這樣做會每切換一次路由，就呼叫一次 API。

我們希望能在應用程式層級，只做一次取得遠端設定檔的作業就好，該怎麼做呢？

## APP_INITIALIZER

Angular 提供了用於配置系統初始化相關作業的 Token，[APP_INITIALIZER](https://github.com/angular/angular/blob/b14c2d1568f9cc634c18fe1ee77a647aa57a012a/packages/core/src/application_init.ts#L18)。當應用程序初始化時，Angular 會將執行 `APP_INITIALIZER` 所提供的功能，該功能可以藉由返回 Promise，讓應用程式能接續執行各項初始化作業，同時你也可以使用現有的服務和框架功能。

因此我們可以藉由擴充 `APP_INITIALIZER` 的功能，達到想要在初始化前呼叫 API 取得設定檔的目的。

### 自訂 ConfigService

首先建立一個 `ConfigService` 服務，主要功用在於呼叫 Http API 取得設定檔（這裡是用隨便一個 JSON API），這裡有三個重點要提一下：

1. 使用自訂的 `ConfigModel` 型別，讓強型別幫助你之後取用設定值
2. 不希望這個設定值被之後的使用所修改到，因此使用 private 建立 `_config` 私有欄位，並搭配 getter 來開放外部的存取
3. `load()` 方法必須回傳 Promise 物件，讓 `APP_INITIALIZER` 能藉此依序執行各項初始化作業，並且在這裡透過 `then()` 將從 API 取到的設定值保存到 `_config` 中

```typescript
@Injectable()
export class ConfigService {
  private _config: ConfigModel;
  get config() { return this._config; }

  constructor(private http: HttpClient) { }

  load(): Promise<any> {
    return this.http.get<ConfigModel>('https://jsonplaceholder.typicode.com/users/1')
      .toPromise()
      .then(data => this._config = data);
  }
}
```

### 修改 AppModule

接著在 `AppModule` 中，註冊剛剛建立的 `ConfigService`，並設定初始化時我們想要執行的動作。

這邊的重點在於如何在 Provider 中註冊 `APP_INITIALIZER` Token，一樣有三個重點要說明：

1. 請使用 [FactoryProvider](https://angular.io/api/core/FactoryProvider) 模式來配置
2. `useFactory` 需要設定一個產生該 Token 值的 function 方法，這裡用 Arrow Function 來表達，而 `deps` 用於設定工廠函數 `useFactory` 的依賴對象
3. 將 `multi` 設定成 `true`，讓我們可以使用相同的 Token 去註冊多個 Provider，而不失去各個 Provider 所產生的值

```typescript
...
import { APP_INITIALIZER } from '@angular/core';
import { ConfigService } from './config.service';
...

@NgModule({
  imports: [BrowserModule, HttpClientModule],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  providers: [ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: (configService: ConfigService) => function () { return configService.load() },
      deps: [ConfigService],
      multi: true
    }]
})
export class AppModule { }
```

>`multi` 會告訴 Angular 的相依性注入系統是否可以用同一個 Token 來註冊，若設定成 `false`，共用 Token 註冊 Provider，會造成後面註冊的 Provider 將會覆蓋前面已註冊的 Provider。

如此一來，就完成在應用程式初始化時呼叫 API 取得設定檔，之後要使用該設定檔，只要直接注入我們自訂的 `ConfigService` 去取得設定值即可，而且這將不會造成運作上的延遲，確保需要設定值的方法一定能取到設定值。

## 本篇完整範例程式碼

<iframe src="https://stackblitz.com/edit/angular-app-initializer-load-config?embed=1&file=app/app.module.ts&view=editor" height="500" width="100%" frameborder="0"></iframe>

----------

參考資料：

* [Angular 2 Multi Providers](https://segmentfault.com/a/1190000008626215)
* [Angular 2 Provider](https://segmentfault.com/a/1190000008626130)
* [Reading data before application startup in Angular 2](https://gist.github.com/fernandohu/122e88c3bcd210bbe41c608c36306db9)
* [How to execute Angular2 code before any rendering](https://gillespie59.github.io/2016/12/04/angular2-code-before-rendering.html)

