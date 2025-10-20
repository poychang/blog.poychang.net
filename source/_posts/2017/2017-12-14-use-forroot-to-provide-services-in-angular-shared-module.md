---
layout: post
title: 使用 forRoot() 幫助 SharedModule 提供單一實例服務
date: 2017-12-14 15:10
author: Poy Chang
comments: true
categories: [Angular, Develop]
permalink: use-forroot-to-provide-services-in-angular-shared-module/
---
在 Angular 專案中，我們會把共用的元件(Component)、指令(Directive)、管道(Pipe)放在一個 SharedModule 中做管理，那服務(Service)呢？一般來說，我們希望服務是單一實例(Singleton Service)的狀態，但基於底層運作的方式，直接在 SharedModule 建立服務，會產生多個重複的單一實例服務，而可能引發問題，這時我們可以透過 `forRoot()` 來幫我們避免這狀況的發生。

## 模組分割

Angular 提供模組化的概念讓我們能輕鬆管理應用程式的各個功能，在官方的 [Style Guide](https://angular.io/guide/styleguide) 針對模組架構也做了相當多的建議。

根據 [Style Guide 的模組章節](https://angular.io/guide/styleguide#application-structure-and-ngmodules)，會建議我們會將 Angular 專案分成以下幾個模組：

* 共享模組 (SharedModule)
* 核心模組 (CoreModule)
* 特性模組 (FeatureModule)

>特性模組不是只做一個模組叫 `FeatureModule`，而且將多個功能特性區分成多個模組，例如 `AFeatureModule`、`BFeatureModule`。

在分割模組的時候有一點要注意，SharedModule 經常會匯入到各個子模組中，應該盡量避免在 SharedModule 中建立 App 層級的服務，因為這樣會讓每個子模組都產生自己的單一實例服務(Singleton Service)，**造成 App 中有多個一樣的單一實例服務**，而可能引發問題（如果你是刻意要這樣做，也是可以啦）。

## 提供單一實例服務

要避免 `SharedModule` 被多個子模組匯入時，產生多個單一實例服務，可以在 SharedModule 中定義一個返回 `ModuleWithProviders` 對象的靜態 `forRoot()` 方法。

`ModuleWithProviders` 對象是一個介面(Interface)，[程式碼](https://github.com/angular/angular/blob/b7a6f52d59c286ece0512fd407d4b9f2ffd9ae1d/packages/core/src/metadata/ng_module.ts#L18)定義內容如下：

```typescript
// A wrapper around a module that also includes the providers.
export interface ModuleWithProviders {
  ngModule: Type<any>;		// 模組名稱
  providers?: Provider[];	// 要註冊的服務
}
```

接下來看看` SharedModule` 和 `AppModule` 分別要怎麼寫。

### SharedModule

我們要將 App 層級的單一實例服務放在 `SharedModule` 中時，可以這樣寫：

```typescript
import { NgModule, ModuleWithProviders } from '@angular/core';
import { MyService } from './my.service';

@NgModule({
  ...
})
export class SharedModule {
  static forRoot(providers = []): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [ ...providers, MyService ]
    };
  }
}
``` 

在 SharedModule 的 ngModule 照原本的方式做宣告(`declarations`)、匯入(`imports`)、匯出(`exports`)的動作，但不處理提供服務(`providers`)，而在裡面定義一個靜態的 `forRoot()` 方法，這方法會返回 `ModuleWithProviders` 對象並包含要提供的單一實例服務。

另外，這裡的 `forRoot()` 方法可以傳入一個 `providers` 參數，這用途是讓根模組也有機會注入服務。

>`forRoot()` 方法是什麼？這是一個約定的用法，你可以把他視為一個只提供給根模組做配置的設定方法，因此我們也只能在根模組中使用 `forRoot()`。此外還有一個 `forChild()` 約定用法，給子模組做配置。

### AppModule

在根模組 `AppModule` 中，我們可以匯入 `SharedModule` 並呼叫 `forRoot()` 靜態方法，藉此註冊 `SharedModule` 要提供的服務。

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule.forRoot()
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}
```

>你可能曾經看過 `RouterModule` 也用了同樣的作法，不過他要做的是將路由設定導入給根模組。

### 子模組

透過上面的設定方式，子模組可以安心的匯入 `SharedModule` 並使用所提供的元件、指令、管道等功能，而不會因此產生另外一個服務實例。

這個技巧讓整個 Angular 專案架構更容易被管理，也使的共用模組(Shared Module)或延遲載入模組(Lazy-Loaded Module)的行為更容易被預測。

----------

參考資料：

* [Angular: Understanding Modules and Services](https://medium.com/@michelestieven/organizing-angular-applications-f0510761d65a)
* [在Angular中定義共享的Providers](http://www.bijishequ.com/detail/460120)

