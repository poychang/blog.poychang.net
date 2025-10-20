---
layout: post
title: 查詢手動安裝 Azure CLI 擴充功能的安裝腳本檔案
date: 2021-11-26 09:28
author: Poy Chang
comments: true
categories: [Azure, Develop, PowerShell, Tools]
permalink: find-install-script-for-manual-install-azure-cli-extension/
---

Azure CLI 有需多好用的擴充功能，一般來說我們只要用內建的指令加上擴充功能的名稱就可以安裝了，但有時候在某些環境只能透過指定安裝腳本檔案來源的方式進行手動安裝，而這個安裝腳本檔的位置並沒有列在官方文件上，那麼該怎麼辦呢？

通常要安裝 Azure CLI 擴充功能，可以使用 `az extension add --name <extension-name>` 的方式進行安裝，你也可以明確指定安裝腳本檔案的來源，這部分會使用 Python Whell File (.whl 檔)來安裝，範例指令如下：

```powershell
# 安裝 application_insights 擴充功能
az extension add --source https://azurecliprod.blob.core.windows.net/cli-extensions/application_insights-0.1.3-py2.py3-none-any.whl
```

但是要如何找到每個 Azure CLI 擴充功能的安裝腳本檔案呢？

首先，你可以從這份官方文件：[可用 Azure CLI 擴充功能](https://docs.microsoft.com/en-us/cli/azure/azure-cli-extensions-list?WT.mc_id=DT-MVP-5003022)找到你想要安裝的擴充功能的名字。

>建議開英文的文件網站，因為有時候機器翻譯會把擴充功能的名字給翻譯了，反而不知道正確的名字。

接著你可以到 GitHub 上，找到 [Azure/azure-cli-extensions](https://github.com/Azure/azure-cli-extensions) 專案，這裡面會有所有 Azure CLI 擴充功能的原始碼，而且在專案說明文件上有個重點資訊：

```
https://aka.ms/azure-cli-extension-index-v1
```

我們在使用 `az extension list-available` 查詢可安裝的擴充功能清單時，就是用這個網址（其實背後是 https://azcliextensionsync.blob.core.windows.net/index1/index.json，上面的只是短網址）來取得所有擴充功能的安裝資訊。

直接用瀏覽器打開網址，就可以搜尋到你想要安裝的 Azure CLI 擴充功能的相關資訊，尤其是這裡我們需要的 `downloadUrl`：

![Azure CLI 擴充功能索引資訊](https://i.imgur.com/HkKwbyD.png)

如此一來我們就可以使用上面的安裝指令，搭配安裝腳本檔案的網址進行安裝。

## 後記

如果使用上面的安裝腳本檔案的網址會被資安設備擋住了話，例如出現下面這樣的錯誤訊息，這是因為資安設備把 `azcliextensionsync.blob.core.windows.net` 這個網址擋住了，這時我們也可以手動下載那個安裝腳本到本機，然後安裝指令的 `--source` 參數改成指到本機的檔案路徑。

```
Unable to get extension index.
Please ensure you have network connection. Error detail: HTTPSConnectionPool(host='azcliextensionsync.blob.core.windows.net', port=443): Max retries exceeded with url: /index1/index.json (Caused by SSLError(SSLCertVerificationError(1, '[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1125)')))
```

----------

參考資料：

* [MS Docs - 使用和管理擴充功能與 Azure CLI](https://docs.microsoft.com/en-us/cli/azure/azure-cli-extensions-overview?WT.mc_id=DT-MVP-5003022)
* [MS Docs - Available Azure CLI extensions](https://docs.microsoft.com/en-us/cli/azure/azure-cli-extensions-list?WT.mc_id=DT-MVP-5003022)
* [GitHub - Azure/azure-cli-extensions](https://github.com/Azure/azure-cli-extensions)
