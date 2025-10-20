---
layout: post
title: 使用 NSG 設定 Azure VM 只允許國內的 IP 訪問
date: 2023-10-22 22:49
author: Poy Chang
comments: true
categories: [Azure, Container, Tools]
permalink: using-NSG-to-configure-azure-vm-only-allow-taiwan-ip/
---

前陣子以為自己玩壞了架在 Azure VM 的 AdGuard Home，經過調查之後發現，原來是被來自境外的黑客進行 DDoS 攻擊，雖然小小的 VM 承受得住每秒百來次的查詢請求，但是硬碟空間撐不住每次查詢所紀錄下的 Query Log，因此造成 VM 極度不穩。在不想額外花錢的情況下，這篇文章提供一種解決方案，讓有需要的人可以參考看看。

首先，因為攻擊還在持續，所以只要我關閉防護，就會湧進大量的攻擊請求，這裡附上被攻擊的短暫流量畫面：

![被 DDoS 攻擊](https://i.imgur.com/SQtuWZE.png)

使用情境上，絕大多數的時候只會在國內使用這個 VM 上所架設的服務，因此我想直接用阻斷境外連線的方式來進行防護。

不過要做到這種地理位置的 IP 控制，必定需要先取得指定國家的所有 IP 清單，再加入白名單。如何取得這個 IP 清單，就會是我們的第一步。

# 取得國內 IP 清單

[APNIC](https://www.apnic.net/) 亞太網路資訊中心，是全球五大區域性網際網路註冊管理機構之一，主要負責亞太地區 IP 位址、ASN 的分配，以及管理一部分根域名伺服器。

這個組織也提供每日更新的亞太地區 IPv4、IPv6、ASN 的分配資訊表，因此我們可以從下面這個網址取得該資訊：

[https://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest](https://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest)

而這個檔案的格式說明可以參考這個 [README.txt](https://ftp.apnic.net/apnic/stats/apnic/README.txt)

APNIC 所提供的這個檔案是可以免費使用的，即便 APNIC 對此檔案的準確性不提供任何保證，但 APNIC 也承諾會盡力確保這些報告的準確性，因此我打算用這份檔案來當作識別來源 IP 是國內還是境外。

# 處理 IP 清單

這個檔案內容的格式長得像下面這樣：

```
apnic|JP|ipv4|49.212.0.0|65536|20101207|allocated
apnic|HK|ipv4|49.213.0.0|4096|20101207|allocated
apnic|SG|ipv4|49.213.16.0|4096|20101209|allocated
apnic|VN|ipv4|49.213.64.0|16384|20101208|allocated
apnic|TW|ipv4|49.213.128.0|32768|20101208|allocated
apnic|TW|ipv4|49.214.0.0|131072|20101207|allocated
apnic|TW|ipv4|49.216.0.0|262144|20101207|allocated
...
```

可以明顯的看出來，他是用 `|` 作為欄位分隔，第 2 欄欄位是國別，第 3 欄是類型、第 4 和第 5 欄就是我們要的 IP 和該範圍的主機數量，不過我們需要的 IP 格式是要像 `49.216.0.0/14` 這樣來表示，所以拿到這份檔案之後，還需要再加工處理一下。

如果是使用 Linux 可以使用這個 Shell 指令來做轉換：

```shell
wget -q --timeout=60 -O- 'https://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest' | awk -F\| '/TW\|ipv4/ { printf("%s/%d\n", $4, 32-log($5)/log(2)) }' > taiwan_ssr.txt
```

如果是使用 Windows 可以使用這個 PowerShell 指令來做轉換：

```powershell
(Invoke-WebRequest -Uri 'https://ftp.apnic.net/apnic/stats/apnic/delegated-apnic-latest' -TimeoutSec 60).Content -split "`n" | ForEach-Object {
     if ($_ -match 'TW\|ipv4') {
        $ipParts = $_ -split '\|'
        $ipPrefix = $ipParts[3]
        $subnetMask = 32 - [math]::Ceiling([math]::Log([int]$ipParts[4], 2))
        "$ipPrefix/$subnetMask" 
     } 
} | Set-Content -Path 'taiwan_ssr.txt'
```

這兩個指令最後都會將結果輸出並儲存成 `taiwan_ssr.txt` 檔案，內容會長得像這樣：

```
49.213.128.0/17
49.214.0.0/15
49.216.0.0/14
...
```

# 設定白名單

由於這次主要被 DDoS 攻擊的是 AdGuard Home 的 DNS 服務，因此我可以從這套系統的 `設定` > `DNS 設定` > `存取設定` 中加入可使用的用戶端 IP，這裡只需要將上面所取得的 IP 清單加上去就可以了。

不過我想要把防護的位置往前拉到 Azure 上，讓這種地理位置的限制能力放在雲端架構上，藉此免除消耗伺服器的運算資源。

在 Azure 上有很多種防護手段，可以是建立 Azure Firewall、加入 Azure Load Balancer、使用 Azure DDoS Protection 服務，各種強大且進階的防護應有盡有。

這次我要用最基礎的又不需要費用的 NSG (Network Security Groups) 功能，來達到我想要的效果，畢竟手邊這個只是個沒幾個人用的小服務，殺雞焉用牛刀。

> 這裡的架構與情境很單純，因此採用 NSG 達到效果即可以滿足，但若是用在複雜架構或有許多管理工作要處理的情境，NSG 可能就不適合了，因為他相對其他服務來說，NSG 功能簡單且設定與管理的細膩度不足。

在建立 Azure VM 時，基本上都會配一張 NIC (Network Interface Controller) 網路介面，而這個網路介面會被加入到 NSG (Network Security Groups) 網路安全性群組中，這裡我們需要開啟 NSG 的`輸入安全性規則`選單，這裡可以看到所有 inbound 的連線規則，也就是要傳送訊息到這個 NSG 中的 NIC，必須通過這裡的規則才行，如下的畫面：

![NSG 網路安全性群組的輸入安全性規則](https://i.imgur.com/I4RhF7H.png)

接著，我們從上方的新增按鈕，在這裡新增一組輸入安全性規則，`來源`選擇 `IP Address`，在`來源 IP 位址/CIDR 範圍`欄位中輸入所有台灣的 IP，每筆 IP 間用 `,` 做分隔，下面的`服務`、`通訊協定`等設定，就根據你的需求做調整即可。

![新增輸入安全性規則](https://i.imgur.com/sL8wzD3.png)

完成新增之後稍微等一下，該規則很快就生效了，不用額外花一毛錢的防護就完成了。

## 後記

花了一點時間來研究這個來自境外的 DDoS 攻擊，藉此練了一點功，謝謝這位黑客 😉

---

參考資料：

* [MS Learn - Azure 網路安全性群組](https://learn.microsoft.com/zh-tw/azure/virtual-network/network-security-groups-overview?WT.mc_id=DT-MVP-5003022)
