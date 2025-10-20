---
layout: post
title: SonarQube 如何偵測程式碼重複
date: 2021-08-18 14:12
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: how-sonarqube-detect-duplication/
---

SonarQube 會掃描專案中是否有過多重複的程式碼，若超過一定程度的重複區塊或行數，就會在儀錶板上明顯的表示出來。這個功能能夠幫助我們清楚的知道程式碼中的重複區塊，但是它是怎麼算出來的呢？來了解一下它背後的計算方式。

>知道他背後如何計算的，才知道怎麼避開這個問題呀！

## 定義

首先，我們來看看官方文件怎麼說明 Duplications 這個測量維度，從[官方這篇文件](https://docs.sonarqube.org/latest/user-guide/metric-definitions/)中可以看到這個測量維度會根據語言的不同，然後採不一樣的標準來計算冗餘區塊的程度。

如果是 Java 專案，會先忽略縮排符號和字串的差異，然後當出現 10 行或以上的重複程式碼時，就會備標註出來。

如果是非 Java 專案，判斷的條件稍微複雜一點：

- 超過 100 個以上的 Token（這裡的 Token 可以簡單看成程式碼的字詞）
- 這些 Token 集中在指定的程式碼行數之中，這會隨著程式語言不同而異
  - COBOL 預設為 30 行
  - ABAP 預設為 20 行
  - 其他語言預設為 10 行

## 設定

上面的文件講到的是測量冗餘區塊的檢測預設值，這些設定當然可以手動修改，官方的說明文件在[這裡](https://docs.sonarqube.org/latest/analysis/analysis-parameters/)。

簡單來說，就是在呼叫 SonarQube 來幫我們檢查專案的時候，可以透過設定以下兩個設定值，來幫我們修改當前的檢測條件：

| Key                                   | Default |
| ------------------------------------- | ------- |
| `sonar.cpd.${language}.minimumtokens` | 100     |
| `sonar.cpd.${language}.minimumLines`  | 10      |

這邊要稍微注意的是，這個設定值會根據語言不同而有不同的寫法，例如如果要檢測的是 C# 專案，那麼你可以參考下面的設定方式：

```ini
sonar.cpd.cs.minimumtokens=100
sonar.cpd.cs.minimumLines=5
```

但根據上面定義中所提到的，Java 專案是不會根據 Token 數量去檢測，因此如果是 Java 專案，設定 `sonar.cpd.java.minimumtokens=100` 是沒有效果的。

## 重構

根據 SonarQube in Action 這本書（出版商有提供[免費看的線上版](https://livebook.manning.com/book/sonarqube-in-action/)），針對冗餘區塊有提出以下 4 種解法，提供給各位參考：

- 擷取方法（Extract method）
  - 用於同一類別中的重複程式碼
  - 建立一個新方法，將重複的程式碼區塊移至該方法
- 提取欄位（Pull up field）
  - 通常與擷取方法結合使用
  - 基本想法是將在兩個或多個子類別中使用到的欄位或屬性提取至父類別中
- 擷取父類別（Extract superclass）
  - 應用於不同類別中有程式碼重複的情況
  - 當類別具有相同甚至相似的特徵時，請考慮將這些特徵移至父類別中
- 擷取類別（Extract class）
  - 擷取方法和擷取父類別的組合，主要應用於不相關的類別
  - 將在不相關類別中重複的程式碼搬移至新的工具類別中

這邊提供給各位參考。

## 原始碼

SonarQube 本身開放原始碼專案，再知道要如何手動修改設定值後，順手來看看原始碼來驗證預設值吧！

`minimumTokens` 的預設值從[這裡](https://github.com/SonarSource/sonarqube/blob/master/sonar-scanner-engine/src/main/java/org/sonar/scanner/cpd/CpdSettings.java#L42)可以看到，當取不到設定值的時候，他會預設給他 100 來當作檢查 Token 數量的標準。

而 `minimumLines` 的預設值可以從[這裡](https://github.com/SonarSource/sonarqube/blob/master/sonar-scanner-engine/src/main/java/org/sonar/scanner/sensor/DefaultSensorStorage.java#L388)看到，程式碼中直接針對 Cobol 和 ABAP 的語言設定成為 30 和 20 預設值，其他的都是偵測 10 行作為預設值。

----------

參考資料：

* [Duplication Criteria in Sonar](https://stackoverflow.com/questions/41439789/duplication-criteria-in-sonar)
* [SonarQube Docs - Metric Definitions](https://docs.sonarqube.org/latest/user-guide/metric-definitions/)
* [SonarQube Docs - Analysis Parameters](https://docs.sonarqube.org/latest/analysis/analysis-parameters/)
