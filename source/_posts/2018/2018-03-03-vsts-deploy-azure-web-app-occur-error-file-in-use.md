---
layout: post
title: 使用 VSTS 佈署 Azure Web App 發生 ERROR_FILE_IN_USE
date: 2018-03-03 18:09
author: Poy Chang
comments: true
categories: [Azure, Tools]
permalink: vsts-deploy-azure-web-app-occur-error-file-in-use/
---
[Visual Studio Team Service](https://www.visualstudio.com/vso/) 所提供的 CI/CD 功能非常強大且很容易使用，內建了很多任務 (Task) 可以直接取用，甚至還提供許多設計好的範本讓你直接套用，相當方便，例如 Azure Web App 範本，可以幫你從做了一套從還原套件至編譯然後佈署至 Azure 一系列的流程。不過對於持續運行的站台，使用這個 CI/CD 範本可能在佈署至 Azure 這段發生 `ERROR_FILE_IN_USE` 錯誤。

`ERROR_FILE_IN_USE` 的錯誤訊息如下：

```
##[error]Failed to deploy App Service.
##[error]Error Code: ERROR_FILE_IN_USE
More Information: Web Deploy cannot modify the file 'QnAServiceBot.dll' on the destination because it is locked by an external process.  In order to allow the publish operation to succeed, you may need to either restart your application to release the lock, or use the AppOffline rule handler for .Net applications on your next publish attempt.  Learn more at: http://go.microsoft.com/fwlink/?LinkId=221672#ERROR_FILE_IN_USE.
Error count: 1.
```

如果你點裡面的 Learn more 連結 [http://go.microsoft.com/fwlink/?LinkId=221672#ERROR_FILE_IN_USE](http://go.microsoft.com/fwlink/?LinkId=221672#ERROR_FILE_IN_USE)，只會告訴你這個錯誤是因為有檔案正在使用，所以被鎖定了，無法更換成新的檔案，好像 VSTS 所吐出的錯誤訊息還更詳細些。

最簡單的解法就是將 Azure Web App 重新啟動，讓原本被鎖定的檔案，釋放開來。

但每次都手動做這件事，太不 DevOps 了，應該直接把這個動作放進 CI/CD 流程，VSTS 提供了 Azure App Service Manage 任務，讓你可以設定這個工作。

![Azure App Service Manage](https://i.imgur.com/PrAjEoG.png)

要設定的內容也相當簡單，只要修改 Azure Subscription、Actioin、App Service Name 三個欄位即可，如下：

![設定 Azure App Service Manage 重開 WebApp](https://i.imgur.com/5TG0mQr.png)

這樣就自動化前面要手動處理的重新啟動 WebApp 這個動作。

不過這樣做，有時候還是會發生 `ERROR_FILE_IN_USE` 錯誤，因為你還是無法控制那個 WebApp 是否真的"沒有"在使用那個檔案，畢竟他已經啟動了。

開啟 Action 這個下拉選單，可以看到他其實有很多動作選項，可以讓我們安排。

![](https://i.imgur.com/Zz0KoIr.png)

* Swap Slots
* Start App Service
* Stop App Service
* Restart App Service
* Install Extensions
* Enable Continuous Monitoring
* Start All Continuous WebJobs
* Stop All Continuous WebJobs

避免檔案被鎖定的最保險方法是透過 Start App Service 和 Stop App Service 來安排，依序的動作就會是

1. 停止 Azure WebApp 的運行
2. 進行 Azure WebApp 的佈署
3. 啟動 Azure WebApp 的運行

CI/CD 任務流程變成如下圖：

![CI/CD 任務流程](https://i.imgur.com/oyUBvYc.png)

這樣就可以確保，佈署期間絕對不會有檔案被鎖定。

不過這樣做還有一個問題，就是網站會在佈署期間停機，無法提供服務，這時候可以使用 Swap Slots 這個任務做正式環境與預備環境的對調，對調的過程相當於起兩個站台，新的站台服務新連線，舊的站台的服務停止後就移除了。

Swap Slots 這個動作必須搭配 Standard 以上的 Azure App Service 方案，像我是使用共用等級的方案就不能用了，有興趣的朋友們請參考這份[在 Azure App Service 中設定預備環境](https://docs.microsoft.com/zh-tw/azure/app-service/web-sites-staged-publishing?WT.mc_id=DT-MVP-5003022)官方文件。

----------

參考資料：

* [Can Azure Web App Deployment have an option to stop/start web app?](https://github.com/Microsoft/vsts-tasks/issues/1233)
* [使用 Visual Studio Team Services 和 IIS 建立持續整合管線](https://docs.microsoft.com/zh-tw/azure/virtual-machines/windows/tutorial-vsts-iis-cicd?WT.mc_id=DT-MVP-5003022)

