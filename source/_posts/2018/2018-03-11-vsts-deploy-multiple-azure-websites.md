---
layout: post
title: 使用 VSTS 建置並佈署多個 Azure Web App
date: 2018-03-11 17:19
author: Poy Chang
comments: true
categories: [Azure, Tools]
permalink: vsts-deploy-multiple-azure-websites/
---
如果今天想要使用 [Visual Studio Team Service](https://www.visualstudio.com/vso/) 提供的持續整合和部署 (CI/CD) 管線，建置並發行多個 ASP.NET 網站專案至 Azure 雲端時，預設情況下，你會發現建置任務會兩個網站專案都建置，但在佈署任務時，你無法指定要佈署哪一個建置後的網站專案，而且只有某一個網站專案會被佈署。

根據 [Continuous Integration Deploying Wrong Project From Solution](https://peter.orneholm.com/post/84647111808/deploy-to-multiple-azure-websites-with-visual) 這串 MSDN 的討論，裡面提到兩個重點：

>Currently build definitions which do a CI from VSO to Azure will deploy the first web application alphabetically in that solution. If you have a specific web application you want to deploy you will need to create a solution with only that web application in it.

1. 佈署至 Azure 時，會從方案中**按照字母順序**選擇第一個網站專案進行佈署
2. 如果要指定佈署專案，請建立一個只包含該網站專案的方案檔

簡單說，如果要佈署多個網站專案了話，要為每個網站專案建立對應的方案檔。

不過這樣做有點殺雞用牛刀，方案檔可以設定多個組態檔，因此我們**可以使用方案組態檔來規劃**，然後各個組態檔只建置一個專案，最後在 Visual Studio Team Service 的建置任務中，指定要用哪個組態檔即可。

## 實做看看

同一個方案檔，建立兩個網站 `A.WebApp`、`B.WebApp`。

>如果想自己玩玩看了話，可以直接 Clone 這個 [poychang/Demo-Deploy-Multiple-Azure-WebApp-With-VSTS](https://github.com/poychang/Demo-Deploy-Multiple-Azure-WebApp-With-VSTS) 範例專案，這樣你就不用從頭建專案了。

![建立兩個網站](https://i.imgur.com/0fr5LFR.png)

在方案檔上按右鍵，開啟方案的組態管理員，或者也可以從工具列上的`建置` > `組態管理員`開啟設定視窗。

![開啟方案的組態管理員](https://i.imgur.com/jVMHJ2I.png)

在組態管理員設定視窗中，增加一個新的組態。

![新增組態](https://i.imgur.com/ru59pyz.png)

依據要佈署的網站需求，增加並設定組態檔，下圖為只建置 A 網站。同樣的步驟可設定多個組態，分別只建置指定的專案。

![設定編譯第一個專案](https://i.imgur.com/LdOqMdD.png)

最後到 Visual Studio Team Service 裡面設定建置及佈署任務，下圖紅框分別為兩組建置及佈署，各組設定重點如下：

1. 調整建置任務 `Build Solution` 的 `Configuration` 欄位，將其設定成指定的組態檔，例如 A 網站。

![調整建置任務](https://i.imgur.com/FC2N2hi.png)

2. 調整佈署任務 `Azure App Service Deploy` 的 `Package or Folder` 欄位，指定要佈署至 Azure 的壓縮檔。

![調整佈署任務](https://i.imgur.com/jO7hwrs.png)

接者就可以直讓 VSTS 去執行這個佈署多個網站至 Azure 的 CI 任務了。

![佈署後的網站畫面](https://i.imgur.com/iCR6l1U.png)

>如果佈署至 Azure 過程中，發生 ERROR_FILE_IN_USE 錯誤，可以參考這篇 [使用 VSTS 佈署 Azure Web App 發生 ERROR_FILE_IN_USE](https://blog.poychang.net/vsts-depoly-azure-web-app-occur-error-file-in-use/)。

----------

參考資料：

* [Continuous Integration Deploying Wrong Project From Solution](https://social.msdn.microsoft.com/forums/azure/en-US/95f161f6-9370-43ad-9ac5-714f8978cc5e/continuous-integration-deploying-wrong-project-from-solution)
* [Deploy to multiple Azure Websites with Visual Studio Online and Continuous Integration](https://peter.orneholm.com/post/84647111808/deploy-to-multiple-azure-websites-with-visual)
* [使用 Visual Studio Team Services 和 IIS 建立持續整合管線](https://docs.microsoft.com/zh-tw/azure/virtual-machines/windows/tutorial-vsts-iis-cicd?WT.mc_id=AZ-MVP-5003022)
* [Deploy azure website and webjobs in same sln using VSO - Error - There can be only one](https://stackoverflow.com/questions/35385492/deploy-azure-website-and-webjobs-in-same-sln-using-vso-error-there-can-be-on)

