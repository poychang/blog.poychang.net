---
layout: post
title: 讓 Razor Pages 模仿 WebAPI 一樣用 HTTP GET 回傳 JSON 資料
date: 2018-12-17 23:17
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, WebAPI]
permalink: working-with-json-in-razor-pages-like-web-api/
---

[Razor Pages](https://docs.microsoft.com/zh-tw/aspnet/core/razor-pages/?WT.mc_id=DT-MVP-5003022) 是 ASP.NET Core MVC 的一部分，他讓撰寫網頁變得非常簡單，你不用管太多關於 MVC 架構上的事情，專注在頁面的編寫即可，相當具有生產力。如果你想透過 Razor Pages 簡單使用 HTTP GET 呼叫並回傳的 JSON 資料，像是 Web API 那樣，這時因為 Razor Pages 背後其實是 MVC 的架構，因此你也可以很簡單的實現這件事。

>因為有一次我只想做一個很簡單的頁面，但有些功能還是要透過 JavaScript 來做比較方便，又不想另外做一個 WebAPI，加上還是想保留前後端分離的架構，因此想要模擬一個 Web API 的 GET 動作來做資料處理層，所以有了這篇實驗。

## 建立專案

首先開啟 Visual Studio 選擇 ASP.NET Core Web 應用程式來建立傳案，這會是一個 Razor Pages 專案。

![建立 Razor Pages 專案](https://i.imgur.com/WC72rcK.png)

因為 Razor Pages 預設在執行階段會從 `Pages` 資料夾中尋找 Razor Pages 的檔案，所以你可以把 `Pages` 看作網站的根目錄，例如 `Pages/Index.cshtml` 這個專案路徑，相當於網站的 `/Index` 網址路徑。

## 建立 API

為了將 API 的網址端點和網頁的區分開來，可以在 `Pages` 資料夾下建立一個 `API` 資料夾，之後我們用 Razor Pages 做的回傳 JSON 資料的 API 端點就會放在這裡。

![建立 API 資料夾](https://i.imgur.com/9H7mEpJ.png)

再來我們簡單建立一個 `UserInfoModel` 資料模型。

```csharp
public class UserInfoModel
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
}
```

接著我們在 `API` 資料夾下使用 Scaffold 快速產生 Razor Pages 檔案，並取名叫做 `User`，這裡要注意因為我們要做的是回傳 JSON 資料，因此不需要使用共用的 Layout Page，所以建立 Razor Pages 的時候不要勾選**使用 Layout Page**，

![新增 Razor Pages 檔案](https://i.imgur.com/RG7woe9.png)

![使用 Scaffold 產生 Razor Pages 檔案](https://i.imgur.com/HyZTRsU.png)

![取名為 User，並注意不要勾選使用 Layout Page](https://i.imgur.com/2rB1ClH.png)

這時 Scaffold 會幫你建立兩個檔案 `User.cshtml` 和 `User.cshtml.cs`，這兩個檔案是一組的，也就是我們常說的 Code Behind 方式。

基本上 `User.cshtml` 我們完全不需要動他，因為對 JSON 資料來說只是個端點的殼而已，完全用不到。

Razor Pages 使用習慣取代配置的方式來命名執行方法，我們常見的 HTTP GET 和 POST 動作，對應到 Razor Pages 來說就是下面這四種：

- `OnGet`
- `OnPost`
- `OnGetAsync`
- `OnPostAsync`

## HTTP GET 動作

這裡我們先使用 `OnGet` 來製作呼叫 HTTP GET 動作時的回應，程式碼如下：

```csharp
public class UserModel : PageModel
{
    public IActionResult OnGet()
    {
        var userInfoList = new List<UserInfoModel>
        {
            new UserInfoModel{ Id = 1, Name = "Poy Chang", Email = "poy@mail.com"},
            new UserInfoModel{ Id = 2, Name = "foo", Email = "foo@mail.com"},
            new UserInfoModel{ Id = 3, Name = "bar", Email = "bar@mail.com"}
        };

        return new JsonResult(userInfoList);
    }
}
```

如果你有用過 ASP.NET MVC 可以發現這個方法的回傳型別是熟悉的 `IActionResult`，藉此我們可以使用 MVC 內建的 `JsonResult` 來幫我們把物件序列化成 JSON 格式，這樣就輕鬆完成 HTTP GET 動作並取得 JSON 資料了，呼叫 `/API/User` 的執行畫面結果如下圖。

![呼叫 /API/User 的結果](https://i.imgur.com/2rB1ClH.png)

### @page "{name?}"

我們可以透過 Model Binding 的方式將 URL 的 QueryString 當參數傳入，例如下面程式碼可以只回傳指定 Name 的資料：

```csharp
public class UserModel : PageModel
{
    public IActionResult OnGet(string name)
    {
        var userInfoList = new List<UserInfoModel> { /* 略 */};

        return new JsonResult(userInfoList.Where(p => p.Name == name));
    }
}
```

如果你不想要使用 QueryString 的方式，想透過路由參數的方式來做了話，你可以將 `User.cshtml` 的 `@page` 改成 `@page "{name?}"`，透過設定 `name?` 可以直接將原本的 `/API/User?name=foo` 查詢方式，變成 `/API/User/foo` 來操作。

>參考完整範例程式碼 [poychang/Demo-Razor-Pages-Json-API](https://github.com/poychang/Demo-Razor-Pages-Json-API) 中的 `UserWithRouteParam`。

如果想用此方法接多個路由參數，可以用 `@page "{name?}/{id?}"` 這樣的設定方式，就可以使用像 `/API/User/foo/3` 這樣的方式來呼叫。

## HTTP POST 動作

那我們可以如法炮製做 HTTP POST 的動作嗎？結果是不行的。

Razor Pages 主要在處理頁面的呈現，而不是提供資料服務，因此上面同樣的處理方式，是不能用在 `OnPost` 中的。

但我們知道 Razor Pages 是架構在 MVC 之下，所以 MVC 能做的我們還是可以做，例如使用 `Controller` 類別來建立對應的功能，程式碼如下：

```csharp
[Produces("application/json")]
[Route("api/user2")]
public class UserController : Controller
{
    private readonly List<UserInfoModel> _data = new List<UserInfoModel>
    {
        new UserInfoModel{ Id = 1, Name = "Poy Chang", Email = "poy@mail.com"},
        new UserInfoModel{ Id = 2, Name = "foo2", Email = "foo@mail.com"},
        new UserInfoModel{ Id = 3, Name = "bar2", Email = "bar@mail.com"}
    };

    [HttpGet]
    public IActionResult GetData()
    {
        return new JsonResult(_data);
    }

    [HttpPost]
    public IActionResult PostData()
    {
        return new JsonResult(_data);
    }
}
```

>這裡要注意的是，Razor Pages 和 MVC 的路由不能相衝突，所以上面的程式碼中，路由是指定成 `[Route("api/user2")]`，和 Razor Pages 的區分開，如果兩者有相同路由了話，是會 `404` 的唷！

如此一來，可以玩的事情是不是瞬間多了起來，所以即使我們的專案是用 Razor Pages 來開發，和骨子裡還是可以透過 MVC 來實作一些功能。

雖然有一點本末倒置，畢竟 Razor Pages 就是設計給專注在頁面而非複雜架構下的框架，但是靈活運用，才是克敵致勝的關鍵呀 :)

>本篇完整範例程式碼請參考 [poychang/Demo-Razor-Pages-Json-API](https://github.com/poychang/Demo-Razor-Pages-Json-API)。

----------

參考資料：

* [Working With JSON in Razor Pages](https://www.mikesdotnetting.com/article/318/working-with-json-in-razor-pages)
* [Learn Razor Pages - Handler Methods in Razor Pages](https://www.learnrazorpages.com/razor-pages/handler-methods)
