---
layout: post
title: 重構筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note]
permalink: note-refactoring/
---

本篇作為書籤用途，記錄網路上的 Refactoring 參考資料

## Martin Fowler

Martin Fowler - Refactoring : Improving the Design of Existing Code

[https://martinfowler.com/](https://martinfowler.com/)

[How to access the web edition of Refactoring](https://martinfowler.com/articles/access-refactoring-web-edition.html)

### 重構的定義

不改變外在的行為的前提下，對程式碼做出修正，以改進程式的內部結構。本質上來說，重構就是在程式碼寫好之後改進它的設計

### 重構的原則

- 需要有穩定且堅固的測試機制
- 以微小步伐修改程式，如果引入錯誤便可以很容易發現
- 如果覺得比較困難增加新的功能，就先重構後再增加
- 只有寫出人類容易理解的程式碼，才是優秀的程式員

### 兩頂帽子 - 重構與增加新功能

- `重構`：不能增加新功能，只管修改程式結構。只在絕對必要的時刻才修改測試。
- `增加新功能`：不應該修改既有程式碼，只管增加新功能以通過測試
- 如果增加新功能很困難，那就先重構它

### 為何要重構?

- 改進軟體設計：一個主要的方向就是消除重複的程式碼。
- 使軟體更容易被理解：提高可讀性。
- 幫你找到 Bug
- 幫你提高編程速度

---

參考資料：

- [重構 - 改善既有的程式的設計 - 第二版 練習與筆記](https://bryanyu.github.io/2018/01/07/RefactorPactice/)
- [BryanYu/RefactorPractice](https://github.com/BryanYu/RefactorPractice)
