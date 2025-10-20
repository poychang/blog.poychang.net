---
layout: post
title: 上傳 Container Image 到 Azure Container Registry
date: 2023-07-12 09:06
author: Poy Chang
comments: true
categories: [Develop, Container, PowerShell]
permalink: import-images-to-azure-container-registry/
---

有些情境下，特別是在比較封閉的企業內部網路，可能無法直接從 Docker Hub 上取得 Container Image，不過如果你有 Azure Container Registry (ACR) 的話，且網路架構可以存取的時候，就可以透過 Azure CLI 來將 Container Image 上傳到 ACR 中，藉此管理企業內會用到的 Container Image。

首先，我們必須要安裝 Azure CLI，這個 CLI 工具可用於在 Windows、macOS 和 Linux 環境中，安裝，底下提供 Windows 的 MSI 安裝連結，如果有其他環境的需求請參考 [如何安裝 Azure CLI](https://learn.microsoft.com/zh-tw/cli/azure/install-azure-cli) 這篇官方文章。

- [下載](https://aka.ms/installazurecliwindows) Windows 最新版的 Azure CLI。

要將 Docker Hub 上的 Container Image 上傳到 ACR 的指令為 `az acr import`，基本的使用方式如下，這邊以 [SQLPad](https://hub.docker.com/r/sqlpad/sqlpad) 這個 Container Image 為例：

```powershell
az acr import `
  --name myregistry `
  --source docker.io/sqlpad/sqlpad:latest `
  --image sqlpad:latest
```

> 上述指令中的 `` ` `` 是換行符號，是 PowerShell 的多行指令寫法，如果是在其他環境中，請自行調整。

一般來說，Docker Hub 上的 Container Image 預設會放在 `library` 存放庫底下，`source` 的路徑就會是像 `docker.io/library/hello-world:latest` 這樣，但這取決於每個維護者的習慣，所以如果你要上傳的 Container Image 不是放在 library 存放庫底下，就要自行調整 `source` 的路徑。

最簡單的查詢方式就是直接在本機上使用 `docker pull` 指令，例如 `docker pull sqlpad/sqlpad:7`，這個指令執行之後所輸出的 Log 訊息，裡面會提供對應的 `source` 路徑，如下圖：

![使用 docker pull 指令後所輸出的 Log 訊息](https://i.imgur.com/Dw2m2Ft.png)

## 匯入私有 Container Image

透過上面的指令，就可以把公開的 Container Image 匯入到 ACR 中，不過如果是私有的 Container Image 呢？這時候就需要提供 Docker Hub 的帳號和 PAT（Personal Access Token），也就是在指令後面加上 `--username [DOCKER_HUB_ACCOUNT]` 和 `--password [DOCKER_HUB_PAT]` 參數及其對應的值，如下：

```powershell
az acr import `
  --name myregistry `
  --source poychang/docker101tutorial:latest `
  --image hello-world:latest
  --username [DOCKER_HUB_ACCOUNT]
  --password [DOCKER_HUB_PAT]
```

> 上述指令中的 `source` 是我建立的私有 Container Image，如果你要測試的話，可以改成你自己的私有 Container Image。

至於如何取得 Docker Hub 的 PAT，請登入 Docker Hub 網站後，在 `Account Settings` > `Security` 頁面中點選 `New Access Token` 即可產生，如下圖：

![Docker Hub 上的 PAT 管理畫面](https://i.imgur.com/s9vrccq.png)

---

參考資料：

* [MS Learn - 如何安裝 Azure CLI](https://learn.microsoft.com/zh-tw/cli/azure/install-azure-cli)
* [MS Learn - 將容器映像匯入到容器登錄](https://learn.microsoft.com/zh-tw/azure/container-registry/container-registry-import-images?WT.mc_id=DT-MVP-5003022)