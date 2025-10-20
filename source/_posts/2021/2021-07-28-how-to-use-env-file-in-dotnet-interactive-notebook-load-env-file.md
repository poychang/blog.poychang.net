---
layout: post
title: 如何在 .NET Notebook 中使用 .env 檔
date: 2021-07-28 12:57
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Tools]
permalink: how-to-use-env-file-in-dotnet-interactive-notebook-load-env-file/
---

利用 `.env` 檔來存放應用程式所需要的環境變數是個相當不錯的方案，一來可以避免敏感資訊外洩，二來方便另一個使用者使用他自己的環境設定值，在玩 .NET Notebook 時，有時候也會想藉此來把像是 API Key 之類的設定值，抽離程式碼中，避免寫死設定又不小心提交到版控庫中，這裡來看看可以如何在 .NET Notebook 中載入 `.env` 檔。

## 自己動手讀

因為 `.env` 檔的內容格式相當簡單且容易理解，基本上就長得像下面那樣 `key=value` 這樣的配對：

```
YOUR_VARIABLE='你的環境變數'
```

所以其實我們可以自己寫一小段程式碼來讀取這個檔案內容，如下：

```csharp
public static class DotEnv
{
    public static Dictionary<string, string> Load(string filePath)
    {
        if (!File.Exists(filePath)) return default;

        var env = new Dictionary<string, string>();

        foreach (var line in File.ReadAllLines(filePath))
        {
            var parts = line.Split('=', StringSplitOptions.RemoveEmptyEntries);

            if (parts.Length != 2) continue;

            env.Add(parts[0], parts[1]);
        }
        return env;
    }
}
```

如此一來，就可以使用讀取 `.env` 檔的內容了。

## 使用套件

但是因為我們是想要在 .NET Notebook 中使用，如果每次都要在 Notebook 中寫上那一段程式碼，也太囉嗦了，況且功能相當簡陋。

剛好 .NET Notebook 可以讓我們自行安裝 NuGet 套件，因此這裡推薦使用 [dotenv.net](https://github.com/bolorundurowb/dotenv.net) 這個第三方套件，功能豐富且易用。

使用方式相當簡單，首先，安裝 `dotenv.net` 套件，這邊直接設定 `*-*` 使用該套件最新的版本：

```csharp
#i "nuget:https://api.nuget.org/v3/index.json"
#r "nuget: dotenv.net, *-*"
```

接者假設我們相同的資料夾中有 `.env` 檔案，內容如下：

```
YOUR_VARIABLE='你的環境變數'
```

如此一來，就可以使用下面的方式來快速取得指定的環境變數值，這裡我使用此套件提供的 Fluent API 方式來操作：

```csharp
using dotenv.net;

var envVars = DotEnv.Fluent()
    .WithEnvFiles()
    .Read();

display(envVars["YOUR_VARIABLE"]);
```

.NET Notebook 的畫面如下：

![在 .NET Notebook 中使用 dotenv.net 讀取 .env 檔](https://i.imgur.com/rRDdw3C.png)

輕鬆取得 `.env` 檔案中的環境變數設定。

更多 `dotenv.net` 套件的使用方式請直接到該專案的 GitHub 中查詢，文件寫得相當完善且 API 很容易上手。

## 後記

還有其他 NuGet 套件也能處理載入 `.env` 的動作，如果你有興趣可以另外嘗試這兩個套件 [dotnet-env](https://github.com/tonerdo/dotnet-env)、[net-dotenv](https://github.com/codeyu/net-dotenv)。

----------

參考資料：

* [Using .env in .NET](https://dusted.codes/dotenv-in-dotnet)
* [GitHub - bolorundurowb/dotenv.net](https://github.com/bolorundurowb/dotenv.net)
