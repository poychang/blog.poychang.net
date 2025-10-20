---
layout: post
title: 串接 Okta OAuth 製作使用者身分認證平台
date: 2025-04-30 09:13
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, WebAPI]
permalink: connecting-okta-oauth-to-create-auth-platform/
---

[Okta](https://okta.com/) 提供網路身分認證的服務，透過雲端平台來協助企業員工進行身分認證、單一登入、使用者資料庫維護等，其中我們可以使用單一登入 (Single Sign-On) 的功能，來達到應用程式的身分認證，甚至也可以使用對應的 API 或服務，打造客製化的身分認證及授權系統。這篇將使用 ASP.NET Core WebAPI 串接 Okta 來建立使用者身分認證平台。

# 建立 Okta 應用程式

Okta 本身可以讓你建立多組應用程式，讓你為每一個應用程式各自做身分認證，不過我的目標是想要提供一站式的平台 API 服務，讓身分認證以及客製的授權功能整合在一起，因此我只需要一組應用程式的設定即可。

>要測試 SaaS 服務，首先要先到該服務的網站上，建立並登入帳號，你可以[從這裡](https://www.okta.com/free-trial/customer-identity/)來建立測試用的帳號。

在 Okta 平台上開啟管理應用程式的選單：

![Okta 的管理應用程式畫面](https://i.imgur.com/7DGZ0Ag.png)

點選 `Create Application Integration` 來建立新的應用程式，這時會出現 4 個選項：

- OIDC - OpenID Connect
- SAML 2.0
- SWA - Secure Web Authentication
- API Services

這裡我們選擇以 OAuth 2.0 為認證協議的 OIDC 來建立串接，對應的應用程式類型則選擇 `Web Application`：

![建立使用 OIDC 來串接的 Web Application 應用設定](https://i.imgur.com/1aWpoC5.png)

接著會讓你設定該應用程式的詳細設定，其中比較重要的是 `Sign-in redirect URIs` 區塊，這在 OAuth 協議中扮演著重要的角色，這裡我們可以設定一個或多個網址，這些網址會在你登入 Okta 成功之後，將使用者的身分資訊帶到這些網址，這樣你的應用程式就可以使用使用者的身分資訊來做身分認證。

這區塊我會設定三個網址，分別是：

1. `https://localhost:5001/api/Authorize/Callback`
2. `https://[YOUR_DOMAIN]/api/Authorize/Callback`
3. `https://oauth.pstmn.io/v1/callback`

第一個是在本機測試時使用，第二個是放到外部網路可以存取到的地方，例如 Azure 雲端上，讓這個平台也能在網際網路中使用。

如果你有要使用 Postman 來做測試了話，才需要第三個網址，這是讓 Postman 能順利自動取得 OAuth 的 AccessToken 的網址。

接著儲存之後，你會在畫面中找到 Client Credentials，這裡的 Client ID 和 Client Secret 很重要，這是用來取得 AccessToken 用的。

# 目標：用平台簡化 Okta OAuth 認證流程

![Authorization Code flow](https://i.imgur.com/dPfndCA.png)

上圖是 Okta 所提供的 OAuth 2.0 運作流程，順著上圖的順序，動作如下：

1. 使用者開啟應用程式，應用程式夾帶 Okta Client ID 和必要資訊發送請求到 `/authorize`
2. 使用者瀏覽器會轉跳到 Okta 登入畫面，請使用者登入帳號
3. 使用者登入資訊會交由 Okta 進行驗證
4. 如果驗證成功，Okta 會回傳一個 Authorization Code，這個 Code 只能被使用一次
5. 應用程式發送 Authorization Code 和 Client Secret 到 `/token`
6. Okta 回傳 Access Token、ID Token 或是 Refresh Token
7. 應用程式使用上述取得的 Token 來向資源伺服器取得資源
8. 資源伺服器回傳資源

>官方文件：[Implement authorization by grant type](https://developer.okta.com/docs/guides/implement-grant-type/authcode/main/)

我們的目標是要將這流程的動作變成：

1. 使用者開啟應用程式，應用程式夾帶 callbackUrl 藉由平台轉跳到 Okta 登入畫面，請使用者登入帳號
2. 使用者登入成功，平台自動向 Okta 取得授權的 AccessToken
3. 平台向資源伺服器取得資源
4. 平台將資源回傳給應用程式

完整範例程式碼請參考 [poychang/OktaOAuthAPI](https://github.com/poychang/OktaOAuthAPI)。

----------

參考資料：

* [How is OAuth 2 different from OAuth 1?](https://stackoverflow.com/questions/4113934/how-is-oauth-2-different-from-oauth-1)
* [Okta Docs - Implement authorization by grant type](https://developer.okta.com/docs/guides/implement-grant-type/authcode/main/)
* [Okta Docs - OpenID Connect & OAuth 2.0 API](https://developer.okta.com/docs/reference/api/oidc/)
