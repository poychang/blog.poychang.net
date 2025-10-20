---
layout: post
title: ASP.NET Core 搭配反向代理的虛擬目錄問題
date: 2021-04-26 00:12
author: Poy Chang
comments: true
categories: [Dotnet, Develop]
permalink: asp-net-core-reverse-proxy-with-different-virtual-root/
---

當網頁應用程式前面用了 Nginx 來做反向代理的時候，遇到一個狀況是，Nginx 可以在同一個網域下去建立如同虛擬目錄的路徑，例如 `domain.net/YOUR-APP`，這個 `YOUR-APP` 其實是不存在的目錄，然而在 ASP.NET Core 中要如何將處理像這樣的虛擬目錄的問題呢？

>此篇的處理方式，同樣可以處理將應用程式放在 IIS 的虛擬目錄時的狀況。

ASP.NET Core 預設會使用內建的 [Kestrel 微型網頁伺服器](https://docs.microsoft.com/zh-tw/aspnet/core/fundamentals/servers/kestrel?WT.mc_id=DT-MVP-5003022)來啟動網頁應用程式，因此 ASP.NET Core 不需要掛到任何網頁伺服器（如 IIS、Apache）也可以啟動網頁，然而 Kestrel 沒有虛擬目錄的設定選項，要處理虛擬目錄的問題，則是需要靠 ASP.NET Core 的中介軟體（Middleware）來處理。

在 ASP.NET Core 2.1 之後的版本，我們可以使用官方提供的 `UsePathBase()` 擴充方法來處理這件事，不用再自己寫了，如果你對這支官方所提供的擴充方法寫法有興趣，可以[從這裡](https://source.dot.net/#Microsoft.AspNetCore.Http.Abstractions/Extensions/UsePathBaseExtensions.cs)看到原始碼，或[這裡查看官方文件](https://docs.microsoft.com/zh-tw/dotnet/api/microsoft.aspnetcore.builder.usepathbaseextensions.usepathbase?WT.mc_id=DT-MVP-5003022)。

基本上使用方法相當簡單，只要在 `Configure()` 中加入一段設定即可，如下：

```csharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env)
{
  app.UsePathBase("/YOUR-APP");
  app.UseRouting();
  // 略
}
```

至於這個路徑你要怎麼做成動態設定，根據執行環境做變化，就看你如何規劃，這個路徑值你可以放在環境變數、`appsettings.json` 設定檔、或是用程式碼寫死也都可以。

但有三件事要注意：

第一，請將此設定放在最前面，例如在 `app.UseStaticFiles()` 或 `app.UseMvc()` 的前面，這樣 ASP.NET Core 才會在 HTTP Request 一進來就去判斷是不是在正確的路徑上。

第二，記得後面要加上 `app.UseRouting()` 來套用路由機制。

第三，虛擬路徑的值前面要加 `/` 不然不會有作用。

如此一來，無論你是要用 IIS 虛擬目錄來掛載網頁應用程式，還是用像是 Nginx 這樣的反向代理，都可以用作簡潔的方式處理好根目錄的問題了。

----------

參考資料：

* [在虛擬目錄中部署 ASP.NET Core 應用](https://beginor.github.io/2018/05/19/deploy-aspnet-core-app-in-virtual-directory.html)
* [ASP.Net Core Reverse Proxy with different root](https://stackoverflow.com/questions/45311393/asp-net-core-reverse-proxy-with-different-root)
* [MS Docs - UsePathBaseExtensions.UsePathBase(IApplicationBuilder, PathString) 方法](https://docs.microsoft.com/zh-tw/dotnet/api/microsoft.aspnetcore.builder.usepathbaseextensions.usepathbase?WT.mc_id=DT-MVP-5003022)
