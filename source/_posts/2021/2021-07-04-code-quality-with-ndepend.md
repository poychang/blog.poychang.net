---
layout: post
title: 使用 Ndepend 分析 .NET 專案程式碼品質
date: 2021-07-04 23:11
author: Poy Chang
comments: true
categories: [Dotnet, Develop, Tools]
permalink: code-quality-with-ndepend/
---

要分析一個專案的程式碼品質的面相很多，透過工具自動化找出專案中可以修正的地方，以及潛在的程式碼弱點，這對開發人員來說是非常有幫助的，[Ndepend](https://www.ndepend.com/) 這套工具實現了許多幫助開發人員檢測程式碼的功能，從透過 Code Metrics 測量專案品質，到分析程式碼架構的功能，對於越來越大的專案開發者來說，能利用 NDepend 幫我們做品質分析，維持良好的程式碼品質，這篇來分享最近的使用心得。

Ndepend 提供了兩種使用方式，他有可獨立執行的程式，讓你不用開啟 Visual Studio 就可以檢測程式碼品質，這對於專注在檢測各個專案品質的情境下相當方便，畢竟開啟地表上最強的 IDE 也是需要不少系統資源。

<!-- ![獨立執行主畫面](https://i.imgur.com/7OZZdgh.png) -->
![獨立執行](https://i.imgur.com/0hI3pq7.png)

當然，對於大多數專案開發者而言，當下都只會專注在一個專案上，因此在 Visual Studio 中隨時查看 Ndepend 儀表板，也是相當便利的選擇。

![依附在 Visual Studio 下執行](https://i.imgur.com/sEUxgex.png)

從上面的畫面就可以看的出來，Ndepend 所提供的儀表板內容相當豐富，有以下 9 個面向：

- `Lines of Code` 專案規模
- `Types` 類別數量
- `Comment` 註解
- `Debt` 技術債
- `Coverage` 測試覆蓋率
- `Method Complexity` 方法複雜度
- `Quality Gates` 品質閥
- `Rules` 品質規則
- `Issues` 發現問題

其實每個指標都滿重要的，一般來說最常看的指標莫過於 `Issues` 發現問題這個項目，而 Ndepend 內建的品質規則非常的豐富，有些是關於語言的使用細節規則，細細查看這些規則有助於精進語言的使用方式，相當有意思，不過會需要多一點時間去思考就是了。

Ndepend 的品質紀錄架構有一點很不錯，從下圖的儀錶板中可以看到關於時間的資訊，以及技術債或 Issues 的變化，而這些歷史紀錄是怎麼被記錄的呢？

![儀錶板的歷史紀錄](https://i.imgur.com/r5ghf66.png)

由於 Ndepend 本身是另外一個 `.ndproj` 專案檔，這專案檔會包含專案資訊、要掃描的品質規則和分析紀錄。沒錯，掃描後的分析紀錄是用文件的方式儲存在專案資料夾中，相關資訊有以下 4 種檔案：

1. `.ndproj` 以 XML 格式儲存的專案檔，內容包含 Ndepend 的專案資訊及分析設定
2. `.ndar` 為二進制格式儲存的分析後結果，會儲存在專案資料夾中的 `NDependOut` 資料夾中，預設以每天為單位做儲存.
3. `.ndrules` 專案要使用的品質規則
4. Report Files 以 HTML 格式產出的品質報告

由於 Ndepend 不需要額外像是資料庫的資源去儲存歷史紀錄，Ndepend 將其結果以檔案的方式產出，這樣有幾個好處：

1. 執行速度更快，直接本機執行掃描及查看報表
2. 不需要額外資源即可儲存歷史紀錄
3. 可從版控庫中直接存取團隊成員產生的品質報告

當然，Ndepend 所產出的檔案你可以視需求提交版控庫中，這你可以簡單用 `gitignore` 的設定做到排除的動作。如果可以接受版控庫中包含專案檢測報告類的相關資訊，將這些檔案提交到版控庫中還保存歷史紀錄，是一個不錯的解決方案。

如果有些東西不想提交，但又想保留或共用，也是可以將該檔案複製到像是網路磁碟之類的位置，達到保存和共用的目的。

## 後記

[Ndepend](https://www.ndepend.com/) 掃描程式碼品質的功能強大之外，還有推出 Azure DevOps Extension 使之[整合進 CI/CD 之中](https://www.ndepend.com/docs/devops-quality-gate-strategy)，直接[在 Azure DevOps 上呈現品質報告結果](https://www.ndepend.com/docs/devops-code-quality-report)，讓開發結果更透明，讓整個團隊的人都能一目了然的看到該專案的狀態。

----------

參考資料：

* [介紹好用工具：NDepend ( .NET 程式碼品質分析的利器 )](https://blog.miniasp.com/post/2011/04/04/Useful-tool-NDepend)
* [Getting Started with NDepend](https://www.ndepend.com/docs/getting-started-with-ndepend)
