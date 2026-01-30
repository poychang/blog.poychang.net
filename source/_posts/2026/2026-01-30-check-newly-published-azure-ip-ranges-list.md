---
layout: post
title: 檢查是否有發布新的 Azure IP Ranges 清單
date: 2026-01-30 11:42
author: Poy Chang
comments: true
categories: [Azure, PowerShell]
permalink: check-newly-published-azure-ip-ranges-list/
---

因為 Azure 的全球基礎設施與服務端點會不斷變動，而企業防火牆、Proxy、WAF、NSG 等安全設備必須依賴這份清單保持正確的允許清單設定，這時候可以參考 Microsoft 所以發布的 Azure IP Ranges and Service Tags 清單。本文示範如何使用 PowerShell 自動檢查 Microsoft 是否發布了新的 Azure IP Ranges 清單。

Microsoft 之所以需要發布新版 Azure IP Ranges 清單，主要是為了：

- 反映 Azure 全球基礎設施的最新變動
- 確保企業防火牆與安全設備能正確允許 Azure 流量
- 支援仍需使用明確 IP 的企業環境
- 滿足合規需求

而這份清單，你可以從 Microsoft 官方下載頁面 [Azure IP Ranges and Service Tags - Public Cloud](https://www.microsoft.com/en-us/download/details.aspx?id=56519) 取得。

## 自動化

如果每次都要手動打開下載頁面查看是否有新版清單，實在是太麻煩了。因此，我想透過使用 PowerShell 撰寫一個簡單的腳本來自動檢查是否有新的 Azure IP Ranges 清單發布。

觀察網頁的原始內容發現，下載頁面會在 HTML 中嵌入一個名為 `__DLCDetails__` 的 JavaScript 物件，裡面包含了下載檔案的詳細資訊，例如檔案名稱、下載 URL、版本號、發布日期等。我們可以利用 PowerShell 的 `Invoke-WebRequest` 來取得網頁內容，然後使用正則表達式擷取出 `__DLCDetails__` 的 JSON 資料，接著解析 JSON 並檢查發布日期是否在最近幾天內。

可擷取使用的主要內容如下 JSON 內容格式如下：

```json
{
    "isPrimary": "False",
    "name": "ServiceTags_Public_20260112.json",
    "url": "https://download.microsoft.com/download/7/1/d/71d86715-5596-4529-9b13-da13a5de5b63/ServiceTags_Public_20260112.json",
    "size": "4297411",
    "version": "2026.01.12",
    "datePublished": "1/13/2026 8:12:56 AM"
}
```

有了這個資訊，要實現自動化檢查是否有新的 Azure IP Ranges 清單發布就變得相當簡單了。以下是完整的 PowerShell 程式碼範例：

## 完整的 PowerShell 程式碼

我預期每周執行一次，因此底下程式碼會檢查是否在最近 7 天內有新的發布，如果有偵測到新的版本，則會輸出相關資訊，並可在指定區塊內加入後續的通知或處理邏輯。

```powershell
#requires -Version 5.1

$ErrorActionPreference = 'Stop'
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 -bor [Net.SecurityProtocolType]::Tls13

$uri = 'https://www.microsoft.com/en-us/download/details.aspx?id=56519'
$headers = @{ 'User-Agent' = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' }

# Fetch page and pull the JSON blob assigned to __DLCDetails__.
$response = Invoke-WebRequest -Uri $uri -Headers $headers -UseBasicParsing
$pageContent = $response.Content

$pattern = [regex] '__DLCDetails__\s*=\s*(\{.*?\})\s*</script>'
$match = $pattern.Match($pageContent)
if (-not $match.Success) { throw 'Failed to locate __DLCDetails__ JSON payload.' }

$json = $match.Groups[1].Value
$dlc = $json | ConvertFrom-Json

$title = $dlc.dlcDetailsView.downloadTitle
$downloadUrl = $dlc.dlcDetailsView.downloadFile[0].url
$version = $dlc.dlcDetailsView.downloadFile[0].version
$datePublished = $dlc.dlcDetailsView.downloadFile[0].datePublished
$installInstruction = $dlc.dlcDetailsView.installInstructionSection

if (-not $datePublished) { throw 'datePublished field not found.' }

$published = [datetime]::Parse($datePublished, [Globalization.CultureInfo]::InvariantCulture)
$age = (Get-Date) - $published
$checkingDays = 7
$withinDays = $age.TotalDays -le $checkingDays

if ($withinDays) {
    Write-Output "$title"
    Write-Output "Status: Published within last $checkingDays days."
    Write-Output "Date Published: $datePublished"
    Write-Output "Version: $version"
    Write-Output "Download URL: $downloadUrl"
    Write-Output "Installation Instruction: $installInstruction"

    #                                 #
    # 偵測到有更新，可在這裡處理後續通知作業 #
    #                                 #
} 
else { 
    Write-Output "Status: Older than $checkingDays days. No action needed."
}
```

---

參考資料：

- [Azure IP Ranges and Service Tags - Public Cloud](https://www.microsoft.com/en-us/download/details.aspx?id=56519)
- [MS Learn - 虛擬網路安全性的 Azure 服務標籤概觀](https://learn.microsoft.com/zh-tw/azure/virtual-network/service-tags-overview?WT.mc_id=DT-MVP-5003022)
- [MS Learn - Azure IP 位址](https://learn.microsoft.com/zh-tw/azure/virtual-network/what-is-ip-address-168-63-129-16)
