---
layout: post
title: 在安裝 Zscaler 的電腦上使用 npm 安裝套件時出現無法取得憑證的錯誤
date: 2021-11-17 09:47
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: npm-unable-get-local-issuer-certificate-behind-zscaler/
---
我們知道要安裝 Azure DevOps 上私有的 npm 套件需要安裝 vsts-npm-auth 套件，詳細作法可以參考[在 VSTS 中建立 npm 套件管理平台](http://edwardkuo.github.io/paper/2017/08/10/Devops/VSTSNpm/)這篇文章，但企業內部可能為了資安，使用了 Zscaler 這類型的資安服務，而置換了連線過程的 SSL CA 憑證，所以在安裝 npm 套件時，可能會出現 `unable to get local issuer certificate` 錯誤，這時候該怎麼辦？

因為網路設備置換了 SSL 的 CA 憑證，因此你在安裝 npm 套件時會出現如下的錯誤畫面：

![unable to get local issuer certificate 錯誤訊息](https://i.imgur.com/HsNnXpJ.png)

這裡提供幾種處理方法。

## 方法一

使用以下指令，關閉 npm 的 SSL 檢查機制：

```powershell
npm config set strict-ssl false
```

但這樣做容易有安全上的疑慮，例如連線到惡意網站下載惡意套件，這樣的風險是可以藉由方法二來避免的。

## 方法二

Zscaler 官方[這份文件](https://help.zscaler.com/zia/adding-custom-certificate-application-specific-trusted-store#cafile)有提到關於 NPM 要如何處理 CA 憑證的問題，方法如下：

```powershell
# 下載 CA 憑證，並放在家目錄下
copy "T:\Temp\Poy Chang\Zscaler Cert\ZscalerRootCertificate-2048-SHA256.crt" $env:USERPROFILE
# 設定 npm 的設定檔，<Path to Certificate> 請改成你的 CA 憑證檔案的路徑，也就是上面的儲存路徑
npm config set cafile <Path to Certificate>/ZscalerRootCertificate-2048-SHA256.crt
```

這裡透過 npm config 中的 cafile 設定，這個設定可以加入多個 CA 根憑證，相關說明文件請參考[這裡](https://docs.npmjs.com/cli/v8/using-npm/config#cafile)。

## 方法三

告訴 npm 我們有另外一個 CA 憑證，請使用這個憑證來處理 SSL 驗證，只需要在環境變數中增加一個 `NODE_EXTRA_CA_CERTS` 變數，並指定 CA 憑證的位置即可，PowerShell 指令如下：

```powershell
# 下載 CA 憑證，並放在家目錄下
copy "T:\Temp\Poy Chang\Zscaler Cert\ZscalerRootCertificate-2048-SHA256.crt" $env:USERPROFILE
# 設定環境變數，並指定 CA 憑證的位置
$NODE_EXTRA_CA_CERTS = "$env:USERPROFILE\ZscalerRootCertificate-2048-SHA256.crt"
[System.Environment]::SetEnvironmentVariable("NODE_EXTRA_CA_CERTS", $NODE_EXTRA_CA_CERTS, "User")
```

接者檢查系統的環境變數是否有設定好 `NODE_EXTRA_CA_CERTS` 這個設定值，你可以參考下列 PowerShell 指令：

```powershell
[System.Environment]::GetEnvironmentVariable('NODE_EXTRA_CA_CERTS')
```

查詢結果的畫面如下：

![查詢環境變數是否有 NODE_EXTRA_CA_CERTS 設定值](https://i.imgur.com/QZXxxRg.png)

如此一來 npm 在連線到套件網站時，就不會因為憑證無法驗證，造成問題了。

## 後記

我猜很多人會有跟我一樣的問題，不知道 Zscaler 的 CA 根憑證要去哪裡取得，這裡提供一個方法，可以透過瀏覽器的檢視憑證工具，藉由查看網站的憑證，然後使用匯出功能，這樣就可以取得 Zscaler 的 CA 根憑證了。

簡單步驟如下：

1. 用瀏覽器開啟一個會使用到 Zscaler CA 憑證的網站，例如 https://registry.npmjs.com/
2. 點選網址列中的鎖頭，然後選擇 `Connection is secure`
    ![點選鎖頭，查看連線](https://i.imgur.com/MVGZxrr.png)
3. 點選右上的憑證圖示，查看憑證內容
    ![點選右上的憑證圖示查看憑證內容](https://i.imgur.com/bQoyN0E.png)
4. 點選憑證中最上方的 Root CA 憑證，然後點選右下角的匯出 Export 按鈕
    ![點選 Root CA 憑證並匯出](https://i.imgur.com/QcmTFi6.png)

這樣一來你就取得 Zscaler 的 CA 根憑證了。

----------

參考資料：

- [npm 安裝套件時發生 unable to get local issuer certificate 錯誤](https://blog.darkthread.net/blog/npm-unable-get-local-issuer-cert-issue/)
- [Zscaler Docs - Adding Custom Certificate to an Application Specific Trusted Store](https://help.zscaler.com/zia/adding-custom-certificate-application-specific-trusted-store#cafile)
