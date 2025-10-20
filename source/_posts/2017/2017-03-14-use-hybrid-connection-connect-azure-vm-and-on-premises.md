---
layout: post
title: 使用 Hybrid Connection 連接 Azure VM 與地端伺服器
date: 2017-03-14 19:11
author: Poy Chang
comments: true
categories: [Azure, Tools]
permalink: use-hybrid-connection-connect-azure-vm-and-on-premises/
---
在傳統企業環境中要使用雲端服務，應該會經常被問到雲端能不能存取地端（On-Promises）的伺服器，畢竟企業內部有些資源、資料是企業主不想放在別人家的，而這問題的標準答案絕對是 YES，BizTalk 的 Hybrid Connection 是一個不錯的解決方案。

>BizTalk Hybrid Connections 已於 May 31, 2018 停止服務，剩下 Azure App Service 中可繼續使用 Hybrid Connections 服務，也就是只支援 PaaS 服務使用。

## Hybrid Connections

先來看看 Hybrid Connections 的示意圖：

![Hybrid Connections](http://i.imgur.com/7srzaYr.png)

從上圖可以很清楚的知道，我們在 Azure 上可以透過 Hybrid Connection 讓 WebApp 在某些情況下，連回地端的資料庫或伺服器，不需要用到成本較高且建立較為複雜的 VPN，使用單純的混合式連接就可以達成雲端與地端連結在一起的效果。

## 搭配 WebApp

如果你是使用 Azuew Paas 的 WebApp 服務，可以直接參考官方[建立和管理混合式連線](https://docs.microsoft.com/zh-tw/azure/biztalk-services/integration-hybrid-connection-create-manage?WT.mc_id=AZ-MVP-5003022)的文件，設定方式寫得很清楚，跟著做就差不多了，這裡就不多做說明。

比較需要注意的是地端的防火牆設定：

* Hybrid Connection 會用到 80、443、5671、9350~9354 這幾個 Port
* 地端伺服器的防火牆只要開啟 Outbound 連線就可以
* 混合式連接不支援 UDP 的通訊協定

另外，一個 BizTalk 服務可以給多個混合式連線使用，且主機名稱最好不要有特殊字元、連結號或底線，這樣有可能會有問題，且使用時請一定要使用地端伺服器的主機名稱，使用 IP 可能會無法連線

## 搭配 Azure VM

如果你是使用 Azure 虛擬機器的服務來構建環境了話，就無法用 Azure Portal 上的設定選項來設定 Hybrid Connection，基本的步驟如下：

1. 登入 [Azure 傳統入口網站](https://manage.windowsazure.com/)
	* 目前只有 Azure 傳統入口網站能單獨建立 BizTalk 服務
	* BizTalk Hybrid Connection 基本有 5 個免費連線可以用（好棒棒！）
2. 在左側瀏覽窗格中，選取並建立 [BizTalk 服務](https://docs.microsoft.com/zh-tw/azure/biztalk-services/biztalk-provision-services?WT.mc_id=AZ-MVP-5003022)
3. 從中選取 [建立混合式連接] 並設定想要連線地端伺服器
4. 在地端伺服器上使用 Hybrid Connection Manager 來設定內部部屬連接字串

到這裡都和上一節差不多，接下來不同的是 Azure VM 要怎麼做設定。

1. 在 Azure VM 上安裝 Hybrid Connection Client
	* 參考下方 Hybrid Connection Client 段落的下載位置
2. 確認服務有開啟
![Hybrid Connections Client Service](http://i.imgur.com/e8GVG82.png)

3. 取得 Hybrid Connection 所產生的**應用程式連接字串**（主要、次要都可以）
![應用程式連接字串](http://i.imgur.com/PyCagEE.png)

4. 使用系統管理員權限開啟 PowerShell 執行下列指令
	* `Add-HybridConnectionClient -ConnectionString "YourConnectionString"`
	* 其中 `YourConnectionString` 需替換成上一步取得的**應用程式連接字串**
5. 執行 `Get-HybridConnectionClient` 檢查是否有把地端伺服器的連結加進去
![Get-HybridConnectionClient](http://i.imgur.com/71QJcyk.png)

6. 順利加入後，可執行 `ping <地端主機名稱>` 來試試看有沒連結到

----------

## 以下為相關的整理文件

記得一個大方向：<span style="background-color: #FFFF00">Hybrid Connection Manager 用於地端，Hybrid Connection Client 用於雲端。</span>

### Hybrid Connection Manager

Microsoft Azure Hybrid Connection Manager [下載位置](https://www.microsoft.com/en-us/download/details.aspx?id=42962)

官方文件：[PowerShell CmdLet 混合式連線管理員](https://msdn.microsoft.com/zh-tw/library/azure/dn789178.aspx)

>重要事項：這裡的 -ConnectionString 參數是指 Azure 管理入口網站中列出的完整**內部部署連接字串**。

PowerShell CmdLet

* `Add-HybridConnection`
	* 在混合式連線管理員中，將新的內部部署接聽程式連線新至 Azure 上現有的混合式連接。
	* 語法 & 範例：

```powershell
Add-HybridConnection -ConnectionString <string>  [<CommonParameters>]
```

```powershell
Add-HybridConnection -ConnectionString "Endpoint=hc://YourBizTalkServiceName.hybrid.biztalk.windows.net/YourNewHybridConnectionName;SharedAccessKeyName=defaultListener;SharedAccessKey=xxxx"
```

* `Update-HybridConnection`
	* 針對本機混合式連線管理員上設定的內部部署接聽程式，更新連線參數。
* `Remove-HybridConnection`
	* 從本機混合式連線管理員中，移除特定混合式連接的內部部署接聽程式。
	* 語法 & 範例：

```powershell
Remove-HybridConnection -ConnectionString <string>  [<CommonParameters>]
```

```powershell
Remove-HybridConnection -ConnectionString "Endpoint=hc://YourBizTalkServiceName.hybrid.biztalk.windows.net/YourHybridConnectionName;SharedAccessKeyName=defaultListener;SharedAccessKey=xxxx"
```

* `Get-HybridConnection`
	* 針對本機混合式連線管理員上設定的所有混合式連接，傳回內部部署接聽程式的相關資訊。
	* 語法 & 範例：

```powershell
Get-HybridConnection [-ConnectionString <string>] [-Uri <uri>] 
```

```powershell
Get-HybridConnection -URI "hc://YourBizTalkServiceName.hybrid.biztalk.windows.net/YourHybridConnectionName"
```

* `Set-HybridConnectionManagerConfiguration`
	* 設定混合式連線管理員的本機管理 TCP 通訊埠。

### Hybrid Connection Client

Microsoft Azure Hybrid Connection Client [下載位置](https://www.microsoft.com/en-us/download/details.aspx?id=44216)

這段沒有官方文件，但基本操作和 Hybrid Connection Manager 差不多。

>重要事項：這裡的 -ConnectionString 參數是指 Azure 管理入口網站中列出的完整**應用程式連接字串**。

PowerShell CmdLet

* `Add-HybridConnection`
	* 在混合式連線管理員中，將新的內部部署接聽程式連線新至 Azure 上現有的混合式連接。
	* 語法 & 範例：

```powershell
Add-HybridConnectionClient -ConnectionString <string>  [<CommonParameters>]
```

```powershell
Add-HybridConnectionClient -ConnectionString "Endpoint=hc://YourBizTalkServiceName.hybrid.biztalk.windows.net/YourNewHybridConnectionName;SharedAccessKeyName=defaultListener;SharedAccessKey=xxxx"
```

* `Remove-HybridConnection`
	* 從本機混合式連線管理員中，移除特定混合式連接的內部部署接聽程式。
	* 語法 & 範例：

```powershell
Remove-HybridConnectionClient -ConnectionString <string>  [<CommonParameters>]
```

```powershell
Remove-HybridConnectionClient -ConnectionString "Endpoint=hc://YourBizTalkServiceName.hybrid.biztalk.windows.net/YourHybridConnectionName;SharedAccessKeyName=defaultListener;SharedAccessKey=xxxx"
```

* `Get-HybridConnection`
	* 針對本機混合式連線管理員上設定的所有混合式連接，傳回內部部署接聽程式的相關資訊。
	* 語法 & 範例：

```powershell
Get-HybridConnectionClient [-ConnectionString <string>] [-Uri <uri>]
```

```powershell
Get-HybridConnectionClient -URI "hc://YourBizTalkServiceName.hybrid.biztalk.windows.net/YourHybridConnectionName"
```

## 這段純屬個人抒發，可忽略

之所以會有這篇的出現，是因為要在 Azure VM 上面使用 Hybrid Connection 跟地端伺服器連線的使用介紹真的超級少，google 了半天，也只有這一篇短短的討論串 [Is there way to create HYBRID CONNECTIONS for azure could service or azure VM?](http://stackoverflow.com/questions/32329361/is-there-way-to-create-hybrid-connections-for-azure-could-service-or-azure-vm) 和這篇短文 [Connect Azure to Your On-premises Data with the Hybrid Connection Client](http://windowsitpro.com/azure/connect-azure-your-premises-data-hybrid-connection-client)有提到關鍵字 Hybrid Connection Client，再來就都沒有了。

我也是瞎貓碰上死耗子才領悟出上面的用法，費了我大半天呢。

----------

參考資料：

* [混合式連線概觀](https://docs.microsoft.com/zh-tw/azure/biztalk-services/integration-hybrid-connection-overview?WT.mc_id=AZ-MVP-5003022)
* [使用混合式連接，讓WebApp不使用VPN就可以連接內部網路進行資料存取](https://dotblogs.com.tw/maduka/2016/06/02/163424)
* [Azure BizTalk Services: Connecting to On-Premises Resources](https://www.simple-talk.com/cloud/platform-as-a-service/azure-biztalk-services-connecting-to-on-premises-resources/)
* [Is there way to create HYBRID CONNECTIONS for azure could service or azure VM?](http://stackoverflow.com/questions/32329361/is-there-way-to-create-hybrid-connections-for-azure-could-service-or-azure-vm)
* [Connect Azure to Your On-premises Data with the Hybrid Connection Client](http://windowsitpro.com/azure/connect-azure-your-premises-data-hybrid-connection-client)
