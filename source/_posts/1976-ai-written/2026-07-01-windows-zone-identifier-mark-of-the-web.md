---
layout: post
title: Windows 下載檔案後的隱藏標記：Zone.Identifier 是什麼？
date: 2026-07-01 11:23
author: Poy Chang
comments: true
categories: [Develop, PowerShell, Tools]
permalink: windows-zone-identifier-mark-of-the-web/
---

> 聲明：此篇文章使用 AI 工具產生，請自行判斷文章內容的正確性。

在 Windows 上，從網路下載 `.ps1`、`.exe`、`.zip`、`.docm`、`.xlsm` 等檔案後，有時會遇到這類訊息：

```text
This file came from another computer and might be blocked to help protect this computer.
```

或在 PowerShell 執行腳本時看到：

```text
File cannot be loaded. The file is not digitally signed.
You cannot run this script on the current system.
```

這通常不是檔案內容被修改，也不是 PowerShell 判定這個檔案一定有問題，而是 Windows 在檔案旁邊加上了一個安全來源標記：`Zone.Identifier`。

這個標記常被稱為 **Mark of the Web，MOTW**。

---

## Zone.Identifier 不是寫在檔案內容裡

很多人第一次聽到 `Zone.Identifier`，會直覺打開檔案搜尋：

```powershell
Get-Content .\do-something.ps1
```

或用 VS Code、記事本打開檔案內容，但通常什麼都找不到。

原因是：`Zone.Identifier` 不存在於檔案的主內容裡。

它是 NTFS 檔案系統的 **Alternate Data Stream，替代資料流**。

可以把一個檔案想像成這樣：

```text
do-something.ps1
├─ 主資料流：真正的 PowerShell 腳本內容
└─ 替代資料流：Zone.Identifier
```

也就是說，同一個檔名底下，除了正常看到的檔案內容，還可以附掛額外的資料流。Windows 會利用這個額外資料流記錄檔案來源區域。Microsoft 的 Windows 協定文件也明確記載，`Zone.Identifier` 是用來儲存 URL security zones 的 stream name，完整形式可以表示為 `sample.txt:Zone.Identifier:$DATA`。

---

## Zone.Identifier 裡面長什麼樣子？

`Zone.Identifier` 本身是文字格式，常見內容類似：

```ini
[ZoneTransfer]
ZoneId=3
```

其中 `ZoneId=3` 通常代表這個檔案來自 Internet Zone。Microsoft 文件中的範例也使用這種格式描述 `Zone.Identifier` stream。

如果檔案是用瀏覽器、郵件、即時通訊軟體或其他會保留來源資訊的方式下載，Windows 可能會把來源區域記錄在這個 stream 裡。

這就是為什麼同一份 `.ps1`：

```text
自己在本機建立：可能可以直接執行
從網路下載：可能被 PowerShell 擋下
```

檔案內容可以完全一樣，但檔案的「來源標記」不同。

---

## 如何檢查檔案是否有 Zone.Identifier？

使用 PowerShell 可以列出檔案的 stream：

```powershell
Get-Item .\do-something.ps1 -Stream *
```

如果檔案有 `Zone.Identifier`，可能會看到：

```text
Stream             Length
------             ------
:$DATA              12345
Zone.Identifier       120
```

其中：

```text
:$DATA
```

代表檔案主內容。

```text
Zone.Identifier
```

代表附加的來源區域標記。

要讀取它的內容，可以執行：

```powershell
Get-Content .\do-something.ps1 -Stream Zone.Identifier
```

可能會看到：

```ini
[ZoneTransfer]
ZoneId=3
HostUrl=https://example.com/file.ps1
ReferrerUrl=https://example.com/
```

不是每個檔案都有 `HostUrl` 或 `ReferrerUrl`，但只要有 `ZoneId=3`，就足以讓 Windows 或 PowerShell 把它視為來自網際網路的檔案。

---

## 它和 PowerShell Execution Policy 的關係

PowerShell 的 `RemoteSigned` 執行原則會允許腳本執行，但對「從網路下載的腳本」要求更高。官方文件說明，`RemoteSigned` 會要求從網際網路下載的腳本與設定檔必須由受信任發行者簽章；本機撰寫、不是從網路下載的腳本則不需要簽章。

因此問題不是：

```text
這支腳本內容一定有問題
```

而是：

```text
這支腳本被標記為從網路下載，而且沒有可信任的數位簽章
```

PowerShell 文件也說明，Internet Explorer 和 Microsoft Edge 這類程式會對下載檔案加入 alternate data stream，用來標示檔案來自 Internet；當執行原則是 `RemoteSigned` 時，PowerShell 不會執行未簽章且從網際網路下載的腳本。

所以錯誤訊息中的：

```text
The file is not digitally signed.
```

不是說腳本被竄改，而是說目前政策要求這類腳本要簽章，但這個檔案沒有簽章。

---

## 如何解除封鎖？

PowerShell 提供 `Unblock-File`：

```powershell
Unblock-File .\do-something.ps1
```

這個指令的作用不是修改腳本內容，而是移除 `Zone.Identifier` 替代資料流。Microsoft 官方文件明確說明，`Unblock-File` 內部會移除 `Zone.Identifier` alternate data stream，其值為 `3` 時表示檔案是從網際網路下載。

解除後可以再次檢查：

```powershell
Get-Item .\do-something.ps1 -Stream *
```

如果只剩下：

```text
:$DATA
```

代表 `Zone.Identifier` 已被移除。

也可以用 `Remove-Item` 直接刪除指定 stream：

```powershell
Remove-Item .\do-something.ps1 -Stream Zone.Identifier
```

不過在一般情境下，`Unblock-File` 比較能表達意圖。

---

## 檔案總管裡的「解除封鎖」也是同一件事

在 Windows 檔案總管中，對某些從網路下載的檔案按右鍵，進入「內容」，底部可能會看到「解除封鎖」核取方塊。

那個操作本質上也是移除來源區域標記。

PowerShell 官方文件也說，`Unblock-File` 執行的是與檔案總管內容視窗中「解除封鎖」按鈕相同的作業。

---

## 為什麼複製、壓縮、解壓縮後行為可能不同？

`Zone.Identifier` 是 NTFS 的 alternate data stream，因此它是否被保留，取決於檔案如何被移動、複製、壓縮、解壓縮，以及目標檔案系統是否支援 ADS。

例如：

```text
NTFS → NTFS
有機會保留 ADS

NTFS → FAT32 / exFAT
通常無法保留 ADS

壓縮成 zip
可能只標記 zip 本身

解壓縮 zip
是否傳遞 MOTW 取決於解壓縮工具與 Windows 行為
```

這也是為什麼有時候從瀏覽器下載 `.zip` 後，解壓縮出來的 `.ps1`、`.exe` 或 Office 文件也會受到來源標記影響；有時候卻不會。

PowerShell 官方文件也提醒，不是所有下載方式都會標記檔案為來自 Internet Zone，例如 `curl.exe`、`Invoke-RestMethod`、`Invoke-WebRequest` 這類方式可能不會加上相同標記。

---

## 這是安全機制，不是防毒機制

`Zone.Identifier` 的定位不是判斷檔案有沒有病毒，而是記錄：

```text
這個檔案來自哪個安全區域
```

後續由 Windows、PowerShell、Office、SmartScreen 或其他應用程式根據這個資訊決定要不要提示、阻擋、要求簽章或進入受保護模式。

所以它更像是：

```text
來源風險標籤
```

不是：

```text
惡意程式判定結果
```

這個設計的核心價值是降低誤執行風險。

使用者從網路下載一支 `.ps1` 後，PowerShell 不會直接假設它可以執行，而是先看來源標記與 Execution Policy。這讓「下載後立即執行」多了一個判斷門檻。

---

## 實務建議

不要用全域放寬政策來處理單一檔案。

不建議一遇到錯誤就執行：

```powershell
Set-ExecutionPolicy Unrestricted
```

這會放寬整個環境對腳本執行的限制。

較合理的流程是：

```powershell
Get-Item .\do-something.ps1 -Stream *

Get-Content .\do-something.ps1 -Stream Zone.Identifier

Unblock-File .\do-something.ps1
```

也就是：

```text
先確認檔案來源
再確認檔案內容
最後只解除這個檔案的封鎖
```

如果是企業環境，應優先遵守組織的 Group Policy 與腳本簽章規範。PowerShell 的 Execution Policy 支援多個 scope，包含 MachinePolicy、UserPolicy、Process、CurrentUser、LocalMachine，且 Group Policy 設定有較高優先順序。

---

## 總結

`Zone.Identifier` 是 Windows 對下載檔案加上的來源標記。

它不在檔案主內容裡，而是在 NTFS alternate data stream 裡。

它常見內容是：

```ini
[ZoneTransfer]
ZoneId=3
```

`ZoneId=3` 代表檔案來自 Internet Zone。這個資訊會被 PowerShell、Windows Shell、Office 或其他安全機制用來判斷是否要提示、限制或要求簽章。

所以當 PowerShell 擋下一支從網路下載的 `.ps1`，真正的判斷鏈通常是：

```text
檔案有 Zone.Identifier
↓
PowerShell 判斷它來自 Internet
↓
目前 Execution Policy 要求網路下載腳本必須簽章
↓
腳本未簽章
↓
拒絕執行
```

處理方式不是直接放寬整台電腦，而是先理解這個標記，再針對可信任的單一檔案執行：

```powershell
Unblock-File .\do-something.ps1
```

---

## 官方參考資料

* Microsoft Learn：Zone.Identifier Stream Name。說明 `Zone.Identifier` stream name、完整形式與 `[ZoneTransfer] ZoneId=3` 格式。
* Microsoft Learn：Unblock-File。說明 `Unblock-File` 會解除封鎖從網際網路下載的檔案，並移除 `Zone.Identifier` alternate data stream。
* Microsoft Learn：about_Execution_Policies。說明 `RemoteSigned`、Execution Policy scope，以及下載檔案的 alternate data stream 與 PowerShell 腳本執行限制。
* Microsoft Learn：Set-ExecutionPolicy。說明 PowerShell 執行原則的可用值，例如 `AllSigned`、`RemoteSigned`、`Restricted`、`Unrestricted`、`Bypass`。
* Microsoft Learn：Persistent Zone Identifier object。說明 Windows 可將 zone information 持久化到本機檔案，並由 Attachment Execution Services 設定、Internet Security Manager 使用。

