---
layout: post
title: Surface Pro 睡著了，WSL 服務卻還在跑
date: 2026-07-06 16:06
author: Poy Chang
comments: true
categories: [Typescript, Javascript, Python, CSharp, Dotnet, Blazor, SQL, Angular, WebAPI, Azure, Develop, Bot, IoT, AI, Container, PowerShell, Tools, App, Test, Note, Concept, Uncategorized]
permalink: wsl-service-running-on-asleep-device/
---

最近我遇到一個很有趣的現象：我在 Surface Pro 6 上使用 WSL 跑服務，當裝置進入「睡眠」狀態後，這個服務竟然還可以運作。直覺上，電腦都睡著了，背景服務應該也停了才對。但如果這台裝置使用的是 Windows 的 **Modern Standby**，事情就不完全是這樣。

這篇文章整理 Modern Standby / S0 Low Power Idle 的技術概念，並釐清一件容易混淆的事：這不是傳統的休眠，也不是傳統的 S3 Sleep，而是一種讓系統在低功耗狀態下仍保留部分活動能力的電源模型。

## 先講結論

Modern Standby 的核心是 **S0 Low Power Idle**。在這個狀態下，系統不是進入傳統 ACPI S3 睡眠，而是仍停留在 S0，只是把螢幕關閉、讓硬體進入低功耗狀態，並由 Windows 控制哪些活動可以短暫執行。

![Modern Standby 和舊式 S3 模型。](https://files.poychang.net/storage/wsl-service-running-on-asleep-device/the-legacy-and-modern-standby-models.png)

Microsoft 文件對 [Modern Standby](https://learn.microsoft.com/zh-tw/windows-hardware/design/device-experiences/modern-standby?WT.mc_id=DT-MVP-5003022) 的描述是：Modern Standby 擴展自 Connected Standby 的電源模型，提供類似手機的 instant on / instant off 體驗；S0 Low Power Idle 讓系統在低功耗模式下仍可維持網路連線。

因此，我手上的 Surface Pro 6 在「睡眠」時，WSL 裡的服務仍在運作。

> 裝置進入的是 Modern Standby，也就是 S0 Low Power Idle；系統仍部分運作，Windows 可能在受控的活動窗口中允許部分背景活動、網路事件或維護工作執行。

雖然有這樣的結論，但請不要過度解讀。Modern Standby 不能讓裝置成為一台穩定持續運作的伺服器。

## Modern Standby 不是傳統 Sleep，也不是 Hibernate

來理解一些技術細節，基本上 Windows 的電源狀態大致是這樣：

| 狀態           | ACPI 狀態         | 行為                             |
| -------------- | ----------------- | -------------------------------- |
| 正常運作       | S0                | 系統完整運作                     |
| Modern Standby | S0 Low Power Idle | 系統仍在 S0，但進入低功耗閒置    |
| 傳統睡眠       | S1 / S2 / S3      | 系統看起來關閉，記憶體維持刷新   |
| 休眠           | S4                | 記憶體內容寫入硬碟，系統幾乎關閉 |
| 關機           | S5                | 完整關閉，下次重新開機           |

Microsoft 的 System Power States 文件明確列出，Modern Standby 是 **Sleep (Modern Standby), S0 low-power idle**；在這個狀態下，系統可以快速從低功耗切回高功耗，以回應硬體或網路事件。文件也指出，支援 [Modern Standby](https://learn.microsoft.com/zh-tw/windows-hardware/design/device-experiences/modern-standby?WT.mc_id=DT-MVP-5003022) 的 SoC 系統不使用 S1-S3。

這也是為什麼「休眠」這個詞容易造成誤會。使用者日常說「電腦休眠」時，可能只是指螢幕關掉、蓋上鍵盤、按下電源鍵或從開始功能表選擇睡眠。但在 Windows 技術語境裡，**Hibernate 是 S4**，而 Modern Standby 是 **S0 Low Power Idle**，兩者不是同一件事。

我手邊的 Surface Pro 6 就是屬於這類裝置，當按下電源鍵、闔上蓋子，或從 Windows 開始功能表選擇 Sleep 的時候，它進入的是 Modern Standby / S0 Low Power Idle。

之所以會在 Surface Pro 6 上看到這種行為其實也不奇怪，因為這台裝置的電源模型本來就不是傳統桌機那種「睡下去就整台幾乎停止」的設計，而是偏向手機、平板、行動裝置那種「看起來睡著，但仍可維持部分系統活動」的模型。

## 為什麼 WSL 服務可能還在運作

WSL 讓 Windows 可以直接執行 Linux 環境。Microsoft 文件說，WSL 可執行 Bash、GNU/Linux 命令列工具與 Linux 服務。如果是 WSL 2，則可以使用虛擬化技術，在輕量級 utility VM 裡執行 Linux kernel；Linux 發行版則以隔離容器的形式跑在這個由 WSL 管理的 VM 內。

從這個架構來看，WSL 服務是否能在 Surface 進入 Modern Standby 後繼續有活動，取決於幾個條件：

1. Surface 當下進入的是 Modern Standby，而不是 S4 Hibernate。
2. Windows 是否允許該階段有背景活動。
3. 是否接上 AC 電源。
4. 網路是否仍維持 Connected Standby（連線待命）能力。
5. WSL VM 是否仍保持啟動。
6. 該服務是否剛好在 Windows 允許的活動窗口中執行。

Modern Standby 的官方文件提到，系統可以在此低功耗狀態支援背景活動與快速喚醒，而Connected Standby（連線待命）的系統還可根據特定網路模式喚醒，讓應用接收 email、VoIP、新聞等最新內容。

這解釋了為什麼 WSL 服務仍然有反應。

不過要注意，這項特性不是承諾，也不是伺服器語意，所以不要將這樣的行為視為可靠的伺服器運作模式，**Modern Standby 不是設計來讓任意背景服務長時間穩定運作的模式。**。

> WSL 服務在 Surface Pro 6 的睡眠期間仍有機會運作，是 Modern Standby + WSL VM 生命週期 + Windows 背景活動政策共同作用的結果。

## AC 電源與電池模式差異很大

Modern Standby 在插電與使用電池時的行為不同。

Modern Standby 系統在 AC 電源下可以進入 maintenance mode，如果此時有維護工作，更新與其他活動可能會發生，並在有網路時使用網路。

但在電池模式下，Windows 會更積極延後非關鍵工作，減少不必要喚醒。系統會透過延後非關鍵工作與移除不必要喚醒來改善 Modern Standby 期間的電池續航。

因此在電池模式下，Modern Standby 的效果未必會讓 WSL 服務持續運作。

## Connected Standby 與 Disconnected Standby

Modern Standby 又分成是否維持網路連線。

Microsoft 的 Modern Standby 驗證文件說，可以使用 `powercfg /a` 確認系統是否支援 Modern Standby，以及睡眠期間是否支援網路連線。若支援連線待命，會看到：

```powershell
powercfg /a
```

輸出中可能出現：

```text
Standby (S0 Low Power Idle) Network Connected
```

如果 NIC 不支援相關 offload，但系統韌體仍回報支援 S0 Low Power Idle，則可能看到：

```text
Standby (S0 Low Power Idle) Network Disconnected
```

這代表它支援 Modern Standby，但睡眠期間不維持網路連線。

這點在我的使用情境非常重要，因為我在 WSL 上跑的服務就是需要網路連線才能讓遠端裝置正確運作。如果 Modern Standby 期間網路斷線，那個 WSL 服務就無法持續運作了。

## 如何確認機器有沒有 Modern Standby

在 Windows Terminal 或 PowerShell 執行：

```powershell
powercfg /a
```

如果看到：

```text
Standby (S0 Low Power Idle) Network Connected
```

或：

```text
Standby (S0 Low Power Idle) Network Disconnected
```

就代表這台機器支援 Modern Standby。

如果你想知道睡眠期間到底發生了什麼，可以產生 SleepStudy 報告：

```powershell
powercfg /sleepstudy /duration 7
```

或：

```powershell
powercfg.exe /SleepStudy
```

SleepStudy 會產生 HTML 報告，提供每個 Modern Standby session 的 active time、idle time、power consumed，並列出活動原因與較活躍的元件。

## Modern Standby 的硬體條件

Modern Standby 不是單靠 Windows 設定就能打開的功能。Microsoft 的[設計文件](https://learn.microsoft.com/zh-tw/windows-hardware/design/device-experiences/prepare-hardware-for-modern-standby?WT.mc_id=DT-MVP-5003022)指出，要支援 Modern Standby，PC 硬體平台必須符合特定要求，包含 SoC、DRAM、網路裝置與其他硬體元件。

因此 Modern Standby 並不是「只要 Windows 10 / 11 就一定有」，而是需要硬體、韌體、驅動與 OEM 設計共同支援。

這也是為什麼 Surface、筆電、平板、迷你電腦比較常見 Modern Standby，而傳統自組桌機不一定有。

## 實務觀察方式：驗證是否真的在睡眠期間有活動

如果要驗證服務是否真的會在 Modern Standby 期間持續有活動，可以用比較保守的方式測試：

```bash
while true; do
  date >> ~/modern-standby-test.log
  sleep 10
done
```

然後讓 Surface 進入睡眠，過一段時間後喚醒，再檢查 log 的時間戳是否持續前進。

## 這項特性的真正意義

Modern Standby 的有趣之處在於，它把 PC 的睡眠模型往手機靠近。使用者看到的是螢幕關閉、裝置像是睡著了，但系統底層其實還保留事件處理、快速喚醒、網路維持、通知、維護工作與受控背景活動的能力。

這讓我手邊的 Surface 裝置能在低功耗下，額外執行具有潛在價值的服務。

## 結語

我在 Surface Pro 6 上觀察到 WSL 服務在睡眠期間仍可運作，最合理的技術解釋是：這台裝置進入的不是傳統 S3，也不是 S4 Hibernate，而是 Modern Standby / S0 Low Power Idle。

在這個狀態下，Windows 仍停留在 S0，只是進入低功耗閒置。系統可以根據硬體事件、網路事件、背景工作與維護需求短暫回到活動狀態。這讓 WSL 服務有機會在某些條件下繼續取得執行時間。

但這不代表 Modern Standby 是可靠的背景伺服器模式。Windows 會暫停桌面應用程式、節流第三方服務，WSL VM 本身也會自動管理生命週期。若要長時間穩定執行服務，仍應使用真正的伺服器、雲端 VM、容器平台，或至少明確設定電源策略並接受耗電與發熱成本。

Modern Standby 的價值不是「讓電腦睡著還能無限制工作」，而是「讓 PC 在看似睡著時，仍能以非常受控的方式保持部分活性」。

不過 Modern Standby 這項特性也足夠讓我玩出一些有趣的應用。

---

參考資料：

- [MS Learn - Modern Standby 現代待命模式是什麼](https://learn.microsoft.com/zh-tw/windows-hardware/design/device-experiences/modern-standby?WT.mc_id=DT-MVP-5003022)
- [MS Learn - 適用於 Surface 裝置的網路喚醒](https://learn.microsoft.com/zh-tw/surface/wake-on-lan-for-surface-devices?WT.mc_id=DT-MVP-5003022)
- [MS Learn - 現代待命模式的硬體準備](https://learn.microsoft.com/zh-tw/windows-hardware/design/device-experiences/prepare-hardware-for-modern-standby?WT.mc_id=DT-MVP-5003022)
- [MS Learn - Modern Standby 與 S3 的比較](https://learn.microsoft.com/zh-tw/windows-hardware/design/device-experiences/modern-standby-vs-s3?WT.mc_id=DT-MVP-5003022)
