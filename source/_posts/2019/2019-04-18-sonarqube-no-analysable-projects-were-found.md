---
layout: post
title: SonarQube 執行分析時找不到 .NET Core 的專案
date: 2019-04-18 16:28
author: Poy Chang
comments: true
categories: [Dotnet, Develop, Tools]
permalink: sonarqube-no-analysable-projects-were-found/
---

今天在使用 Azure DevOps 搭配 SonarQube 做程式碼分析的時候，遇到執行分析時找不到 .NET Core 專案的錯誤，但是過去明明就可以對 .NET Core 專案程式碼作分析，怎麼會報出 `No analysable projects were found` 的錯誤訊息呢？

## 錯誤訊息

遇到的錯誤訊息畫面如下：

![No analysable projects were found](https://i.imgur.com/tpsvArM.png)

```log
##[error]No analysable projects were found. SonarQube analysis will not be performed. Check the build summary report for details.
No analysable projects were found. SonarQube analysis will not be performed. Check the build summary report for details.
Generation of the sonar-properties file failed. Unable to complete SonarQube analysis.
##[error]01:26:51.663  Post-processing failed. Exit code: 1
01:26:51.663  Post-processing failed. Exit code: 1
##[error]D:\a\_tasks\SonarQubePrepare_15b84ca1-b62f-4a2a-a403-89b77a063157\4.6.0\classic-sonar-scanner-msbuild\SonarScanner.MSBuild.exe failed with return code: 1
```

看見紅色的錯誤訊息就心慌慌，仔細來回看這錯誤訊息的說明，只知道說 SonarQube 找不到可以分析的專案。但不對呀，之前都分析得好好的，怎麼會突然不行了呢。

但其實重點是這段：

```log
WARNING: The following projects do not have a valid ProjectGuid and were not built using a valid solution (.sln) thus will be skipped from analysis...
D:\a\1\s\XXXXXXXX.MessageCardModel.csproj, D:\a\1\s\XXXXXXXX.HttpClientLibrary.csproj, D:\a\1\s\XXXXXXXX.MessageCardModel.csproj, D:\a\1\s\XXXXXXXX.MessageCardModel.csproj, D:\a\1\s\XXXXXXXX.HttpClientLibrary.csproj, D:\a\1\s\UdspHub\UdspHub.csproj
WARNING: Duplicate ProjectGuid: "00000000-0000-0000-0000-000000000000". The project will not be analyzed by SonarQube. Project file: "D:\a\1\s\XXXXXXXX.MessageCardModel.csproj"
WARNING: Duplicate ProjectGuid: "00000000-0000-0000-0000-000000000000". The project will not be analyzed by SonarQube. Project file: "D:\a\1\s\XXXXXXXX.HttpClientLibrary.csproj"
WARNING: Duplicate ProjectGuid: "00000000-0000-0000-0000-000000000000". The project will not be analyzed by SonarQube. Project file: "D:\a\1\s\UdspHub\UdspHub.csproj"
```

原來 `WARNING` 的這一句 `The following projects do not have a valid ProjectGuid` 才是關鍵所在。

.NET Core 所使用的專案檔（`.csproj`）已經和過去 .NET Framework 所使用的專案檔格式不一樣了，現在的專案檔內容相當簡潔易讀，但也少了一個 SonarQube 用於辨識專案的 `ProjectGuid` 屬性，因此 SonarQube 會預設給他 `00000000-0000-0000-0000-000000000000` 當作 `ProjectGuid`，但當我們要分析一個由多專案所組成的解決方案時，每個專案的 `ProjectGuid` 都是一樣的值時，就出現問題了，這時有兩個解決方案。

## 解決方案一

第一個解決方案就是打開每個 .NET Core 專案的專案檔，把 `ProjectGuid` 補回去，讓專案檔長的像下面這樣：

```xml
<PropertyGroup>
  <!-- SonarQube 需要這個屬性 -->
  <ProjectGuid>{F71DA3FB-89E5-4FD1-AC2C-9121CE1925A4}</ProjectGuid>

  <!-- 其他專案檔屬性，略... -->
</PropertyGroup>
```

這裡的 GUID 可以是你隨便設定的，可以透過 [Online GUID Generator](https://www.guidgenerator.com/online-guid-generator.aspx) 這個線上產生 GUID 工具幫我們產生一個。這樣一來 SonarQube 就不會抱怨了。

但這方式太手動了，而且要改每一個專案檔，又要塞一個沒啥意義的 GUID 進去，很奇怪。

## 解決方案二

第二個解決方案則是透過 Visual Studio 的方案檔（`.sln`）來建置 .NET Core 專案即可，因為在 Visual Studio 的方案檔中，其實就會建立底下各個專案的 GUID，你用編輯器打開方案檔可以看到類似下面這樣的程式碼：

```
Project("{9A19103F-16F7-4668-BE54-9A1E7A4F7556}") = "UdspHub", "UdspHub\UdspHub.csproj", "{3457335C-8F3C-4677-947B-8AD465F8A54D}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "XXXXXXXX.HttpClientLibrary", "XXXXXXXX.HttpClientLibrary.csproj", "{ABAA2E02-F9E2-4B8B-9F96-5356C912B995}"
EndProject
Project("{FAE04EC0-301F-11D3-BF4B-00C04F79EFBC}") = "XXXXXXXX.MessageCardModel", "XXXXXXXX.MessageCardModel.csproj", "{301A6674-94F5-4833-B24C-F9871788D654}"
EndProject
```

既然方案檔裡已經幫每個專案建立了 GUID，所以我們可以藉此來讓 SonarQube 知道他所需要的 `ProjectGuid` 是什麼，操作上就只要...（以 Azure DevOps 為例）

修改前整個 CI 流程如下圖，在 .NET Core 建置任務（Build）裡，設定會去找建置資料夾底下的所有專案檔（`**/*.csproj`）做建置。

![修改前](https://i.imgur.com/oCLgqNN.png)

我們只要改成用指定的方案檔來做建置即可，請看下圖的 `Path to project(s)` 欄位修改。

![修改後](https://i.imgur.com/ejpiAuE.png)

這樣改完就 SonarQube 就可以正常執行程式碼分析了 😎

----------

參考資料：

* [Duplicate ProjectGuid: “00000000-0000-0000-0000-000000000000” on dotnet core scan](https://community.sonarsource.com/t/duplicate-projectguid-00000000-0000-0000-0000-000000000000-on-dotnet-core-scan/4804/2)
* [The following projects do not have a valid ProjectGuid and were not built using a valid solution (.sln) thus will be skipped from analysis](https://stackoverflow.com/questions/50479716/the-following-projects-do-not-have-a-valid-projectguid-and-were-not-built-using)
