---
layout: post
title: 處理 Azure Storage Explorer 遇到 ZScaler 的憑證問題
date: 2023-01-09 14:08
author: Poy Chang
comments: true
categories: [Azure]
permalink: azure-storage-exploter-ssl-proxy-issue/
---

透過 Azure Storage 可以建立大量資料的儲存服務，而且我們可以使用 Azure Storage Explorer 來管理存放在上面的各種檔案資料，相當方便。在有使用 ZScaler 服務的企業內部網路時，有可能會遇到對外連線的時候，被 ZScaler 抽換 SSL 憑證，造成無法正確處理連線的問題，這篇文章將介紹如何解決這個問題。

由於 ZScaler 會抽換中繼憑證，造成程式進行連線驗證時失敗，因此 Azure Storage Explorer 在無法正確連線到 Azure Storage 取得檔案清單的時候，會跳出下面這樣的錯誤訊息：

![無法錯誤訊息視窗](https://i.imgur.com/I6A96Eu.png)

當 Azure Storage Explorer 就會出現 `UNABLE_TO_GET_ISSUER_CERT_LOCALLY` 這樣的錯誤訊息時，很大的可能性就是發生 SSL 憑證相關的驗證錯誤。

好理佳在 Azure Storage Explorer 有提供一個簡便的方式，讓我們匯入中間憑證，在工具列中 `Edit` > `SSL Certificates` > `Import Certificates` 選項，在這裡可以匯入公司內所使用的根憑證，匯入後接著重開 Azure Storage Explorer 即可正確處理 SSL 中繼憑證的問題。

![Azure Storage Explorer 提供匯入憑證的功能](https://i.imgur.com/XmL7Ols.png)

----------

參考資料：

* [Azure 儲存體總管疑難排解指南](https://learn.microsoft.com/zh-tw/azure/storage/common/storage-explorer-troubleshooting?WT.mc_id=DT-MVP-5003022)
