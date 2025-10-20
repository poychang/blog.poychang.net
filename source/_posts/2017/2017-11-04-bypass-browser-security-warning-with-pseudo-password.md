---
layout: post
title: 繞過瀏覽器中密碼的不安全警告檢查
date: 2017-11-04 22:12
author: Poy Chang
comments: true
categories: [Develop]
permalink: bypass-browser-security-warning-with-pseudo-password/
---
2017 年起 Chrome 56、Firefox 51 以上版本的瀏覽器會將收集密碼的網頁標示為不安全，除非你使用 HTTPS 開啟該網頁，對於沒有 SSL 保護的小型網站（尤其是企業內部的小網站）造成了一點點困擾，而資訊人員總不想被人挑戰安全性議題，因此有個小撇步可以繞過這安全性檢查。

>最好的作法還是使用 SSL 幫你的網站做好連線保護。

目前的機制是網頁內包含密碼的輸入欄位，都會觸發這項新的安全性警告。因此只要避掉 `<input type="password" />` 這樣的用法即可。

這裡使用 [noppa/text-security](https://github.com/noppa/text-security) 把密碼欄位改成單純的 text，然後用特殊字型讓它看起來像密碼欄位。

使用方式很簡單：

1. 安裝套件 `npm install text-security`
2. 在 index.html 引用
```
<link rel="stylesheet" type="text/css" href="node_modules/text-security/dist/text-security.css">
```

3. 新增 CSS 類別
```
.conceal {
  font-family: 'text-security-disc' !important;
}
```

4. 修改 input 類型，從 password 改成 text
```html
<input type="text" class="conceal" />
```

打完收工！

## 後記

以上只能暫時緩解問題，因為從 Chrome 62 起，只要是未加密的HTTP網頁上含有資料輸入欄位都會被標示為「不安全」（Not secure），而在無痕視窗（Incognito mode）中出現的所有HTTP網頁則皆會被標示為不安全。

----------

參考資料：

* [Google 檢查網站連線是否安全](https://support.google.com/chrome/answer/95617?hl=zh-Hant)
* [Bypassing Browser Security Warnings with Pseudo Password Fields](https://www.troyhunt.com/bypassing-browser-security-warnings-with-pseudo-password-fields/)
* [noppa/text-security](https://github.com/noppa/text-security)
* [自Chrome 62起，所有需填資料的HTTP網頁都會被標示為「不安全」](https://www.ithome.com.tw/news/113782)