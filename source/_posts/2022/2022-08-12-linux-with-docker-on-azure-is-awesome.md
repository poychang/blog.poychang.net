---
layout: post
title: 在 Azure 上玩 Docker for Linux 是一件很棒的事
date: 2022-08-12 16:09
author: Poy Chang
comments: true
categories: [App, Azure, Docker]
permalink: linux-with-docker-on-azure-is-awesome/
---

因緣際會之下，忽然想在雲端起一台 Linux 虛擬機，來玩 Docker 服務，不意外的發現，在 Azure 上玩 Docker 服務是一件很棒的事，深深地覺得每個開發者都應該要有一台 Linux。

>這篇應該會是篇心得文。

## Linux

現在很多應用程式都封裝成容器（Container）來執行，這項技術越來越普片發生在開發者的身邊，而要玩容器這項技術，有一台 Linux 絕對讓你少碰很多雷。

由於雲端服務的平易近人，因此我打算在 Azure 上建立一台 Linux 虛擬機器來玩 Docker 服務，過程中，玩到一些有趣的事情，在這裡做分享。

之所以會使用 Azure，除了對他比較熟習之外，也因為我有一些使用的額度，所以優先選擇介面友善的 Azure 來建立雲端虛擬機器，當然如果你習慣其他雲端平台，那也是 OK。

## Caddy

先來聊聊 [Caddy](https://caddyserver.com/)，這是一套使用 Go 撰寫而成的 Web Server，主要賣點是簡單的設定檔，還有豐富網站伺服器功能，像是支援 HTTP3、File Server、Virtual Host、Reverse Proxy 等等。

其中 Reverse Proxy 反向代理這個功能在現在化的網站架構中，可是非常好用的，再加上 Caddy 的設定檔，寫起來比 Nginx 簡潔不少，很值得體驗看看。

另外還有個重點是，他[支援自動從 Let's Encrypt 取得並更新 TLS 1.3 加密憑證](https://caddyserver.com/docs/automatic-https#wildcard-certificates)。這個原生的功能自動幫你處理好 HTTPS 的功能，可以省去開發者很多的工作，不僅很適合拿來開發 Side Project，對於買不起通用憑證的小型團隊，非常友善。

因此我主要看上他這兩點，有反向代理以及自動處理憑證的功能。

## Docker Compose

為了更容易管理容器的運行環境，我使用 Docker Compose 來管理容器，就連上面的 Caddy 我也是用 Docker Compose 來啟動。

之所以會覺得這是必須，一方面是因為我想要玩的環境只是個人想用的，不需要用到像是 K8S 那項龐大、強悍的管理平台，另一方面我覺得使用 Docker Compose 可以讓我輕鬆的管理啟動容器的環境與相依性。

在應用程式的管理上，也可以透過容器來做環境隔離，而統一透過 Docker Compose 來處理，可以方便我用一致的處理手段來管理。

## 我想像中的架構

目標上，我期望達到這樣的目標與架構:

### 目標一：最低的硬體成本

使用 Azure 雲端服務建立 Linux 虛擬機，選用 Standard B1s 的定價層，只有 1 顆 CPU 和 1 G 的記憶體每月成本約 300 塊台幣。

![Linux VM on Azure](https://i.imgur.com/xqEBkZu.png)

### 目標二：SSL 與反向代理

使用 Caddy 來處理反向代理，並使用 Container 的方式來執行，由於 Caddy 官方已經有建好 Container Image 並放在 [Docker Hub](https://hub.docker.com/_/caddy) 上，所以我們可以直接用就好。

比較特別的是，我想要透過他來管理所有流進這台 Linux 虛擬機器的網路流量，處理反向代理的功能，因此在以下的 `docker-compose.yaml` 設定檔中，會使用 `network_mode: host` 的方式來監聽主機的 80 和 443 端口，藉此來將不同的網址轉到不同的容器來處理。

```
version: '3.7'

services:

  caddy:
    container_name: caddy
    image: caddy:2-alpine
    network_mode: host
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy-data:/data:rw
      - caddy-config:/config:rw
    environment:
      - CADDY_TLS=${LETSENCRYPT_EMAIL:-internal}
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
      - DAC_OVERRIDE

volumes:
  caddy-data:
  caddy-config:
```

而 Caddy 所使用的 `Caddyfile` 設定檔裡面的設定很簡單，透過反向代理，將從主機監聽到的流量轉到指定的容器中就好了，如下：

```
docker1.poychang.net {
  reverse_proxy localhost:50080
}
```

由於 Caddy 會自動根據你所使用的網域名稱來自動取得並更新 SSL 憑證，所以甚麼設定都不用做。

### 目標三：容器化 Web 應用程式

從上面的反向代理就可以稍微看出來，Caddy 將 `docker1.poychang.net` 這個網址來的流量，轉向到 `localhost:50080` 這裡，而這個就是使用以下 `docker-compose.yaml` 所啟動的容器化 Web 應用程式。

```
version: '3.7'

services:

  docker1:
    container_name: docker1
    image: httpd:2.4
    ports:
      - 50080:80
    volumes:
      - ./html:/usr/local/apache2/htdocs
```

![容器化的 Web 應用程式](https://i.imgur.com/uO47NPX.png)

藉由這樣的端口對應，搭配 Caddy 的反向代理，我可以實現一個自動化申請 SSL 憑證的多網站架構。

### 目標四：啟動一個別人做好的 Web 應用程式

最近看到一個專案滿有趣的，透過 Meta Search 引擎來對多個搜尋網站來獲取搜尋結果，簡單說就是你可以建設一個像是 Google 的搜尋網站，而這個自己架設的搜尋網站背後正是使用 Google、Qwant、Brave、DuckDuckGo 這類的搜尋引擎來搜尋。

這樣有神麼好處？簡單說就是隱私。透過這樣的自架搜尋網站，你所要搜尋的關鍵字就不會被記錄下來，而且這個關鍵字也關聯不到你了。

有興趣的人可以去看看這個放在 GitHub 上的專案 [SearXNG](https://github.com/searxng/searxng)。

我自己就用上面所提的架構，在一台 Linux 虛擬機器上，啟動 SearXNG 容器，[https://search.poychang.net/](https://search.poychang.net/)。

![自己架設的 SearXNG 搜尋網站](https://i.imgur.com/uSHuDLd.png)

## 後記

這篇比較偏向心得文，很多細節都沒有提到怎麼做，因為很難用文字詳述，所以就...走過路過，看看就算了。

----------

參考資料：

* [Caddy - Docs](https://caddyserver.com/docs/)
* [GitHub - SearXNG](https://github.com/searxng/searxng)
* [Azure 中的 Linux 虛擬機器](https://azure.microsoft.com/zh-tw/services/virtual-machines/linux/)
