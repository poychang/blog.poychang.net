---
layout: post
title: 設定 GitHub Copilot 各項提示檔
date: 2026-05-07 09:31
author: Poy Chang
comments: true
categories: [Develop, Tools]
permalink: setting-github-copilot/
---

要讓 GitHub Copilot 依照你的規則來工作，我們需要先了解如何設定各項提示檔，透過這些提示檔，可以定義 Copilot 的行為和回應方式，達到符合我們工作流的運作效果，讓我們更有效率地使用這個工具。這篇文章會介紹 GitHub Copilot 的提示檔類型、常見欄位以及一些範例。

關於 GitHub Copilot 的完整說明，可以參考官方文件：[GitHub Copilot documentation](https://docs.github.com/en/copilot)，特別是在 GitHub Copilot 的各項功能仍在快速演進的時候。

這裡來先看一下 `.github` 資料夾底下可以怎樣管理跟 Copilot 有關的子資料夾與檔案。

| 路徑                                | 用途                                                  | 檔案規則               |
| ----------------------------------- | ----------------------------------------------------- | ---------------------- |
| `copilot-instructions.md`           | 套用於整個儲存庫，定義整個儲存庫的規則                | 固定檔名               |
| `instructions/**/*.instructions.md` | 針對特定路徑或檔案類型的細粒度規則                    | `NAME.instructions.md` |
| `prompts/*.prompt.md`               | 可重用的 Prompt 範本，可用 `/NAME` 呼叫               | `NAME.prompt.md`       |
| `agents/*.agent.md`                 | 自訂 Copilot Agent Profile，定義專門的 AI 助手        | `NAME.agent.md`        |
| `skills/<skill-name>/SKILL.md`      | 自訂特定技能或提供專業領域知識的 Copilot Agent Skills | 固定檔名               |
| `hooks/*.hook.json`                 | 定義在特定事件觸發時執行的自動化工作流程              | `*.json`               |

各個提示檔可以用一些特定的欄位來定義這些提示檔的套用範圍或其他設定，以下列出一些常見的欄位：

## Instruction 常見欄位

| 欄位           | 必要 | 用途                                        | 值                                 |
| -------------- | ---: | ------------------------------------------- | ---------------------------------- |
| `applyTo`      |   是 | 指定這份 instruction 套用到哪些檔案或資料夾 | glob pattern，例如 `"**/*.cs"`     |
| `excludeAgent` |   否 | 排除特定 Copilot agent 使用這份 instruction | `"code-review"` 或 `"cloud-agent"` |

## Prompt 常見欄位

| 欄位            | 必要 | 用途           | 說明                                                                                                                                      |
| --------------- | ---: | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `description`   |   否 | Prompt 描述    | 簡短描述這個 prompt 的用途。                                                                                                              |
| `name`          |   否 | Prompt 名稱    | 在 Chat 中輸入 `/` 後使用的名稱；未指定時使用檔名。                                                                                       |
| `argument-hint` |   否 | 參數提示       | 顯示在 chat input 中，用來提示使用者如何提供參數。                                                                                        |
| `agent`         |   否 | 指定執行 agent | 可用 `ask`、`agent`、`plan`，或自訂 agent 名稱。未指定時使用目前 agent；若有指定 `tools`，預設 agent 會是 `agent`。                       |
| `model`         |   否 | 指定語言模型   | 未指定時使用 model picker 目前選取的模型。                                                                                                |
| `tools`         |   否 | 指定可用工具   | 可列出 built-in tools、tool sets、MCP tools，或 extension 提供的 tools。若要包含某個 MCP server 的所有工具，可用 `<server name>/*` 格式。 |

## Agent Profile 常見欄位

| 欄位                       | 型別                          | 必要 | 用途                                                                                |
| -------------------------- | ----------------------------- | ---: | ----------------------------------------------------------------------------------- |
| `name`                     | `string`                      |   否 | 自訂 agent 的顯示名稱。未設定時，使用檔名去掉 `.md` 或 `.agent.md` 後的名稱。       |
| `description`              | `string`                      |   是 | 描述這個 custom agent 的用途、能力或領域知識。                                      |
| `target`                   | `string`                      |   否 | 指定目標環境，可用 `vscode` 或 `github-copilot`。未設定時，預設兩者都適用。         |
| `tools`                    | `list of strings` 或 `string` |   否 | 指定 agent 可使用的工具。可用 YAML 陣列或逗號分隔字串。未設定時，預設可用所有工具。 |
| `model`                    | `string`                      |   否 | 指定此 agent 執行時使用的模型。未設定時，繼承預設模型。                             |
| `disable-model-invocation` | `boolean`                     |   否 | 禁止 Copilot cloud agent 依任務脈絡自動叫用此 agent。設為 `true` 時，必須手動選取。 |
| `user-invocable`           | `boolean`                     |   否 | 控制使用者是否能手動選取此 agent。設為 `false` 時，不能從 UI 手動選。               |
| `mcp-servers`              | `object`                      |   否 | 定義只給此 agent 使用的 MCP                                                         |

## Skill 常見欄位

| 欄位            | 必要 | 用途                 | 說明                                                                         |
| --------------- | ---: | -------------------- | ---------------------------------------------------------------------------- |
| `name`          |   是 | Skill 識別名稱       | 必須是唯一識別符。官方要求小寫，空白用 hyphen。通常與 skill 資料夾名稱相同。 |
| `description`   |   是 | Skill 說明與觸發依據 | 描述這個 skill 做什麼，以及 Copilot 何時應該使用它。                         |
| `license`       |   否 | 授權資訊             | 描述此 skill 適用的 license。                                                |
| `allowed-tools` |   否 | 預先允許工具         | 列出 Copilot 可不用每次確認就使用的工具。未列出的工具仍會要求確認。          |

## Hook 常見欄位

Hook 是使用 JSON 作為設定檔，基本的結構是由版本和事件所組成，常見的結構如下：

```json
{
  "version": 1,
  "hooks": {
    "sessionStart": [],
    "sessionEnd": [],
    "userPromptSubmitted": [],
    "preToolUse": [],
    "postToolUse": [],
    "errorOccurred": []
  }
}
```

| 事件                  | 觸發時機                          |
| --------------------- | --------------------------------- |
| `sessionStart`        | 新 session 或 resume session 開始 |
| `sessionEnd`          | session 結束                      |
| `userPromptSubmitted` | 使用者送出 prompt                 |
| `preToolUse`          | 工具執行前                        |
| `postToolUse`         | 工具成功完成後                    |
| `postToolUseFailure`  | 工具失敗完成後                    |
| `agentStop`           | main agent 完成一輪回應           |
| `subagentStart`       | subagent 被建立前                 |
| `subagentStop`        | subagent 完成                     |
| `errorOccurred`       | 執行期間發生錯誤                  |
| `permissionRequest`   | permission service 執行前         |
| `notification`        | CLI 發出 system notification      |
| `preCompact`          | context compaction 開始前         |

不同的事件會支援不同的參數，詳細參數可以參考 [GitHub Copilot CLI hooks reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-hooks-reference) 官方文件。

這裡提供一個 `preToolUse` 常見的範例，用於「阻擋危險 shell command」，若要執行的命令包含高風險刪除、格式化、關機等操作時，會回傳 `permissionDecision: "deny"`，讓 GitHub Copilot 知道不允許執行該工具。

```
.github/hooks/pre-tool-use-policy.json
```

```json
{
  "version": 1,
  "hooks": {
    "preToolUse": [
      {
        "type": "command",
        "powershell": "./.github/hooks/scripts/pre-tool-use-policy.ps1",
        "cwd": ".",
        "timeoutSec": 10
      }
    ]
  }
}
```

```powershell
$payload = [Console]::In.ReadToEnd() | ConvertFrom-Json

$toolName = $payload.toolName
$toolArgsJson = $payload.toolArgs | ConvertTo-Json -Depth 20 -Compress

$dangerousPattern = 'rm -rf /|rm -rf \.|\bdel\b.*\/s|\bformat\b|\bshutdown\b|Remove-Item.*-Recurse.*-Force'

if ($toolName -in @('bash', 'shell', 'powershell')) {
    if ($toolArgsJson -match $dangerousPattern) {
        @{
            permissionDecision = "deny"
            permissionDecisionReason = "Blocked dangerous command by preToolUse policy."
        } | ConvertTo-Json -Compress
        exit 0
    }
}

@{
    permissionDecision = "allow"
} | ConvertTo-Json -Compress
```

---

參考資料：

- [GitHub Copilot documentation](https://docs.github.com/en/copilot)
- [GitHub - Awesome GitHub Copilot](https://github.com/github/awesome-copilot)
