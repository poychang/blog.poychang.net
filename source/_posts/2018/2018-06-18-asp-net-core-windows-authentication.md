---
layout: post
title: 在 ASP.NET Core WebAPI 中做 Windows 驗證
date: 2018-06-18 19:30
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, WebAPI]
permalink: asp-net-core-windows-authentication/
---
建立 REST 服務的 WebAPI 大多會採用 Token 的方式作為呼叫驗證，不過有時候在企業內部，我們會想要使用 AD 作為身分驗證，也就是使用 Windows 驗證，在 WinForm 的時代，我們可以從 IIS 或設定 `Web.config` 來開啟 Windows 驗證的機制，那麼在 ASP.NET Core WebAPI 中我們可以怎麼做呢？

## 啟動 Windows 驗證

首先，我們先使用 ASP.NET Core WebAPI 專案範本建立一個 WebAPI 專案，或參考本篇完整範例程式碼 [poychang/Demo-Net-Core-Auth](https://github.com/poychang/Demo-Net-Core-Auth) 中的 WindowsSecurity 專案。

![專案資料夾結構](https://i.imgur.com/ddaB859.png)

在專案資料夾中，有個 `Properties` 資料夾，裡面的 `launchSettings.json` 檔案可以設定本機開發的環境，除此之外，我們還可以透過 `iisSettings` 這個區段來設定之後部屬到 IIS 後的相關設定，這裡我們就可以啟動 IIS 的 Windows 驗證，或匿名驗證的機制，請參考下面程式碼加入 `windowsAuthentication` 和 `anonymousAuthentication` 並根據需求做相關設定。

```json
{
  "iisSettings": {
    "windowsAuthentication": true,
    "anonymousAuthentication": false,
    "iisExpress": {
      "applicationUrl": "http://localhost:60164/",
      "sslPort": 0
    }
  },
  //...
}
```

到目前為止，如果你直接啟動網站，是可以正常運行的，並且你可以透過 `User.Identity.Name` 來取得本機登入的使用者名稱，或是透過 `User.Claims` 來取得所有使用者的帳號屬性，可以試著修改 `ValuesController` 加入以下程式碼做測試：

```csharp
[Route("api/[controller]")]
public class ValuesController : Controller
{
    // GET api/values/iisAuthorize
    [Route("iisAuthorize")]
    [HttpGet]
    public IActionResult IisAuthorize()
    {
        var name = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name)?.Value;
        return new ContentResult() { Content = $@"IIS authorize. {name}" };
    }
}
```

![Windows 整合驗證的對話框](https://i.imgur.com/ajMnDhE.png)

此時瀏覽網頁，會跳出 Windows 整合驗證的對話框，請輸入本機的使用者帳號密碼。

![成功驗證後的畫面](https://i.imgur.com/IwXK2xU.png)

## 整合 WebAPI 與 Windows 驗證

接著我們要加入 Windows 驗證的 Middleware 來讓 WebAPI 框架整合 Windows 驗證，這裡我們要修改 `Startup.cs`：

第一，修改 `ConfigureServices`，透過 Option Pattern 加入 IIS 設定來啟動自動驗證，接著加入驗證服務並使用 IIS 預設的驗證配置：

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc();
    services.Configure<IISOptions>(options => { options.AutomaticAuthentication = true; });
    services.AddAuthentication(IISDefaults.AuthenticationScheme);
}
```

第二，修改 `Configure`，加入驗證配置的 Middleware：

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
    app.UseAuthentication();
    app.UseMvc();
}
```

>這裡要注意，Middleware 的執行順序是依據你程式碼的順序做調用，因此這裡的 `app.UseAuthentication()` 一定要放在 `app.UseMvc()` 之前，才能讓 MVC 框架執行之前就做身分驗證。

接著，我們可以再來修改 `ValuesController` 加入以下程式碼做測試：

```csharp
// GET api/values/anonymous
[AllowAnonymous]
[Route("anonymous")]
[HttpGet]
public IActionResult Anonymous()
{
    var name = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name)?.Value;
    return new ContentResult() {Content = $@"For all anonymous. {name}"};
}

// GET api/values/authorize
[Authorize]
[Route("authorize")]
[HttpGet]
public IActionResult All()
{
    var name = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name)?.Value;
    return new ContentResult() {Content = $@"For all client who authorize. {name}"};
}
```

如果有啟動匿名驗證，可以使用 `[AllowAnonymous]` 來讓沒有驗證身分的使用者呼叫該 API，而掛上 `[Authorize]` 的 API 只能由已完成身分驗證的使用者調用。

## 驗證原則

有時候我們需要建立多個驗證原則，作為權限分群，此時可以修改 `Startup.cs` 中的 `ConfigureServices` 方法，參考以下程式碼建立一個專屬於 Administrator 的驗證原則，裡面的驗證細節可以根據需求做複合式調整，這裡只簡單使用 `policy.RequireRole()` 來限定該群組必須要有 `Administrator` 角色才能通過。

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc();
    services.Configure<IISOptions>(options => { options.AutomaticAuthentication = true; });
    services.AddAuthorization(options =>
    {
        options.AddPolicy("OnlyAdministrator", policy =>
        {
            policy.AddAuthenticationSchemes(IISDefaults.AuthenticationScheme);
            policy.RequireRole("Administrator");
        });
    });
}
```

套用權限的方式也相當簡單，只需要在要提供調用的 API 前面，加上 `[Authorize(Policy = "OnlyAdministrator")]` 即可，請參考以下程式碼：

```csharp
// GET api/values/onlyAdministrator
[Authorize(Policy = "OnlyAdministrator")]
[Route("onlyAdministrator")]
[HttpGet]
public IActionResult OnlyAdministrator()
{
    var name = HttpContext.User.Claims.FirstOrDefault(p => p.Type == ClaimTypes.Name)?.Value;
    return new ContentResult() { Content = $@"For all client who authorize with Administrator role. {name}" };
}
```

## 更細緻的權限處理

如果以上的權限設定還不能滿足需求，可以自己建立 ASP.NET Core Middleware 來自定限制未授權的 API 呼叫，畢竟我們已經可以透過 `User.Claims` 來取得所有使用者的帳號屬性，但一樣要要注意，Middleware 的執行順序問題。

這裡提供[範例程式碼](https://gist.github.com/poychang/60570f178dfb1e4566b45b5b83589b01)做參考，此範例是只允許特定 IP 區段才能呼叫 API，你可以根據需求修改成想要的限制情境，例如取得使用者帳號後，去某一個權限系統取得該使用者的執行權限，再判斷他能不能執行特定功能。

>本篇完整範例程式碼請參考 [poychang/Demo-Net-Core-Auth](https://github.com/poychang/Demo-Net-Core-Auth) 中的 WindowsSecurity 專案。

----------

參考資料：

* [瞭解 ASP.NET 的執行身份識別](http://vito-note.blogspot.com/2013/04/windows.html)
* [在 ASP.NET Core 中使用多個環境](https://docs.microsoft.com/zh-tw/aspnet/core/fundamentals/environments?view=aspnetcore-2.1&WT.mc_id=DT-MVP-5003022)
* [將驗證和身分識別移轉至 ASP.NET Core 2.0](https://docs.microsoft.com/zh-tw/aspnet/core/migration/1x-to-2x/identity-2x?view=aspnetcore-2.1&WT.mc_id=DT-MVP-5003022)
* [在 ASP.NET Core 原則為基礎的授權](https://docs.microsoft.com/zh-tw/aspnet/core/security/authorization/policies?view=aspnetcore-2.1&WT.mc_id=DT-MVP-5003022)
* [在 ASP.NET Core 應用程式中設定 Windows 驗證](https://docs.microsoft.com/zh-tw/aspnet/core/security/authentication/windowsauth?tabs=aspnetcore2x&WT.mc_id=DT-MVP-5003022#enable-windows-authentication-with-httpsys-or-weblistener)
* [Web API with windows authentication on asp.net Core 2](https://haithamshaddad.com/2017/12/29/web-api-with-windows-authentication-on-asp-net-core-2/)
* [How to implement Windows Authentication in an Angular (^4.3.1) application with a stand-alone Web API](https://spikesapps.wordpress.com/2017/08/04/how-to-implement-windows-authentication-in-an-angular-4-3-1-application-with-a-stand-alone-web-api/)
