---
layout: post
title: 在 LINQPad 中使用 Secret Manager
date: 2025-10-10 12:09
author: Poy Chang
comments: true
categories: [Dotnet, Develop, Tools]
permalink: using-secret-manager-in-linqpad/
---

在測試一些呼叫 API 的寫法時，我經常會用 LINQPad 來測試，過程中或多或少都會遇到需要金鑰，特別是呼叫AI 服務的時候，在 .NET 的開發環境中，可以使用 Secret Manager 來保護這些機密設定值，使用上相當方便，因此想如法炮製，在 LINQPad 中也使用同樣的方式來存取機密資訊，特別是在同一組金鑰需要在多個測試寫法中使用的時候。

> 關於標準的使用方式，請參考[使用 Secret Manager 保護 .NET 專案的機密設定值](https://blog.poychang.net/using-secret-manager-with-dotnet-and-visual-studio/)。

首先，Secret Manager 有一個特性，會使用存放 `secrets.json` 的資料夾作為 User Secrets ID，因此我會在 `C:\Users\USER-NAME\AppData\Roaming\Microsoft\UserSecrets\` 中手動建立一個 `azure-openai-secrets` 資料夾，裡面的 `secrets.json` 就是我用來呼叫 Azure OpenAI 的相關資訊。

在 LINQPad 的設定頁面中，可以在 `Folders` 頁籤中指定 `Plugins and Extensions` 的資料夾路徑，我會在這裡修改成一個我常用的位置，例如 `D:\LINQPad\Plugins`，或者你也可以將該資料夾指定到 OneDrive 或其他雲端同步的資料夾，這樣就可以在多台電腦上共用相同的設定。

![linqpad-set-folders](https://files.poychang.net/storage/using-secret-manager-in-linqpad/linqpad-set-folders.png)

在 `Plugins and Extensions` 這個資料夾中，預設的情況下，這裡面放一個 `MyExtensions.linq` 檔案，這個檔案會在每次執行 LINQPad 查詢時自動編譯並載入，因此我們可以在這裡面加入以下的程式碼：


```csharp
public static class PC
{
    // Write custom extension methods here. They will be available to all queries.

    /// <summary>
    /// 從 User Secrets 或環境變數載入 Secrets 設定。
    /// </summary>
    public static Secrets Secrets
    {
        get
        {
            return new ConfigurationBuilder()
             //C:\Users\PoyChang\AppData\Roaming\Microsoft\UserSecrets\azure-openai-secrets
             .AddUserSecrets("azure-openai-secrets")
             .Build()
             .Get<Secrets>() ?? throw new InvalidOperationException("無法載入 Secrets 設定，請確認 user secrets 或環境變數是否已設定。");
        }
    }

    public static Secrets ShowSecrets() => Secrets.Dump();

    public static void ShowRaw()
    {
        var path = """C:\Users\PoyChang\AppData\Roaming\Microsoft\UserSecrets\azure-openai-secrets\secrets.json""";
        File.ReadAllText(path).Dump();
    }

    /// <summary>
    /// 顯示 Secrets 設定內容，僅供測試使用，請勿在生產環境中使用。
    /// </summary>
    public static string SecretsJsonTemplate() => System.Text.Json.JsonSerializer.Serialize(new Secrets());
}

public class Secrets
{
    public AzureOpenAIModel AzureOpenAI { get; set; } = new AzureOpenAIModel();
    public class AzureOpenAIModel
    {
        public string Endpoint { get; set; } = string.Empty;
        public string APIKey { get; set; } = string.Empty;
        public string DeploymentName { get; set; } = string.Empty;
        public string ImageModel { get; set; } = string.Empty;
    }
}
```

如此一來，在 LINQPad 的查詢中，就可以直接使用 `PC.Secrets` 來取得常用的機密設定值了。

例如要查看目前所有的 `Secrets` 設定值，可以執行：

```csharp
PC.ShowSecrets();
```

或者使用 `PC.Secrets` 來取得指定的設定值：

```csharp
PC.Secrets.AzureOpenAI.Endpoint.Dump();
```

如果想要查看 `secrets.json` 的原始內容，可以使用：

```csharp
PC.ShowRaw();
```

這樣就可以在 LINQPad 中方便地使用 Secret Manager 來管理機密設定值了。

---

參考資料：

- [使用 Secret Manager 保護 .NET 專案的機密設定值](https://blog.poychang.net/using-secret-manager-with-dotnet-and-visual-studio/)
- [MS Learn - 在 ASP.NET Core 的開發中安全儲存應用程式秘密](https://learn.microsoft.com/zh-tw/aspnet/core/security/app-secrets?view=aspnetcore-10.0&WT.mc_id=DT-MVP-5003022)
