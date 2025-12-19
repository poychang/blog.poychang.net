---
layout: post
title: 為什麼 Azure 要推廣使用 RBAC
date: 2025-5-11 23:29
author: Poy Chang
comments: true
categories: [Azure, Develop]
permalink: why-azure-recommend-to-use-rbac/
---

曾幾何時，我認為用 SAS Token（Shared Access Signature Token）就好了，何必使用 RBAC（Role-Based Access Control）的方式來管理呢？但其實背後有很多細節是 SAS 所不無法觸及的，這篇來探索一下為什麼 Azure 在許多文件上都推薦使用 RBAC 的原因吧。

Azure 大力推廣使用 RBAC（Role-Based Access Control）的原因，主要是為了在安全性、可管理性與合規性，為這三方面提供更精細與可控的資源存取管理機制，而且能夠提供以下六大特性：

1. 最小權限原則（Least Privilege）
    - RBAC 能讓你只賦予使用者或應用程式執行其任務所需的最低權限，降低風險
    - 比起以往只能給「共同管理者」或「擁有者」權限，RBAC 可細到「只能讀取某個儲存體帳戶的 blob」，大幅減少了錯誤操作與潛在內部濫用的風險

2. 精細的權限控制
    - RBAC 可支援跨層級與資源類型的權限指定
    - 可對單一資源、資源群組、訂用帳戶，甚至是管理群組層級設定權限
    - 可指定內建角色（如：Reader、Contributor）或自訂角色

3. 中央管理與審計
    - RBAC 可以與 [Microsoft Entra ID](https://www.microsoft.com/zh-tw/security/business/identity-access/microsoft-entra-id)（過去所熟知的 Azure AD）進行整合
    - 權限分配與人員身份綁定，集中由 Microsoft Entra ID 控制
    - 可透過 Azure Activity Logs 或 Microsoft Entra ID 的審計功能，追蹤是誰做了什麼操作

4. 符合企業合規要求
    - 企業在遵循 ISO、SOC、GDPR 等法規時，需要可審計且可控的存取控制模型
    - RBAC 符合這類合規需求的標準機制，能納入治理與風控流程

5. 支援自動化與 DevOps
    - RBAC 權限可透過 ARM templates、Bicep、Terraform、Azure CLI 等工具進行部署
    - 透過 CI/CD 流程自動化，避免手動組態錯誤。
    - 快速佈建環境，給開發人員、系統管理員不同的角色

6. 與 PIM（Privileged Identity Management）整合
    - RBAC 搭配 PIM 可提供「按需啟用」的高權限角色（例如：只在執行維護作業時擁有 Contributor 權限）
    - 提高安全性，防止權限長期存在

也就是說，RBAC 是為了讓 Azure 符合大型企業與雲端原生架構所需的細緻、安全、可追蹤的存取控制模型。

## RBAC vs SAS Token 差異比較表

用表格來比較 RBAC 和 SAS Token 的特性差異，更能看出來為什麼 RBAC 會需要被大力推廣。

| 比較項目         | RBAC（角色型存取控制）                                       | SAS Token                                                         |
| ---------------- | ------------------------------------------------------------ | ----------------------------------------------------------------- |
| 身份驗證來源     | 透過 Entra ID 身份（人員或應用程式）                         | 透過 字串型金鑰或 Token（如連線字串、SAS Token）                  |
| 授權方式         | 指派角色至身份（使用者、群組、Managed Identity）             | 使用者需手動取得金鑰/Token 並嵌入應用程式或傳遞                   |
| 最小權限控制     | 支援細緻權限設定（如僅允許讀取 Blob）                        | 權限較粗略（Access Key 幾乎等同「擁有者」，SAS 雖可限制但易誤設） |
| 權限生命週期管理 | 可透過 RBAC 動態調整、移除角色；搭配 PIM 做到「臨時啟用」    | 金鑰常為長期性，有效期限須手動控制；遺失後難追蹤                  |
| 安全性           | 身份驗證與權限分開管理，支援條件式存取、多因子驗證等 AD 功能 | 金鑰一旦外洩，即可繞過 AD 直接存取資源                            |
| 可審計性         | 所有動作與身份綁定，完整記錄於 Azure Activity Log            | 難以追溯是哪位用戶或程式用金鑰進行操作                            |
| 應用程式整合     | 支援 Managed Identity，程式碼中不需明文金鑰                  | 需儲存明文金鑰或 Token，管理成本高                                |
| 自動化與 DevOps  | 可在 IaC 工具中定義角色綁定，配合 CI/CD                      | 金鑰需額外機制安全儲存與部署                                      |
| 適用情境         | 推薦用於 企業內部系統、安全需求高的應用與自動化流程          | 適合 短期分享、匿名存取或相容性需求（如舊系統）                   |

## 後記

對開發者來說，如果要建立企業系統時，若要存取 Azure 雲端資源，不論是官方文件還是個人建議，最好還是在架構上全面採用 RBAC + Entra ID 驗證為主體的安全模型。

我也深深明白，要從簡單直接就能用的 SAS Token 轉用 Entra ID 所管理的 RBAC 相當不容易，畢竟 SAS Token 用起來相當單純且直覺，反觀 RBAC 還需要許多腳色、權限設定。

不過在許多 Microsoft Azure 官方提供的函示庫和許多開發框架中，可以使用[Azure.Identity 中的 ClientSecretCredential](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.clientsecretcredential?WT.mc_id=DT-MVP-5003022) 做到權限驗證的效果，而且如果你的系統是放到 Azure 上執行了話，基本上只要直接使用 [DefaultAzureCredential](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredential?WT.mc_id=DT-MVP-5003022) 就可以直接套用當前的環境權限，通過驗證。

當然，如果是開發環境特殊，或者有特殊需求，例如要讓客戶端直接下載 Blob 資料，或是要做到匿名資源存取的模式時，使用 SAS Token 還是可行的解決方案。

---

參考資料：

- [MS Learn - 什麼是 Azure 角色型存取控制 (Azure RBAC)](https://learn.microsoft.com/zh-tw/azure/role-based-access-control/overview?WT.mc_id=DT-MVP-5003022)
- [Azure.Identity - ClientSecretCredential](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.clientsecretcredential?WT.mc_id=DT-MVP-5003022)
- [Azure.Identity - DefaultAzureCredential ](https://learn.microsoft.com/en-us/dotnet/api/azure.identity.defaultazurecredential?WT.mc_id=DT-MVP-5003022)
