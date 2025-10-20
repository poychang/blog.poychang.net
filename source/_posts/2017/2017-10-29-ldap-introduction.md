---
layout: post
title: LDAP 簡介
date: 2017-10-29 20:35
author: Poy Chang
comments: true
categories: [Dotnet, Develop]
permalink: ldap-introduction/
---
LDAP 的目錄服務，不僅可以幫助我們管理階層結構的組織或資源，對很多傳公司來說也是非常常用的驗證技術，這篇對 LDAP 做一些簡單介紹。

LDAP (Lightweight Directory Access Protocol) 是一種輕量的目綠服務協定，像是通訊錄一樣記錄人員資訊，可以拿來做帳號整合、驗證，LDAP 目錄服務通常有層級結構，像是公司組織階層。

## 資料結構

![LDAP generic schema](https://i.imgur.com/W3TRU6U.png)

LDAP 資料結構的三層概念是：`Schema`、`Object Class`、`Attribute Type`，上圖就算是一組 Schema，分別簡述如下：

* `Schema`
	* `Object Class` 的集合，透過集合相同性質的類別，描述現實中的個體的資訊
* `Object Class`
	* `Attribute Type` 的集合，每種 `Object Class` 會定義有哪些必要、可選的 `Attribute Type`
	* `Object Class` 具有繼承的關係
* `Attribute Type`
	* 描述資料的內容
	* 已鍵值（Key-Value）的方式表示

使用上述的資料結構來組成 LDAP 的樹狀結構，在 LDAP 中稱呼樹的節點為 `Entry`，一個 `Entry` 只能使用一種 `Object Class` 來表達，而葉子就是 `Attribute Type` 了，下面這張圖表達了 LDAP 目錄樹的關聯階層。

<a href="www.zytrax.com/books/ldap/ch3/" target="_blank">
  ![Directory Infomation Tree](https://i.imgur.com/gshKUHB.png)
</a>

LDAP 的 Attribute Type 很多，可以參考[這張列表](http://www.kouti.com/tables/baseattributes.htm)。

常見的項目這裡筆記一下：

<table class="table table-striped">
<thead>
  <tr>
    <th>屬性名稱</th>
	<th>全名</th>
	<th>說明</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>CN</td>
	<td>Common Name</td>
	<td>用戶名稱、單位名稱</td>
  </tr>
  <tr>
    <td>DN</td>
	<td>Distinguished Name</td>
	<td>識別名稱，絕對位置</td>
  </tr>
  <tr>
    <td>OU</td>
	<td>Organizational Unit Name</td>
	<td>組織單位名稱</td>
  </tr>
  <tr>
    <td>DC</td>
	<td>Domain Componet</td>
	<td>網域元件</td>
  </tr>
</tbody>
</table>

## 基本查詢語法

對 LDAP 伺服器，我們可以使用 LDAP 陳述式來寫查詢語法，藉此找到我們想要尋找的資源，以下做一點簡單介紹：

* `=` (等於)
	* 例如要尋找名字為 John 的所有物件，可使用：`(givenName=John)` 這會傳回所有名字為 John 的物件
	* 包括括弧是要強調 LDAP 陳述式的開始和結束
* `&` (邏輯 AND)
	* 當您有一個以上的條件，或希望序列中的所有條件皆為 True 時可使用此語法
	* 例如要尋找所有名字為 John 且住在達拉斯的人，可使用：`(&(givenName=John)(l=Dallas))`
	* 請注意每個引數都位於自己的一組括弧內
	* 整個 LDAP 陳述式必須封裝在主要的括弧組中
* `!` (邏輯 NOT)
	* 排除具有特定屬性的物件
	* 例如要尋找名字為 John 以外的所有物件，可使用：`(!givenName=John)`
	* `!` 運算子是直接放在引數的前面，和引數括弧組的裡面
* `*` (萬用字元)
	* 使用萬用字元來代表任何東西的值
	* 例如要尋找標題具有值的所有物件，可使用：`(title=*)`
	* 或是例如要尋找名字以 Jo 開頭，可使用：`(givenName=Jo*)` 來尋找這些物件

----------

參考資料：

* [解析LDAP資料結構](http://crashedbboy.blogspot.tw/2015/09/ldap.html)
* [Chapter 3. LDAP Schemas, objectClasses and Attributes](http://www.zytrax.com/books/ldap/ch3/)
* [Practical Spring LDAP, Varanasi and Balaji](http://www.books.com.tw/products/F013113991)
* [LDAP 查詢基礎](https://technet.microsoft.com/zh-tw/library/dd159860.aspx)