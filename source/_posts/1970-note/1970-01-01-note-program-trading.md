---
layout: post
title: 程式交易筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note]
permalink: note-program-trading/
---

本篇作為書籤用途，紀錄網路上的程式交易參考資料

## 取得證交所台股價格

從[台灣證卷交易所](https://www.twse.com.tw/zh/)和該網站底下的[基本市況報導網站](https://mis.twse.com.tw/stock/index.jsp)取得即時股價，以及每日收盤行情和當月各日成交資訊。

### 取得即時股價

參考下面的範例來取得即時股價。

```http
GET /stock/api/getStockInfo.jsp?json=1&delay=0&ex_ch=tse_2330.tw|tse_0050.tw HTTP/1.1
Host: mis.twse.com.tw
Content-Type: application/json
```

網址中的 `tse_2330.tw|tse_0050.tw` 就是要查詢的股票名稱，可以換成自己需要的股票。

JSON 的屬性說明：

| 欄位 | 說明                                 |
| ---- | ------------------------------------ |
| `c`  | 股票代號                             |
| `n`  | 公司簡稱                             |
| `d`  | 最近交易日期 (YYYYMMDD)              |
| `t`  | 最近成交時刻 (HH:MM:SS)              |
| `o`  | 開盤                                 |
| `h`  | 最高                                 |
| `l`  | 最低                                 |
| `z`  | 當盤成交價                           |
| `tv` | 當盤成交量                           |
| `v`  | 累積成交量                           |
| `a`  | 揭示賣價 (從低到高，以 `_` 分隔資料) |
| `b`  | 揭示買價 (從高到低，以 `_` 分隔資料) |

### 取得每日收盤行情

參考下面的範例來取得查詢日期的所有股價的 K 線價格。

```http
GET /exchangeReport/MI_INDEX?response=csv&date=20220210&type=ALL HTTP/1.1
Host: www.twse.com.tw
Content-Type: text/csv
```

替換網址中的 `date` 參數值，例如將 `20220210` 改成需要查詢的日期，就可以查詢該日期的所有股票價格。

此查詢結果會回傳 csv 格式的內容，內容包含所有上市交易的清單，以及類股指數的價格。

### 取得當月各日成交資訊

參考下面的範例來取得指定日期和股票代碼的價格資訊。

```http
GET /exchangeReport/STOCK_DAY?response=csv&date=20210510&stockNo=2330 HTTP/1.1
Host: www.twse.com.tw
Content-Type: text/csv
```

替換網址中的 `date` 以及 `stockNo` 參數值，就可以查詢該股票在當日的成交資訊。

此查詢結果會回傳 csv 格式的內容，內容包含股票當月各日成交資訊。

資料欄位：

```csv
日期,成交股數,成交金額,開盤價,最高價,最低價,收盤價,漲跌價差,成交筆數
```

---

參考資料：

- [[C#] 取得證交所台股價格的 3 種實用方法(附範例下載)](https://ithelp.ithome.com.tw/m/articles/10258478)
