---
layout: post
title: 在 ASP.NET Core 專案中改用 JSON.NET 做資料繫結
date: 2020-12-03 22:12
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, WebAPI]
permalink: using-newtonsoft-json-in-asp-net-core-projects/
---

如果是使用 .NET Core 3 以上版本，`System.Text.Json` 已經預設包含在裡面，當然也就使用它來做資料繫結了，不過有時候會懷念以前 [JSON.NET](https://www.newtonsoft.com/json) 所提供的好用特性，這篇介紹如何將 ASP.NET Core 專案中改用 JSON.NET 來做 JSON 資料繫結。

建立好 ASP.NET Core 3.0 以上版本的專案後，直接安裝 `Microsoft.AspNetCore.Mvc.NewtonsoftJson` 這個 NuGet 套件，這會直接幫你安裝以下相依的套件，當中就包含了 `Newtonsoft.Json`：

```
Microsoft.AspNetCore.JsonPatch.5.0.0
Microsoft.AspNetCore.Mvc.NewtonsoftJson.5.0.0
Microsoft.CSharp.4.7.0
Newtonsoft.Json.12.0.2
Newtonsoft.Json.Bson.1.0.2
```

接著我們必須告訴專案的 MVC 框架改用 JSON.NET 來處理資料繫結，不過這裡會根據 ASP.NET Core 版本的不同而作法有一點差異，不過都是去修改 `Startup.cs` 中 `ConfigureServices()` 內的設定，直接參考下面設定：

```csharp
// .NET Core 2.x 可能會看到這樣
services.AddMvc().AddNewtonsoftJson();
// .NET Core 3.x 則可能會看到這樣
services.AddControllers().AddNewtonsoftJson();
services.AddControllersWithViews().AddNewtonsoftJson();
services.AddRazorPages().AddNewtonsoftJson();
```

安裝一個套件，修改一行程式碼，簡單幾個動作，重新回到 JSON.NET 的懷抱。

## 後記

基本上新的專案我還是會使用內建的 `System.Text.Json` 來處理資料繫結或相關的 JSON 處理，之所有會有這篇是因為要為 []() 這篇做準備。

----------

參考資料：

* [Using Newtonsoft.Json In .NET Core 3+ Projects](https://dotnetcoretutorials.com/2019/12/19/using-newtonsoft-json-in-net-core-3-projects/)
