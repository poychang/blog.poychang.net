---
layout: post
title: 使用 Azure Cloud Shell 取得 Azure 地區清單
date: 2019-07-30 19:33
author: Poy Chang
comments: true
categories: [Azure]
permalink: list-azure-service-regions/
---

Azure 提供了豐富的雲端資源，而為了讓全球的使用者能更享受更低的網路延遲，Azure 截至目前為止，在全球提供 54 個資料中心（或稱`地區`），我們可以把應用程式放在離使用者相對靠近的地方，提供更高效率的服務，所以在設定 Azure 上的資源時，要放在哪個地區就要好好想想了，那麼要如何得知這 54 個地區的清單及地理資訊呢？

![Azure 54 個地區的分布](https://i.imgur.com/vJosVLB.png)

從 [Azure 的全球基礎結構介紹網頁](https://azure.microsoft.com/zh-tw/global-infrastructure/regions/)中，可以看到 Azure 的資料中心部屬在 54 個地區，提供給 140 多個國家使用，從上圖可以看到真的是遍佈全球。

>但是上圖有兩個 Azure Government 祕密區域位置是不會公開的。

## Azure CLI

Azure 提供 Azure CLI 和 Azure Powershell 兩個命令列工具，方便我們新增或管理 Azure 資源，你可以參考[這篇官方文件](https://docs.microsoft.com/zh-tw/cli/azure/install-azure-cli?WT.mc_id=AZ-MVP-5003022)在你本機安裝 Azure CLI，或者[這篇官方文件](https://docs.microsoft.com/zh-tw/powershell/azure/install-az-ps?WT.mc_id=AZ-MVP-5003022)安裝 Azure Powershell。這裡就是利用 Azure CLI 來查詢你 Azure 訂閱帳戶可使用的地區資訊。

但有時候在公用電腦不想安裝 Azure CLI 工具的時候，你其實還有一個選擇，Azure Cloud Shell，一個讓你在瀏覽器中執行 Azure CLI 的終端機工具，當你登入 Azure Portal 時，上方的標題列會有個像命令列工具的小圖示，參考下圖：

![開啟 Cloud Shell](https://i.imgur.com/M7VecYi.png)

如果你是第一次使用此 Azure Cloud Shell 功能，他會需要你建立一個儲存體資源，這是因為 Cloud Shell 是一個暫存的終端機機器，因此需要一個儲存體來保留你的檔案。

設定完成後開啟 Azure Cloud Shell，預設先進到 `Azure` 磁碟機中（相當於 D 槽的概念），這時執行 `dir` 指令會列出該帳號底下的所有訂閱帳戶，如下圖：

![在 Azure Cloud Shell 執行 dir 指令](https://i.imgur.com/tOJzMDV.png)

>其實 Azure Cloud Shell 是基於 Ubuntu 的虛擬機，你可以透過 `uname -a` 這個指令來查詢。

## 取得 Azure 地區清單

要進入正題了，那麼要如何取得 Azure 地區清單呢？很簡單，使用下面這個 Azure CLI 指令就可以列出目前這個登入帳號所能使用的所有區域，指令如下：

```bash
az account list-locations -o table
```

而 Azure Powershell 指令如下：

```powershell
Get-AzureRMLocation
```

執行結果如下：

![Azure CLI 查詢訂閱帳戶下能使用的地區清單](https://i.imgur.com/AazO9ux.png)

![Azure Powershell 查詢訂閱帳戶下能使用的地區清單](https://i.imgur.com/giNKamf.png)

這個清單中，除了顯示區域的顯示名稱以及識別名稱外，還提供經緯度讓我們知道該資料中心的確切位置。

## 後記

我這邊簡單紀錄一下我比較常用到的地區名稱，方便我之後查詢。

DisplayName         | Latitude   | Longitude   | Name
------------------- | ---------- | ----------- | ------------------
East Asia           | 22.267     | 114.188     | eastasia
Southeast Asia      | 1.283      | 103.833     | southeastasia
West US             | 37.783     | -122.417    | westus
Japan West          | 34.6939    | 135.5022    | japanwest
Japan East          | 35.68      | 139.77      | japaneast
West Central US     | 40.890     | -110.234    | westcentralus
West US 2           | 47.233     | -119.852    | westus2
Korea Central       | 37.5665    | 126.9780    | koreacentral
Korea South         | 35.1796    | 129.0756    | koreasouth

----------

參考資料：

* [Azure 地區](https://azure.microsoft.com/zh-tw/global-infrastructure/regions/)
* [安裝 Azure CLI](https://docs.microsoft.com/zh-tw/cli/azure/install-azure-cli?view=azure-cli-latest?WT.mc_id=AZ-MVP-5003022)
* [Is there an API to list all Azure Regions?](https://stackoverflow.com/questions/44143981/is-there-an-api-to-list-all-azure-regions)
