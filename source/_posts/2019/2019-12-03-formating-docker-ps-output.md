---
layout: post
title: 格式化 Docker PS 的輸出樣式
date: 2019-12-03 11:34
author: Poy Chang
comments: true
categories: [Develop, Container, PowerShell]
permalink: formating-docker-ps-output/
---

最近使用 Docker 時遇到個小狀況，每次下 `docker ps` 查看容器資訊的時候，所輸出的資訊太多，斷行的結果造成閱讀困難，於是就在想，這個輸出應該可以被格式化吧，只顯示部分我比較關心的欄位就好了，於是找了一下官方文件，`docker ps --format` 是這次狀況的好夥伴。

從 Docker 官方文件 [docker ps](https://docs.docker.com/engine/reference/commandline/ps/) 中，有個參數 `--format` 可以妥善利用，使用說明在 [Formatting](https://docs.docker.com/engine/reference/commandline/ps/#formatting) 這個段落。

{% raw %}
用法很簡單，只要在 `--format` 參數後面使用下面表格中的關鍵字，並用 `{{.xxxxx}}` 來組合你想要呈現的樣式即可，你也可以再前面加上 `table` 關鍵字，讓輸出表格加上表頭說明，詳請參考下面範例：
{% endraw %}

{% raw %}
```bash
docker ps --format "{{.Names}}\t{{.Status}}"

# project_web_1          Up 11 minutes
# project_app_1          Up 11 minutes
```
{% endraw %}

{% raw %}
```bash
docker ps --format "table {{.Names}}\t{{.Status}}"

# NAMES                  STATUS
# project_web_1          Up 11 minutes
# project_app_1          Up 11 minutes
```
{% endraw %}

{% raw %}
| Placeholder | Description |
| ----------- | ----------- |
| .ID         | Container ID |
| .Image      | Image ID |
| .Command    | Quoted command |
| .CreatedAt  | Time when the container was created. |
| .RunningFor | Elapsed time since the container was started. |
| .Ports      | Exposed ports. |
| .Status     | Container status. |
| .Size       | Container disk size. |
| .Names      | Container names. |
| .Labels     | All labels assigned to the container. |
| .Label      | Value of a specific label for this container. For example '{{.Label "com.docker.swarm.cpu"}}' |
| .Mounts     | Names of the volumes mounted in this container. |
| .Networks   | Names of the networks attached to this container. |
{% endraw %}

## 後記

但是如果每次都要打這麼長的格式化參數，那肯定不方便，如果你使用 Powershell 了話，可以參考[透過 Alias 和 Function 讓你的 PowerShell 變得順手、更好用](https://blog.poychang.net/make-your-powershell-handy/)這篇來建立方便你使用的快速鍵，例如：

{% raw %}
```powershell
# 將遠端三台 Docker 的 PS 資訊一次吐回來，並且格式化表格資訊
function vtps {
    cmd /c echo "-----VT01-----"
    cmd /c docker -H=VTDocker1.poychang.net ps --format "table {{.Names}}\t{{.Status}}"
    cmd /c echo "-----VT02-----"
    cmd /c docker -H=VTDocker2.poychang.net ps --format "table {{.Names}}\t{{.Status}}"
    cmd /c echo "-----VT03-----"
    cmd /c docker -H=VTDocker3.poychang.net ps --format "table {{.Names}}\t{{.Status}}"
}
```
{% endraw %}

有了這個客製 Powershell Function，我就可以打少少的 4 個字 `vtps` 就可以拿到完整又清楚的 Docker PS 資訊。

----------

參考資料：

* [Official Doc - docker ps format](https://docs.docker.com/engine/reference/commandline/ps/)

