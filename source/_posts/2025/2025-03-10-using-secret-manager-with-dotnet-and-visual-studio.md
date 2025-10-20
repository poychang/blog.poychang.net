---
layout: post
title: 使用 Secret Manager 保護 .NET 專案的機密設定值
date: 2025-03-10 00:12
author: Poy Chang
comments: true
categories: [Dotnet, Develop, Tools]
permalink: using-secret-manager-with-dotnet-and-visual-studio/
---

開發專案的過程中，或多或少都會遇到要透過設定檔來設定機密資訊，例如資料庫連線字串或 AI 服務的金鑰，在 .NET 的開發環境中，可以使用 Secret Manager 來保護這些機密設定值，使用上相當方便，特別是在同一組金鑰需要在多個專案中使用的時候。

> 最近在撰寫測試 Azure OpenAI 功能的專案時，經常會建立多個小專案來做測試，這時候為了避免每個小測試專案都遺留一份呼叫 Azure OpenAI 的金鑰，可以使用 Secret Manager，將一份金鑰保存在本機的隱蔽位置，然後讓各個小專案中去使用，藉此保護機密設定值，也方便在各個小專案間共用一組金鑰，還可以避免不小心將該資訊提交到版控庫中。

## 設定值的格式

首先要先說明一件事，不同的作業系統平台所支援的環境變數階層格式略有不同。

在 .NET 的專案中，通常會使用 `appsettings.json` 來存放專案的設定值，從副檔名可以清楚的知道，這會使用 JSON 格式。而 JSON 格式的資料是有可能出現階層關係的，如下面的設定值：

```json
{
  "AA": {
    "BB": "123"
  }
}
```

當我們要把這組設定值轉換成環境變數的時候，就需要搭配環境變數的階層符號，在 Windows 的作業系統環境時，會使用 `:` 冒號做為階層符號。在 Linux/Mac 的作業系統環境下，則使用 `__` 雙底線作為階層符號。因此上面的設定檔相當於：

```json
// Windows 環境
{
  "AA:BB": "123"
}
// Linux 環境
{
  "AA__BB": "123"
}
```

這件事會跟後面建立秘密時，所設定的秘密名稱有關。

## 秘密存放位置

雖然 Secret Manager 可能會因為版本或實作的不同而將秘密存放在不同的位置，但稍微知道一下可能存放的位置，還是會比較好。

Secret Manager 所產生 `secrets.json` 檔，路徑會根據作業系統不同：

- Windows: `%APPDATA%\Microsoft\UserSecrets\<user_secrets_id>\secrets.json`
- Linux/Mac: `~/.microsoft/usersecrets/<user_secrets_id>/secrets.json`

路徑中的 `<user_secrets_id>` 預設會是一組 Secret Manager 產生的 GUID。如果想要手動修改該資料夾名稱，也是可行的，只是後面在設定 `UserSecretsId` 時，就必須使用你所修改的名稱。

你可以自行到對應的位置查看 `secrets.json` 內容，要注意的是，這裡面的內容是不會被加密的。

## CLI

Secret Manager 被包含在 `dotnet user-secrets` CLI 中，有以下 5 個主要指令：

| 指令   | 說明                     | 語法                                             |
| ------ | ------------------------ | ------------------------------------------------ |
| init   | 設定使用者秘密的識別碼     | dotnet user-secrets init                         |
| set    | 將使用者秘密設定為指定的值 | dotnet user-secrets set [SECRET_SETTING] [VALUE} |
| remove | 移除指定的使用者秘密       | dotnet user-secrets remove [SECRET_SETTING]      |
| list   | 列出所有應用程式的秘密   | dotnet user-secrets list                         |
| clear  | 刪除所有應用程式的秘密   | dotnet user-secrets clear                        |

在執行 `init` 指令的時候，必須要在包含專案檔的資料夾中，執行後會在 `.csproj` 專案檔的 `PropertyGroup` 元素中新增 `UserSecretsId`，並在秘密存放位置中建立對應位置的 `secrets.json`。

接著你可以使用上述 CLI 的指令，或直接開啟 `secrets.json` 來編輯內容，加上所需要的機密資訊。

如果你是採手動直接編輯 `secrets.json`，是可以使用 JSON 原生的階層格式來設定，不過之後如果有使用任一個 CLI 來編輯 `secrets.json` 的時候，會自動修改成使用環境變數階層符號的格式。如果可以，建議你根據當前作業系統，直接使用環境變數階層符號的格式。

## Visual Studio

除了使用 dotnet CLI 來管理，也可以使用 Visual Studio 來操作，只要在方案總管中的專案上按滑鼠右鍵，選擇`管理使用者密碼`即可建立或編輯。

![管理使用者密碼](https://i.imgur.com/p49Xt2q.png)

如果該專案是第一次執行 Secret Manager 的功能，Visual Studio 會提示你要安裝 `Microsoft.Extensions.Configuration.UserSecrets` 套件，這樣才能讀取 Secret Manager 所管理的秘密設定值。

## 使用方法

這裡會提供兩種常見的使用情境，第一種是在 Conosle 主控台專案中如何使用：

確認專案有安裝 `Microsoft.Extensions.Configuration.UserSecrets` 套件後，即可使用下面的程式碼來抓取秘密設定值，範例中擷取了以 `AppSecret` 為設定名稱的秘密值：

```csharp
static void Main(string[] args)
{
    var config = new ConfigurationBuilder()
        .AddUserSecrets<Program>()
        .Build();

    Console.WriteLine(config["AppSecret"]);
}
```

另一種是在 ASP.NET Core 專案中使用，下面範例：

```csharp
var builder = WebApplication.CreateBuilder(args);
var apiKey = builder.Configuration["AppSecret:ApiKey"];

var app = builder.Build();

app.MapGet("/", () => apiKey);

app.Run();
```

> 本篇完整範例程式碼請參考 [poychang/dotnet-samples/using-secret-manager](https://github.com/poychang/dotnet-samples/tree/main/using-secret-manager)。

---

參考資料：

* [MS Learn - 在 ASP.NET Core 的開發中安全儲存應用程式秘密](https://learn.microsoft.com/zh-tw/aspnet/core/security/app-secrets?WT.mc_id=DT-MVP-5003022)