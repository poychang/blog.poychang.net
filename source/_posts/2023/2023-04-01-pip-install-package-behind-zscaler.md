---
layout: post
title: 在安裝 Zscaler 的電腦上執行 pip 安裝 Python 套件
date: 2023-04-01 16:57
author: Poy Chang
comments: true
categories: [Python, Develop, Tools]
permalink: pip-install-package-behind-zscaler/
---

Python 的開發者應該都知道 Python 安裝套件時，是使用 `pip install package` 的指令，但是在企業內部環境中，網路可能會因為一些設定而無法直接使用此指令安裝套件，例如因為無法合法的辨識 Zscaler 中繼憑證，而導致無法成功安裝 Python 套件，這篇提供一個方法來解決這個問題。

專案中通常會用到不只一個套件，因此為了管理方便，我們會將要安裝的套件名稱及版本寫在 `requirements.txt` 中，這樣在安裝套件時，就可以直接使用 `pip install -r requirements.txt` 來安裝所有套件。

但在中繼憑證被 Zscaler 抽換之後，你在使用 pip 來安裝套件時，會遇到如下的錯誤訊息，所以我們必須讓 pip 這個套件管理器認識 Zscaler 的根憑證。

![錯誤訊息](https://i.imgur.com/4cR0Vwh.png)

```log
WARNING: Retrying (Retry(total=3, connect=None, read=None, redirect=None, status=None)) after connection broken by 'SSLError(SSLCertVerificationError(1, '[SSL: CERTIFICATE_VERIFY_FAILED] certificate Verify faited: setf signed certificate in certificate chain ( _ssl.c:997)'))'
```

## 加入 Zscaler 憑證

在 Zscaler 的官方文件中（[這份](https://help.zscaler.com/zia/adding-custom-certificate-application-specific-trust-store)）有提供多種方法讓你處理這個問題，我們這邊選擇使用調整 pip 的 certifi 來解決這個問題。

首先，要先知道 pip 這個套件管理器的位置，每個人所安裝的位置可能不一樣，不過可以使用 `pip --version` 來查看 pip 的版本和位置。

例如，在我的電腦執行 `pip --version` 這個指令，就會顯示下面的訊息：

```
pip 23.0.1 from C:\Users\poychang\AppData\Local\Programs\Python\Python311\Lib\site-packages\pip (python 3.11)
```

其中 `C:\Users\poychang\AppData\Local\Programs\Python\Python311\Lib\site-packages\pip` 這個路徑是關鍵，我們要將 Zscaler 的根憑證加入到這個路徑中位於 `_vendor` 資料夾下的 `certifi` 套件中的 `cacert.pem`。

接著，請下載 ZscalerRootCertificate-2048-SHA256.crt 這張 Zscaler 根憑證檔之後，並使用下列指令將其加入至 Python 和 pip 的 certifi 中：


```bash
# 檢查是否有安裝 certifi 套件及原始的憑證檔
./python.exe -m certifi
# 如果沒有安裝，執行這行指令後會顯示 No module named certifi
# 有安裝了話，會顯示 cacert.pem 路徑

# 若沒有請使用以下指令來安裝，--trusted-host 為忽略 SSL 相關檢查
./pip.exe install --upgrade certifi --trusted-host pypi.org --trusted-host files.pythonhosted.org
```

接著分別對 Python 和 pip 的 `cacert.pem` 做調整：

```bash
# 調整 Python 的 certifi 套件的 cacert.pem
gc .\ZscalerRootCertificate-2048-SHA256.crt | ac "C:\Users\poychang\AppData\Local\Programs\Python\Python311\Lib\site-packages\certifi\cacert.pem"
# 調整 pip 的 certifi 套件的 cacert.pem
gc .\ZscalerRootCertificate-2048-SHA256.crt | ac "C:\Users\poychang\AppData\Local\Programs\Python\Python311\Lib\site-packages\pip\_vendor\certifi\cacert.pem"
```

如此一來就可以正常使用 pip 來安裝套件了。

---

參考資料：

* [Zscaler Docs - Adding Custom Certificate to an Application Specific Trusted Store](https://help.zscaler.com/zia/adding-custom-certificate-application-specific-trust-store#pip-set-cacert)
