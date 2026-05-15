---
layout: post
title: 在 Visual Studio 中使用 Markdown 檔輔助 GitHub Copilot
date: 2026-05-07 15:19
author: Poy Chang
comments: true
categories: [Develop, AI, Tools]
permalink: using-markdown-to-assist-github-copilot-in-visual-studio/
---

網路上許多文章都是針對 Visual Studio Code 的 GitHub Copilot 進行介紹，但 Visual Studio 也有支援 GitHub Copilot，而且在 Visual Studio 中也可以使用 Markdown 檔來輔助 GitHub Copilot 達到自訂的提示效果，讓我們更有效率地使用這個工具。

> 關於 GitHub Copilot 的完整說明，可以參考官方文件：[GitHub Copilot documentation](https://docs.github.com/en/copilot)，特別是在 GitHub Copilot 的各項功能仍在快速演進的時候。

網路上之所有會有比較多 GitHub Copilot 用在 Visual Studio Code 的文章，是因為 Visual Studio Code 的演進速度比 Visual Studio 快，因此就跟得比較快。不過 Visual Studio 是會將比較穩定的功能移植進來，這樣的策略是比較符合企業環境的需求。

因此從 GitHub Copilot 的官方文件中可以看到很多功能，但可能在 Visual Studio 中無法使用。

## 設定層級

首先提一下 GitHub Copilot 套用設定檔的層級，分成 User-level（個人層級）與 Repository-level（儲存庫層級），前者會影響所有 IDE、所有 repo 中使用 Copilot 的行為，後者則只會影響特定 repo 中的 Copilot 行為進行設定。

一般來說，User-level 的設定會放在使用者的家目錄下的 `.github` 資料夾中（`%USERPROFILE%/.github/`），而 Repository-level 的設定則會放在儲存庫根目錄下的 `.github` 資料夾中。

因此，如果僅是想套用到個人開發環境，則可以將撰寫好的提示檔放在 `%USERPROFILE%/.github/` 中，這樣在 Visual Studio 中使用 GitHub Copilot 就會套用這些提示檔的設定；如果是想要在特定專案中使用，甚至與團隊共享並且加入版控，則可以將提示檔放在該專案儲存庫的 `.github` 資料夾中，這樣就可以隨著 Git 提交而更新，並且只會影響該儲存庫中的 Copilot 行為。

另外，請注意，Visual Studio 中的 GitHub Copilot 會優先套用 Repository-level 的設定，如果沒有找到 Repository-level 的提示檔，才會套用 User-level 的提示檔，也就是離程式碼越近的提示檔優先套用。

## Instructions

這是用來定義 GitHub Copilot 在特定情境下的行為規則，透過這些規則來制定開發規範，特別是在團隊中，可以藉此來讓 GitHub Copilot 在團隊成員的使用下，有一定程度的行為一致性，讓團隊有相同的開發標準。

Instructions 主要分成兩種類型，一種是套用在整個儲存庫的 `.github/copilot-instructions.md`，作為通用規則。另一種則是針對特定路徑或檔案類型的細粒度規則，可以放在 `.github/instructions/` 資料夾底下，並且以 `NAME.instructions.md` 的格式命名。

在 `copilot-instructions.md` 中，可以定義一些適用於整個專案的通用規則，例如程式碼風格、命名規則、註解規範等等，特別是語系的規範，例如要在專案中使用英文還是中文來撰寫註解。

另外要針對特定語言或開發框架來做細粒度的規範，可以參考以下放在 `.github/instructions/` 資料夾底下的簡單範例，這是一個針對 C# 檔案所定義的 Instruction，提供細粒度的規則：

```markdown
---
description: 'Guidelines for building C# applications'
applyTo: '**/*.cs'
---

# C# Development

## C# Instructions
- Always use the latest version C#, currently C# 14 features.
- Write clear and concise comments for each function.

略...
```

在開頭的 YAML front matter 中，`description` 是對這個 Instruction 的簡短描述，`applyTo` 則是定義這個 Instruction 套用的範圍，這裡使用了 glob pattern `**/*.cs` 來指定只套用在 C# 檔案上。

一般來說，會用程式語言、開發框架來建立不同的 Instruction，這樣在開發不同類型的專案時，就可以有不同的規則來讓 GitHub Copilot 依照這些規則來產生回應。

更多範例可以參考 [Awesome GitHub Copilot - Instructions](https://awesome-copilot.github.com/instructions/)。

## Prompts

Prompts 是用來定義可重複使用的提示範本，特別是經常使用的複雜提示，藉此可以提高開發效率，若放在儲存庫中，可以與團隊共享並且加入版控。

> 雖然這裡用的是 Prompt 這個名稱，但在 Visual Studio 中比較像是會將此提示視為一種指令 Command，可以用 `/` 關鍵字來呼叫。
> 有些人會把這個 Prompt 的效果稱為技能（Skill），但我認為把技能這個名稱用在代理程式（Agent）中比較貼切。

我們可以將要建立的 Prompt 放在 `.github/prompts/` 資料夾底下，並且以 `NAME.prompt.md` 的格式命名。

在 Visual Studio 開啟專案後，就可以在 Chat 中透過 `/NAME` 的方式來呼叫這些 Prompt，讓 GitHub Copilot 套用這些提示範本來產生回應。

以下是一個放在 `.github/prompts/hi.prompt.md` 的簡單範例，這會建立一個 `/hi` 指令，讓 GitHub Copilot 回應 3 種不同語言的友善問候：

```markdown
---
name: just-say-hi
description: 'A simple prompt to greet the user. Use when you want the AI to say hello or provide a friendly greeting.'
---
# Just Say Hi
Resolve greeting requests with friendly and engaging responses.
## Language
Use a warm and conversational tone to create a welcoming atmosphere with 3 different languages, Traditional Chinese must be included.
```

![demo prompt command in Visual Studio](https://files.poychang.net/storage/using-markdown-to-assist-github-copilot-in-visual-studio/demo-prompt-command-in-vs.png)

## Agents

要打造一個專屬的 Agent，讓 GitHub Copilot 依照我們定義的工作流程和規則來回應，可以透過建立 Agent Profile 的方式來定義這個 Agent 的能力、專業領域知識、行為規則等等，讓這個 Agent 可以更符合我們的需求。

我們可以將要建立的 Agent 放在 `.github/agents/` 資料夾底下，並且以 `NAME.agent.md` 的格式命名。

當然，如果你想要建立的是你自己專屬的 Agent，則將該檔案放在使用者家目錄下的 `.github/agents/` 資料夾中即可。

以下是一個放在 `.github/agents/hi.agent.md` 的簡單範例，這會建立一個 `@just-say-hi` Agent，讓 GitHub Copilot 可以用該代理程序回應 3 種不同語言的友善問候：

```markdown
---
name: just-say-hi
description: 'A simple prompt to greet the user. Use when you want the AI to say hello or provide a friendly greeting.'
---
# Just Say Hi
Resolve greeting requests with friendly and engaging responses.
## Language
Use a warm and conversational tone to create a welcoming atmosphere with 3 different languages, Traditional Chinese must be included.
```

![demo agent in Visual Studio](https://files.poychang.net/storage/using-markdown-to-assist-github-copilot-in-visual-studio/demo-agent-in-vs.png)

### Agent Tools

上面所建立的 Agent 是非常簡單的範例，實際上 Agent 的定義可以非常複雜，例如定義這個 Agent 的專業領域知識、行為規則、可用工具等等，讓他可以在特定的情境下給出更符合需求的回應。

特別是可用工具這段，我們可以在 `NAME.agent.md` 上的 YAML front matter 中，設定 `tools` 欄位來明確的告訴這個 Agent 可以使用哪些工具，如果沒有指定這個屬性，預設會讓所有可用的工具都會被啟用。

目前 GitHub Copilot 在 Visual Studio 中內建的工具如下：

- `code_search`
- `create_file`
- `detect_memories`
- `edit_files`
- `file_search`
- `find_symbol`
- `get_background_terminal_output`
- `get_errors`
- `get_files_in_project`
- `get_output_window_logs`
- `get_projects_in_solution`
- `get_web_pages`
- `lookup_vs`
- `profiler_agent`
- `query_azure_resource_graph`
- `read_file`
- `remove_file`
- `run build`
- `run_command_in_terminal`
- `start_modernization`

> 目前 Visual Studio 沒有文件列出這些內建工具，必須透過實驗的方式來發現。
> 工具名稱在不同的 GitHub Copilot 平台間有所不同，例如 Visual Studio Code 中的工具名稱就和 Visual Studio 不一樣。因此請務必特別檢查要執行環境中的可用技能，確保你的代理程式能正常運作。

以下改寫了前面建立的 `just-say-hi.agent.md`，加入了 `code_search`、`read_file`、`edit_files` 這三個工具，讓這個 Agent 可以在回應中使用這些工具來達成更複雜的行為，可以去找當前文件中的特定字串做替換的動作，將 `hello` 替換成 `hi`：

```markdown
---
name: just-say-hi
description: 'Greeting and do the actions.'
tools: ["code_search", "read_file", "edit_files"]
---
# Just Say Hi
Resolve greeting requests with friendly and engaging responses.
## Actions
- Use a warm and conversational tone to create a welcoming atmosphere with 3 different languages, Traditional Chinese must be included.
- Search for the word "hello" in the current file
- Replace "hello" with "hi"
```

![demo agent with tools in Visual Studio](https://files.poychang.net/storage/using-markdown-to-assist-github-copilot-in-visual-studio/demo-agent-with-tools-in-vs.png)

這裡的 Tool 也可以看做是這個 Agent 的技能（Skill），當這個 Agent 在回應時，如果需要使用到這些技能，就會依照定義的行為規則來使用這些工具，達成特定的行為。

如果你有從其他平台安裝 Skill，Visual Studio 的 GitHub Copilot Agent 也可以直接使用這些自訂的 Skill，而這些技能可以從以下來源獲得：

| 技能類型                             | 來源                                                           |
| ------------------------------------ | -------------------------------------------------------------- |
| 工作空間或專案技能（存在儲存庫） | `.github/skills/`、`.claude/skills/`、`.agents/skills/`        |
| 個人技能（存在使用者家目錄）     | `~/.copilot/skills/`、`~/.claude/skills/`、`~/.agents/skills/` |

關於 Skill，你可以參考 [Awesome GitHub Copilot - Skills](https://awesome-copilot.github.com/skills/) 獲得更多範例。

看到這邊可想而知，建立自己的 Skill 就是另一個重要議題了。

關於 Visual Studio 中如何讓 Agent 使用 Skill 的部分，請參考這篇[在 Visual Studio 中使用 GitHub Copilot 和 Agent Skills](https://blog.poychang.net/using-agent-skills-with-github-copilot-in-visual-studio/)。

---

參考資料：

- [設定 GitHub Copilot 各項提示檔](https://blog.poychang.net/setting-github-copilot/)
- [GitHub Copilot documentation](https://docs.github.com/en/copilot)
- [GitHub - Awesome GitHub Copilot](https://github.com/github/awesome-copilot)
- [Awesome GitHub Copilot](https://awesome-copilot.github.com/)
- [MS Learn - 開始使用 GitHub Copilot](https://learn.microsoft.com/zh-tw/visualstudio/ide/visual-studio-github-copilot-get-started?WT.mc_id=DT-MVP-5003022)
