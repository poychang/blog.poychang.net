---
layout: post
title: 實現你自己的 Chat Copilot
date: 2023-09-12 08:55
author: Poy Chang
comments: true
categories: [Dotnet, WebAPI, Azure, Develop, AI, Container, PowerShell]
permalink: implement-your-own-chat-copilot/
---

經歷過 [ChatGPT](https://chat.openai.com/) 席捲式的熱潮後，許多企業紛紛開始想要打造自己的 AI 對話功能，可能是直接使用 API 的方式開發聊天機器人，或是直接選用廠商提供的解決方案。在 GitHub 上，也有許多開放原始碼專案可以提供我們快速建立相關的應用，例如 [BetterChatGPT](https://github.com/ztjhz/BetterChatGPT/) 就是按造 ChatGPT 的使用介面所打造。在 Microsoft 官方的版本庫中，也有 [Chat Copilot](https://github.com/microsoft/chat-copilot) 專案，提供了我們參考的樣板。

這篇我想使用 [Chat Copilot](https://github.com/microsoft/chat-copilot) 專案來建立一個 AI 對話應用程式，並且將前後端專案合併成一個，最後建置成 Container，而絕大部分的設定值可以透過 Dockerfile 的環境變數來調整。

過程中，難免會需要修改原始碼，讓專案更貼近這次的需求，但我不想因此而直接動到原始專案的原始碼，因為這個專案隨時會有版本更新、程式碼異動，為了讓 Git 能順利更新程式碼，因此我會寫一隻 PowerShell 來修改特定的地方，而所修改到的地方將不進行版控。

> 本篇新增加的檔案，都放在 `Deploy` 資料夾中。

## modify-files.ps1

[Chat Copilot](https://github.com/microsoft/chat-copilot) 這個專案中，分了前端 `webapp` 與後端 `webapi` 兩個專案，而我們要做的事情，就是將前端專案建置後的檔案，複製到後端專案中，這樣就可以讓後端專案直接啟動前端專案的應用程式。

要讓前端專案順利建置，我們需要建立 `.env` 檔案，這裡我們只需要設定 `REACT_APP_BACKEND_URI` 環境變數，讓前端專案知道要呼叫後端專案的 API 位址，這裡我們直接寫死為 `http://localhost:40442/`，這樣就可以讓前端專案在本機開發時，直接呼叫後端專案的 API。在正式環境中，這個設定值請依照實際情況調整。

而後端專案我們則需要稍微調整 `Program.cs` 檔案，主要是要讓這個後端專案能直接開啟前端專案的應用程式，這裡我們使用 `app.UseDefaultFiles()` 與 `app.UseStaticFiles()` 來開啟靜態檔案的服務，這樣就可以讓後端專案直接啟動前端的網頁應用程式。

```ps1
# ---------------------------------------------
# 調整前端專案
# ---------------------------------------------
# 設定前端專案建置時所需要的環境變數
$EnvFilePath = ".\webapp\.env"

## REACT_APP_BACKEND_URI 為前端呼叫後端的 API 位址，請依照實際情況調整
$newEnv = "REACT_APP_BACKEND_URI=http://localhost:40442/"

$newEnv | Set-Content -Path $EnvFilePath

# ---------------------------------------------
# 調整後端專案
# ---------------------------------------------
# 讓後端專案能夠開啟靜態檔案，藉此啟動前端專案的應用程式
# 需要調整 WebAPI 的 Program.cs 檔案
$ProgramCSFilePath = ".\webapi\Program.cs"
$ProgramCSContent = Get-Content -Path $ProgramCSFilePath

$newProgramCS = @()

foreach ($line in $ProgramCSContent) {
    $newProgramCS += $line
    if ($line -match "app\.UseCors\(\);") {
        $newProgramCS += "        app.UseDefaultFiles();"
        $newProgramCS += "        app.UseStaticFiles();"
    }
}

$newProgramCS | Set-Content -Path $ProgramCSFilePath
```

這個簡單的修改即可。

## 建置指令

接下來我們要建置前後端專案，並將前端專案的檔案複製到後端專案中，這裡我們使用 `yarn` 來建置前端專案，並使用 `dotnet` 來建置後端專案。

建置前，我們要先執行剛剛我們寫的 `modify-files.ps1` 來修改檔案，這個動作只需要執行一次即可。

```ps1
# Modify Files (Execute only once)
./Deploy/modify-files.ps1
```

使用 `yarn` 建置前端專案的動作如下：

```ps1
# Build Frontend
cd webapp
yarn install
yarn build
cd ..
```

建置完前端專案後回到專案跟目錄，接著使用 `dotnet` 建置後端專案：

```ps1
# Build Backend
Copy-Item -Path ./webapp/build/* -Destination ./webapi/wwwroot -Recurse -Force
dotnet publish ./webapi/CopilotChatWebApi.csproj --configuration Release --framework net6.0 --output ./app
```

這裡你會看到我們將前端專案建置後的成果，複製到後端專案的 `wwwroot` 資料夾中，接著在使用 dotnet CLI 來執行發布指令，將最後的輸出存放在專案根目錄的 `app` 資料夾中。

再來我們要將專案建置成 Container，這裡我們使用 Dockerfile 來建置，Dockerfile 的內容如下：

```bash
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libc6-dev \
    libgdiplus \
    libx11-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
COPY /app/ /app/
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:80
ENV Kestrel__Endpoints__Http__Url=http://0.0.0.0:80
ENV Kestrel__Endpoints__Https__Url=http://0.0.0.0:443

ENV AIService__Type=AzureOpenAI
ENV AIService__Endpoint=[AZURE_OPENAI_ENDPOINT]
ENV AIService__Key=[AZURE_OPENAI_ENDPOINT_KEY]
ENV AIService__Models__Completion=gpt-35-turbo
ENV AIService__Models__Embedding=text-embedding-ada-002
ENV AIService__Models__Planner=gpt-35-turbo

ENV Prompts__SystemDescription="This is a chat between an intelligent AI bot named Copilot and one or more participants. SK stands for Semantic Kernel, the AI platform used to build the bot. The AI was trained on data through 2021 and is not aware of events that have occurred since then. It also has no ability to access data on the Internet, so it should not claim that it can or say that it will go and look things up. Try to be concise with your answers, though it is not required. Knowledge cutoff: {{$knowledgeCutoff}} / Current date: {{TimeSkill.Now}}."
ENV Prompts__SystemResponse="Either return [silence] or provide a response to the last message. If you provide a response do not provide a list of possible responses or completions, just a single response. ONLY PROVIDE A RESPONSE IF the last message WAS ADDRESSED TO THE 'BOT' OR 'COPILOT'. If it appears the last message was not for you, send [silence] as the bot response."
ENV Prompts__InitialBotMessage="Hello, I am Chat Copilot. How can I help you today?"

ENTRYPOINT ["dotnet", "CopilotChatWebApi.dll"]
EXPOSE 80
EXPOSE 443
```

這裡會看到很多 `ENV` 環境變數的設定，這些設定本來是透過後端專案的 `appsettings.json` 來設定的，但我們需要做適度的調整，讓他能存取到我們的 Azure OpenAI 服務，因此這裡拉出來寫在 Dockerfile 中，這樣就可以讓 Docker Image 在建置時，就能夠藉由環境變數來調整這些設定值。

基本上只有以下幾個設定值是必要修改的，其他設定你可以視需要做調整：

- ENV ASPNETCORE_URLS
- ENV Kestrel__Endpoints__Http__Url
- ENV Kestrel__Endpoints__Https__Url
- ENV AIService__Endpoint
- ENV AIService__Key

有了 Dockerfile 後，我們就可以使用 Docker CLI 來建置 Docker Image 了：

```ps1
# Build Docker Image
docker build -t chat-copilot -f ./Deploy/Dockerfile .
```

![使用 Dockerfile 建置 Container](https://i.imgur.com/l0Uo1ao.png)

如此一來，我們就建置出一個名為 `chat-copilot` 的 Docker Image。

使用以下指令啟動 chat copilot 容器：

```bash
docker run --detach --name chat-copilot -p 40442:80 chat-copilot
```

![啟動 chat copilot 容器](https://i.imgur.com/Xqbsy3S.png)

> 本篇完整範例程式碼請參考 [poychang/demo-chat-copilot](https://github.com/poychang/demo-chat-copilot)。

## 後記

越深入看，你會發現這個專案所提供的功能相當多，例如上傳檔案當作 chat copilot 的背景知識庫，或是設定 Planner 來執行某些特定功能，詳細的用法和設定，就請參考 [microsoft/chat-copilot](https://github.com/microsoft/chat-copilot) 專案中的說明文件。

---

參考資料：

* [microsoft/chat-copilot](https://github.com/microsoft/chat-copilot)
* [Azure OpenAI Service 10 - 使用 BetterChatGPT 在 Azure 部署私有的 ChatGPT 站台](https://dotblogs.com.tw/anyun/2023/09/09/152942)
