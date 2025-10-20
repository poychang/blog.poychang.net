---
layout: post
title: 查詢/分析 Application Insights 所記錄的遙測資料 
date: 2018-07-24 23:33
author: Poy Chang
comments: true
categories: [Azure]
permalink: how-to-query-and-analytics-application-insights-log/
---
Azure Application Insights 是一個應用程式遙測工具，可以幫助開發者輕鬆的深入了解應用程式和資源的運作，運作的過程中會將收集到的遙測資料紀錄在 Azure 雲端平台中，我們可以簡單的從 Azure 平台搜尋過去發生的事件，也可以透過 Azure Log Analytics 這一套功能強大的視覺效果與分析工具，協助開發者或 IT 管理員輕易地掌握所記錄的遙測資訊。

## 搜尋

在 Application Insights 介面上的**搜尋**頁籤中，我們可以在搜尋欄位中輸入關鍵字進行查詢，或者透過上方工具列的設定篩選條件，找出符合條件的遙測資料，在大部分的情況下，這樣能夠滿足基本的資料搜尋需求。

![在 Application Insights 中搜尋](https://i.imgur.com/V6k03Kq.png)

## 分析

但如果所收集到的資料來自多個應用程式，或是遙測資料有自定義的欄位或事件時，基本的搜尋功能可能就無法滿足我們的需求了，Azure Log Analytics 就是另一個分析工具的利器。

在 Application Insights 上方的工具列中，有個**分析**按鈕，點擊他會轉到 Azure Log Analytics 平台，並開啟該 Application Insights 資源。

![Azure Application Insights 在](https://i.imgur.com/4vguPsH.png)

這時你可以直接開新分頁，會新增一個查詢該 Application Insights 資源的查詢介面。

![在 Azure Log Analytics 平台中開新分頁](https://i.imgur.com/xBRFeoa.png)

版面左側是該 Application Insights 資源的事件類型，如果有玩過資料庫的開發者，你可以把它比你做資料庫中資料表，每個資料表中有各自的資料欄位。

右方上下視窗分別是輸入查詢語法及查詢結果。

![Azure Log Analytics 介面](https://i.imgur.com/lrCY4iR.png)

## 分析語法

Azure Log Analytics 的查詢語法和 SQL 的觀念是一樣的，以下舉幾個例子做說明，同時你也可以連到 [Azure Log Analytics Playground](https://analytics.applicationinsights.io/demo#/) 玩玩看：

* 查詢資料表中指定欄位的資料，並用時間做排序

  ```sql
  -- SQL 語法
  SELECT name, resultCode FROM dependencies
  ORDER BY timestamp asc
  ```

  ```cs
  // Log Analytics 語法
  dependencies
  | project name, resultCode
  | order by timestamp asc nulls last
  ```
* 指定欄位起始字串，並且使用日期區間來過濾資料

  ```sql
  SELECT * FROM dependencies
  WHERE timestamp
  BETWEEN '2016-10-01' AND '2016-11-01'
  ```

  ```cs
  dependencies
  | where type startswith "Azure"
  | where timestamp > datetime(2018-07-01)
      and timestamp <= datetime(2018-07-31)
  ```
* 分別對兩個資料表做時間過濾，再將兩者做聯集

```sql
SELECT * FROM dependencies WHERE timestamp > ...
UNION
SELECT * FROM exceptions WHERE timestamp > ...
```

```cs
dependencies
| where timestamp > ago(1d)
| union (exceptions | where timestamp > ago(1d))
```

透過以上的例子，可以看出 Azure Log Analytics 的查詢語法和我們常用的資料庫查詢語言 SQL 的使用思維是接近的，透過 `|` 符號將條件串聯，並提供更多語意清出的方法（例如 `ago()` 方法），讓我們可以更容易表達出我們想要查詢的條件。

更多關於 SQL 查詢語法轉換成 Azure Log Analytics 的查詢語法範例，請參考 [SQL to Analytics language cheat sheet 這份檔案](https://aka.ms/sql-analytics)。

>如果有到 [Azure Log Analytics Playground](https://analytics.applicationinsights.io/demo#/) 跟著玩玩看，會發現這個平台提供了優秀的智慧提示，會預測你接下來可能會想打那些條件指令。

## 結語

Application Insights 收集了數量龐大，維度多元的遙測資料，如何將這些數據轉換成有價值的資訊，是一個需要花時間研究的議題，搭配 Azure Log Analytics 強大的查詢工具，能讓我們更輕鬆的在茫茫數據海中找到，有價值的數據，進而回饋給我們作為監控、預測或開發更高品質的程式。

## 後記

下面這個查詢語法很好用，主要是查 30 分鐘內的事件，並且每 5 分鐘做一個計數的區間，用 `events_count` 這個欄位名稱來存放值。

```cs
Event
| where TimeStamp > ago(30m)
| summarize events_count=count() by bin(TimeGenerated, 5m) 
```

參考資料在這 [依時間間隔的彙總與貯體處理](https://docs.microsoft.com/zh-tw/azure/azure-monitor/log-query/datetime-operations?WT.mc_id=AZ-MVP-5003022#aggregations-and-bucketing-by-time-intervals)。

另外，如果你要使用 Application Insights 的 REST API 來查詢資料了話，可以參考[這個官方網站](https://dev.applicationinsights.io/quickstart)，有介紹如何使用 Application Insights 的 REST API 搭配上述介紹到的 Query 語法來查詢資料，滿好用的。

----------

參考資料：

* [什麼是 Azure Log Analytics](https://docs.microsoft.com/zh-tw/azure/log-analytics/log-analytics-overview?WT.mc_id=AZ-MVP-5003022)
* [Getting Started with the Analytics Portal](https://docs.loganalytics.io/docs/Learn/Getting-Started/Getting-started-with-the-Analytics-portal)
* [Application Insights 中分析的教學課程](https://docs.microsoft.com/zh-tw/azure/application-insights/app-insights-analytics-tour?WT.mc_id=AZ-MVP-5003022)
* [Query Language Reference](https://docs.loganalytics.io/docs/Language-Reference)
* [SQL to Analytics language cheat sheet](https://aka.ms/sql-analytics)
