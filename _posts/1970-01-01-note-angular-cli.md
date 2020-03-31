---
layout: post
title: Angular CLI 操作筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Angular, Tools]
---

開發 Angular 就不能不知道 Angular CLI 這個超級好用的命令列工具，有了這個工具，原本渾沌的開發環境，頓時清晰，許多繁瑣的瑣事，一個命令就搞定！這邊是我自己的操作筆記，讓記憶力不佳的我，有個地方可以方便查詢。

> 這裡的內容不保證最新，但會盡量持續更新。

> 最即時的文件請參考 Angular CLI 在 Github 上的文件，例如要查 `ng new` 這個指令的用法，請參考這個[連結](https://github.com/angular/angular-cli/blob/master/docs/documentation/new.md)。

## 安裝

建議使用 [Node.js](https://nodejs.org/en/) 的 npm 套件管理工具來安裝 Angular CLI，請使用以下指令安裝：

```bash
npm install -g angular-cli
```

> Angular CLI 需要 Node 4.X 和 NPM 3.X 以上的版本支援。

## 常用指令

- 預覽新專案：`ng new AppName --routing --skip-tests --style=scss -d`
- 建立新專案：`ng new AppName --routing --skip-tests --style=scss`
- 建立 PWA 專案：`ng new AppName --routing --skip-tests --style=scss --service-worker`
- 啟動：`ng serve`

## 專案升級步驟

參考：[簡介 Angular 4 如何升級至 Angular 5 最新版本](https://www.slideshare.net/WillHuangTW/angular-5-angular-4-angular-5)

1. 查詢最新版的版本
   - `ng -v` 查詢目前 Angular CLI 版本
   - `npm show @angular/core@* version --json` 查詢 Angular 版本
2. 更新 Angular
   - 修正 `package.json` 中 所有 `@angular/*` 套件版本至最新版，例 `^5.0.0`
3. 更新相依套件
   - `npm install @angular/cli@1.5`
   - `npm install typescript@2.4`
   - `npm install rxjs@5.5`
   - `npm install codelyzer@4`
4. `npm install` 重新安裝套件

## ng new

- 指令：`ng new <project-name> [options]`
- 說明：建立 Angular 專案，預設此專案會建立在目前的路徑下
- 選項：
  - `--routing`
    - 使用路由機制，並建立路由檔
  - `--dry-run`
    - 只輸出會建立的檔案名稱，不會真的產生檔案
    - 別名：`-d`
  - `--skip-git`
    - 此專案不建立 git 庫
    - 別名：`-sg`
  - `--skip-install`
    - 當專案建立後，不執行任何 npm/yarn 安裝指令
    - 別名：`-si`
  - `--skip-tests`
    - 當專案建立後，不增加單元測試檔案
    - 別名：`-st`
  - `--skip-e2e`
    - 當專案建立後，不增加 e2e 測試檔案
    - 別名：`-se`
  - `--directory`
    - 設定專案要建立在哪個資料夾內
    - 如果要將產生的專案放在當前資料夾，可這樣下參數 `--directory ./`
  - `--verbose`
    - 輸出更多資訊
    - 別名：`-v`
  - `--style=scss`
    - 改使用 SCSS 設計 CSS 樣式
  - `--service-worker`
    - 建立 PWA 專案
    - 別名：`-sw`

## ng init

- 指令：`ng init <project-name> [options]`
- 說明：在目前資料夾下建立 Angular 專案（不會產生資料夾）
- 選項：
  - `--dry-run`
    - 只輸出會建立的檔案名稱，不會真的產生檔案
    - 別名：`-d`
  - `--verbose`
    - 輸出更多資訊
    - 別名：`-v`
  - `--skip-npm`
    - 當專案建立後，不執行任何 npm 指令
  - `--name`
    - 設定專案名稱

## ng serve

在專案資料夾中執行 `ng serve`，將編譯 Angular 專案並自動在瀏覽器中打開預設網址 `http://localhost:4200/`，執行後如果修改了專案中的程式碼，網頁會自動重新整理。

也可以使用以下指令，自訂要配置的 IP 和 Port 號：

```bash
ng serve --host 0.0.0.0 --port 4201 --live-reload-port 49123
```

## ng completion

- 指令：`ng completion`
- 說明：在目前的 shell 底下增加自動補完 ng 指令的功能

## ng doc

- 指令：`ng doc <keyword>`
- 說明：開啟瀏覽器查詢 `<keyword>` 用法。相當於在 [angular.io API Reference](https://angular.io/docs/ts/latest/api/) 中查詢 API 文件。

## ng e2e

- 指令：`ng e2e`
- 說明：使用 protractor 執行所有 end-to-end 測試你的應用程式

## ng format

- 指令：`ng format`
- 說明：Formats the code of this project using clang-format.

## ng generate

- 指令：`ng generate <type> [options]`
- 說明：在專案中產生新的程式碼
- 別名：`g`
- 有效類型：
  - `ng g component my-new-component` 產生 Component 元件程式碼
  - `ng g directive my-new-directive` 產生 Directive 指令程式碼
  - `ng g pipe my-new-pipe` 產生 Pipe 管道程式碼
  - `ng g service my-new-service` 產生 Service 服務程式碼
  - `ng g class my-new-class` 產生 Class 程式碼
  - `ng g interface my-new-interface` 產生 Interface 介面程式碼
  - `ng g enum my-new-enum` 產生 Enum 程式碼
  - `ng g module my-module` 產生 Module 模組程式碼
  - `ng g guard my-guard` 產生 Guard 守衛程式碼
  - `ng g app-shell [ --universal-app <universal-app-name>] [ --route <route>]` 建立 App Shell

每個產生的元件有各自的資料夾，除非使用 `--flat` 選項

- 選項：
  - `--flat` 不建立資料夾
  - `--route=<route>` 指令父路由，僅用於產生元件和路由，預設使用指定的路徑
  - `--skip-router-generation` 跳過產生父路由配置，只能用於路由命令
  - `--default` 指定路由為預設路由 \* `--lazy` 指定路由為延遲載入

## ng build

將專案編譯至輸出資料夾，預設為 `dist`。

`ng build` 可以指定輸出目標（`--target=production` 或 `--target=development`）和要使用的環境文件（`--environment=dev` 或 `--environment=prod`）。預設情況下，會使用開發目標和環境。

```bash
# 這是正式環境的編譯
ng build --target=production --environment=prod
ng build --prod --env=prod
ng build --prod

# 這是開發環境的編譯
ng build --target=development --environment=dev
ng build --dev --e=dev
ng build --dev
ng build
```

## ng get

- 指令：`ng get <path1, path2, ...pathN> [options]`
- 說明：Get a value from the Angular CLI configuration. The pathN arguments is a valid JavaScript path like "users[1].userName". If the value isn't set, "undefined" will be shown. This command by default only works inside a project directory.
- 選項： \* `--global` Returns the global configuration value instead of the local one (if both are set). This option also makes the command work outside of a project directory.

## ng set

- 指令：`ng get <path1=value1, path2=value2, ...pathN=valueN> [options]`
- 說明：Set a value in the Angular CLI configuration. By default, sets the value in the project's configuration if ran inside a project, or fails if not inside a project. The pathN arguments is a valid JavaScript path like "users[1].userName". The value will be coerced to the proper type or will throw an error if the type cannot be coerced.
- 選項： \* `--global` Sets the global configuration value instead of a local one. This also makes `ng set` works outside a project.

## ng github-pages:deploy

- 指令：`ng github-pages:deploy [options]`
- 說明：Build the application for production, setup the GitHub repository, then publish the app.
- 選項：
  - `--message=<message>` Commit message to include with the build. Defaults to "new gh-pages version".
  - `--environment=<env>` The Angular environment to build. Defaults to "production".
  - `--branch=<branch-name>` The git branch to push the pages to. Defaults to "gh-branch".
  - `--skip-build` Skip building the project before publishing.
  - `--gh-token=<token>` API token to use to deploy. Required.
  - `--gh-username=<username>` The Github username to use. Required.

## ng lint

- 指令：`ng lint`
- 說明：執行 codelyzer linter 檢查你的專案

## ng test

- 指令：`ng test [options]`
- 說明：使用 karma 執行單元測試
- 選項：
  - `--watch` Keep running the tests. Default to true.
  - `--browsers`, `--colors`, `--reporters`, `--port`, `--log-level` Those arguments are passed directly to karma.

## ng version

- 指令：`ng version`
- 說明：輸出 angular-cli、node 和作業系統版本

---

參考資料：

- [angular/angular-cli](https://github.com/angular/angular-cli)
- [Angular CLI Reference](https://cli.angular.io/reference.pdf)
