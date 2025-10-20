---
layout: post
title: 在 ASP.NET Core WebAPI 中使用 JWT 驗證
date: 2019-04-17 17:41
author: Poy Chang
comments: true
categories: [Dotnet, WebAPI]
permalink: authenticating-jwt-tokens-in-asp-net-core-webapi/
---

為了保護 WebAPI 僅提供合法的使用者存取，有很多機制可以做，透過 JWT (JSON Web Token) 便是其中一種方式，這篇示範如何使用官方所提供的 `System.IdentityModel.Tokens.Jwt` 擴充套件，處理呼叫 API 的來源是否為合法的使用者身分。

順道一提，要產生 JWT Token 有很多套件可以幫助開發者快速建立，[JWT](https://github.com/jwt-dotnet/jwt) 這個 NuGet 套件就是其中一個，但這裡我使用官方所提供的 `System.IdentityModel.Tokens.Jwt` 擴充套件來處理，雖然這是官方提供的版本，但寫起來一點也不困難。

> `Microsoft.IdentityModel.JsonWebTokens` 是 `System.IdentityModel.Tokens.Jwt` 的更新、更快速的版本，具有額外的功能。建議改用 [Microsoft.IdentityModel.JsonWebTokens](https://www.nuget.org/packages/Microsoft.IdentityModel.JsonWebTokens)。

## 建立專案

使用 Visual Studio 2019 建立 ASP.NET Core WebAPI 專案後，首先修改 `Startup.cs` 中的 `ConfigureServices` 方法，設定這個 WebAPI 站台要使用哪種方式來驗證 HTTP Request 是否合法，程式碼如下：

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // STEP1: 設定用哪種方式驗證 HTTP Request 是否合法
    services
        // 檢查 HTTP Header 的 Authorization 是否有 JWT Bearer Token
        .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        // 設定 JWT Bearer Token 的檢查選項
        .AddJwtBearer(options =>
        {
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = Configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = Configuration["Jwt:Issuer"],
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:SecureKey"]))
            };
        });
}
```

這裡我們設定系統在驗證 JWT Token 時，必須要符合以下 4 個條件：

1. 相同的 Issuer 設定值
2. 相同的 Audience 設定值
3. 驗證 Token 有效期限
4. 符合對稱式加密的簽章

接者一樣在 `Startup.cs` 中的 `Configure` 加入驗證權限用的 Middleware，讓每次進來的 HTTP Request 都會經過此層驗證機制，程式碼如下：

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    // 略...

    // STEP2: 使用驗證權限的 Middleware
    app.UseAuthentication();

    app.UseHttpsRedirection();
    app.UseMvc();
}
```

如此一來網站的基本設定就搞定了。

## 取得 JWT Token

要如何產生 JWT Token 呢？這裡我們建立了一個 `AuthController` 控制器來產生所需要的 JWT Token，流程如下：

0. 身分驗證
1. 建立使用者聲明資訊
2. 取得加密金鑰
3. 建立 JWT Token

身分驗證是你的需求自行實作，驗證後可將取得的使用者資訊（非機敏資訊）包進使用者的 Claim 聲明中，這些資訊將會是 JWT Payload 的一部分，這裡的 Claim 聲明資訊也可以根據你的需求客制增加。

我們知道 JWT 是用三部分 Header、Payload 和 Signature，並使用**點**（.）將三個部分連結起來成為一個字串，Signature 這部分會是 Header、Payload 加上一組 Secret 做雜湊運算產生出來的，用來驗證整個 JWT 資訊是沒有被竄改過。加密金鑰這段雖然是選用，但還是相當建議加上去，增加安全強度。

接著透過 `Microsoft.IdentityModel.JsonWebTokens` 這個命名空間底下的 `JsonWebTokenHandler` 來產生 JWT Token，而 JWT Token 的內容描述則交由 `SecurityTokenDescriptor` 來組合，在 JWT Token 的內容描述中，請根據需求做調整。

如此一來就可以產生所需要的 JWT Token 了。

```csharp
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;

    public AuthController(IConfiguration configuration)
    {
        _config = configuration;
    }

    // GET api/auth/login
    [HttpGet, Route("login")]
    public IActionResult Login(string name)
    {
        // STEP0: 在產生 JWT Token 之前，可以依需求做身分驗證

        // STEP1: 建立使用者的 Claims 聲明，這會是 JWT Payload 的一部分
        var userClaims = new ClaimsIdentity(new[] {
            new Claim(JwtRegisteredClaimNames.NameId, name),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim("Custom", "Anything You Like")
        });
        // STEP2: 取得對稱式加密 JWT Signature 的金鑰
        // 這部分是選用，但此範例在 Startup.cs 中有設定 ValidateIssuerSigningKey = true 所以這裡必填
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:SecureKey"]));
        // STEP3: 建立 JWT TokenHandler 以及用於描述 JWT 的 TokenDescriptor
        var tokenHandler = new JsonWebTokenHandler();
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _config["Jwt:Issuer"],
            Audience = _config["Jwt:Issuer"],
            Subject = userClaims,
            Expires = DateTime.Now.AddMinutes(30),
            SigningCredentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256)
        };
        // 產出 JWT
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new ContentResult() { Content = token };
    }
}
```

## 如何使用

使用上非常簡單，只要掛上需要的裝飾器即可，這裡建立了 `ValuesController` 做測試，分別掛上 `[AllowAnonymous]` 和 `[Authorize]`，前者是給匿名登入使用，也就是不需要有 JWT Token 也能執行，後者則必須要在 HTTP 的 Authorization Header 必須設定合法的 JWT Bearer Token 才能使用。

```csharp
[Route("api/[controller]")]
[ApiController]
public class ValuesController : ControllerBase
{
    // GET api/values/anonymous
    /// <summary>使用匿名登入，無視於身分驗證</summary>
    [AllowAnonymous]
    [HttpGet, Route("anonymous")]
    public IActionResult Anonymous()
    {
        return new ContentResult() { Content = $@"For all anonymous." };
    }

    // GET api/values/authorize
    /// <summary>使用身分驗證，HTTP 的 Authorization Header 必須設定合法的 JWT Bearer Token 才能使用</summary>
    [Authorize]
    [HttpGet, Route("authorize")]
    public IActionResult All()
    {
        return new ContentResult() { Content = $@"For all client who authorize." };
    }
}
```

這個驗證裝飾器還可以有很多種玩法，例如根據所建立的驗證 Policy 做驗證，或根據使用者 Claim 聲明的角色做驗證，提供了很大的彈性來處理。

### JwtRegisteredClaimNames 屬性說明

在建立使用者的 Claims 聲明時，我們會用到很多 `JwtRegisteredClaimNames` 結構型別，來取得是先定義好的字串，在 `Microsoft.IdentityModel.JsonWebTokens` 命名空間中的 `JwtRegisteredClaimNames` 定義了很多 JWT 會用到的聲明，但[官方文件](https://learn.microsoft.com/en-us/dotnet/api/microsoft.identitymodel.jsonwebtokens.jwtregisteredclaimnames?WT.mc_id=DT-MVP-5003022)說明相當的少，自行整理了如下：

| 聲明欄位   | 說明                                                 | 連結                                                                  |
| ---------- | ---------------------------------------------------- | --------------------------------------------------------------------- |
| Jti        | 表示 JWT ID，Token 的唯一識別碼                      | http://tools.ietf.org/html/rfc7519#section-4                          |
| Iss        | 表示 Issuer，發送 Token 的發行者                     | http://tools.ietf.org/html/rfc7519#section-4                          |
| Iat        | 表示 Issued At，Token 的建立時間                     | http://tools.ietf.org/html/rfc7519#section-4                          |
| Exp        | 表示 Expiration Time，Token 的逾期時間               | http://tools.ietf.org/html/rfc7519#section-4                          |
| Sub        | 表示 Subject，Token 的主體內容                       | http://tools.ietf.org/html/rfc7519#section-4                          |
| Aud        | 表示 Audience，接收 Token 的觀眾                     | http://tools.ietf.org/html/rfc7519#section-4                          |
| Typ        | 表示 Token 的類型，例如 JWT 表示 JSON Web Token 類型 | http://tools.ietf.org/html/rfc7519#section-4                          |
| Nbf        | 表示 Not Before，定義在什麼時間之前，不可用          | http://tools.ietf.org/html/rfc7519#section-4                          |
| Actort     | 識別執行授權的代理是誰                               | http://tools.ietf.org/html/rfc7519#section-4                          |
| Prn        |                                                      | http://tools.ietf.org/html/rfc7519#section-4                          |
| Nonce      |                                                      | http://tools.ietf.org/html/rfc7519#section-4                          |
| NameId     | 使用者識別碼                                         | http://tools.ietf.org/html/rfc7519#section-4                          |
| FamilyName | 使用者姓氏                                           | http://tools.ietf.org/html/rfc7519#section-4                          |
| GivenName  | 使用者名字                                           | http://tools.ietf.org/html/rfc7519#section-4                          |
| Gender     | 使用者性別                                           | http://tools.ietf.org/html/rfc7519#section-4                          |
| Email      | 使用者的電子郵件                                     | http://tools.ietf.org/html/rfc7519#section-4                          |
| Birthdate  | 使用者生日                                           | http://tools.ietf.org/html/rfc7519#section-4                          |
| Website    | 使用者的網站                                         | http://tools.ietf.org/html/rfc7519#section-4                          |
| CHash      |                                                      | http://tools.ietf.org/html/rfc7519#section-4                          |
| UniqueName |                                                      | http://tools.ietf.org/html/rfc7519#section-4                          |
| AtHash     |                                                      | http://openid.net/specs/openid-connect-core-1_0.html#CodeIDToken      |
| Acr        |                                                      | http://openid.net/specs/openid-connect-core-1_0.html#IDToken          |
| Amr        |                                                      | http://openid.net/specs/openid-connect-core-1_0.html#IDToken          |
| Azp        |                                                      | http://openid.net/specs/openid-connect-core-1_0.html#IDToken          |
| AuthTime   |                                                      | http://openid.net/specs/openid-connect-core-1_0.html#IDToken          |
| Sid        |                                                      | http://openid.net/specs/openid-connect-frontchannel-1_0.html#OPLogout |

> 有些定義的聲明欄位很難找到說明，有找到相關資訊再陸續補充。

## 程式碼

關於本篇文章完整的程式碼發布於 GitHub：[poychang/Demo-WebAPI-Jwt-Auth](https://github.com/poychang/Demo-WebAPI-Jwt-Auth)，請參考裡面的 `SimpleJwtAuth` 專案。

----------

參考資料：

- [JWT JSON Web Token 使用 ASP.NET Core 2.0 Web API 的逐步練習教學與各種情境測試](https://csharpkh.blogspot.com/2018/04/jwt-json-web-token-aspnet-core.html)
- [aspnet-core-webapi-jwt-auth-example](https://github.com/williamhallatt/aspnet-core-webapi-jwt-auth-example)
- [ASP.NET Core 中的那些認證中間件及一些重要知識點](http://www.qingruanit.net/c_all/article_6645.html)
- [Asp.net Core WebApi 項目使用Jwt進行授權管理和權限驗證](http://zhaokuohaha.github.io/2017/01/07/webapijwt/)
- [asp.net core 2.0 web api 基於 JWT 自定義策略授權](http://www.itread01.com/articles/1505620631.html)
- [Issuing and authenticating JWT tokens in ASP.NET Core WebAPI – Part I](https://goblincoding.com/2016/07/03/issuing-and-authenticating-jwt-tokens-in-asp-net-core-webapi-part-i/)
- [移轉的驗證和身份識別，ASP.NET Core 2.0](https://docs.microsoft.com/zh-tw/aspnet/core/migration/1x-to-2x/identity-2x?WT.mc_id=DT-MVP-5003022)
- [RFC7519 - JSON Web Token - JWT Claims](https://tools.ietf.org/html/rfc7519#section-4)
