# Poy Chang's Blog

**記錄開發實務，分享技術探索，持續學習與實作。**

以繁體中文分享 .NET、Azure、Web 開發與 AI 應用的技術筆記。

[![GitHub Pages 部署狀態](https://github.com/poychang/blog.poychang.net/actions/workflows/main.yml/badge.svg)](https://github.com/poychang/blog.poychang.net/actions/workflows/main.yml)
[![Built with Hexo 8](https://img.shields.io/badge/Hexo-8-0E83CD?logo=hexo&logoColor=white)](https://hexo.io/)
[![MIT License](https://img.shields.io/badge/License-MIT-22A675)](./LICENSE)

[**閱讀部落格**](https://blog.poychang.net/) · [文章彙整](https://blog.poychang.net/archives/) · [主題分類](https://blog.poychang.net/category.html) · [搜尋文章](https://blog.poychang.net/search.html) · [關於作者](https://blog.poychang.net/about/)

---

## 關於這個專案

這裡是 [blog.poychang.net](https://blog.poychang.net/) 的原始碼倉庫，收錄文章、網站資源與佈景主題。網站使用 **Hexo** 產生靜態頁面，搭配 **Cactus** 主題，透過 **GitHub Actions** 自動部署至 **GitHub Pages**。

如果你是來找技術文章，可以直接從上方導覽開始；如果你想了解網站如何運作，或協助修正內容，下方也整理了專案結構與本機預覽方式。

## 關於 Poy Chang

Poy Chang 是來自台灣的軟體開發者，專注於 **Azure 與 .NET**，並在部落格分享開發經驗與技術實作。依據公開的[作者介紹](https://blog.poychang.net/about/)，他的經驗涵蓋製造業軟體開發與架構設計，也參與 **STUDY4** 技術社群及 **.NET Conf** 活動。

持續學習、動手實作，並將經驗分享給社群，是這個部落格的核心精神。

[GitHub](https://github.com/poychang) · [Facebook](https://www.facebook.com/poychang.tech/) · [LinkedIn](https://www.linkedin.com/in/poychang) · [Email](mailto:poypost@gmail.com)

## 本機預覽

### 環境需求

- [Node.js](https://nodejs.org/) **20.19.0 以上**（Hexo 8 的最低需求；建議使用仍受支援的 LTS 版本）。
- npm（隨 Node.js 安裝）與 Git。

### 快速開始

```shell
git clone https://github.com/poychang/blog.poychang.net.git
cd blog.poychang.net
npm ci
npm run server
```

啟動後開啟 [http://localhost:4000](http://localhost:4000) 即可預覽。上述指令使用專案內的 Hexo，不需要全域安裝 `hexo-cli`。

### 常用指令

| 指令             | 用途                             |
| ---------------- | -------------------------------- |
| `npm run server` | 啟動本機預覽伺服器               |
| `npm run build`  | 產生靜態網站至 `public/`         |
| `npm run clean`  | 清除 Hexo 快取與已產生的網站檔案 |

正式站由 [GitHub Actions 部署流程](./.github/workflows/main.yml) 在推送至 `main` 後自動建置與發布，不需要手動執行 `npm run deploy`。

## 專案結構

| 路徑                                         | 說明                           |
| -------------------------------------------- | ------------------------------ |
| [`source/_posts/`](./source/_posts/)         | 依年份整理的 Markdown 文章     |
| [`source/assets/`](./source/assets/)         | 圖片、元件與其他網站資源       |
| [`source/apps/`](./source/apps/)             | 直接提供的靜態小工具與互動頁面 |
| [`themes/cactus/`](./themes/cactus/)         | 網站使用的 Cactus 主題         |
| [`scaffolds/`](./scaffolds/)                 | Hexo 新文章與頁面範本          |
| [`_config.yml`](./_config.yml)               | 網站基本設定、網址與外掛設定   |
| [`_config.cactus.yml`](./_config.cactus.yml) | 主題外觀、導覽與社群連結設定   |
| [`.github/workflows/`](./.github/workflows/) | 自動建置、部署與維護流程       |

`public/` 為自動產生的網站輸出，不納入版本控制；修改文章或頁面時，請編輯對應的來源檔案。

## 回饋與參與

發現錯字、失效連結或範例需要補充，歡迎透過 [Issues](https://github.com/poychang/blog.poychang.net/issues) 提出，或提交 Pull Request。回報時附上文章網址與問題描述，會更容易確認與修正。

## 授權與參考

本專案採用 [MIT License](./LICENSE)，使用與散布時請保留授權要求的著作權及許可聲明。

- [Hexo 官方文件](https://hexo.io/docs/)
- [Cactus 主題](https://github.com/probberechts/hexo-theme-cactus)
- [Poy Chang 的 GitHub 個人頁](https://github.com/poychang)與[部落格作者介紹](https://blog.poychang.net/about/)（作者資訊參考來源）
