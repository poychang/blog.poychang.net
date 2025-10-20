---
layout: post
title: Azure 使用 BizTalk 無法安裝 Agent
date: 2016-07-01 14:02
author: Poy Chang
comments: true
categories: [Azure]
permalink: azure-hybrid-connections/
---

架設在 Azure 上的網站或服務，如果需要和自家內部的伺服器連結了話，除了打 VPN 通道外，還可以透過 Azure BizTalk 的服務，達成 Hybrid Connections 混合式連結。

相關的運作方式，可以參考下圖，主要透過`混合式連結`服務，並在內部的伺服器上安裝對應的 Agent，混合式連線管理員，就可以達成雲與地的連結。

![運作圖](http://i.imgur.com/KNoBRML.png)

這次在實做的時候，遇到一些小狀況，筆記起來。

 | 內部伺服器環境
--- | ---
OS | Windows Server 2008 R2 SP1

在伺服器端要安裝 Agnet 的時候，出現這樣的錯誤訊息：

![錯誤訊息](http://i.imgur.com/ppUUoQT.png)

其中提到：`您需要先於全域組件快取(GAC)中安裝組件 Microsoft.Management.Infrastructure 版本 1.0.0.0，才能使用此應用程式。`，可知一定是少裝了什麼，Google 後發現，是系統少裝了 Windows Management Framework 3.0 這工具，補裝一下就搞定了，這裡附上[載點](https://www.microsoft.com/en-us/download/details.aspx?id=34595)必備之後裝在其他台機器時需要使用。

## 執行環境

根據 MSDN 文件，執行 BizTalk 服務的環境如下：

作業系統：

* Windows 7
* Windows Server 2008 R2 SP1
* Windows 8
* Windows Server 2012

.NET Framework 必要版本：

* .NET Framework 3.5.1
* .NET Framework 4.5

詳請見官方文件[安裝 Azure BizTalk 服務 SDK - 軟體需求](https://msdn.microsoft.com/zh-tw/library/azure/hh689760.aspx?f=255&MSPPError=-2147217396#BKMK_Reqs)

(這篇完全是工作遇到狀況的小筆記...)

----------

參考資料：

* [混合式連線概觀](https://azure.microsoft.com/zh-tw/documentation/articles/integration-hybrid-connection-overview/)
* [Description of Windows Management Framework 3.0 for Windows 7 SP1 and Windows Server 2008 R2 SP1](https://support.microsoft.com/en-us/kb/2506143)
