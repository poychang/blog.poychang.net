---
layout: post
title: 設定 SonarQube 的掃描器設定
date: 2021-09-07 15:14
author: Poy Chang
comments: true
categories: [Azure, Develop, Tools]
permalink: passing-project-properties-to-sonarqube-scanner/
---

我們可以在 Azure DevOps 安裝 [SonarQube 擴充套件](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarqube)，來讓 CI 的 Pipeline 增加 SonarScanner 掃描任務，並且可以在任務中調整掃描的分析設定，這篇來了解一下 SonarQube 的掃描器設定。

## 設定階層

其實 SonarScanner 的分析設定可以在很多地方設定，但會有一個覆蓋順序，後者蓋前者，順序如下：

1. 全域設定
2. 專案設定
3. 專案分析任務設定
4. 專案分析任務的指令設定

其中**全域設定**和**專案設定**因為是透過 SonarQube 的系統介面來設定，因此會存在 SonarQube 的系統資料庫中，另外兩者則不會。

### 全域設定

這要從 SonarQube 的系統介面上去設定，路徑為 `Administration` > `Configuration` > `General Settings`，這裡所看到的設定會套用到所有掃描專案中：

![全域設定](https://i.imgur.com/xkv58WX.png)

### 專案設定

這也是要從 SonarQube 的系統介面上去設定，路徑為 `Project Settings` > `General Settings`，這裡的設定只會套用到該掃描的專案中：

![專案設定](https://i.imgur.com/MZmAl9E.png)

### 專案分析任務設定

這個是這篇主要要講的設定方式，此層級的設定有兩種方式，一種是使用設定檔的，另一種是直接在 CI 介面上提供，這裡用 Azure DevOps Service 的介面來表示。

要在 CI 的 Pipeline 上調整掃描的分析設定，首先你要使用第 4 版以上的 Prepare Analysis Configuration 任務功能，如下圖，要指定使用 Task Version 為 `4.*`：

![第 4 版的 Prepare Analysis Configuration 任務](https://i.imgur.com/L0Dr03v.png)

這樣就可以在下方看到 Additional Properties 設定欄，這裡就是讓我們手動設定此掃描任務的分析設定：

![Additional Properties 設定欄](https://i.imgur.com/Nqi7OWq.png)

你可以看到設定值就是一組 Key Value 的設定方式，至於有哪些分析參數可以設定，可以參考下方的分析參數段落。

而大部分常用的參數已經被放進 Pipeline 任務的設定介面中，所以不需要特別在這裡輸入，但如果有一些比較特殊的應用，這裡的設定欄位可以提供更貼近需求的操作。

如果是更之前的版本，則必須使用設定檔的方式來提供分析設定。

### 專案分析任務的指令設定

最後一種是透過指令的方式來提供分析設定，例如你可以在執行 SonarScanner 的指令後方，加上例如 `-D sonar.projectKey=<專案名稱>`，`-D` 後面的參數設定就是 SonarQube 所接收的分析參數。

## 分析參數

由於 SonarQube 的分析參數滿多的，詳細可以參考這份官方文件[Analysis Parameters](https://docs.sonarqube.org/latest/analysis/analysis-parameters/)，這邊僅列出幾項比較容易使用到的參數。

### 專案設定類

| Key                 | Description          |
| ------------------- | -------------------- |
| `sonar.projectKey`  | 掃描專案的唯一識別碼 |
| `sonar.projectName` | 掃描專案的顯示名稱   |

### 驗證類

| Key              | Description                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| `sonar.login`    | 系統登入帳號或 [Authentication Token](https://docs.sonarqube.org/latest/user-guide/user-token/) |
| `sonar.password` | 系統登入帳號的密碼，若使用 Authentication Token 則留空白                                        |

### 檢測程式碼重複

| Key                                   | Description                                     |
| ------------------------------------- | ----------------------------------------------- |
| `sonar.cpd.${language}.minimumtokens` | 超過 100 個以上的 Token（可簡單視為程式碼字詞） |
| `sonar.cpd.${language}.minimumLines`  | 同上                                            |

>`${language}` 請改成要分析的程式語言名稱。

關於更多 SonarQube 是如何偵測程式碼重複，請參考這篇[部落格文章](https://blog.poychang.net/how-sonarqube-detect-duplication/)。

### 分析日誌

| Key             | Description                              |
| --------------- | ---------------------------------------- |
| `sonar.log.level` | 輸出日誌的等級，可設定成 `DEBUG`、`INFO`、`TRACE` |
| `sonar.verbose` | 詳細輸出執行時的日誌訊息，預設為 `false` |

有時候執行分析時，出現一些不知道為什麼的錯誤，這時候可以打開日誌設定，查看 SonarScanner 在執行時發生了什麼事。

### 測試類

這類的設定會根據對應的程式語言的不同而異，詳細可以參考這份官方文件[Test Coverage & Execution](https://docs.sonarqube.org/latest/analysis/coverage/)。

| Language | Key                                   | Description                                                                              |
| -------- | ------------------------------------- | ---------------------------------------------------------------------------------------- |
| Any      | `sonar.coverageReportPaths`           | 通用型測試報告檔的路徑，[參考](https://docs.sonarqube.org/latest/analysis/generic-test/) |
| C#       | `sonar.cs.vscoveragexml.reportsPaths` | Visual Studio 測試報告檔的路徑，可用 `,` 分隔多個報告檔                                  |
| C#       | `sonar.cs.opencover.reportsPaths`     | OpenCover 測試報告檔的路徑                                                               |

### 其他

分析設定的參數還有很多，可能跟程式語言、專案等因素而不同，還有一些是要直接到 SonarQube 系統上去查找（有時候相關文件不容易找到），如下圖可以看到，有些設定下方會出現關鍵字 `key`，這裡所表示的 Key 就是可以用於 SonarQube 的分析參數。

![介面上的分析參數 Key](https://i.imgur.com/d0q3L3k.png)

## 後記

SonarQube 掃瞄的分析設定其實還滿多的，但因為找不到一個完整的參數清單，所以只能拼湊來自各個文件的內容，如果你有找到更完整的參數清單和說明，請您分享給我，感謝～

----------

參考資料：

* [Perform a SonarCloud analysis on script based projects](https://medium.com/@edwin.vriethoff/perform-a-sonarcloud-analysis-on-script-based-projects-7052d456bcf7)
* [SonarQube Docs - Analysis Parameters](https://docs.sonarqube.org/latest/analysis/analysis-parameters/)
* [SonarQube Docs - Branch Analysis](https://docs.sonarqube.org/latest/branches/overview/)
* [SonarQube Docs - Test Coverage & Execution](https://docs.sonarqube.org/latest/analysis/coverage/)
