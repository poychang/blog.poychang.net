---
layout: post
title: 關閉 Azure CLI 的 SSL 檢查（非必要別這樣做）
date: 2023-12-11 10:48
author: Poy Chang
comments: true
categories: [Azure, Develop, PowerShell, Tools]
permalink: disable-ssl-verify-with-azure-cli/
---

在一些特殊的情境下，要安裝或更新 Azure CLI 擴充套件時，出現 SSL Error 是相當惱人的事情，這時候你可以考慮`暫時`關閉 Azure CLI 的 SSL 檢查，但是這不是一個好的做法，因為這樣做會讓你的 Azure CLI 變得不安全，所以非必要的情況下，請不要這樣做。

![安裝 Azure CLI 擴充套件時出現 SSL Error](https://i.imgur.com/Z6Wua68.png)

```log
Unable to get extension index.
Please ensure you have network connection. Error detail: HTTPSConnectionPool(host='azcliextensionsync.blob.core.windows.net', port=443): Max retries exceeded with url: /index1/index.json (Caused by SSLError(SSLCertVerificationError(1, '[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1006)')))
```

當你在安裝 Azure CLI 擴充套件時看見這樣的錯誤訊息，多半就是連線時有憑證發生問題。

當然，如果可以找到合適的處理方式，例如補上相關的憑證，或調整中繼憑證的驗證方式，那就不用關閉 Azure CLI 的 SSL 檢查，但是如果你不知道怎麼做，或是沒有權限去做，那就可以考慮`暫時`關閉 Azure CLI 的 SSL 檢查。

在 PowerShell 的環境下，只要設定兩個環境變數，就可以告訴 Azure CLI 不要去檢查 SSL 憑證：

```powershell
$env:ADAL_PYTHON_SSL_NO_VERIFY = '1'
$env:AZURE_CLI_DISABLE_CONNECTION_VERIFICATION = '1'
```

接著就可以安裝或更新你的 Azure CLI 擴充套件了。

![成功安裝](https://i.imgur.com/hwKXgvK.png)

最後，還是要說一下，這是一種 WorkAround 的作法，要知道自己在做甚麼，千萬不要因為便利的快速解而忘了安全性。

---

參考資料：

* [SSL handshake error with some Azure CLI commands](https://stackoverflow.com/questions/55463706/ssl-handshake-error-with-some-azure-cli-commands)
