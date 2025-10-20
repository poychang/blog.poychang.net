---
layout: post
title: 在安裝 Zscaler 的電腦上安裝 Azure DevOps CLI
date: 2021-11-16 18:21
author: Poy Chang
comments: true
categories: [Azure, Develop, PowerShell, Tools]
permalink: install-azure-devops-cli-behind-zscaler/
---

由於 Zscaler 會抽換中繼憑證，造成在安裝 Azure DevOps CLI 擴充功能的時候，會因為無法合法的辨識 Zscaler 中繼憑證，而無法安裝成功，這篇提供一個方法來解決這個問題。

錯誤訊息可能會長得像下面這樣：

```log
Please ensure you have network connection. Error detail: HTTPSConnectionPool(host='objects.githubusercontent.com', port=443): Max retries exceeded with url: /github-production-release-asset-2e65be/107708057/86b7deeb-d3c5-4f14-87dd-22e5e47e9f1c?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=releaseassetproduction%2F20250602%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20250602T030130Z&X-Amz-Expires=300&X-Amz-Signature=44dd58a86bde6dc8bf8b5477272ad7470b1ec8ca1edc64e3311fbee8c2135d83&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%3Dazure_devops-0.22.0-py2.py3-none-any.whl&response-content-type=application%2Foctet-stream (Caused by SSLError(SSLCertVerificationError(1, '[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1000)')))
```

## 安裝 Azure CLI

首先若電腦還沒有安裝 Azure CLI，可以參考[官方這篇文章](https://docs.microsoft.com/zh-tw/cli/azure/install-azure-cli?WT.mc_id=DT-MVP-5003022)來進行安裝，但如果手邊的電腦只能手動安裝，這時請使用下列連結下載 `.msi` 安裝檔進行安裝：[https://aka.ms/installazurecliwindows](https://aka.ms/installazurecliwindows)。

## 安裝 Azure DevOps CLI 擴充功能

因為在安裝了 Zscaler 的電腦，會因為保護資安的原因抽換中繼憑證，造成無法直接使用 `az extension add --name azure-devops` 這樣的方式進行安裝 Azure CLI 的擴充套件，必須明確指定檔案來源，因此要先到 [Azure DevOps CLI 的 GitHub](https://github.com/Azure/azure-devops-cli-extension)，從 Release 中找到最新版的 Python Whell File (.whl 檔)來安裝，範例指令如下：

```bash
az extension add --source https://github.com/Azure/azure-devops-cli-extension/releases/download/20240514.1/azure_devops-1.0.1-py2.py3-none-any.whl
```

>你可以在上述指令加上 `--debug` 來顯示更多資訊。

但是到這裡，你會發現上述指令即使指定了安裝檔的來源位置，依然無法正確，因為 Zscaler 抽換了中繼憑證所致，所以我們必須讓這個安裝擴充功能的背後機制，認識這個中繼憑證。

## 加入 Zscaler 中繼憑證

首先請先檢查 Azure CLI 所內建的 Python 是否有安裝 certifi 這個套件，你可以使用下列指令來確認或進行安裝：

>這裡請注意！最好要切換到 Azure CLI 的 Python.exe 目錄下進行操作，避免和系統另外安裝的 Python 混淆。

```powershell
# 切換到 Azure CLI 的 Python.exe 目錄，位置可能因版本而不同
cd "C:\Program Files\Microsoft SDKs\Azure\CLI2\"
# 檢查是否有安裝 certifi 套件及原始的憑證檔
./python.exe -m certifi
# 若沒有請使用以下指令來安裝，--trusted-host 為忽略 SSL 相關檢查
./pip.exe install --upgrade certifi --trusted-host pypi.org --trusted-host files.pythonhosted.org
```

接著請下載 ZscalerRootCertificate-2048-SHA256.crt 這張 Zscaler 根憑證檔，並使用下列指令將其加入至 Azure CLI 內建的 Python certifi 中：

```powershell
gc .\ZscalerRootCertificate-2048-SHA256.crt | ac "C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\Lib\site-packages\pip\_vendor\certifi\cacert.pem"
```

## 再安裝一次 Azure DevOps CLI 擴充功能

到這裡就大功告成了，再使用上述安裝 Azure DevOps CLI 擴充功能的指令進行安裝就可以囉！

最後可以使用 `az login` 來登入你的 Azure 帳號來操作相關資源，或用 `az devops -h` 來確認 Azure DevOps CLI 是否能正確執行。

----------

參考資料：

* [Installing TLS / SSL ROOT Certificates to non-standard environments](https://community.zscaler.com/t/installing-tls-ssl-root-certificates-to-non-standard-environments/7261)
* [MS Docs - 如何安裝 Azure CLI](https://docs.microsoft.com/zh-tw/cli/azure/install-azure-cli?WT.mc_id=DT-MVP-5003022)
* [MS Docs - Azure DevOps CLI 入門](https://docs.microsoft.com/zh-tw/azure/devops/cli/?view=azure-devops?WT.mc_id=DT-MVP-5003022)
