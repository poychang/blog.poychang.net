---
layout: post
title: 使用 Bootstrap 4 顯示/隱藏 HTML 元素
date: 2017-08-25 16:55
author: Poy Chang
comments: true
categories: [Uncategorized]
permalink: visible-and-hidden-in-bootstrap-4/
---
Bootstrap 千呼萬喚來到了 v4 beta，裡面除了提供更好看的元件外，以提供了許多好用個工具，讓排版變得更輕鬆，這對 CSS 苦手的我，真是一大福音，但是使用的時候發現一個問題，前幾版都有的 `visible` 和 `hidden` 類別好像變得不容易用了...

在 Bootstrap 3 的時候，有 [Responsive Utilities](https://getbootstrap.com/docs/3.3/css/#responsive-utilities) 讓我們控制響應式顯示，可以參考下表來設定。

![Bootstrap 3 - Responsive Utilities ](http://i.imgur.com/Vzzhy7N.png)

很方便對吧！

到了 Bootstrap 4-alpha 的時候，改成用 [Display Property](https://v4-alpha.getbootstrap.com/utilities/display-property/) 來做控制，而 [Bootstrap 4 Beta](https://getbootstrap.com/docs/4.0/utilities/display/) 也依照這樣的方式繼續走下去。

這樣做也不會說不好，保留了更多彈性去使用，只是對我這位 CSS 苦手來說有一點不直覺，所以整理了最下面的表格，方便我之後使用。

## Display 通用類別

Display 通用類別，可用於切換元件的顯示與否，並且可以包含響應式設定，基本的變化如下：

<table class="table table-striped">
<thead>
  <tr>
    <th>CSS Class</th>
	<th>說明</th>
  </tr>
</thead>
<tbody>
  <tr>
	<td>d-none</td>
	<td>不顯示也不佔空間</td>
  </tr>
  <tr>
	<td>d-inline</td>
	<td>行內並排容器，大小以內容物判定</td>
  </tr>
  <tr>
	<td>d-inline-block</td>
	<td>行內塊狀容器，大小以內容物判定，可設定寬高、上下外距等屬性</td>
  </tr>
  <tr>
	<td>d-block</td>
	<td>塊狀容器，大小以空間判定，可設定寬高、上下外距等屬性</td>
  </tr>
  <tr>
	<td>d-table</td>
	<td>表格容器</td>
  </tr>
  <tr>
	<td>d-table-cell</td>
	<td>表格元素容器</td>
  </tr>
  <tr>
	<td>d-flex</td>
	<td>塊級伸縮容器</td>
  </tr>
  <tr>
	<td>d-inline-flex</td>
	<td>行內級伸縮容器</td>
  </tr>
</tbody>
</table>

## 搭配響應式的類型做變化

有了 Display 通用類別，再搭配響應式的設定，就可以做出響應式顯示/隱藏 HTML 元素的功能。

<table class="table table-striped">
<thead>
  <tr>
    <th>BS 3</th>
	<th>BS 4</th>
	<th>備註</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>hidden-xs-down</td>
	<td>d-none d-sm-block</td>
	<td></td>
  </tr>
  <tr>
    <td>hidden-sm-down</td>
	<td>d-none d-md-block</td>
	<td></td>
  </tr>
  <tr>
    <td>hidden-md-down</td>
	<td>d-none d-lg-block</td>
	<td></td>
  </tr>
  <tr>
    <td>hidden-lg-down</td>
	<td>d-none d-xl-block</td>
	<td></td>
  </tr>
  <tr>
    <td>hidden-xl-down</td>
	<td>d-none</td>
	<td>(same as hidden)</td>
  </tr>
  <tr>
    <td>hidden-xs-up</td>
	<td>d-none</td>
	<td>(same as hidden)</td>
  </tr>
  <tr>
    <td>hidden-sm-up</td>
	<td>d-sm-none</td>
	<td></td>
  </tr>
  <tr>
    <td>hidden-md-up</td>
	<td>d-md-none</td>
	<td></td>
  </tr>
  <tr>
    <td>hidden-lg-up</td>
	<td>d-lg-none</td>
	<td></td>
  </tr>
  <tr>
    <td>hidden-xl-up</td>
	<td>d-xl-none</td>
	<td></td>
  </tr>
  <tr>
    <td>hidden-xs</td>
	<td>d-none d-sm-block</td>
	<td>(only)</td>
  </tr>
  <tr>
    <td>hidden-sm</td>
	<td>d-block d-sm-none d-md-block</td>
	<td>(only)</td>
  </tr>
  <tr>
    <td>hidden-md</td>
	<td>d-block d-md-none d-lg-block</td>
	<td>(only)</td>
  </tr>
  <tr>
    <td>hidden-lg</td>
	<td>d-block d-lg-none d-xl-block</td>
	<td>(only)</td>
  </tr>
  <tr>
    <td>hidden-xl</td>
	<td>d-block d-xl-none</td>
	<td>(only)</td>
  </tr>
  <tr>
    <td>visible-xs</td>
	<td>d-block d-sm-none</td>
	<td>(only)</td>
  </tr>
  <tr>
    <td>visible-sm</td>
	<td>d-none d-sm-block d-md-none</td>
	<td>(only)</td>
  </tr>
  <tr>
    <td>visible-md</td>
	<td>d-none d-md-block d-lg-none</td>
	<td>(only)</td>
  </tr>
  <tr>
    <td>visible-lg</td>
	<td>d-none d-lg-block d-xl-none</td>
	<td>(only)</td>
  </tr>
  <tr>
    <td>visible-xl</td>
	<td>d-none d-xl-block</td>
	<td>(only)</td>
  </tr>
</tbody>
</table>

整理完後，仿造原本的表格樣式做一個對照表。

<a href="http://i.imgur.com/iP6aSjb.png" target="_blank">
  ![](http://i.imgur.com/anBVU2q.png)
</a>

----------

參考資料：

* [Bootstrap - Visibility](https://getbootstrap.com/docs/4.0/utilities/visibility/)
* [Missing visible-** and hidden-** in Bootstrap v4](https://stackoverflow.com/questions/35351353/missing-visible-and-hidden-in-bootstrap-v4)
* [Bootstrap 4 Hidden & Visible](https://medium.com/wdstack/bootstrap-4-hidden-visible-dd969a4c5854)
* [CSS 基本Display屬性](http://archerworkshop.info/cssdisplay/)