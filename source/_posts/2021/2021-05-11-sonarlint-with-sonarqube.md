---
layout: post
title: SonarLint 程式碼品質分析工具
date: 2021-05-11 12:59
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: sonarlint-with-sonarqube/
---

[SonarQube 是一套程式碼品質分析工具](https://blog.poychang.net/sonarqube-csharp/)，你可以自架伺服器並設定掃描規則來檢查專案程式碼，並可以搭配 CI/CD 工具來做到自動化掃描，例如[在 Azure DevOps 上使用 SonarQube 進行程式碼品質分析](https://blog.poychang.net/how-to-config-sonarqube-work-with-vsts/)，這對維持團隊開發品質有很大的幫助。然而如果每次都要提交程式碼到版控平台，再透過 CI/CD 去掃描，就太浪費時間了，若能在 IDE 或 Editor 等開發工具上接套用 SonarQube 上所自訂的團隊規則，直接在工具中掃描當前的程式碼，這樣的開發體驗才不會被影響。

若把 SonarQube 看作伺服器端的程式碼掃描工具，那麼 [SonarLint](https://www.sonarlint.org/) 就是對應到用戶端的工具。

SonarLint 是開發工具的擴充套件，支援 Eclipse、IntelliJ IDEA、Visual Studio、VS Code 開發工具，且這套擴充套件本身有以下兩種模式：

- 獨立模式
- 連線模式

獨立模式顧名思義就是安裝完就可以直接使用，所支援的品質規則請參考 [rules.sonarsource.com](https://rules.sonarsource.com/) 這個網站。

## 安裝

每套開發工具的安裝方式都不一樣，但大同小異，這裡操作用 Visual Studio 為例。

從 Visual Studio 的選單列上點選 `Extensions` > `Manage Extensions`，直接搜尋 SonarLint 關鍵字就會找到對應你當前 Visual Studio 版本的 SonarLint 擴充套件。

![在 Visual Studio 中安裝 SonarLint](https://i.imgur.com/TD7ukhP.png)

點選安裝即可。

## 使用獨立模式

安裝完後就可以直接使用獨立模式，不需要做任何設定。

這裡我建立了一個 .NET Core 3.1 的 Console App 專案，簡單示範一下。

![違反規則 S3169 和 S1481](https://i.imgur.com/KTWzrP3.png)

從上圖可以看到，在建置時會出現警告，提醒程式碼違反了規則 [S3169](https://rules.sonarsource.com/csharp/RSPEC-3169) 和 [S1481](https://rules.sonarsource.com/csharp/RSPEC-1481)。

如果你想要在獨立模式下，自訂掃描的規則，可以從選單列上點選 `Tools` > `Options` 然後找到 SonarLint 設定頁，點選 `Edit rules settings`，這會開啟 `settings.json` 全域設定檔，你可以在這裡設定要開啟或關閉特定的規則，不過目前 Visual Studio 只支援 C、C++、JavaScript 規則設定，設定方式如下：

![設定 SonarLint](https://i.imgur.com/mX60vGf.png)

>請注意！這個方式是全域套用，不是針對某一專案使用。

```json
{
    "sonarlint.rules": {
        "javascript:S3504": {
            "level": "off"
        }
    }
}
```

上面設定不適用這次的範例，提供給其他程式語言參考。

SonarLint 本身是個開放原始碼專案，因此你可以到 GitHub 上找到對應開發工具的擴充套件原始碼，離如 [SonarSource/sonarlint-visualstudio](https://github.com/SonarSource/sonarlint-visualstudio) 和 [SonarSource/sonarlint-vscode](https://github.com/SonarSource/sonarlint-vscode)，更多關於獨立模式的使用方式，文件不多，只能去對應的 GitHub 專案中找找看了。

## 使用連線模式

對於團隊開發來說，連線模式才是最適合的方式。

團隊可以在 SonarQube 上設定好適用於團隊的程式碼品質規則，然後給 CI/CD 工具使用，並且透過 SonarLint 的連線模式來取得團隊自訂的規則，套用到當前的專案之中。

如此一來，就可以在 SonarQube 平台上設定好之後，讓團隊中的各個開發者去取得同一份規則設定。

要設定連線模式，從選單列上的 `Analyze` > `Manage SonarQube Connections`

![開啟 Manage SonarQube Connections 視窗](https://i.imgur.com/NJesRhh.png)

在 SonarQube Connections 設定視窗中點選 `Connect...` 並輸入 SonarQube 網址（例如 https://sonarqube.domain.net/）和登入的帳號密碼。

![設定 SonarQube Connections](https://i.imgur.com/HWIaYbj.png)

完成登入後會顯示 SonarQube 所有可綁定的專案。

![SonarQube 上面可以綁定的專案清單](https://i.imgur.com/zaqStUX.png)

綁定完專案後，會在本機專案的資料夾中建立 `.sonarlint` 資料夾，這裡面會是連線與規則的相關設定，同時也會修改 `.csproj` 專案檔。

之所以會修改專案檔，是因為要將規則加入程式碼分析規則集（CodeAnalysisRuleSet），讓 Visual Studio 可以套用剛剛下載下來的團隊規則。

到這裡設定就完成了，再來建置看看手邊的範例專案。

![套用團隊規則的範例專案，只剩下違反規則 S3169 的警告](https://i.imgur.com/BEUyKzJ.png)

套用團隊規則的範例專案，只剩下違反規則 S3169 的警告。

如果要更新相關規則了話，在同一個視窗中點選清單中綁定的專案，然後按滑鼠右鍵，就會有 `Update` 的選項讓你更新相關規則至本機專案。

![更新規則](https://i.imgur.com/bRCnCbV.png)ㄋ

## 後記

基本上只要將綁定後的 `.sonarlint` 資料夾和修改後的 `.csproj` 專案檔提交到版控系統，之後團隊中其他成員就可以直接套用該規則。

因此只有第一次綁定和之後要更新規則的時候，才需要進行登入 SonarQube 的動作。

----------

參考資料：

* [MS Docs - 使用規則集將程式碼分析規則分組](https://docs.microsoft.com/zh-tw/visualstudio/code-quality/using-rule-sets-to-group-code-analysis-rules?WT.mc_id=DT-MVP-5003022)
