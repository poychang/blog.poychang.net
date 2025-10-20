---
layout: post
title: 用瀏覽器開啟架設在遠方的瀏覽器
date: 2025-5-01 22:52
author: Poy Chang
comments: true
categories: [App, Container]
permalink: docker-run-a-browser-in-browser/
---

用網頁瀏覽器開啟一個網頁瀏覽器，這個玩法滿有趣的，這種感覺相當於你在 A 地連到 B 地去開網頁瀏覽器，一方面開啟網頁的位置變了，二方面存取 B 端資源的方式則是用 80/433 埠就完成跳轉，而這件事只要會啟動容器就可以完成了唷。

由 LinuxServer.io 發行的 lscr.io/linuxserver/msedge Docker 映像，是基於 Chromium 的 Microsoft Edge 瀏覽器封裝於 KasmVNC GUI 容器中，讓你可以透過 3000（HTTP）與 3001（HTTPS）連接埠提供遠端圖形化瀏覽體驗。

透過這個容器印象檔，就可以輕鬆達成想要的「用網頁瀏覽器開啟一個網頁瀏覽器」唷。

## 環境變數與運行組態

這個印象檔提供滿多環境變數可以設定的，整理如下：

### 環境變數（`-e`）

| 變數              | 說明                                         |
| ----------------- | -------------------------------------------- |
| CUSTOM_PORT       | HTTP 服務內部埠（預設 3000）                 |
| CUSTOM_HTTPS_PORT | HTTPS 服務內部埠（預設 3001）                |
| CUSTOM_USER       | Basic Auth 使用者名稱，預設 abc              |
| PASSWORD          | Basic Auth 密碼，預設 abc；未設即無認證      |
| SUBFOLDER         | 反向代理子目錄，需以 /subfolder/ 格式        |
| TITLE             | 瀏覽器頁面標題，預設 "KasmVNC Client"        |
| FM_HOME           | 檔案管理器根目錄，預設 /config               |
| START_DOCKER      | 設為 false 將不啟動容器內的 DinD Docker 環境 |
| DRINODE           | 指定 DRI3 GPU 裝置，如 /dev/dri/renderD128   |
| DISABLE_IPV6      | 任意值啟用即可關閉 IPv6                      |
| LC_ALL            | 設定容器語言，如 fr_FR.UTF-8、ar_AE.UTF-8    |
| NO_DECOR          | 取消視窗邊框，適用於 PWA 模式                |
| NO_FULL           | 禁止自動全螢幕                               |

> 務必設定密碼，否則很容易被掃瞄到，因此成為黑客的待宰羔羊。

### 運行組態

- `--privileged`：啟用 Docker-in-Docker（DinD），可搭配 `-v /home/user/docker-data:/var/lib/docker` 提升效能。
- `-v /var/run/docker.sock:/var/run/docker.sock`：將宿主機 Docker socket 掛入容器以供 CLI 操作或應用內 Docker 呼叫。
- `--device /dev/dri:/dev/dri`：將 GPU 裝置掛入容器，可搭配 DRINODE 參數實現 GPU 加速（僅限開放原始碼驅動）。
- 可透過 `LC_ALL` 調整預設語系；映像預設僅含 Latin 字型，若需 CJK 字型，可安裝 mods 並設定：

    ```bash
    -e DOCKER_MODS=linuxserver/mods:universal-package-install
    -e INSTALL_PACKAGES=fonts-noto-cjk
    -e LC_ALL=zh_CN.UTF-8
    ```

- Web 介面設定中啟用 "IME Input Mode" 後，可在非 en_US 鍵盤下使用本地輸入法。

## Docker Compose

我個人是覺得使用 docker-compose 的方式來管理啟動指令，是相當方便的，除了可以文件化整個啟動指令，還可以藉此做版控，我使用的基本樣板如下：

```yaml
version: "3.8"

services:
  msedge:
    image: lscr.io/linuxserver/msedge:latest  # 官方 Edge GUI 容器映像
    container_name: msedge
    security_opt:
      - seccomp:unconfined        # 解決老核心/新 syscalls 相容性問題（可選）

    environment:
      - PUID=1000                 # 主機使用者 UID（請替換為你的 uid）
      - PGID=1000                 # 主機群組 GID（請替換為你的 gid）
      - TZ=Asia/Taipei            # 設定為台北時區
      - CUSTOM_USER=YOUR_ACCOUNT  # HTTP Basic Auth 帳號（可選）
      - PASSWORD=YOUR_PASWORD     # HTTP Basic Auth 密碼（可選）
      - EDGE_CLI=--no-sandbox     # 傳遞給 Chromium 的額外 CLI 參數

    volumes:
      - ./config:/config          # 永續化設定存放目錄

    ports:
      - "3000:3000"               # HTTP GUI 介面對應埠
      - "3001:3001"               # HTTPS GUI 介面對應埠

    shm_size: "1gb"               # Edge 啟動所需共享記憶體大小
    restart: unless-stopped       # 容器異常重啟策略

    # 以下為可選 GPU 加速設定：
    devices:
      - /dev/dri:/dev/dri         # DRI3 GPU 加速（僅開放原始碼驅動）

    # 如需 Nvidia GPU 支援，加入以下部署設定：
    # deploy:
    #   resources:
    #     reservations:
    #       devices:
    #         - driver: nvidia
    #           count: 1
    #           capabilities: [compute,video,graphics,utility]
```

當然，有些環境還是適合用 `docker run` 指令的方式來啟動容器，例如在 Synology NAS 上就可以用以下 `docker run` 指令搭配排成管理氣，達成啟動 NAS 自動啟動該容器，我在我 NAS 所使用的指令樣板如下：

```bash
docker run -d --name=edge \
-p 3000:3000 \
-p 3001:3001 \
-v /volume1/docker/edge:/config \
-e PUID=1000 \
-e PGID=100 \
-e TZ=Asia/Taipei \
-e CUSTOM_USER=YOUR_ACCOUNT \
-e PASSWORD=YOUR_PASWORD \
--shm-size="5gb" \
--restart=always \
lscr.io/linuxserver/msedge
```

最後，啟動容器後就可以透過瀏覽器連線到該容器，用瀏覽器來瀏覽瀏覽器了。

![browser in browser](https://i.imgur.com/TnyalWA.png)

## 後記

如果你習慣使用的是 Chrome 或 Firefox 瀏覽器了話，也可以參考 [linuxserver/docker-chromium](https://github.com/linuxserver/docker-chromium) 或 [linuxserver/docker-firefox](https://github.com/linuxserver/docker-firefox) 來啟動對應的容器喔。

---

參考資料：

- [linuxserver/msedge](https://docs.linuxserver.io/images/docker-msedge/)
- [linuxserver/docker-msedge](https://github.com/linuxserver/docker-msedge)
- [給 NAS 裝個瀏覽器，五分鐘快速部署，Chrome、Firefox、Edge 任你選](https://post.smzdm.com/p/a6pwgqvz/)
- [用 Docker 在瀏覽器中再打開一個瀏覽器](https://qwas.fun/blog/docker-run-browser-in-browser)
