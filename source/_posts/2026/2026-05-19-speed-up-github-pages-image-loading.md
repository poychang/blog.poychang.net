---
layout: post
title: 加速 GitHub Pages 圖片載入速度
date: 2026-05-19 14:03
author: Poy Chang
comments: true
categories: [Develop]
permalink: speed-up-github-pages-image-loading/
---

如果你是 GitHub Pages 的使用者，可能會遇到圖片載入緩慢的問題，特別是當你的網站有很多圖片或是訪客來自不同地區時。這是因為 GitHub Pages 的圖片是從 GitHub 的伺服器直接提供的，而 GitHub 的載入速度可能會受到區域的影響。這時候可以使用一些免費的 CDN 服務來加速圖片的載入速度，這篇介紹一些常用的選項。

## 為什麼需要 CDN 加速

- 地理優勢：CDN 節點分佈全球，使用者可就近獲取資源
- 頻寬最佳化：CDN 提供商通常具有更大的網路頻寬
- DDoS 防護：專業 CDN 提供基礎的安全防護
- 快取策略：可自訂快取時間，減少源站壓力

雖然 Github Pages 本身有一定快取機制，但對於圖片等靜態資源，使用專業 CDN 服務能顯著提升載入速度。

## jsDelivr

jsDelivr 提供免費的 Github 倉庫加速服務，特別適合 Github Pages 使用者。

```html
<!-- 原始圖片引用 -->
<img src="https://github.com/<user>/<repo>/raw/<branch>/<path>">
<!-- 使用 jsDelivr -->
<img src="https://cdn.jsdelivr.net/gh/<user>/<repo>@<branch>/<path>">
```

## Statically

Statically 是一個免費的 CDN 服務，專門為靜態資源提供加速。

```html
<!-- 原始圖片引用 -->
<img src="https://github.com/<user>/<repo>/raw/<branch>/<path>">
<!-- 使用 Statically -->
<img src="https://cdn.statically.io/gh/<user>/<repo>/<branch>/<path>">
```

## Cloudflare Workers

如果你想完全掌控，可以考慮用 Cloudflare Workers 自建 GitHub Proxy。

首先到 [https://workers.cloudflare.com](https://workers.cloudflare.com) 註冊帳號，登入後可以在後台儀表板中，

接著在選單中找到 `Workers & Pages`，點選 `Create Application` 建立專案。

![1 create application](https://files.poychang.net/storage/speed-up-github-pages-image-loading/1-create-application.png)

建立的過程中，我們可以先選 `Start with Hello World` 範本，然後為這個 Worker 專案設定一個網域名稱，最後點選 `Deploy`。
![2 start with hello world](https://files.poychang.net/storage/speed-up-github-pages-image-loading/2-start-with-hello-world.png)

![3 set worker name](https://files.poychang.net/storage/speed-up-github-pages-image-loading/3-set-worker-name.png)

這時會回到後台儀表板中，點選 `Edit code` 來編輯這個 Worker 的程式碼。

![4 edit code](https://files.poychang.net/storage/speed-up-github-pages-image-loading/4-edit-code.png)

在編輯器中，將下面所提供的程式碼，替換掉部分設定值後，貼到 Worker 的程式碼中。在這個編輯畫面中，你可以先從右邊試試看要執行的網址是否符合預期，如果一切正常，就可以點選 `Deploy` 來部署這個 Worker。

![5 paste code](https://files.poychang.net/storage/speed-up-github-pages-image-loading/5-paste-code.png)

### 程式碼

以下程式碼可以根據自己的需求修改 `ASSET_URL`、`DEFAULT_PREFIX`、`DEFAULT_JSDELIVR` 和 `DEFAULT_WHITE_LIST` 設定值。

這些設定值的用途如下：

- `ASSET_URL`：靜態資源的來源 URL，也就是你要代理的原始檔案位置。
- `DEFAULT_PREFIX`：路徑前綴，用於自訂路由。
- `DEFAULT_JSDELIVR`：是否使用 jsDelivr CDN，0 為關閉。
- `DEFAULT_WHITE_LIST`：白名單，路徑包含其中字串才會放行，空陣列表示全部放行。

```javascript
// @ts-check
/**
 * Cloudflare Worker - GitHub Proxy (ES Modules 版本)
 *
 * 部署方式：
 * 1. 在 wrangler.toml 設定 main = "index.js"、compatibility_date 不要過舊
 * 2. 或直接在 Cloudflare Dashboard 的 Worker 編輯器中貼上本檔案內容
 */

/** 靜態資源來源 */
const ASSET_URL = 'https://raw.githubusercontent.com/'
/** 路徑前綴。若自訂路由為 example.com/gh/*，請改為 '/gh/'，注意：少一個斜線都會錯！ */
const DEFAULT_PREFIX = '/'
/** 分支文件是否使用 jsDelivr CDN，0 為關閉 */
const DEFAULT_JSDELIVR = 0
/** 白名單，路徑包含其中字串才會放行，例如 ['/username/']；空陣列表示全部放行 */
const DEFAULT_WHITE_LIST = ['/poychang/']

/** @type {ResponseInit} */
const PREFLIGHT_INIT = {
  status: 204,
  headers: {
    'access-control-allow-origin': '*',
    'access-control-allow-methods': 'GET,POST,PUT,PATCH,TRACE,DELETE,HEAD,OPTIONS',
    'access-control-max-age': '1728000',
  },
}

// GitHub 各種 URL 樣式
const RE_RELEASES_ARCHIVE = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:releases|archive)\/.*$/i
const RE_BLOB_RAW         = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:blob|raw)\/.*$/i
const RE_INFO_GIT         = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/(?:info|git-).*$/i
const RE_RAW_HOST         = /^(?:https?:\/\/)?raw\.(?:githubusercontent|github)\.com\/.+?\/.+?\/.+?\/.+$/i
const RE_GIST             = /^(?:https?:\/\/)?gist\.(?:githubusercontent|github)\.com\/.+?\/.+?\/.+$/i
const RE_TAGS             = /^(?:https?:\/\/)?github\.com\/.+?\/.+?\/tags.*$/i

const ALL_PATTERNS = [
  RE_RELEASES_ARCHIVE,
  RE_BLOB_RAW,
  RE_INFO_GIT,
  RE_RAW_HOST,
  RE_GIST,
  RE_TAGS,
]

/**
 * 建立統一格式的 Response（不會 mutate 傳入的 headers 物件）
 * @param {BodyInit | null} body
 * @param {number} status
 * @param {Record<string, string>} headers
 */
function makeRes(body, status = 200, headers = {}) {
  return new Response(body, {
    status,
    headers: { ...headers, 'access-control-allow-origin': '*' },
  })
}

/**
 * 安全地建立 URL 物件，失敗時回傳 null
 * @param {string} urlStr
 * @returns {URL | null}
 */
function safeNewUrl(urlStr) {
  try {
    return new URL(urlStr)
  } catch {
    return null
  }
}

/**
 * 判斷字串是否符合任一 GitHub 樣式
 * @param {string} u
 */
function checkUrl(u) {
  return ALL_PATTERNS.some((re) => re.test(u))
}

/**
 * 主要請求處理
 * @param {Request} req
 */
async function fetchHandler(req) {
  const urlObj = new URL(req.url)

  // 支援 ?q= 形式的轉址
  const q = urlObj.searchParams.get('q')
  if (q) {
    return Response.redirect('https://' + urlObj.host + DEFAULT_PREFIX + q, 301)
  }

  // cloudflare worker 會把路徑中的 `//` 合併成 `/`
  const path = urlObj.href
    .slice(urlObj.origin.length + DEFAULT_PREFIX.length)
    .replace(/^https?:\/+/, 'https://')

  if (
    RE_RELEASES_ARCHIVE.test(path) ||
    RE_INFO_GIT.test(path) ||
    RE_GIST.test(path) ||
    RE_TAGS.test(path)
  ) {
    return httpHandler(req, path)
  }

  if (RE_BLOB_RAW.test(path)) {
    if (DEFAULT_JSDELIVR) {
      const redirectUrl = path
        .replace('/blob/', '@')
        .replace(/^(?:https?:\/\/)?github\.com/, 'https://cdn.jsdelivr.net/gh')
      return Response.redirect(redirectUrl, 302)
    }
    return httpHandler(req, path.replace('/blob/', '/raw/'))
  }

  if (RE_RAW_HOST.test(path)) {
    if (DEFAULT_JSDELIVR) {
      const redirectUrl = path
        .replace(/(?<=com\/.+?\/.+?)\/(.+?\/)/, '@$1')
        .replace(
          /^(?:https?:\/\/)?raw\.(?:githubusercontent|github)\.com/,
          'https://cdn.jsdelivr.net/gh'
        )
      return Response.redirect(redirectUrl, 302)
    }
    return httpHandler(req, path)
  }

  // Fallback：回傳靜態資源。為防 SSRF，若 path 仍含絕對 URL，直接 404
  if (/^https?:\/\//i.test(path)) {
    return makeRes('not found', 404)
  }
  return fetch(ASSET_URL + path)
}

/**
 * 處理代理請求（含白名單檢查、CORS preflight）
 * @param {Request} req
 * @param {string} pathname
 */
function httpHandler(req, pathname) {
  const reqHdrRaw = req.headers

  // CORS preflight
  if (
    req.method === 'OPTIONS' &&
    reqHdrRaw.has('access-control-request-headers')
  ) {
    return new Response(null, PREFLIGHT_INIT)
  }

  // 白名單檢查
  if (DEFAULT_WHITE_LIST.length > 0 && !DEFAULT_WHITE_LIST.some((w) => pathname.includes(w))) {
    return new Response('blocked', { status: 403 })
  }

  const urlStr = /^https?:\/\//i.test(pathname) ? pathname : 'https://' + pathname
  const urlObj = safeNewUrl(urlStr)
  if (!urlObj) {
    return makeRes('invalid url: ' + urlStr, 400)
  }

  /** @type {RequestInit & { duplex?: 'half' }} */
  const reqInit = {
    method: req.method,
    headers: new Headers(reqHdrRaw),
    redirect: 'manual',
    body: req.body,
  }
  // 帶 body 的請求（POST/PUT/PATCH）在新版 fetch API 必須宣告 duplex
  if (req.body) {
    reqInit.duplex = 'half'
  }

  return proxy(urlObj, reqInit)
}

/**
 * 實際發出代理請求並處理回應 header
 * @param {URL} urlObj
 * @param {RequestInit & { duplex?: 'half' }} reqInit
 * @returns {Promise<Response>}
 */
async function proxy(urlObj, reqInit) {
  const res = await fetch(urlObj.href, reqInit)
  const resHdrNew = new Headers(res.headers)

  const location = resHdrNew.get('location')
  if (location) {
    if (checkUrl(location)) {
      // 仍是 GitHub 系列 URL，改寫成走 proxy
      resHdrNew.set('location', DEFAULT_PREFIX + location)
    } else {
      // 非 GitHub URL，直接讓 fetch 自動跟隨
      return fetch(location, { ...reqInit, redirect: 'follow' })
    }
  }

  resHdrNew.set('access-control-expose-headers', '*')
  resHdrNew.set('access-control-allow-origin', '*')
  resHdrNew.delete('content-security-policy')
  resHdrNew.delete('content-security-policy-report-only')
  resHdrNew.delete('clear-site-data')

  return new Response(res.body, {
    status: res.status,
    headers: resHdrNew,
  })
}

/**
 * ES Modules entry point for Cloudflare Workers
 * @see https://developers.cloudflare.com/workers/runtime-apis/handlers/fetch/
 */
export default {
  /**
   * @param {Request} request
   */
  async fetch(request) {
    try {
      return await fetchHandler(request)
    } catch (err) {
      const stack = err instanceof Error ? err.stack : String(err)
      return makeRes('cfworker error:\n' + stack, 502)
    }
  },
}
```

## 後記

使用 cUrl 指令來測試下載速度，這裡觀察 Time to First Byte (TTFB) 和總下載時間 (Total) 做比較：

| 圖片載入方式      | TTFB (s) | Total (s) |
| ----------------- | -------- | --------- |
| GitHub URL        | 0.244    | 0.388     |
| jsDelivr CDN      | 0.139    | 0.277     |
| Statically CDN    | 0.203    | 0.321     |
| Cloudflare Worker | 0.090    | 0.188     |

測試指令如下：

```powershell
$urls = @(
    "<FROM>https://github.com",
    "<FROM>https://cdn.jsdelivr.net",
    "<FROM>https://cdn.statically.io",
    "<FROM>https://cloudflare.workers.dev"
)

# 將測試結果輸出成 CSV 檔，包含欄位名稱
"Url,Run,DNS,Connect,TLS,TTFB,Total,SpeedBytesPerSec" | Out-File result.csv -Encoding utf8
foreach ($url in $urls) {
    1..5 | ForEach-Object {
        $run = $_
        $result = curl.exe -L -o $null -s -w "%{time_namelookup},%{time_connect},%{time_appconnect},%{time_starttransfer},%{time_total},%{speed_download}" $url
        "$url,$run,$result" | Out-File result.csv -Append -Encoding utf8
    }
}
```
