---
layout: post
title: 理解 SECS/GEM 基礎架構
date: 2026-07-23 14:00
author: Poy Chang
comments: true
categories: [IoT, Concept]
permalink: about-secs-gem/
---

SECS/GEM 是半導體製造的核心骨幹，使主機系統與設備之間能夠進行無縫通訊，並且能夠實現自動化生產流程。本文將介紹 SECS/GEM 的基本概念、架構以及其在半導體製造中的應用。

## SECS/GEM 的基本概念

SECS，全名為 SEMI Equipment Communications Standard，是一個通訊協議家族，主要用於半導體製造設備與主機系統之間的通訊。這個協議家族由 SEMI（半導體設備與材料國際協會）制定，SECS 通訊協議家族其實包含三個標準：

- SECS-I（SEMI E4）：透過 RS-232/RS-422 傳輸
- HSMS（SEMI E37）：透過 TCP/IP 傳輸
- SECS-II（SEMI E5）：訊息結構

GEM 全名為 Generic Equipment Model，是 SEMI E30 標準，是一個設備模型標準，定義了設備的功能、狀態以及與主機系統的互動方式。GEM 使得不同廠商的設備能夠以一致的方式與主機系統進行通訊，從而實現自動化生產流程。

另外，GEM 是屬於 SECS-II 的一個子集，完全依賴 SECS-II 訊息結構來實作它的所有功能，GEM 明確定義了在什麼情況下要用哪一個 SECS II 訊息結構。正確的理解方式是 SECS-II 是「語言」，GEM 是「語言的使用規範」。

GEM 主要功能和層次示意圖如下：

![GEM 主要功能/層次示意](https://files.poychang.net/storage/about-secs-gem/main-concept-of-gem-functions.png)

![SECS/GEM 協議家族的關係](https://files.poychang.net/storage/about-secs-gem/secs-and-gem-protocol.png)

因此可以將 SEMI 這 4 個協議關係理解成，3 個層次：

1. 設備模型：SEMI E30（GEM）
2. 訊息結構：SEMI E5（SECS-II）
3. 資料傳輸：SEMI E4（SECS-I）、SEMI E37（HSMS）

之所以會有這些協議，主要是在早期晶片製造會因為不同廠商的設備都用著各自的溝通語言，導致大量客製化程式碼與混亂的整合流程。因此藉由這些協議標準化通訊方式，讓自動化的成本下降，現在這些協議已成為晶圓廠自動化通訊的全球標準。

## SECS-I 與 HSMS 傳輸層

設備的通訊從最底層的實體傳輸層開始，SECS-I 與 HSMS 是兩種不同的傳輸方式。由於早期工廠大多使用 RS-232 串列通訊，因此 SECS-I（SEMI E4）就是在規範這種透過 RS-232/RS-422 進行資料傳輸的傳輸方式。這種方式的特點是簡單、可靠，但速度較慢，且需要專用的串列線纜。今日，你仍可能在老舊產線中看到這類型的設備。

現代化的工廠則多採用高速訊息服務 HSMS（SEMI E37），其基於 TCP/IP，可透過標準乙太網路進行高速資料傳輸。HSMS 負責處理設備與主機之間的握手流程，確保資料封包能準確送達，不會遺失。

## SECS-II 訊息結構

這個協議定義了訊息的結構，這些訊息以 Stream（串流）與 Function（功能）的方式被組織起來。

結構上可以看成以不同的 Stream Number 搭配不同的 Function Number 來表示，其先以 Stream Number 來區分不同訊息種類，再以
Function Number 來分類訊息意涵，通常會用 Sn,Fm 來表達。

### Stream Function 對照表

SEMI 將 SECS 的主要訊息分類成以下 18 種 Stream，並且每個 Stream 都有對應的 Function Number，這些 Function Number 定義了訊息的意涵與用途。

Stream Function 的對照表格如下：

| 訊息種類         | 習用訊息種類 | Stream Number (n) | Function Number (m) |
| ---------------- | ------------ | ----------------- | ------------------- |
| 機台狀態         |              | 1                 | 0~20                |
| 機台控制及診斷   |              | 2                 | 0~50                |
| 材料狀態         | 晶圓狀態     | 3                 | 0~26                |
| 材料控制         | 晶圓控制     | 4                 | 0~42                |
| 例外處置         | 警報訊息     | 5                 | 0~18                |
| 資料收集         | 動態事件回報 | 6                 | 0~30                |
| 機台操作管理     | 配方管理     | 7                 | 0~36                |
| 控制程式傳送     |              | 8                 | 0~4                 |
| 系統錯誤         | 錯誤訊息     | 9                 | 0~14                |
| 終端機服務       |              | 10                | 0~10                |
| 主機檔案服務     |              | 11                | 已被 SEMI 刪除      |
| 晶圓定位         |              | 12                | 0~20                |
| 資料組傳送       |              | 13                | 0~16                |
| 物件服務         |              | 14                | 0~18                |
| 配方管理         |              | 15                | 0~48                |
| 程序處理管理     |              | 16                | 0~28                |
| 機台控制及診斷   |              | 17                | 0~14                |
| 子系統控制與資料 |              | 18                | 0~14                |

Stream Function 的發送與接收並非主機或設備都可以使用，有些只能由主機發送或接收，有些則是設備專屬的，也有二者均可發送的 Stream Function。

下表為常用的 Stream Function 表：

| Stream | Function | 訊息意涵                           | Host ← | → Equip. |
| :----: | :------: | ---------------------------------- | -----: | :------- |
|   S1   |    F1    | Are you There                      |      ← | →        |
|   S1   |    F2    | On Line Data                       |      ← | →        |
|   S1   |    F5    | Formatted Status Request           |        | →        |
|   S1   |    F6    | Formatted Status Data              |      ← |          |
|   S1   |   F13    | Connect Request                    |      ← | →        |
|   S1   |   F14    | Connect Request Acknowledge        |      ← | →        |
|   S2   |   F13    | Equipment Constant Request         |        | →        |
|   S2   |   F14    | Equipment Constant Data            |      ← |          |
|   S2   |   F25    | Diagnostic Loopback Request        |        | →        |
|   S2   |   F26    | Diagnostic Loopback Data           |      ← |          |
|   S2   |   F41    | Remote Command with Parameters     |        | →        |
|   S2   |   F42    | Remote Command Acknowledge         |      ← |          |
|   S5   |    F1    | Alarm Report Send                  |      ← |          |
|   S5   |    F2    | Alarm Report Acknowledge           |        | →        |
|   S5   |    F3    | Enable/Disable Alarm Send          |        | →        |
|   S5   |    F4    | Enable/Disable Alarm Acknowledge   |      ← |          |
|   S6   |   F11    | Event Report Send                  |      ← |          |
|   S6   |   F12    | Event Report Acknowledge           |        | →        |
|   S6   |   F13    | Annotated Event Report Send        |      ← |          |
|   S6   |   F14    | Annotated Event Report Acknowledge |        | →        |

### SML 語法

SECS Message 的結構是以二進位格式傳輸，雖然這對機器來說效率高，但對人類閱讀與撰寫並不友善，因此 SML（SECS Message Language）提供了一種文字化的表示方式，讓我們能夠更直觀地理解 SECS 訊息。

![SML 語法範例](https://files.poychang.net/storage/about-secs-gem/sml-basic-syntax-sample.png)

上圖是 SML 的語法範例，裡面標註了 4 個位置，其代表的基本語法可以這樣理解：

- ① 定義 1 個 Stream / Function，`S` 表示 Stream，`F` 表示Function，上圖表示第 `5` 個 Stream 的第 `1` 個 Function，也就是 `S5F1`，其意涵是 Alarm Report Send
- ② 如果有 `W` 表示預期會收到回覆，這功能是給程式可以設定 timeout 機制，如果預期收到卻沒有收到回覆，就可以做一些適當的處理。`W` 如果沒有，就表示不預期會收到回覆
- ③ 代表有一組 Data Item
- ④ 以 `.` 符號表示結束定義

訊息的主要內容是放在 ③ 這個位置，這裡我們單獨拉出來看。

由於這是 `S5F1` Alarm Report Send 訊息，SEMI E5（SECS-II）規範中 `S5F1` 的標準內容為：

| 欄位 | 代號 | 名稱       | 型別  |
| ---- | ---- | ---------- | ----- |
| 1    | ALCD | Alarm Code | B     |
| 2    | ALID | Alarm ID   | U2/U4 |
| 3    | ALTX | Alarm Text | A     |

> 完整的 SEMI E5（SECS-II）規範，請參考官方文件 [SEMI E5 - Specification for SEMI Equipment Communications Standard 2 Message Content (SECS-II)](https://store-us.semi.org/products/e00500-semi-e5-specification-for-semi-equipment-communications-standard-2-message-content-secs-ii)（需付費購買）。

Data Item 的描述語法為 `<Type [Count] Value>`，因此 `S5F1` 的 Data Item 可以寫成這樣：

```
<L [3]
  <B[1] 0x80>
  <U4[1] 1>
  <A[6] "Alarm1">
>
```

這個內容依順序可以這樣描述：

- `<L [3]` 表示一個包含 3 個 Data Item 的清單
- `<B[1] 0x80>` 表示 1 個 byte 的 B 型資料，值為 `0x80`
- `<U4[1] 1>` 表示 1 個 4 byte 的 U4 型資料，值為 `1`
- `<A[6] "Alarm1">` 表示 1 個 6 byte 的 ASCII 字串，值為 `"Alarm1"`
- `>` 表示結束此清單定義

### SML 的 Data Item 資料型別

| Data Type | 定義                                     |
| --------- | ---------------------------------------- |
| L         | 清單，可以用來包含其他 Data Type(包含 L) |
| A         | 一串 ASCII 字元，必須用雙引號括起來      |
| B         | 一串 0~255 的數值                        |
| BOOLEAN   | 表示真或假(1 或 0)的布林值               |
| U1        | 沒有帶正負符號，1 個 byte 的整數         |
| U2        | 沒有帶正負符號，2 個 byte 的整數         |
| U4        | 沒有帶正負符號，4 個 byte 的整數         |
| U8        | 沒有帶正負符號，8 個 byte 的整數         |
| I1        | 帶正負符號，1 個 byte 的整數             |
| I2        | 帶正負符號，2 個 byte 的整數             |
| I4        | 帶正負符號，4 個 byte 的整數             |
| I8        | 帶正負符號，8 個 byte 的整數             |
| F4        | 4 個 byte，32 位元浮點數                 |
| F8        | 8 個 byte，64 位元浮點數                 |

### SML 語法特性

1. 嚴格型別，每個 Item 都必須指定型別（`A`、`B`、`U4`...）。
2. 嚴格數量，`[COUNT]` 必須與 `Value` 數量一致。
3. 嵌套結構，`List` 可以包含 `List`，形成樹狀結構。
4. 必須與 SECS-II 完全對應，SML 是 SECS-II 的文字化表示，不是獨立語言，其格式必須遵守 SECS-II 標準。

## GEM 層

這裡是功能與應用，或者說是「設備的行為邏輯」的地方。SECS-II 只是定義了訊息的結構，GEM 才定義了這些訊息「該做什麼」。

例如會根據不同的機台定義出不同的功能，像是：

- 設備是否正在加工？
- 是否處於維護狀態？
- 是否等待人工操作？

之所以需要 GEM 而非使用一般的 API 或現代 Web 通訊協定，主要原因是在於半導體產業的特殊性，一次失誤可能導致數百萬美元的晶圓報廢，因此需要一套標準化、可靠且可追蹤的通訊協定來確保設備與主機之間的互動，並且要能夠在不同廠商的設備之間保持一致性。

- 標準化：使用統一的通訊標準，讓不同廠商的設備都能接入同一套 MES。
- 資料完整性：協議內建確認與逾時機制，確保資料可靠傳輸。
- 豐富的中繼資料：GEM 可回傳詳細的變數資料（VID）與事件報告（CEID），讓工程師完整掌握每一片晶圓的歷程。

## SEMI E系列標準速查表

| 名稱              | 標準號 | 核心功能                                 | 狀態                       |
| ----------------- | ------ | ---------------------------------------- | -------------------------- |
| SECS-I            | E4     | RS-232序列傳輸                           | 遺留，僅老裝置使用         |
| SECS-II           | E5     | Stream/Function消息格式與資料類型        | 核心標準，廣泛使用         |
| GEM               | E30    | 裝置行為模型：狀態機、事件、報警、Recipe | 核心標準，所有裝置必須支援 |
| HSMS              | E37    | TCP/IP傳輸，Active/Passive模式           | 核心標準，替代E4           |
| OSS               | E39    | 物件導向的裝置內部結構描述               | GEM300基礎標準             |
| PJM               | E40    | Process Job生命週期管理                  | 核心標準，MES調度基礎      |
| CMS               | E87    | Carrier/FOUP到站、驗證、裝卸管理         | 300mm必選                  |
| STS               | E90    | 逐片追蹤晶圓在裝置內位置與狀態           | 300mm必選                  |
| CJM               | E94    | Control Job調度與優先順序管理            | 300mm必選                  |
| EDA / Interface A | E116   | 高頻資料採集，SOAP/XML，毫秒級採樣       | 先進Fab資料採集首選        |

## 後記

SECS/GEM 是現代半導體製造不可或缺的基礎，透過連接硬體與軟體，該協議確保晶圓廠內的設備、機台能具備高效率、高擴展性與極高精準度。

希望藉由這篇文章，能讓更多人理解 SECS/GEM 的基本概念與架構，並且在未來的半導體製造中，能夠更好地應用這些技術，提升生產效率與產品品質。

---

參考資料：

- [ITRI - SECS/GEM 介紹](https://secs.itri.org.tw/about-secs-gem.html)
- [ITRI - SECS Emulator](https://secs.itri.org.tw/products-secs-emulator.html)
- [ITRI - 半導體廠自動化之通訊協定 SECS I/II & GEM](https://files.poychang.net/storage/about-secs-gem/SECS.pdf)
- [SECS Emulator 使用教學: 快速完成 SECS 通訊模擬](https://easysecs.com.tw/question-answer-manual/secs-emulator-tutorial/)
- [SEMI E5 - Specification for SEMI Equipment Communications Standard 2 Message Content (SECS-II)](https://store-us.semi.org/products/e00500-semi-e5-specification-for-semi-equipment-communications-standard-2-message-content-secs-ii)
