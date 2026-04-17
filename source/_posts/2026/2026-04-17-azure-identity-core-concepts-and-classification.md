---
layout: post
title: Azure Identity 的核心概念與分類
date: 2026-04-17 14:56
author: Poy Chang
comments: true
categories: [Dotnet, WebAPI, Azure, Develop]
permalink: azure-identity-core-concepts-and-classification/
---

Azure Identity 是 Microsoft Azure SDK 中的一組用戶端程式庫，提供應用程式連線至 Azure 服務時統一的驗證支援。它簡化了開發人員取得與管理憑證的方式，並在雲端與混合環境中提供安全且一致的資源存取機制。這篇文章將進一步了解 Azure Identity 的核心概念及分類，幫助我們在開發與部署 Azure 應用程式時更有效地管理身份驗證。

Azure Identity 提供了多種 Credential 類別，涵蓋了從開發環境到生產環境的各種使用情境，基本上可以分成以下三種用途：

1. 使用者登入狀態（CLI / IDE / Browser）
2. 應用程式身份（ClientId + Secret / Cert）
3. 平台託管身份（Managed Identity / Workload Identity）

在寫程式的時候，你應該經常會看到使用 `DefaultAzureCredential` 這個類別，你可以將它想像成一個「策略容器」，實際上裡面串接了上述多種 Credential 的嘗試邏輯，會依序嘗試不同的驗證方式，直到成功取得 Token 或全部失敗為止。

> `DefaultAzureCredential` 會按預設順序依序嘗試多種身份來源，第一個成功者即被採用，其餘完全不執行。

因此，在開發階段使用 `DefaultAzureCredential` 是非常方便的，因為它會自動偵測你在本機環境中已登入的帳號（例如 Azure CLI 或 Visual Studio），但在生產環境中則建議明確指定使用 Managed Identity 或 Service Principal，以避免不必要的探測成本與安全風險。

## 分類

在 .NET 或 Python 等 SDK 中，Azure Identity 提供多種 TokenCredential 實作，可分為以下幾類：

- 開發環境用（Developer Credentials）
- 部署環境用（Hosted / Production Credentials）
- 應用程式身份（Service Principal / App Identity）
- 組合與特殊用途

### 開發環境用

主要用於本機開發或工具登入狀態：

- `EnvironmentCredential` 從環境變數讀取（ClientId / Secret / TenantId）
- `VisualStudioCredential` 使用 Microsoft Visual Studio 已登入帳號
- `VisualStudioCodeCredential` 使用 Visual Studio Code 登入資訊
- `AzureCliCredential` 使用 Azure CLI (`az login`)
- `AzurePowerShellCredential` 使用 Azure PowerShell 登入
- `InteractiveBrowserCredential` 透過瀏覽器互動登入
- `DeviceCodeCredential` 使用裝置碼登入（無瀏覽器環境）

### 部署環境用

用於 Azure 或雲端環境：

- `ManagedIdentityCredential` 使用 Azure Managed Identity （App Service、VM、AKS 等）
- `WorkloadIdentityCredential` 用於 Kubernetes（OIDC / federation）

### 應用程式身份

- `ClientSecretCredential` 使用 Client Secret
- `ClientCertificateCredential` 使用憑證（X.509）
- `OnBehalfOfCredential` 代表使用者（OBO flow）

### 組合與特殊用途

- `DefaultAzureCredential` 會依序嘗試多種 Credential（開發 + 部署），常見順序：Environment → Managed Identity → CLI → VS 等
- `ChainedTokenCredential` 自訂多個 Credential fallback 順序

## 常用的 Credential 類別

### `DefaultAzureCredential`

首先，最常看到的當然就是 `DefaultAzureCredential`，主要用途是開發階段的快速驗證，因為它會自動串接多種 Credential，讓你在本機開發時無需額外設定就能取得 Token。

使用方式：

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;

var credential = new DefaultAzureCredential();

var client = new BlobServiceClient(
new Uri("https://<account>.blob.core.windows.net"),
    credential);
```

### `ManagedIdentityCredential`

使用上非常簡單，基本上不需要給他任何資訊，讓他自己在執行環境中自動依序嘗試多種 Credential，當然這僅適合在開發階段，或者簡單部署的場景。建議不要用在生產環境上。

第二個常見的就是 `ManagedIdentityCredential`，主要用途是在 Azure 環境中使用 Azure Managed Identity 來驗證，這樣就不需要在程式碼中管理任何帳密，完全由平台提供 Token，非常適合在 App Service、VM、AKS 等 production 環境使用。

使用方式：

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;

var credential = new ManagedIdentityCredential();

var client = new BlobServiceClient(
    new Uri("https://<account>.blob.core.windows.net"),
    credential);
```

或者，你也可以透過提供 `client-id` 來指定要使用的 User Assigned Identity：

```csharp
var credential = new ManagedIdentityCredential(clientId: "<client-id>");
```

### `ClientSecretCredential`

第三種是我個人比較常用的方式，使用應用程式註冊（Service Principal）進行驗證，這種方式需要在 Azure AD 中註冊一個應用程式，並產生一組 Client Secret，然後在程式碼中明確指定 TenantId、ClientId 和 ClientSecret 來取得 Token。這種方式適合在跨平台或外部系統中使用，或者在 CI/CD pipeline 中使用，但需要妥善保管 Client Secret（建議放在 Key Vault）。

使用方式：

```csharp
using Azure.Identity;
using Azure.Storage.Blobs;

var credential = new ClientSecretCredential(
    tenantId: "<tenant-id>",
    clientId: "<client-id>",
    clientSecret: "<client-secret>");

var client = new BlobServiceClient(
    new Uri("https://<account>.blob.core.windows.net"),
    credential);
```

### 核心差異

| 類型                      | 身份來源           | 是否需密鑰 | 適用場景         |
| ------------------------- | ------------------ | ---------- | ---------------- |
| DefaultAzureCredential    | 多來源（自動串接） | 視情況     | 開發 / 簡單部署  |
| ManagedIdentityCredential | Azure 平台         | 否         | Azure production |
| ClientSecretCredential    | Service Principal  | 是         | 自管部署 / CI    |

### 實務選擇原則

* 本機開發 → `DefaultAzureCredential`
* Azure 上線 → `ManagedIdentityCredential`
* 跨平台 / 外部系統 → `ClientSecretCredential`

---

參考資料：

- [MS Learn - 什麼是 Microsoft 身份識別平台](https://learn.microsoft.com/zh-tw/entra/identity-platform/v2-overview?WT.mc_id=DT-MVP-5003022)
- [MS Learn - Azure 身份管理與存取控制安全最佳實務](https://learn.microsoft.com/zh-tw/azure/security/fundamentals/identity-management-best-practices?WT.mc_id=DT-MVP-5003022)