---
layout: post
title: 半導體製造簡介
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Uncategorized]
permalink: note-semiconductor-manufacturing/
---

半導體製程是被用於製造晶片，從一開始晶圓加工，到晶片封裝測試，直到出貨，這篇簡單介紹半導體製造的相關基本知識。

## 體系架構

下圖為典型的半導體產業體系架構：

```
                                                            ┌───────────────────┐
                                                            │ Connector         │
                                                            │ Manufacture       │
                                                            └─────┬─────────────┘
                                                                  │
                                                                  │
                                                                  ▼
┌─────────────┐   ┌───────────────────┐    ┌────────────┐   ┌───────────────────┐
│ Lead-frame  ├──►│ IC Packaging      ├──► │ IC Testing ├──►│ IC Assembly       │
│ Manufacture │   └───────────────────┘    └────────────┘   └───────────────────┘
└─────────────┘        ▲                                          ▲
                       │                                          │
                       │                                          │
                       │                                          │
┌─────────────┐   ┌────┴──────────────┐                     ┌─────┴─────────────┐
│ Photo Mask  ├──►│ Wafer Fabrication │                     │ Board Manufacture │
└─────────────┘   └───────────────────┘                     └───────────────────┘
     ▲                 ▲
     │                 │
┌────┴────────┐   ┌────┴──────────────┐
│ IC Design   │   │ Wafer Manufacture │
└─────────────┘   └───────────────────┘
     ▲                 ▲
     │                 │
┌────┴────────┐   ┌────┴──────────────┐
│ CAD/CAM     │   │ Material          │
└─────────────┘   └───────────────────┘
```

半導體製造，也就是一般所稱的晶圓加工（Wafer Fabrication），是資金與技術最為密集之處。

晶圓加工的上游包括 IC 產品設計（IC Design）、晶圓製造（Wafer Manufacture）等。

下游可簡單分成兩類，第一類是半導體後段製程（Back-end Processes）的 IC 封裝（Packaging）、測試（Testing）、包裝（Assembly），第二類是週邊的導線架製造（Lead-frame manufacture）、連接器製造（Connector manufacture）、電路板製造（Board manufacture）等。

## IC 產品設計（IC Design）

數位積體電路 (Digital IC) 的設計可以分為系統設計、邏輯設計、實體設計三大部分，實體設計完成後會得到光罩圖形，光罩製作完成後再送進晶圓廠製作晶片 (Chip)，最後再送進封裝與測試廠，經過封裝與測試就成為可以銷售的積體電路 (IC) 。

下圖為典型的 IC 設計的流程與相關公司：

```
                                    ┌──────────────────────┐    ──┐
                   ┌──          ┌── │  SPEC.               │      │ EDA Company
 Design House      │            │   └┬─────────────────────┘      │ provide IC design software
  * MediaTek       │            │    │                            │  * Cadence
  * Novatek        │            │    ▼                            │  * Synopsys
  * Realtek        │            │   ┌──────────────────────┐      │  * Siemens
  * Faraday        │  Front-end │   │  RTL Code            │      │
                   │            │   └┬─────────────────────┘      │
                   │            │    │ Pre-sim                    │
                   │            │    ▼ Synthesis                  │
                   │            │   ┌──────────────────────┐      │
                   │            └── │  Gate Level Netlist  │      │
                   │            ┌── │                      │      │
                   │            │   └┬─────────────────────┘      │
                   │            │    │ Plcaement                  │
                   │            │    ▼ Routing                    │
                   │   Back-end │   ┌──────────────────────┐      │
                   │            │   │  Layout              │      │
                   │            │   └┬─────────────────────┘      │
                   │            │    │ Post-sim & Verification    │
                   └──          └──  │ Tape-out                   │
 Forndry           ────────────────  │ Fabrication                │
  * TSMC                             │                            │
  * UMC                              │                            │
                                     │                            │
 Assembly & Test   ────────────────  ▼ Packaging & Testing        │
  * Siliconware                     ┌──────────────────────┐      │
  * ASE Group                       │  Chip                │      │
                                    └──────────────────────┘    ──┘
```

在 Tape-out 之前都還算是設計階段，所以是交給 Design House 進行設計，這階段每家公司擅長的領域各自不同，而 Tape-out 之後則是將完全沒有問題的 IC 設計圖交給 IC 製造公司進行生產。

## 晶圓製造（Wafer Manufacture）

主要流程：

```
長晶 > 切片 > 邊緣研磨 > 研磨與蝕刻 > 退火 > 拋光 > 洗淨 > 檢驗 > 包裝
```

製造過程是將矽石（Silica）或矽酸鹽 （Silicate），放入爐中熔解提煉，再以一塊單晶矽為「晶種」，讓融化的矽沾附在晶種上，以邊拉邊旋轉方式抽離，形成與晶種相同排列的結晶。

隨著晶種的旋轉上升，沾附的矽愈多，並且被拉引成表面粗糙的圓柱狀結晶棒。其中，拉引及旋轉的速度愈慢，則沾附的矽結晶時間愈久，結晶棒的直徑愈大，反之則愈小。

經過工業級鑽石磨具的加工，磨成平滑的圓柱並切除頭尾兩端錐狀段，接著再切成片狀的晶圓（Wafer）。

後續還需要進行多項動作，使晶片的阻質穩定，使晶片達到可進行晶片加工的狀態。

## 晶圓處理製程

在表面形成一層二氧化矽層等化學堆積流程，然後進行微影（Lithography）的製程，將光罩上的圖案移轉到晶圓上，接著利用蝕刻技術將電路圖製作出來。

根據製程的需要，FAB 廠內通常可分為四大區：

1. 黃光
2. 蝕刻
3. 擴散
4. 真空

## 晶圓針測

晶圓針測（Chip Probing）的目的是要對晶片做電性功能上的測試，使 IC 在進入封裝前，先過濾出電性功能不良的晶片，以避免因為不良品而增加製造成本上升。

這個階段主要有以下項目

-   晶圓針測並作產品分類（Sorting），檢測不良品
-   雷射修補（Laser Repairing），盡可能修復不良品
-   加溫烘烤（Baking），主要在清理晶圓表面

## 封裝製程

電子封裝（electronic packaging），是指電子產品生產的過程中，將各種電子元件，依產品需要進行組裝、連接的製程。

例如，將晶圓中每一顆 IC 晶粒（die）獨立分離，並外接信號線至導線架上並加以包覆。

在 IC 晶片「輕、薄、短、小、高功能」的要求下，亦使得封裝技術需要不斷演進，以符合電子產品的需要。

封裝的目的主要有：

-   電力傳送
-   訊號輸送
-   熱的去除
-   電路保護
-   包裝成美觀的外表
-   提供安全的使用及簡便的操作環境

封裝的材料主要可分為塑膠（plastic）、陶瓷（ceramic）和金屬三種，封裝材質要注意散熱和絕緣能力，目前商業應用以塑膠封裝為主。

以散熱能力來說，塑膠最差，金屬最好，但金屬會導電，因此金屬封裝材質會搭配塑膠來包裝晶片。

陶瓷封裝成本高，組裝不易自動化，反觀塑膠封裝的品質及技術不斷提升，因此已盡量避免使用陶瓷封裝，但陶瓷封裝有極佳的散熱能力、可靠度及氣密性，並可提供高輸出入接腳數，因此高功率及高可靠度的產品，如 CPU、航太、軍事等產品，仍會採用陶瓷封裝。

其步驟依序如下：

1. 晶圓切割 die saw
2. 黏晶 die mount／die bond
3. 銲線 wire bond
4. 封膠 mold
5. 剪切／成形 trim／form
6. 印字 mark
7. 電鍍 plating
8. 檢驗 inspection

晶片的需求已經開始走向小晶片（Chiplet）的發展，例如 SoC，封裝技術也開始要做到晶圓級的封裝，因此晶圓廠也開始要自己發展封裝技術。小晶片的封裝上，會使用矽中介板和矽穿孔技術，將多個小晶片封裝在一起。[https://www.youtube.com/watch?v=VziahpzrZPo](https://www.youtube.com/watch?v=VziahpzrZPo)。

## 電子封裝型態

IC 封裝型態可以區分為兩類，一為引腳插入型（Pin Through Hole, PTH），另一為表面黏著型（Surface Mount Technology, SMT）。

-   引腳插入型，就是必須利用插件的方式將該顆 IC 插入，與印刷電路板結合
-   表面黏著技術，將電子零件快速的焊接於基板上，並維持零件與基板間電路的連接通暢

常見的外觀及相關應用請見下圖 ：

| 封裝名稱                            | 常見應用產品                                                |
| ----------------------------------- | ----------------------------------------------------------- |
| Single In-Line Package（SIP）       | Power Transistor                                            |
| Dual In-Line Package（DIP）         | SRAM, ROM, EPROM, EEPROM, FLASH, Microcontroller            |
| Zig-Zag In-Line Package（ZIP）      | DRAM, SRAM                                                  |
| Small Outline Package（SOP）        | Linear, Logic, DRAM, SRAM                                   |
| Plastic Leaded Chip Carrier（PLCC） | 256K DRAM, ROM, SRAM, EPROM, EEPROM, FLASH, Microcontroller |
| Small Outline Package（SOJ）        | DRAM, SRAM, EPROM, EEPROM, FLASH                            |
| Quad Flat Package （QFP）           | Microprocessor                                              |
| Pin Grid Array （PGA）              | Microprocessor                                              |

不同的 IC 產品，應其功能 I/O 數的需求及散熱、按裝等考量，會搭配不同的包裝型式

## 測試製程

測試製程是於 IC 封裝後，測試產品的電性功能，以保證出廠的 IC 在功能上的完整性，並對已測試的產品，依其電性功能作分類（即分 Bin），作為 IC 不同等級產品的評價依據。最後並對產品作外觀檢驗（Inspect）作業。

由於測試是半導體 IC 製程的最後一站，所以許多客戶將測試廠當作他們的成品倉庫，降低庫存管理等成本，同時減少不必要的搬運成本，這就是測試廠所提供的 Door to Door 服務，幫助客戶將測試完成品送至客戶指定的地方。

----------

參考資料：

* [半導體製造概論](http://www.taiwan921.lib.ntu.edu.tw/mypdf/mf23.pdf)
* [【曲博彩虹頻道 Ep.33】台積電為什麼也要做封裝？封裝技術就看這篇！](https://www.youtube.com/watch?v=VziahpzrZPo)
