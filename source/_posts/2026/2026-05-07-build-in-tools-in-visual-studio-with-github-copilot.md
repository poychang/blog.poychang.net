---
layout: post
title: 在 Visual Studio 中的 GitHub Copilot 內建工具
date: 2026-05-07 16:37
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: build-in-tools-in-visual-studio-with-github-copilot/
---

之前在整理 GitHub Copilot 的提示檔設定時，有提到可以在 Agent Profile 中設定 `tools` 欄位來指定這個 Agent 可以使用哪些工具，而這些工具名稱在不同平台是不一樣的，這篇將列出在 Visual Studio 中可用的工具名稱，以及這些工具的用途。

擷取出來的原始內容都是英文的，為了讓大家更容易理解，我會將工具用途翻譯成中文但工具名稱保留英文，而最原始的英文內容會放在本文最後面。

## 中文版

### `code_search`
以自然語言搜尋使用者目前工作區中相關的內容片段。每次搜尋最多回傳 4 筆結果。

### `create_file`
用來在工作區中建立新檔案。檔案會以指定的內容建立；如果目錄不存在，也會一併建立。請勿使用此工具編輯已存在的檔案。

### `detect_memories`
當使用者出現下列情況時，務必呼叫 `detect_memories`：
1. 修正你的行為或輸出，例如「不，請使用 tab 而不是空格」、「其實我們這裡使用 async/await」。
2. 明確指出程式碼標準、格式規則或團隊慣例。
3. 說明個人的程式撰寫偏好、習慣或身分，例如「我是 DevOps 工程師」、「我偏好 async/await」。
4. 要求你記住某件事，或將其加入自訂指示、Copilot 指示或指示檔。
5. 提供關於程式碼應如何撰寫的詳細資訊，包括風格指南、模式或架構偏好。
不要因為一般對話記憶或短期情境而呼叫此工具。

### `edit_files`
編輯工作區中的檔案。

### `file_search`
依檔名或相對路徑搜尋工作區中的檔案。此工具只會回傳符合條件檔案的相對路徑。當你知道明確的檔名模式時，適合使用此工具。最多回傳 50 筆結果。

### `find_symbol`
使用語言編譯器與符號樹，在整個工作區中尋找符號的使用位置，包括符號定義、其他參考位置以及實作。

### `get_background_terminal_output`
取得先前透過 `run_command_in_terminal` 以背景模式 `background=true` 啟動之終端機命令的目前狀態與輸出。會回傳命令狀態（執行中、已完成或失敗）以及一段輸出內容。可以使用 `headLines` 和 `tailLines` 控制回傳多少輸出。設定 `stop=true` 可送出 Ctrl+C 並終止執行中的命令。

### `get_errors`
取得特定程式碼檔案中的編譯錯誤。這可用於在編輯其他檔案前，先驗證單一檔案範圍內的程式碼變更。所有變更完成後，應改用 `run_build` 取得整個工作區的錯誤。

### `get_files_in_project`
回傳指定專案中的所有檔案路徑。路徑會以方案目錄為基準的相對路徑表示。

### `get_output_window_logs`
從 Visual Studio 的 Output 工具視窗取得記錄，可提供建置、偵錯等各類資訊。

### `get_projects_in_solution`
回傳目前方案中各專案的相對檔案路徑。如果沒有開啟任何方案，則會回傳空結果。

### `get_web_pages`
當提示中明確提到 URL 時，務必呼叫此工具；它會取得對應網頁的內容。

### `lookup_vs`
查詢 Visual Studio 中的功能或設定。

### `profiler_agent`
轉交給 Profiler Agent，以進行以量測為基礎的效能工作。
- [使用] 效能診斷（程式碼執行緩慢、瓶頸、記憶體洩漏）、效能分析（速度/記憶體）、基準測試（建立、執行、探索），或依據指標進行最佳化。
- [避免] 專案遷移、升級、轉換、程式碼品質、可讀性/可維護性、重構，或與已量測效能無關的清理工作。
- 如果目前代理已經是 Profiler Agent，請勿轉交。
- 在轉交前，務必根據使用者的要求與程式碼情境，向使用者說明為什麼需要進行效能分析。

### `query_azure_resource_graph`
使用自然語言提示查詢 Azure Resource Graph。此命令會根據提示產生 Resource Graph 查詢並執行，結果會以 JSON 文件回傳。如果回傳結果很多，為了避免超過 token 數量限制，請限制只回應前 10 筆結果。

### `read_file`
依檔名讀取工作區中檔案的內容。

### `remove_file`
刪除檔案，並從工作區中的專案移除對該檔案的參考。

### `run_build`
建置使用者的工作區並回傳任何編譯錯誤。如果建置成功，會回傳建置成功的訊息。這可用來驗證檔案編輯是否能成功編譯，並應在完成任務前呼叫。

### `run_command_in_terminal`
在 PowerShell 終端機中執行命令並回傳輸出。如果輸出超過 4,000 個字元，內容會被截斷，並只回傳輸出串流的最後部分。

### `start_modernization`
使用此工具處理與下列事項相關的使用者問題：
- 升級任何專案或方案的 .NET 版本。
- 將專案元件或功能從過時或不安全的做法，遷移或轉換到現代且建議的 .NET 功能。
- 升級專案套件。
- 遷移到 Azure。
當使用者在 .NET 專案（或專案功能）情境中提到下列或類似詞彙時，觸發此體驗：
- Upgrade
- Update
- Migrate，例如從 .NET Framework 遷移到 .NET Core 或現代 .NET。
- Modernize
- convert，例如從舊版技術轉換到現代 .NET 功能。
- convert to SDK-style
- Port，特別是跨平台或跨框架的移植。
- Refactor for .NET
- Re-platform，例如轉向雲端原生或容器式架構。
- Transition to newer .NET or features
- Adopt latest .NET
- Move to .NET 8，或任何特定版本號。
- Target new TFM（Target Framework Moniker）
- "migrate to Azure"
- "start Azure migration"
- "help me migrate to Azure"
- "I want to migrate my application to Azure"
- "show me Azure migration options"
- "start app modernization for Azure"
觸發後，請引導使用者進入適當的 .NET App Modernization Agent 體驗，以支援所要求或推斷出的現代化情境。

---

## 英文版

### `code_search`
Run a natural language search for relevant chunks from the user's current workspace. Returns a maximum of 4 results per search.

### `create_file`
This is a tool for creating a new file in the workspace. The file will be created with the specified content. The directory will be created if it does not already exist. Never use this tool to edit a file that already exists.

### `detect_memories`
ALWAYS call detect_memories when the user:
1. Corrects your behavior or output (e.g., "No, use tabs not spaces", "Actually, we use async/await here").
2. Explicitly indicates a coding standard, formatting rule, or team practice.
3. States a personal coding preference, habit, or identity (e.g., "I am a DevOps engineer", "I prefer async/await").
4. Asks you to remember something or add it to their custom instructions, copilot instructions, or instruction file.
5. Provides detailed information about how code should be written, including style guides, patterns, or architectural preferences.
Do NOT call this for simple conversational memory or short-term context.

### `edit_files`
Edit files in the workspace.

### `file_search`
Search for files in the workspace by name or relative path. This only returns the relative paths of matching files. Use this tool when you know the exact filename pattern of the files you're searching for. Limited to 50 results.

### `find_symbol`
Uses language compilers and the symbol tree to find usages of symbols throughout the workspace including a symbol's definition, references elsewhere in the workspace, and implementations.

### `get_background_terminal_output`
Get the current status and output of a background terminal command previously launched with run_command_in_terminal (background=true). Returns the command status (running, completed, or failed) and a window of the output. Use headLines and tailLines to control how much output is returned. Set stop=true to send Ctrl+C and terminate a running command.

### `get_errors`
Get compilation errors in specific code files. This can be used to verify code changes in the scope of a single file before editing other files. Once all changes are complete run_build should be used instead to get errors from all of the workspace.

### `get_files_in_project`
Return the path of all files in a specific project. The path is relative to the solution directory.

### `get_output_window_logs`
Get logs from the Output tool window in Visual Studio, providing various information about build, debug and more.

### `get_projects_in_solution`
Return the relative file paths of projects in the current solution. Returns an empty result if no solution is open.

### `get_web_pages`
Tool to be called always when a URL is explicitly referenced in the prompt; it gets the contents of the corresponding web pages.

### `lookup_vs`
Look up features or settings in Visual Studio

### `profiler_agent`
Transfer to Profiler Agent for measurement-driven performance work
- [USE] Performance diagnostics (slow code, bottlenecks, memory leaks), profiling (speed/memory), benchmarking (create/run/discover), or metric-guided optimization.
- [AVOID] Project migration/upgrade/conversion, code quality, readability/maintainability, refactoring, or cleanup unrelated to measured performance.
- Do NOT transfer if the current agent is already the Profiler Agent.
- Before transferring, ALWAYS explain to the user WHY profiling is necessary based on their request and code context.

### `query_azure_resource_graph`
Query Azure Resource Graph using a natural language prompt. This command generates a Resource Graph query from the prompt and executes it. Results are returned as a JSON document. If many results are returned, limit response to first 10 results in order to stay under the token count limit.

### `read_file`
Read the contents of a file from the workspace by filename.

### `remove_file`
Deletes a file and removes references to it from project in the workspace.

### `run_build`
Builds the users workspace and returns any compilation errors. If build is successful, this will return a message stating the build was successful. This can be used to verify file edits compile successfully and should be called before finishing up the task

### `run_command_in_terminal`
Run a command in a PowerShell terminal and return the output. If the output is longer than 4,000 characters, it will be truncated and only the end of the output stream will be returned.

### `start_modernization`
Use this tool to handle user questions related to:
- upgrading the .NET version of any project or solution,
- migrating/converting project components/features from some outdated/insecure ones to modem/recommended .NET features,
- upgrading project packages.
- Migrating to Azure
Trigger this experience whenever a user mentions any of the following or similar terms in relation to their .NET project (or project feature):
- Upgrade
- Update
- Migrate (e.g., from .NET Framework to .NET Core or modern.NET)
- Modernize
- convert (e.g., from legacy technologies to modern .NET features)
- convert to SDK-style
- Port (especially across platforms or frameworks)
- Refactor for .NET
- Re-platform (e.g., to cloud-native or container-based architectures)
- Transition to newer .NET or features
- Adopt latest .NET
- Move to .NET 8 (or any specific version number)
- Target new TFM (Target Framework Moniker)
- "migrate to Azure"
- "start Azure migration"
- "help me migrate to Azure"
- "I want to migrate my application to Azure"
- "show me Azure migration options"
- "start app modernization for Azure"
When triggered, guide the user through the appropriate .NET App Modernization Agent experience to support the requested or inferred modernization scenario.
