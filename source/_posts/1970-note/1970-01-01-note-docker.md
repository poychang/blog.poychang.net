---
layout: post
title: Docker 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Docker]
permalink: note-docker/
---

本篇作為書籤用途，記錄網路上的 Docker 參考資料

- docs.docker.com Search URL `https://docs.docker.com/search/?q={q}` 其中 `{q}` 可替換成要搜尋的文字

## 關注指令

- 刪除 300 天前的 docker images `docker image prune -a --filter "until=7200h"`
- 刪除所有未被 tag 的 images `docker rmi $(docker images -f "dangling=true" -q)`
- 打掃除！執行前可先用 `docker system df` 查看當前狀態，再用 `docker system prune` 清理 4 個維度的使用空間
  - Images 刪除沒有被任何 Container 使用的 Image
  - Containers 刪除非執行狀態的 Container
  - Network 刪除沒有被任何 Container 參考的 Network
  - Build Cache 刪除建置 Container 用的快取
  - 預設不會清理 Volume，指令可以加上 `--volumes` 進行清理
  - [doc](https://docs.docker.com/engine/reference/commandline/system/)

## 容器基礎架構

![Container Architecture](https://i.imgur.com/MdajDvj.png)

## CheatSheet

- [Docker 官方 CheatSheet](https://www.docker.com/sites/default/files/Docker_CheatSheet_08.09.2016_0.pdf)
- [Docker 官方 CheatSheet 繁中翻譯版](https://1drv.ms/b/s!Aiwtjhj5fofrk8tQBTZ6wZzRpR0yqQ)
- [docker CLI & Dockerfile Cheat Sheet](http://design.jboss.org/redhatdeveloper/marketing/docker_cheatsheet/cheatsheet/images/docker_cheatsheet_r3v2.pdf)

![Docker 官方 CheatSheet 繁中翻譯版](https://i.imgur.com/Dle3hqm.png)

![Docker CheatSheet](https://i.imgur.com/20LvjL3.png)

## Best Practice

- [Docker Docs - Best practices for writing Dockerfiles](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [Best Practices for working with Dockerfiles](https://medium.com/@nagarwal/best-practices-for-working-with-dockerfiles-fb2d22b78186)

## 重點名詞

- Layer: 層，一組唯讀的文件或命令，描述如何在容器下設置底層系統。層 (Layer) 構建在彼此之上，每個層代表對文件系統的更改
- Image: 映像檔，一個不可變的層 (Layer)，形成容器的基礎
- Container: 容器，可以作為獨立執行應用程式的映像檔實例。容器具有可變層，該可變層位於映像檔的頂部並且與底層相分離
- Registry: 註冊伺服器，用於散佈 Docker 映像檔的存儲系統
- Repository: 倉庫，一組相關相同應用程式但不同版本的 Docker 映像檔儲存倉庫

## 啟動容器內的命令列

一般來說我們可以使用 `docker attach` 來將 Docker 運行中的容器附加到終端機上，讓我們能夠在容器內操作指令，但如果這個容器是一個運行中的 Web 服務，這只應會讓你附加到 Web Server Process，你只會看到 Web Server Process 所透過 `stdout` 輸出的訊息，這時我們便無法做更多操作。

如果你想要在一個運行 Web 服務的伺服器進行操作，可以使用以下指令來啟動該容器內的伺服器 `cmd` 指令：

`docker exec -it <YOUR_CONTAINER_ID_OR_NAME> cmd`

> 如果你的容器是使用 Linux，可以將 `cmd` 改成 `bash`。

REF: https://stackoverflow.com/questions/30172605/how-do-i-get-into-a-docker-container

透過 `docker exec -it DOCKER_NAME cmd` 可以在容器中開啟 cmd 命令列，並讓我們進行操作，如果要退出該命令列環境，可使用 `exit` 指令退出，如果你只是想要暫時退出，則要使用特殊方式，`ctrl` + `p` + `q` 來進行暫時退出。

## 複製容器內的檔案

可以使用 `docker cp` 將容器內的檔案複製至本機，指令參考如下：

```ps1
docker cp [OPTIONS] CONTAINER:SRC_PATH DEST_PATH
docker cp [OPTIONS] SRC_PATH CONTAINER:DEST_PATH

# 範例
docker cp MyContainer:"C:\Program Files\logs\" C:\target
docker cp MyContainer:C:\inetpub\logs\ C:\target
```

上面 `<containerId>` 可以使用容器名稱或容器 ID 來指定。

REF:[Copying files from Docker container to host](https://stackoverflow.com/questions/22049212/copying-files-from-docker-container-to-host)

## 基本指令

Docker CLI 官方文件：[Use the Docker command line](https://docs.docker.com/engine/reference/commandline/cli/)

開發 Docker 容器相關：

- `docker create [image]`: Create a new container from a particular image.
- `docker login`: 登錄 Docker Hub 或私有的 Docker 註冊伺服器
- `docker build`: 建立一個新的映像檔 [doc](https://docs.docker.com/engine/reference/commandline/build/)
- `docker pull [image]`: 從倉庫取得所需要的映像檔
- `docker push [username/image]`: 把自己建立的映像檔上傳到倉庫中來共享
- `docker search [term]`: Search the Docker Hub repository for a particular term.
- `docker tag [source] [target]`: 為目標映像檔新增標籤或匿名 (alias)

執行 Docker 容器相關：

- `docker start [container]`: 啟動一個已經停止的容器
- `docker stop [container]`: 停止一個執行中的容器
- `docker exec -it [container] [command]`: Run a shell command inside a particular container.
- `docker run [image]` 啟動容器 [doc](https://docs.docker.com/engine/reference/commandline/run/)
  - `docker run -it -image [image] [container] [command]`: 建立並啟動容器，並在內部執行指令
  - `docker run -it -rm -image [image] [container] [command]`: 建立並啟動容器，並在內部執行指令，指令完成後自動移除此容器
  - 選用參數說明
    - `-i`, `--interactive` 互動模式
    - `-t`, `--tty` 配置一個終端機
    - `-d`, `--detach` 在背景執行
- `docker pause [container]`: Pause all processes running within a particular container.

使用 Docker 工具：

- `docker history [image]`: Display the history of a particular image.
- `docker images`: 顯示所有儲存在本機的映像檔 [doc](https://docs.docker.com/engine/reference/commandline/image/)
- `docker inspect [object]`: Display low-level information about a particular Docker object.
- `docker ps`: 列出當前正在運行的所有容器 [doc](https://docs.docker.com/engine/reference/commandline/ps/)
- `docker version`: 顯示系統上當前安裝的 Docker 版本

清理 Docker 環境：

- `docker kill [container]`: Kill a particular container. [doc](https://docs.docker.com/engine/reference/commandline/kill/)
- `docker kill $(docker ps -q)`: Kill all containers that are currently running.
- `docker rm [container]`: 移除本地端未執行的容器 [doc](https://docs.docker.com/engine/reference/commandline/rm/)
- `docker rm $(docker ps -a -q)`:移除本地端所有未執行的容器
- `docker rmi [image]` 移除本地端的映像檔 [doc](https://docs.docker.com/engine/reference/commandline/rmi/)
- `docker container prune` 移除所以未執行的容器 [doc](https://docs.docker.com/engine/reference/commandline/container_prune/)

> Docker Image 名稱必須是小寫，否則會無法編譯。

## DockerFile

使用 Dockerfile 讓使用者可以建立自定義的映像檔。

Dockerfile 分為四部分：

- 基底映像檔資訊、
- 維護者資訊
- 映像檔操作指令和
- 容器啟動時執行指令

範例：

```dockerfile
FROM microsoft/dotnet:2.1-aspnetcore-runtime
WORKDIR /app 
ADD /apppublish/ .
ENTRYPOINT ["dotnet", "MyClass.dll"]
```

### ADD 和 COPY 的差別

先說結論，根據官方文件 [Docker Doc - ADD or COPY](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#add-or-copy) 建議使用 `COPY`，因為使用上會比較直覺且指令的意思和一般使用上的預期結果一致。

`COPY` 指令相對單純，只會將來源參數的檔案，複製至目的地路徑。

`ADD` 指令做的事情比較多，如下：

- 可以使用 URL 作為來源參數，通過 URL 下載文件並且複製到目的地路徑
- 若來源參數是一個壓縮檔格式（tar, gzip, bzip2, etc），會自動解壓縮並存至目的地路徑

使用 `ADD` 的時候，你可能會遇到有時解壓縮，有時又不會的奇妙現象，因此建議使用單純一點的 `COPY` 指令，讓行為比較符合預期。如果你明確知道要用 `ADD` 來達成下載遠端檔案的行為，這時候 `ADD` 是你的好幫手。

## 常用的 Docker Image

- [microsoft/dotnet](https://hub.docker.com/r/microsoft/dotnet/)
  - `microsoft/dotnet:2.1-sdk` (Windows Server 1803)
  - `microsoft/dotnet:2.1.3-aspnetcore-runtime` (Windows Server 1803)
- [microsoft/nanoserver](https://hub.docker.com/r/microsoft/nanoserver/)
  - `microsoft/nanoserver:1803`
- [node](https://hub.docker.com/r/library/node/tags/)
  - `node:8.11.4` (LTS)

## 自動重新啟動容器

| Flag           | Description                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| no             | 不要自動重新啟動容器（預設值）                                                                       |
| on-failure     | 若容器因錯誤而退出，重新啟動容器                                                                     |
| always         | 總是在容器停止後重新啟動。若手動停止容器，只有在 Docker 重新啟動或容器手動重新啟動時，才重新啟動容器 |
| unless-stopped | 類似於 `always`，但當容器停止（無論手動或其他原因），即使 Docker 程序重新啟動，也不會重新啟動容器    |

```bash
# 啟動容器時設定自動重新啟動方式
docker run -d --restart unless-stopped [Container-ID]

# 更新指定容器的自動重新啟動方式
docker update --restart unless-stopped [Container-ID]

# 更新所有容器的自動重新啟動方式
docker update --restart unless-stopped $(docker ps -q)
```

## Push Docker Image Push 到 Docker Hub

註冊 [Docker Hub](https://hub.docker.com/) 帳號。

1. `docker images` 查看本機的 Docker Images
2. `docker tag Image-Name Docker-Hub-Account/Image-Name` 將本機的 `Image-Name` Docker Images 加上 tag

- 須注意 Docker Tag 的格式，前面為 Docker Hub 帳號名稱

3. `docker login` 登入 Docker Hub
4. `docker push Docker-Hub-Account/Image-Name` 將指定的 Docker Image Push 到 Docker Hub 上
5. 完成後，登入 [Docker Hub](https://hub.docker.com/) 網站就可以看到上傳的 Docker Image

若要從 Docker Hub Pull 指定的 Docker Image，請執行 `docker pull Docker-Hub-Account/Image-Name`。

## 推送映像檔至 Azure Container Registry

[官方文件](https://docs.microsoft.com/zh-tw/azure/container-registry/container-registry-get-started-docker-cli?WT.mc_id=AZ-MVP-5003022)

1. 登入 Azure Container Registry，下面指令擇一

- `az acr login --name myregistry`
- `docker login myregistry.azurecr.io -u xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx -p myPassword`

2. 取得映像檔

- `docker pull nginx`

3. 建立別名

- `docker tag nginx myregistry.azurecr.io/samples/nginx`

4. 將映像推送至您的登錄庫

- `docker push myregistry.azurecr.io/samples/nginx`

## 遠端操作 Docker

有時候不想登入 Docker 的伺服器，想透過自己的電腦做遠端操作，可以使用 `-H` 並指定連線位置，然後下指令執行。

例如下面這個指令，是遠端操作 `DOCKER_REMOTE_SERVER` 這台伺服器，執行 `docker logs --tail 100 WebApp` 印出 `WebApp` 這個 Container 最後 100 行的 Log 資料。

```bash
docker -H=DOCKER_REMOTE_SERVER logs --tail 100 WebApp
```

如果經常需要這樣操作了話，可以透過 `alias` 來建立別名指令：

```bash
alias dockerx="docker -H=DOCKER_REMOTE_SERVER"
```

REF:

- [Run commands on remote Docker host](https://gist.github.com/kekru/4e6d49b4290a4eebc7b597c07eaf61f2)
- [使用 DosKey 簡化操作遠端 Docker 的指令](http://blog.poychang.net/use-doskey-to-alias-docker-command/)

## Docker Compose

[Docker Docs - docker-compose](https://docs.docker.com/compose/reference/overview/)

使用指定的 `docker-compose.yml` 設定檔來啟動遠端的容器。注意，指定遠端主機的地方要加上 2375 的 Port 號。

```bash
docker-compose.exe -H REMOTE_DOCKER_IP:2375 -f docker/command/docker-compose.yml up --detach
docker-compose.exe -H REMOTE_DOCKER_IP:2375 -f docker/command/docker-compose.yml down
docker-compose.exe -H REMOTE_DOCKER_IP:2375 -f docker/command/docker-compose.yml restart
```

- [官方文件 - Compose file version 3 reference](https://docs.docker.com/compose/compose-file/)
- [Docker Compose 初步閱讀與學習記錄](http://blog.maxkit.com.tw/2017/03/docker-compose.html)

---

參考資料：

- [Docker Docs](https://hub.docker.com)
- [用 30 天來介紹和使用 Docker 系列](https://ithelp.ithome.com.tw/users/20103456/ironman/1320)
- [Docker -- 從入門到實踐 ­](https://philipzheng.gitbooks.io/docker_practice/content/)
- [Docker Commands - The Ultimate Cheat Sheet](https://hackernoon.com/docker-commands-the-ultimate-cheat-sheet-994ac78e2888)
