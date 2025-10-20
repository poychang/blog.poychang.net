---
layout: post
title: 使用免費的 SSL 服務幫 Azure Web App 設定 HTTPS
date: 2020-10-08 23:07
author: Poy Chang
comments: true
categories: [Azure, Develop]
permalink: setting-azure-web-app-to-https-with-free-ssl-service/
---

對於當今網站來說，網站套上 SSL 憑證啟用 HTTPS 已經不可或缺的事情，如果沒有使用 HTTPS 協議來開啟網站，瀏覽器還會在網址列標示「不安全」，而且還會影響到 SEO 的排名，這篇介紹如何在 Azure 上建立 Web App 後，套上免費的 SSL 憑證，開啟網站 HTTPS 連線協議。

## 關於 Azure Web App

一般來說，會有在 Azure Web App 套用 SSL 憑證的情境，是因為你需要自訂網域，不然原本 Azure Web App 提供的網址是已經自帶 HTTPS，只是網址都會是 azurewebsites.net 這個結尾。

要使用自訂網域與 SSL 的功能，必須至少是使用 B1 層級，而在 Azure 上建立 Web App 非常簡單直覺，就不細講建立步驟了。

![至少要共用基礎結構的 B1 層級，才能使用自訂網域與 SSL 功能](https://i.imgur.com/cvf44dg.png)

>如果手邊沒有訂閱，請點此[建立免費的 Azure 帳戶](https://azure.microsoft.com/zh-tw/free/)，取得 12 個月免費服務以及價值 NT$6,100 的點數。

建立後，可以在該 Web App 資源的設定中，設定自訂的網址，這裡也不多提，設定完成後會在頁面下看到新增加的網域。

![完成設定自訂網域的畫面](https://i.imgur.com/KPQLbVj.png)

這裡你會發現，該自訂網域因為未設定 SSL 繫結，所以出現紅色叉叉：

![未設定 SSL 繫結](https://i.imgur.com/IZ0roAv.png)

這裡我們可以先暫停一下，先去申請一張 SSL 憑證，再接續往下做。

## 申請 SSL 憑證

想到申請免費的 SSL 憑證，你可能會想到 [Let's Encrypt](https://letsencrypt.org/zh-tw/)，不過我覺得用他申請憑證有一點複雜，這裡我使用 [Zero SSL](https://zerossl.com/) 這個網站服務申請免費的 SSL 憑證，直接在網頁上操作就可以了。

關於 Zero SSL 免費帳號的使用限制，請[參考這裡](https://zerossl.com/pricing/)，其實就是一個帳號只能有 3 張 90 天效期的 SSL 憑證。

>你可能還有聽過 [SSL For Free](https://www.sslforfree.com/)，這間公司目前已經被 Zero SSL 收購，因此現在使用 SSL For Free 申請憑證，會被導到 Zero SSL 後台。

登入 [Zero SSL](https://zerossl.com/) 後台後，你可以看到各個憑證的狀態，而且可以在這裡點選 `New Certificate` 來申請新的憑證。

![Zero SSL 後臺畫面](https://i.imgur.com/vMUNQtk.png)

申請的過程很簡單（因為很多功能都是 PRO 才有的😆），第一步基本上就是輸入你的網域，然後就可以下一步了：

![New Certificate](https://i.imgur.com/HhqZbga.png)

第二步會要你驗證你是否有該網域的權限，這裡提供 3 種驗證方式：

1. 發信到系統指定的電子信箱
2. 設定 DNS 的 CNAME
3. 下載指定檔案並上傳到網站指定位置

這邊我選擇使用第 3 種方式，你可以依照你的控制權限來選擇適合的驗證方式。

![Verify Domain](https://i.imgur.com/pAisiEu.png)

上傳檔案到指定的位置後，就可以點選 `Finalize` 中的 `Verify Domain` 讓網站去檢查，你是否有該網域的控制權。

>注意！這裡會用 HTTP 通訊協議去嘗試讀取該檔案，因此如果你的程式有自動轉到 HTTPS 的功能，要先拿掉，不然不會驗證成功。例如 ASP.NET Core 的網站，可能會用 `app.UseHttpsRedirection();` 這個中介軟體來處理這件事。我在這邊卡了一點時間。

如果驗證順利，畫面會來到下載憑證並安裝的畫面，畫面中的 Server Type 維持 `Default Format` 就好，他只會影響到下面提供的安裝步驟參考資訊，因為他沒有提供 Azure 的說明，所以這裡我們直接點選 `Download Certificate(.zip)` 下載憑證：

![下載憑證](https://i.imgur.com/YUmImRd.png)

這個壓縮檔裡面會包含下面 3 個檔案：

- ca_bundle.crt
- certificate.crt
- private.key

接著我們就可以使用這些下載下來的憑證相關檔案，安裝到 Azure Web App 中，然後完成之後點選這裡的 `Check Installation` 按鈕，這邊就完成了。

## 憑證格式轉換

當我們要拿剛剛產生的憑證來安裝到 Azure Web App 上的時候，你會發現所產生的憑證是 `.crt` 檔，Azure Web App 只接受私密金鑰憑證 (`.pfx`) 和公開金鑰憑證 (.cer) 這兩種憑證，而兩者的差別在於，PFX 格式的憑證是包含有私鑰，CER 格式的憑證裡面只有公鑰沒有私鑰。

因此我們必須要進行憑證格式轉換，詳細你可以參考這篇[憑證格式轉換 - 將 CRT 與 KEY 轉換 PFX](http://dog0416.blogspot.com/2017/08/opensslwindows-crt-key-pfx.html)操作，這裡只簡單列一下步驟：

1. 下載並安裝 [OpenSSL for Windows](http://gnuwin32.sourceforge.net/packages/openssl.htm)
2. 將 `.crt` 與 `.key` 檔案複製到 OpenSSL 的 bin 資料夾，預設路徑是 `C:\Program Files (x86)\GnuWin32\bin`
3. 用系統管理員身分開啟命令提示字元 (command line)，並 切換至 `C:\Program Files (x86)\GnuWin32\bin`
4. 執行轉換指令，過程中會要輸入匯出密碼，請記住此密碼，稍後上傳 Azure Web App 時會用到
    ```bash
    openssl pkcs12 -export -inkey private.key -in certificate.crt -out Certificate_For_Azure.pfx
    ```
5. 完成！

按照上述操作，你可以在 `C:\Program Files (x86)\GnuWin32\bin` 找到 `Certificate_For_Azure.pfx` 私密金鑰憑證。

## 設定 Azure Web App

有了 PFX 憑證後，我們回到 Azure Web App 自訂網域設定那邊，直接點選 SSL 繫結下方的`新增繫結`，並點選`上傳 PFX 憑證`，上傳的時候，會要輸入你剛剛轉換格式時，輸入的匯出密碼。

![新增繫結](https://i.imgur.com/cHDdIDi.png)

接著選取要用該 SSL 憑證保護的自訂網域，以及要使用的憑證。一般來說，這邊我們會選擇使用以伺服器名稱指示 (SNI) 的 SSL 類型。接著點選`新增繫結`就大功告成了。

![新增繫結](https://i.imgur.com/jAosjpB.png)

![大功告成](https://i.imgur.com/z8G3npZ.png)

設定資安相關的東西總是會比較繁瑣一些，記錄下來，讓大家的網站能更安全一些，不過這個憑證只有 90 天的效期，記得定期去更新一下，對於短期的活動網站，90 天的效期，其實也夠用了。

----------

參考資料：

* [憑證格式轉換 - 將 crt 與 key 轉換 pfx](https://dog0416.blogspot.com/2017/08/opensslwindows-crt-key-pfx.html)

