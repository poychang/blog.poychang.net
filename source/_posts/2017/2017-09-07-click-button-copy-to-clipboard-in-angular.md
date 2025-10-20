---
layout: post
title: 在 Angular 中實作一鍵複製
date: 2017-09-07 23:26
author: Poy Chang
comments: true
categories: [Typescript, Angular]
permalink: click-button-copy-to-clipboard-in-angular/
---
之前寫過一篇[只用 JavaScript 實作一鍵複製](https://blog.poychang.net/javascript-copy-clipboard/)的作法，在了解原理後，想要在 Angular 中也來實作同樣的功能，其實也很簡單唷！

>先提一下，複製、貼上這動作是由瀏覽器所提供的，所以需要使用到 `document` 和 `window` 這個瀏覽器物件。

複製文字這件事，基本上三個動作：

1. 找到目標區塊
2. 選取目標
3. 執行複製

## 找到目標區塊

使用 JavaScript 要找到 DOM 中的某段區塊，可使用 `document.querySelector()` 方法，搭配 CSS 選擇器來尋找目標區塊，這樣就可以取得所要的 DOM 節點內容。

在 Angular 中也可以使用上面的方法來尋找區塊，但更推薦的作法是使用 Angular 內部的 `DOCUMENT` Token，透過注入的方式來使用 `document` 全域物件。

>這樣的作法可以用在 AOT，或在寫測試時，可以用模擬的方式來取代全域物件。

```typescript
// 1. 載入 DOCUMENT Token
import { DOCUMENT } from "@angular/platform-browser";

// ...

// 2. 使用 Token 注入至元件中
constructor( @Inject(DOCUMENT) private dom: Document) { }

// ...

// 3. 設計選取區塊的方法
selectText(selector: string): void {
  const element = this.dom.querySelector(selector);
}
```
到目前為止，我們在 `selectText()` 裡面已經可以取到目標區塊並存在 `element` 裡面了。

>由於 `document` 和 `window` 都是瀏覽器提供的全域物件，但 Angular 只有提供 `DOCUMENT` Token 來實作注入，`window` 了話，則需要自己額外設計。
>
>為了簡化問題，這裡先直接用 `window` 全域物件來處理。

## 選取目標

### 具有 select() 方法的 DOM 元素

目前 DOM 元素中，只有 `HTMLInputElement` 和 `HTMLTextAreaElement` 有選取文字的方法 `select()`，所以針對這兩種 DOM 元素滿容易處理的，直接使用該方法就可以選到目標文字。

### 其他 DOM 元素

但除上述兩者外，我們還希望能夠複製其他 DOM 元素的文字時，就需要透過 `document.Range` 物件和 `window.getSelection()` 方法，藉此來選取目標。

這邊稍微解釋一下 `Range` 和 `Selection` 這兩個物件的差別：

* `Range` 物件所包含的是 DOM 裡面的元素，會包含節點及子節點的內容。
* `Selection` 物件則是從 Range 物件中，取得選取到的文字，如同使用者用滑鼠選取特定文字般，並記錄選取的起迄位置。

所以這兩者的運作環境是不一樣的，`Range` 在 DOM 裡面去選取區塊，而 `Selection` 比較像是瀏覽器功能列上的 `Select all` 功能，不過他不是全選，而是針對 `Range` 物件去找到選取目標。

![Select All in Web Browser](https://i.imgur.com/rX8h52p.png)

如此一來 `selectText()` 改成如下：

```typescript
// 3. 設計選取區塊的方法
selectText(selector: string): void {
  const element = this.dom.querySelector(selector);
  const isInputElement = element instanceof HTMLInputElement;
  const isTextAreaElement = element instanceof HTMLTextAreaElement;

  if (isInputElement || isTextAreaElement) {
    (element as HTMLInputElement).select();
  } else {
    let range = this.dom.createRange();
    range.selectNodeContents(element);
    let selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }
}
```

## 執行複製

複製的行為是交由瀏覽器來處理，因此需要調用 `document.execCommand()` 方法，並告訴瀏覽器要執行 `copy` 這個動作。這裡的動作很簡單，一行就可以完成，另外再加上一些狀態訊息的輸出。

```typescript
// 4.  執行瀏覽器的複製指令，複製選取到的文字
execCopy() {
  try {
    const copyStatus = this.dom.execCommand('copy');
    const message = copyStatus ? 'copied' : 'failed';
    console.log(message);
  } catch (error) {
    console.log(`${error}`);
  }
  window.getSelection().removeAllRanges();
}
```

這個方法最後調用了 `removeAllRanges()` 方法，這是取消選取的效果，讓使用者察覺不出來到底發生什麼事。

## 完整程式碼

<iframe src="https://stackblitz.com/edit/angular-copy-clipboard?embed=1&file=app/copy.component.ts&view=editor" height="400" width="100%" frameborder="0"></iframe>

----------

參考資料：

* [MDN - HTMLInputElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement)
* [MDN - HTMLTextAreaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement)
* [MDN - Range](https://developer.mozilla.org/en-US/docs/Web/API/Range)
* [MDN - getSelection](https://developer.mozilla.org/en-US/docs/Web/API/Window/getSelection)
* [MDN - execCommand](https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand)
* [How do I copy to clipboard in Angular 2 Typescript?](https://stackoverflow.com/questions/36328159/how-do-i-copy-to-clipboard-in-angular-2-typescript)
* [How to inject Document in Angular 2 service](https://stackoverflow.com/questions/37521298/how-to-inject-document-in-angular-2-service)
* [Angular2 - How to inject window into an angular2 service](https://stackoverflow.com/questions/34177221/angular2-how-to-inject-window-into-an-angular2-service)
