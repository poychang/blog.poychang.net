---
layout: post
title: 在安裝 Zscaler 的電腦上安裝 Azure DevOps CLI
date: 2021-11-16 18:21
author: Poy Chang
comments: true
categories: [Azure, Develop, PowerShell, Tools]
permalink: install-azure-devops-cli-behind-zscaler-ssl-scan/
---

> 聲明：此篇文章使用 AI 工具產生，請自行判斷文章內容的正確性。

# 問題

在安裝 Zscaler 的電腦上安裝 Azure DevOps CLI 的時候出現 SSL 憑證錯誤訊息，為什麼會發生這問題，該如何解決？

```
Caused by SSLError(SSLCertVerificationError(1, '[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1000)'))
```

# ChatGPT 4o 回答

你遇到的錯誤：

```
SSLError(SSLCertVerificationError(1, '[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: unable to get local issuer certificate (_ssl.c:1000)'))
```

代表 Azure DevOps CLI 在嘗試連線到 Azure DevOps 的服務時，無法驗證伺服器端的 SSL 憑證。

---

## 📌 為什麼會發生這個錯誤？

在你提到的環境裡，「**Zscaler**」是關鍵因素：

### ✅ Zscaler 會攔截與重簽 SSL 流量

Zscaler 是一種企業安全代理（SSL inspection proxy），它會：

1. 攔截你對外的 HTTPS 請求。
2. 使用它自己的「**中繼憑證（Zscaler Root Certificate）**」重新簽署該請求，然後傳給外部伺服器。
3. 對你的應用程式來說，看起來像是 SSL 憑證與信任鏈遭到竄改，因此產生「certificate verify failed」。

---

## ✅ 解決方法

### 方法一：將 Zscaler 憑證匯入系統信任區與 Python 信任憑證中

如果你使用的是 Python 的 Azure CLI 或 DevOps CLI，可能會使用 `requests` 或 `urllib3` 模組，這些模組會依賴憑證儲存區。

#### 步驟：

1. **從 Zscaler 管理員取得憑證檔案**（通常是 `.cer` 或 `.pem`）。

2. **安裝到系統信任憑證中**：

   * Windows：雙擊 `.cer` ➜ 安裝到「受信任的根憑證授權單位」
   * macOS：用「鑰匙圈」匯入後設為信任
   * Linux：安裝至 `/usr/local/share/ca-certificates` ➜ `sudo update-ca-certificates`

3. **更新 Python 的憑證儲存區**（Azure DevOps CLI 使用 Python）：

   * 找到 Python 的憑證目錄：

     ```bash
     python -m certifi
     ```
   * 將 Zscaler 的憑證附加到 `cacert.pem` 檔案中。

---

### 方法二：設定環境變數指向你的憑證（較保守，不推薦用於生產）

```bash
export REQUESTS_CA_BUNDLE=/path/to/zscaler.pem
```

Windows 可用：

```cmd
set REQUESTS_CA_BUNDLE=C:\path\to\zscaler.pem
```

這樣所有使用 `requests` 的 CLI（如 Azure CLI）都會使用指定憑證驗證伺服器端 SSL。

---

### 方法三（⚠️不建議）：停用 SSL 驗證（不安全）

這雖然可以暫時解決問題，但會讓你的連線**不再安全**：

```bash
az devops configure --use-git-aliases true
export AZURE_DEVOPS_CLI_DISABLE_CONNECTION_VERIFICATION=1
```

或使用 `--insecure` 選項（視情況而定）

---

## ✅ 建議做法

企業環境下，請向 Zscaler 管理員要求：

* 提供 **Zscaler 根憑證** 檔案
* 安裝至系統和 Python 信任憑證中
* 確保開發機構的 CLI 工具能正確驗證中繼 SSL 憑證

---

## 自動化匯入憑證的 PowerShell

以下是一份可自動化安裝 **Zscaler 憑證** 到 Windows 的 PowerShell 腳本，會將憑證匯入到「受信任的根憑證授權單位」中，並更新 Python 的憑證儲存（若已安裝 `certifi` 模組）。

---

## ✅ PowerShell 腳本說明

```powershell
# 檔案名稱：Install-ZscalerCert.ps1

param (
    [Parameter(Mandatory = $true)]
    [string]$CertPath
)

function Import-ZscalerCert {
    param (
        [string]$CertPath
    )

    Write-Host "🔍 匯入 Zscaler 憑證中：$CertPath"

    # 檢查檔案是否存在
    if (-Not (Test-Path $CertPath)) {
        Write-Error "❌ 憑證檔案不存在：$CertPath"
        exit 1
    }

    # 匯入至本機電腦的受信任根憑證授權單位
    try {
        Import-Certificate -FilePath $CertPath -CertStoreLocation Cert:\LocalMachine\Root | Out-Null
        Write-Host "✅ 已匯入至 LocalMachine\Root"
    } catch {
        Write-Error "❌ 匯入本機憑證失敗：$_"
    }

    # 匯入至目前使用者的受信任根
    try {
        Import-Certificate -FilePath $CertPath -CertStoreLocation Cert:\CurrentUser\Root | Out-Null
        Write-Host "✅ 已匯入至 CurrentUser\Root"
    } catch {
        Write-Error "❌ 匯入使用者憑證失敗：$_"
    }
}

function Update-PythonCertifi {
    param (
        [string]$CertPath
    )

    Write-Host "`n📦 嘗試更新 Python 的 certifi 憑證..."

    $certifiPath = & python -m certifi 2>$null

    if (-not $certifiPath) {
        Write-Warning "⚠️ 無法取得 certifi 憑證路徑，請確認 Python 和 certifi 已安裝"
        return
    }

    try {
        Get-Content $CertPath | Add-Content -Path $certifiPath
        Write-Host "✅ 已將憑證附加至 certifi：$certifiPath"
    } catch {
        Write-Error "❌ 更新 certifi 憑證失敗：$_"
    }
}

# --- 主流程 ---
Import-ZscalerCert -CertPath $CertPath
Update-PythonCertifi -CertPath $CertPath

Write-Host "`n🎉 所有步驟完成。如仍遇 SSL 問題，請重新啟動 PowerShell 或確認環境變數設定。"
```

---

## ✅ 使用方式

1. 將 Zscaler 憑證儲存為 `ZscalerRootCA.cer` 或 `.pem`。
2. 以系統管理員身份執行 PowerShell。
3. 執行指令：

```powershell
.\Install-ZscalerCert.ps1 -CertPath "C:\Path\To\ZscalerRootCA.cer"
```

---
