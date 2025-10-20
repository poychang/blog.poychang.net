---
layout: post
title: 如何在 VSTS 使用 SonarQube 進行程式碼品質分析
date: 2018-08-08 23:32
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: how-to-config-sonarqube-work-with-vsts/
---

想要自動化檢查程式碼品質，[SonarQube](https://www.sonarqube.org/) 是一套相當不錯的程式碼品質檢查工具，這項[開放原始碼專案](https://github.com/SonarSource/sonarqube)可以幫助我們找出潛在 Bug、重複程式碼、測試覆蓋率、程式碼複雜度等等軟體品質報告，如果配合 [Visual Studio Team Services](https://visualstudio.microsoft.com/team-services/) 在持續整合這個環節中做檢查，就更能夠及時且清楚的掌控專案品質，本文將介紹如何在 VSTS 上設定並使用 SonarQube 進行程式碼品質分析。

## 安裝 SonarQube

相關安裝請參考[這篇文章](https://blog.poychang.net/sonarqube-csharp/)的介紹。

如果需要 SonarQube 7.2 版的繁體中文的語言包，請至[這裡下載](https://github.com/poychang/sonar-l10n-zh-tw/releases)安裝，安裝方式很簡單，將下載的 `.jar` 檔複製至 SonarQube 安裝目錄下的 `\extensions\plugins` 資料夾中，重新啟動系統即可。

## 在 VSTS 上設定 SonarQube 服務端點

首先在 SonarQube 站台上點選右上角的使用者圖示，在`安全`頁籤下產生一個 Token 令牌，這令牌會在等一下的 VSTS 新增端點時用到。

![生成 SonarQube 令牌](https://i.imgur.com/NyycpZx.png)

接著在設定 VSTS 之前請先從[這個連結](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarqube)進入 Visual Studio Marketplace 並安裝 VSTS 的 SonarQube 擴充套件，過程中會讓你挑選要安裝到哪一個 VSTS 團隊組織中，選擇完後直接點選 Download，該團隊組織的 VSTS 就會有 SonarQube 相關的功能與設定選項。

[![Visual Studio Marketplace 上的 SonarQube 擴充套件](https://i.imgur.com/BvKwWro.png)](https://marketplace.visualstudio.com/items?itemName=SonarSource.sonarqube)

![安裝 VSTS 的 SonarQube 擴充套件](https://i.imgur.com/Fu0QBYG.png)

> 這個 SonarQube 擴充套件內建了自己版本的 SonarQube Scanner for MSBuild。

在設定持續整合的品質檢測前，我們需要先告訴 VSTS 我們的 SonarQube 伺服器在哪裡，點選 VSTS 站台左下角的 `Project Settings`，在 `Build and release` 段落中的 `Service Connection`，要在這裡點選 `New service connection` 新增一個 SonarQube 伺服器連線端點，

![新增 SonarQube 伺服器連線端點](https://i.imgur.com/i0jhhZz.png)

輸入完名稱、伺服器連線位置以及先前得到的 Token 後，我們就可以在 VSTS 持續整合的過程中加入此 SonarQube 連線，進行程式碼品質分析了。

## 任務基本介紹

在設定 VSTS 的持續整合設定前，先來簡單介紹 3 個主要的 SonarQube 任務：

- `Prepare Analysis Configuration` **必要的設定任務**，用來在執行建置前設定所有必要 SonarQube 設定
- `Run Code Analysis` 真正執行分析程式碼的任務，.NET 專案為 **必要的分析任務**
  - Maven 或 Gradle 的專案不需要此任務，因為掃描程序會在建置時一起處理
- `Publish Quality Gate Result` **選用任務**，在建置的摘要中顯示 SonarQube 的分析結果，看其 Quality Gate 狀態是否符合品質要求(如下圖)

![檢查 Quality Gate 狀態是否符合品質要求](https://i.imgur.com/esheeq3.png)

## 設定 VSTS 持續整合

有了上述的基礎，我們可以在 VSTS 上建立持續整合設定時加入 SonarQube 檢查專案程式碼品質的任務，這裡我們從頭做一次設定。

首先在 VSTS 的 `Builds` 功能李建立一個持續整合的新專案，程式碼來源可以是 VSTS Git 或是你 GitHub 上的專案，如果你選用 GitHub 作為你的程式碼來源，需要先進行身分驗證。

![設定持續整合的 VSTS 新專案](https://i.imgur.com/rxUJ2qG.png)

這裡我使用的專案是用 .NET Core 來寫 [ML.NET](https://www.microsoft.com/net/learn/apps/machine-learning-and-ai/ml-dotnet) 的一個小[範例專案](https://github.com/poychang/Demo-Abalone-Age-App)，因為是用 .NET Core 所以基本上會有以下兩個建置任務：

- `dotnet restore` 還原專案中相依的套件
- `dotnet build` 建置該專案

>這裡為了簡化設定持訊整合的流程，因此只設定這兩個關鍵任務，其他像是發行或是執行單元測試等任務就沒有加入了。

接著再加上 SonarQube 的檢查與報告任務，這裡要注意順序，`Prepare Analysis Configuration` 這個必要任務必須放在專案建置之前，而另外兩個 `Run Code Analysis`、`Publish Quality Gate Result` 則放在建置之後。

>因為這裡沒有設定單元測試，因此 SonarQube 會無法得知測試覆蓋率(Code Coverage)，若要加入測試覆蓋率，請勾選測試任務(例如 Visual Studio Test)內的 Code Coverage Enabled 選項。

在 `Prepare Analysis Configuration` 設定任務中，選擇剛剛設定好的 SonarQube 服務端點，必選用 `Integrate with MSBuild` 進行分析。

另外還有以下設定需要知道用途：

- `Project Key` 這是用來在 SonarQube 標示的唯一識別碼，不能有重複，若重複，最後的分析報告會覆蓋前者。如果是 .NET 專案，你可以用 `.csproj` 中的專案識別碼，會是一組 GUID。
- `Project Name` - 設定在 SonarQube 平台上要顯示的專案名稱
- `Project Version` - 設定在 SonarQube 平台上要顯示的專案版本

![設定執行任務](https://i.imgur.com/p9F8QNv.png)

設定完成後交給 VSTS 去跑跑看，如果順便跑完，可以在結果頁的 Timeline 頁籤中看到 SonarQube Analytics Report，在這裡我們可以得知這次的建置的品質分析結果是否有通過品質閥。

![在 VSTS 上看品質閥](https://i.imgur.com/GID2XHe.png)

你也可以點選上面 SonarQube Analytics Report 段落中的 `Detailed SonarQube report` 轉到 SonarQube 平台上看完整的分析報告。

![在SonarQube 看完整報告](https://i.imgur.com/mye1Nwt.png)

在完整的分析報告的上方有個質量閥的段落，我們可以快速地看出該專案的品質是因為哪個質量閥條件造成`錯誤`，可以直接點選後查看在該條件下程式碼品質在哪裡出現的問題。

![查看程式碼品質在哪裡出現的問題](https://i.imgur.com/GE1QtfZ.png)

## 結語

透過 VSTS 強大的持續整合功能，幾乎各種整合情境都可以在這裡搭建，並且透過 SonarQube 程式碼品質分析，我們可以逐步修正專案中可能有未符合品質標準的地方，除了掌控並提升程式碼的品質外，開發者也可以藉此學習如何將程式碼寫的更"漂亮"。

---

參考資料：

- [Analyzing with SonarQube Extension for VSTS/TFS](https://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Extension+for+VSTS-TFS)
- [SonarQube Endpoint](https://docs.sonarqube.org/display/SCAN/SonarQube+Endpoint)
- [SonarQube User Token](https://docs.sonarqube.org/display/SONAR/User+Token)
