---
layout: post
title: 如何使用 Secret Manager 保護 .NET Core 專案的機密設定
date: 2017-11-05 11:25
author: Poy Chang
comments: true
categories: [Dotnet, Develop, Tools]
permalink: microsoft-user-secret-manager-with-dotnet-core/
---
開發的過程中經常會有機密資訊需要設定，例如資料庫的連線字串、服務平台的 API 金鑰，如何保護這些機密不被外流，是件很值得探討的議題，而在 .NET 的開發環境中，有提供 Secret Manager 的套件讓我們輕鬆的保護應用程式的機密資訊。

>請不要將資料庫連線字串等機密資訊放在版控中的，尤其是帳號密碼。

## Visual Studio 

在 Viusal Studio 中使用 Secret Manager 動作滿簡單的，只要在方案總管中的專案上按滑鼠右鍵，選擇`管理使用者密碼`

![管理使用者密碼](https://i.imgur.com/p49Xt2q.png)

執行後 Visual Studio 會在你本機產生 `secrets.json` 檔，路徑會根據作業系統不同：

* Windows: `%APPDATA%\microsoft\UserSecrets\<userSecretsId>\secrets.json`
* Linux: `~/.microsoft/usersecrets/<userSecretsId>/secrets.json`
* Mac: `~/.microsoft/usersecrets/<userSecretsId>/secrets.json`

>官方文件表示，不應該依賴這個路徑及相關實作的細節，因為這路徑或實作細節可能會依版本而修改。

有注意到上述路徑有一段 `<userSecretsId>` 嗎？這段會是系統產生的 GUID 值，Secret Manager 會使用這組 `userSecretsId` 來將你的專案及 `secret.json` 綁在一起。

觀察你的專案檔 `.csproj`，裡面的 `PropertyGroup` 中會新增一段 `UserSecretsId` 節點，這裡面的值就是對應到上述路徑的`userSecretsId`。 

![專案檔中的 UserSecretsId 設定值](https://i.imgur.com/59EO1hL.png)

接者開啟 `secrets.json` 檔案，這個檔案的設定會覆蓋 `appsettings.json` 的內容，例如這兩個檔案都有 `SecretSetting` 這個設定，在開發過程中，Visual Studio 會使用你本機 `secrets.json` 中的 `SecretSetting` 來做設定。

![secret.json 和 appsettings.json 的設定](https://i.imgur.com/D0ZLfnq.png)

![執行結果](https://i.imgur.com/9Q3iv1f.png)

如此一來，就可以達到應用程式的機密資訊只存在有權限的人身上，Secret save with you.

## .NET CLI

使用 .NET CLI 命令列工具也可以達成一樣的任務。

首先需要將 `Microsoft.Extensions.SecretManager.Tools` .NET CLI 套件加入 `.csproj` 檔案中，程式碼如下；

```xml
<ItemGroup>
 <DotNetCliToolReference Include="Microsoft.DotNet.Watcher.Tools" Version="2.0.0" />
</ItemGroup>
```

設定後執行 `dotnet resotre` 還原相依套件，接著就可以使用 dotnet user-secrets 指令來呼叫 Secret Manager。

可利用 `dotnet user-secrets -h` 查詢該指令的使用方式，基本執行令對照如下：

<table class="table table-striped">
<thead>
  <tr>
    <th>指令</th>
	<th>說明</th>
	<th>語法</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>list</td>
	<td>查詢程式中所有 Secrets</td>
	<td>dotnet user-secrets list</td>
  </tr>
  <tr>
    <td>set</td>
	<td>設定指定的 Secret</td>
	<td>dotnet user-secrets set [SECRET_SETTING] [VALUE}</td>
  </tr>
  <tr>
    <td>remove</td>
	<td>刪除指定的 Secret</td>
	<td>dotnet user-secrets remove [SECRET_SETTING]</td>
  </tr>
  <tr>
    <td>clear</td>
	<td>刪除程式中所有 Secrets</td>
	<td>dotnet user-secrets clear</td>
  </tr>
</tbody>
</table>

>這裡使用 Dotnet Core 2.0 的環境，建立 ASP.NET Core WebAPI 專案做測試範例。
>
>完整範例程式碼請參考 [poychang/DemoDotnetCoreSecretManager](https://github.com/poychang/DemoDotnetCoreSecretManager)。

----------

參考資料：

* [安全的儲存 ASP.NET Core 在開發期間的應用程式密碼](https://docs.microsoft.com/zh-tw/aspnet/core/security/app-secrets?WT.mc_id=DT-MVP-5003022)
* [.NET Core程序中使用User Secrets存储敏感数据](http://www.cnblogs.com/nianming/p/7068253.html)
* [ASP.NET CORE 2.0 SECRET MANAGER](https://tahirnaushad.com/2017/08/31/asp-net-core-2-0-secret-manager/)

