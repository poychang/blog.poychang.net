---
layout: post
title: 在 Azure 上開 Linux VM 架設 AdGuard
date: 2023-10-20 21:59
author: Poy Chang
comments: true
categories: [Azure, Container, Tools]
permalink: adguard-home-setup-on-azure-linux-vm/
---

最近不小心把之前架設的 AdGuard 玩壞了，由於上次沒有留下筆記，這次把相關的架設筆記留下來，不然未來某天又玩壞了，還要再花點時間找資料。

在 Azure 上建立 Ubuntu VM 基本上沒什麼困難的，頂多就是登入用的 SSH 私鑰要留好，其他的基本上都算是簡單設定就搞定了。

遠端連線到 Linux 之後，不免俗的要先更新一下所安裝的套件，相關指令如下：

```bash
# 取得遠端更新伺服器的套件檔案清單
sudo apt update
# 更新清單後安靜的安裝要更新的套件
sudo apt update && sudo apt upgrade -y
# 清除更新時所下載回來的更新(安裝)檔案
sudo apt clean
# 自動清除更新後用不到的舊版本檔案（例如舊的核心程式）
sudo apt autoremove
```

## 安裝 Docker 相關工具

我打算使用 Docker 容器的方式來啟動 AdGuard，因此先來安裝 Docker 相關工具。

Docker 官方文件也有安裝在 Ubuntu 的詳細說明，有需要可以[參考這裡](https://docs.docker.com/engine/install/ubuntu/)。

這裡簡單節錄一下主要步驟：

1. 設定 Docker 的 Apt 存放庫

```bash
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add the repository to Apt sources:
echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
```

2. 安裝 Docker 相關的工具

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

## 下載 AdGuard Home 的 Docker 映像檔

AdGuard 已經將包裝好的容器放上 [Docker Hub](https://hub.docker.com/r/adguard/adguardhome)，因此我們只要簡單一個指令即可取得所需要的 Docker 映像檔

```bash
sudo docker pull adguard/adguardhome
```

> 記得使用 `sudo` 提升權限。

## 關閉預設啟動的 DNS 服務

由於我會使用 AdGuard Home 所提供的 DNS 服務，因此要先把預設被開啟的 systemd-resolved 服務關閉，避免 53 Port 被占用。

```bash
sudo systemctl disable systemd-resolved
sudo systemctl stop systemd-resolved
```

## 建立 Docker Compose 檔案

為了更容易管理所啟動的容器，使用 Docker Compose 來管理所啟動的容器。

這裡我會先在家目錄建立一個資料夾，例如 `adguard`，然後在這裡面建立 `docker-compose.yml` 檔案，內容如下：

```yml
version: '3.7'

services:

  adguard:
    container_name: adguard
    image: adguard/adguardhome
    restart: unless-stopped
    ports:
      - 53:53/tcp
      - 53:53/udp
      - 80:80/tcp
      - 443:443/tcp
      #- 3000:3000/tcp #這個 Port 只有在初始設定時會用到
    volumes:
      - ./adguard_data:/opt/adguardhome/work
      - ./adguard_config:/opt/adguardhome/conf
```

在 [Docker Hub 上的 AdGuard](https://hub.docker.com/r/adguard/adguardhome) 說明中，有直接使用 Docker 啟動容器的指令，其中官方預設的啟動指令會使用很多 Port，這裡簡單說一下各個 Port 的用途：

```bash
# plain DNS
-p 53:53/tcp -p 53:53/udp
# add if you intend to use AdGuard Home as a DHCP server
-p 67:67/udp -p 68:68/tcp -p 68:68/udp
# add if you are going to use AdGuard Home's admin panel as well as run AdGuard Home as an HTTPS/DNS-over-HTTPS server
-p 80:80/tcp -p 443:443/tcp -p 443:443/udp -p 3000:3000/tcp
# add if you are going to run AdGuard Home as a DNS-over-TLS server
-p 853:853/tcp
# add if you are going to run AdGuard Home as a DNS-over-QUIC server. You may only leave one or two of these
-p 784:784/udp -p 853:853/udp -p 8853:8853/udp
# add if you are going to run AdGuard Home as a DNSCrypt server
-p 5443:5443/tcp -p 5443:5443/udp
```

> 基本上沒有使用到的 Port 設定，是可以直接移除。

## 啟動容器

在有 `docker-compose.yml` 的資料夾中使用以下指令啟動

```bash
sudo docker compose up -d
sudo docker compose down
```

## 設定 AdGuard Home

使用瀏覽器開啟站台，例如這台 Linux VM 對外 IP 為 180.10.10.10，則使用 http://180.10.10.10:3000 來啟動設定頁面，設定完之後，AdGuard Home Portal 則是使用 80 Port，這時候我們可以回過頭，在 docker-compose.yml 那邊將 3000 Port 關閉，之後啟動就不會對外開放 3000 Port 了。

## 收工

OK，打完收工。

如果之後哪天不小心又搞壞了，重裝時有更多心得或資訊，再補充到這篇文章中。

---

參考資料：

* [Docker Hub - AdGuard Home](https://hub.docker.com/r/adguard/adguardhome)
