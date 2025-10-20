---
layout: post
title: SonarQube 程式碼品質分析工具
date: 2016-11-04 08:00
author: Poy Chang
comments: true
categories: [Tools]
permalink: sonarqube-csharp/
---

SonarQube 是一套分析程式碼品質的工具，支援超過 25 種程式語言，如 C/C++、C#/VB.NET、Java、JavaScript、Python...等。這邊為測試架設 SonarQube 系統時所製作的筆記。

[SonarQube 官方網站](http://www.sonarqube.org/)

SonarQube 程式碼品質分析工具用 7 個維度來分析程式碼品質，包括：

* 程式架構　Architecture & Design
* 冗餘程式　Duplications
* 單元測試　Unit tests
* 複雜度　　Complexity
* 潛在問題　Potential bugs
* 寫作原則　Coding rules
* 註解　　　Comments

因此 SonarQube 還可以與 CI 做結合，讓 SonarQube 成為持續整合當中的一環，可以幫助節省一部分人工 Code Review 的力氣，也可以幫助提前發現一些不小心忽略的疏失。

![Code Review](http://i.imgur.com/BT0qDPe.png)

## 環境設定

SonarQube 是使用 Java 開發開源專案，支援 Windows、Mac、Linux 多種平台，這裡以 Windows 來作為操作環境。

* 安裝 Java SE Development Kit 8
  * 下載位置：[http://www.oracle.com/technetwork/java/javase/downloads/index.html](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
* 更新 Microsoft JDBC Drivers （非必要）
  * 下載位置：[https://www.microsoft.com/zh-tw/download/details.aspx?id=11774](https://www.microsoft.com/zh-tw/download/details.aspx?id=11774)
  * SonarQube 安裝檔中已經有自帶 Microsoft JDBC Drivers，因此這項非必要
* SonarQube 必須搭配一套資料庫系統
  * 請參考[官方建議清單](http://docs.sonarqube.org/display/SONAR/Requirements)
  * 目前只支援 SQL Server 2014 以上版本
* 設定資料庫（以 SQL Server 2014 為例）
  * 建立資料庫帳號 `sonar`
  * 建立名稱為 `SonarQube` 的資料庫，並將上面的資料庫帳號 `sonar` 設定為資料庫擁有者
  * 建立時務必選擇正確的**定序**
    * Case-Sensitive (CS) 和 Accent-Sensitive (AS) (例: `Chinese_Taiwan_Stroke_CI_AS`)
    * 備註：繁體中文預設定序為 `Chinese_Taiwan_Stroke_CI_AS`
  * 建立時務必開啟 READ_COMMITTED_SNAPSHOT
    * 開啟指令 `ALTER DATABASE [YourSonarQubeDatabase] SET READ_COMMITTED_SNAPSHOT ON WITH ROLLBACK IMMEDIATE;`
    * 避免 MS SQL 資料庫的交易鎖定造成死結問題
  * 啟動 SQL Server 組態管理員
    * 需要啟動 TCP/IP 通訊協定服務
    * 其中要設定 TCP 通訊埠為 1433 （如下圖）

    ![設定 TCP 通訊埠為 1433](http://i.imgur.com/pt0za2I.png)

## 安裝 SonarQube

* 下載
  * [SonarQube](http://www.sonarqube.org/downloads/)
  * [SonarQube Scanner for MSBuild](http://docs.sonarqube.org/display/SCAN/Analyzing+with+SonarQube+Scanner+for+MSBuild)
* 安裝
  * 將 `SonarQube` 壓縮檔解壓縮到指定目錄，例如 `C:\SonarQube\`
  * 將 `SonarQube Scanner for MSBuild` 壓縮檔解壓縮到指定目錄，例如 `C:\SonarQube\bin\sonar-scanner\`
  * 這裡的安裝目錄可自訂
* 設定環境變數
  * 推薦使用 [Rapid Environment Editor](http://www.rapidee.com/en/about) 修改系統環境變數
  * 在使用者變數的 `Path` 中加入 `C:\SonarQube\bin\sonar-scanner\` 方便後續使用 `MSBuild.SonarQube.Runner.exe`
* 修改 `SonarQube` 設定檔 `\conf\sonar.properties` 主要修改下列三個參數
  * `sonar.jdbc.username` 資料庫連線帳號
  * `soanr.jdbc.password` 資料庫連線密碼
  * `sonar.jdbc.url` 資料庫連線字串(使用 JDBC)
  * 參考下列範例，正式環境建議另外建立一個 DB 使用帳戶，並使用後者方式

```bash
# 使用 Integrated Security 時
sonar.jdbc.url=jdbc:sqlserver://localhost;databaseName=SonarQube;integratedSecurity=true

# 使用指定帳號密碼時
sonar.jdbc.url=jdbc:sqlserver://localhost;databaseName=SonarQube;instance=MSSQLSERVER;SelectMethod=Cursor;
sonar.jdbc.username=sonar
sonar.jdbc.password=sonarpassword
```

## 啟動 SonarQube

* 測試啟動 SonarQube
  * 執行 `C:\SonarQube\bin\windows-x86-64\StartSonar.bat`
  * 第一次執行會需要一點時間讓資料庫初始化
* 把 SonarQube 安裝成 Windows Service，使之可以背景自動啟動
  * 執行 `C:\SonarQube\bin\windows-x86-64\InstallNTService.bat` 安裝服務
  * 執行 `C:\SonarQube\bin\windows-x86-64\StartNTService.bat` 啟動服務
* 預設 SonarQube 網站網址為 [http://localhost:9000/](http://localhost:9000/)
  * 這可以在 `\conf\sonar.properties` 的 `WEB SERVER` 區段調整
  * 若要讓非本機用戶使用，記得要再防火牆中開啟對外的 9000 埠
* 網站預設管理員（[參考](http://docs.sonarqube.org/display/SONAR/Authentication#Authentication-AdminCredentialsDefaultAdminCredentials)）
  * 帳號：admin
  * 密碼：admin

## 測試

* 要分析 C# Code 我們要需要 SonarQube Scanner for MSBuild，我們下載回來之後解壓縮到我們自己指定的目錄。
  *  參考**下載及安裝**段落
  *  也可以將 Scanner 安裝其他開發者的機器裡機，讓開發者可以在自己的電腦上執行掃描
    *  需修改 `SonarQube.Analysis.xml` 檔案
    *  `sonar.host.url` SonarQube 伺服器位置
    *  `sonar.login` 使用者帳號
    *  `sonar.password` 使用者密碼
* 以下為執行掃描的指令（[參考](http://docs.sonarqube.org/display/SCAN/From+the+Command+Line)）

```bash
# 建立掃描專案，會在目錄下新增 `.sonarqube` 資料夾
# /k 為 SonarQube 專案 Key
# /n 為 SonarQube 專案名稱
# /v 為 SonarQube 專案版本
MSBuild.SonarQube.Runner begin /k:"{Project Index}" /n:"{Project Name}" /v:"1.0"
# 執行 MSBuild 編譯
"C:\Program Files (x86)\MSBuild\14.0\Bin\MSBuild.exe" /t:Rebuild
# 執行 SonarQube 品質掃描程式
MSBuild.SonarQube.Runner end
```

* 建立一個新的 WinForm 專案，跑測試，結果畫面如下

![](http://i.imgur.com/DYIMMO4.png)

## 後記

可以正確的測試 C# 的專案，但遇到使用 ASP.NET Core 當框架的專案時，無法完成程式碼掃描，[這裡](http://stackoverflow.com/questions/37841439/running-sonarqube-against-an-asp-net-core-solution-project)說，可能是因為專案檔格式的變更，所以暫無法使用 SonarQube 進行測試。

----------

參考資料：

* [程式碼品質分析的好用工具 - SonarQube 基本介紹 (1)](https://dotblogs.com.tw/kirkchen/2016/06/04/sonarqube-introduction)
* [用 SonarQube 分析 C# 程式碼品質](https://dotblogs.com.tw/supershowwei/2016/10/30/164450)
* [Installing SonarQUBE on windows and SQL Server](http://www.codewrecks.com/blog/index.php/2015/10/30/installing-sonarqube-on-windows-and-sql-server/)
