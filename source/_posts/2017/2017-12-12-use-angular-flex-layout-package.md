---
layout: post
title: 使用 Angular Flex-Layout 輔助版面布局
date: 2017-12-12 22:12
author: Poy Chang
comments: true
categories: [Angular]
permalink: use-angular-flex-layout-package/
---
強大的 Angular 團隊在 Github 上有個專案叫做 [angular/flex-layout](https://github.com/angular/flex-layout)，將 FlexBox CSS 包裝成一個個 Directive 來使用，這個 Flex Layout 專案輔助 Angular (v4.1 以上版本) 用更方便的方式來佈局 HTML 樣板。

>因為 [angular/material2](https://github.com/angular/material2) 不包含 Flex 版面佈局系統，如果想要在 Material2 進行排版時，可以安裝 [angular/flex-layout](https://github.com/angular/flex-layout) 此工具來處理版面布局。 

從 [caniuse](https://caniuse.com/#feat=flexbox) 可以看到目前各大瀏覽器都支援 FlexBox CSS 樣式，但請注意 IE 10 以上版本僅部分支援。

## 安裝

要在 Angular CLI 專案使用相當簡單，只有兩個步驟：

1. 安裝套件指令：`npm install @angular/flex-layout`
2. 將 Angular Flex-Layout 匯入至 `app.module` 中
	```typescipt
	// src/app/app.module.ts
	
	import {NgModule} from '@angular/core';
	import {FlexLayoutModule} from '@angular/flex-layout';
	@NgModule({
	  imports: [FlexLayoutModule],
	  ...
	})
	export class PizzaPartyAppModule {}
	```

官方 Wiki 連結：[Using Angular CLI](https://github.com/angular/flex-layout/wiki/Using-Angular-CLI)

## Angular Flex Layout 簡介

Angular Flex Layout 底層使用 FlexBox CSS + mediaQuery 達成版面布局的設計，FlexBox 的基本模型請參考下圖：

![CSS3 FlexBox 模型](https://i.imgur.com/vdOtzAr.jpg)

FlexBox 主要角色為主容器（flex-container）和子元素（flex-item），主容器來包各項子元素並控制子元素的排列方式。

## 使用方式

從[文件](https://github.com/angular/flex-layout/wiki)中，HTML API 可以分出以下三類：

* 容器類 Containers
* 子元素類 Child Elements within Containers
* 特殊響應功能 Special Responsive Features

### 容器類 Containers

建立一個 FlexBox 容器，其中可包含一個以上的巢狀 Flex 子元素。

* `fxLayout`
	* 控制容器內子元素的排版方向
	* 範例：`<div fxLayout="row" fxLayout.xs="column"> </div>`
	* 設定值：`row`、`column`、`row-reverse`、`column-reverse`、`wrap`
		* `row`：預設值，由左到右，從上到下
		* `column`：從上到下，再由左到右
		* `row-reverse`：與 row 相反
		* `column-reverse`：與 column 相反
		* `wrap`：多行
* `fxLayoutWrap`
	* 控制容器內子元素的排版方式採用多行方式排列
	* 範例：`<div fxLayoutWrap> </div>`
* `fxLayoutGap`
	* 控制容器內子元素的間隔
	* 範例：`<div fxLayoutGap="10px"> </div>`
	* 設定值：可接受這些單位 %、px、vw、vh
* `fxLayoutAlign`
	* 控制容器內子元素的對齊方式
	* 範例：`<div fxLayoutAlign="start stretch"> </div>`
	* 設定值：
		* main-aixs: `start`、`center`、`end`、`space-around`、`space-between` 
		* cross-axis: `start`、`center`、`end`、`stretch`

### 子元素類 Child Elements within Containers

* `fxFlex`
	* 控制子元素大小，以及如何自動增長或收縮大小
	* 範例：`<div fxFlex="1 2 calc(15em + 20px)"></div>`
	* 設定值：
		* 可接受這些單位 %、px、vw、vh
		* 設定值順序：`<grow> <shrink> <basis>`
* `fxFlexOrder`
	* 定義排列順序
	* 範例：`<div fxFlexOrder="2"></div>`
	* 設定值：int
* `fxFlexOffset`
	* 設定子元素的偏移
	* 範例：`<div fxFlexOffset="20px"></div>`
	* 設定值：可接受這些單位 %、px、vw、vh
* `fxFlexAlign`
	* 如同 `fxLayoutAlign` 一樣，但只對該子元素有效
	* 範例：`<div fxFlexAlign="center"></div>`
	* 設定值：`start`、`baseline`、`center`、`end`
* `fxFlexFill`
	* 最大化子元素，將子元素的 width 和 height 撐到最大
	* 範例：`<div fxFlexFill></div>`

當中 `fxFlex` 有很大的變化彈性可以設定，他由三個屬性組合而成，依照先後順序分別是 `flex-grow`、`flex-shrink` 和 `flex-basis`，三個屬性的解釋如下：

* `flex-grow`
	* 當子元素的 flex-basis 長度**小於**它從父元素分配到的長度，按照數字做相對應的**伸展**比例分配
	* 數字，無單位，預設值為 1，設為 0 的話不會進行彈性變化，不可為負值
* `flex-shrink`
	* 當子元素的 flex-basis 長度**大於**它從父元素分配到的長度，按照數字做相對應的**壓縮**比例分配
	* 數字，無單位，預設值為 1，設為 0 的話不會進行彈性變化，不可為負值
* `flex-basis`
	* 子元素的基本大小，作為父元素的大小比較基準
	* 預設值為 0，flex-basis 也可以設為 auto，表示子元素以自己的基本大小為單位

### 特殊響應功能 Special Responsive Features

FlexBox CSS 本身無法控制 DOM 的顯示與否，透過此特殊響應功能，方便我們控制容器或子元素的顯示。 

* `fxShow`
	* 設定顯示條件
	* 範例：`<div fxShow [fxShow.xs]="isVisibleOnMobile()"></div>`
* `fxHide`
	* 設定隱藏條件
	* 範例：`<div fxHide [fxHide.gt-sm]="isVisibleOnDesktop()"></div>`
* `ngClass`
	* 強化 Angular 中 `ngClass` 的樣式設定
	* 範例：`<div [ngClass.sm]="{'fxClass-sm': hasStyle}"></div>`
* `ngStyle`
	* 強化 Angular 中 `ngStyle` 的樣式設定
	* 範例：`<div [ngStyle.xs]="{'font-size.px': 10, color: 'blue'}"></div>`

## 響應斷點

<a href="https://i.imgur.com/PkWCZP1.png" target="_blank">
  ![版面斷點](https://i.imgur.com/PkWCZP1.png)
</a>

響應式的關鍵在於控制斷點，上圖中間藍色那行就是定義斷點的範圍，而在上面的範例中你可能會看到像是 `fxLayout.xs` 這樣的寫法，這就是在控制主容器在 `xs` 斷點下的布局方式，斷點設定方式及適用範圍請參考下表：

<table class="table table-striped">
<thead>
  <tr>
    <th>斷點</th>
	<th>適用範圍</th>
  </tr>
</thead>
<tbody>
  <tr>
	<td>xs</td>
	<td>width < 600px</td>
  </tr>
  <tr>
	<td>sm</td>
	<td>600px <= width < 960px</td>
  </tr>
  <tr>
	<td>md</td>
	<td>960px <= width < 1279px</td>
  </tr>
  <tr>
	<td>lg</td>
	<td>1280px <= width < 1919px</td>
  </tr>
  <tr>
	<td>xl</td>
	<td>1920px <= width < 5000px</td>
  </tr>
  <tr>
	<td></td>
	<td></td>
  </tr>
  <tr>
	<td>lt-sm</td>
	<td>width <= 599px</td>
  </tr>
  <tr>
	<td>lt-md</td>
	<td>width <= 959px</td>
  </tr>
  <tr>
	<td>lt-lg</td>
	<td>width <= 1279px</td>
  </tr>
  <tr>
	<td>lt-xl</td>
	<td>width <= 1919px</td>
  </tr>
  <tr>
	<td></td>
	<td></td>
  </tr>
  <tr>
	<td>gt-xs</td>
	<td>width >= 600px</td>
  </tr>
  <tr>
	<td>gt-sm</td>
	<td>width >= 960px</td>
  </tr>
  <tr>
	<td>gt-md</td>
	<td>width >= 1280px</td>
  </tr>
  <tr>
	<td>gt-lg</td>
	<td>width >= 1920px</td>
  </tr>
</tbody>
</table>

>這裡你會看到 `lt` 和 `gt` 這樣的前綴詞，分別是代表 less then 和 greater then 的意思。

## 後記

這個套件雖然還沒有 release 版，不過滿方便使用的，比起自己寫 FlexBox CSS 方便多了。大部分的功能使用 Directive 來設定布局，但除此之外，還提供了可程式化的 JavaScript API 功能，十分強大呀。

>我另外做了張 [Angular Flex-Layout Cheat Sheet](https://blog.poychang.net/angular-flex-layout-cheat-sheet/)，提供給有需要的開發者們。

----------

參考資料：

* [Angular Material 課程之佈局篇 (一) : 佈局簡介](https://segmentfault.com/a/1190000007215707)
* [angular4 Flex Layout開發實踐](http://blog.csdn.net/j_bleach/article/details/77513213)
* [Material Layout Principles](https://material.io/guidelines/layout/principles.html)
* [深入解析 CSS Flexbox](http://www.oxxostudio.tw/articles/201501/css-flexbox.html)
* [Flexbox in CSS](http://cssreference.io/flexbox/)
* [理解 CSS Flexbox](https://github.com/neal1991/articles-translator/blob/master/%E7%90%86%E8%A7%A3CSS%20Flexbox.md)
* [Angular Connect - Responsive Layouts with @angular/Flex-Layout](https://www.youtube.com/watch?v=geqjUtKJX5s)
