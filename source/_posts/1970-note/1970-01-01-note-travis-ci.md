---
layout: post
title: Travis CI 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note]
permalink: note-travis-ci/
---

本篇作為筆記用途，記錄 Travis CI 參考資料

## Script

`script` 來指定執行動作或測試的指令碼

```yml
script: bundle exec thor build 
```

若有多個冬作可以寫成這樣：

```yml
script:
  - command1
  - command2 
```

>請注意！`script` 與 `install` 對於失敗後的動作有不一樣的處理方式，在 `script` 中，如果 command1 失敗 command2 會繼續執行，但整個狀態還是失敗的。

如果 command2 只有在 command1 成功後才能執行，可以寫成這樣：

```yml
script: command1 && command2 
```

## 指令碼生命週期

完整的生命週期，從開始到結束是下面的流程：

- before_install
- install
- before_script
- script
- after success or after failure
- [OPTIONAL] before_deploy
- [OPTIONAL] deploy
- [OPTIONAL] after_deploy
- after_script

## 指令碼範例

REF: [nukc/how-to-use-travis-ci](https://github.com/nukc/how-to-use-travis-ci)

```yml
language: android   # 声明构建语言环境

notifications:      # 每次构建的时候是否通知，如果不想收到通知邮箱（个人感觉邮件贼烦），那就设置false吧
  email: false

sudo: false         # 开启基于容器的Travis CI任务，让编译效率更高。

android:            # 配置信息
  components:
    - tools
    - build-tools-23.0.2              
    - android-23                     
    - extra-android-m2repository     # Android Support Repository
    - extra-android-support          # Support Library

before_install:     
 - chmod +x gradlew  # 改变gradlew的访问权限

script:              # 执行:下面的命令
  - ./gradlew assembleRelease  

before_deploy:       # 部署之前
  # 使用 mv 命令进行修改apk文件的名字
  - mv app/build/outputs/apk/app-release.apk app/build/outputs/apk/buff.apk  
 
deploy:              # 部署
  provider: releases # 部署到GitHub Release，除此之外，Travis CI还支持发布到fir.im、AWS、Google App Engine等
  api_key:           # 填写GitHub的token （Settings -> Personal access tokens -> Generate new token）
    secure: 7f4dc45a19f742dce39cbe4d1e5852xxxxxxxxx 
  file: app/build/outputs/apk/buff.apk   # 部署文件路径
  skip_cleanup: true     # 设置为true以跳过清理,不然apk文件就会被清理
  on:     # 发布时机           
    tags: true       # tags设置为true表示只有在有tag的情况下才部署
```

## 部屬到 NuGet.org

參考 Repo: [adamovic-cw/travis-nuget-test](https://github.com/adamovic-cw/travis-nuget-test)

```yml
language: csharp
sudo: false
mono:
  - latest
env: TEST_VERSION=1.0.8
solution: Travis.Nuget.Example.sln
script:
  - /bin/sh ./build.sh
  - /bin/sh ./test.sh
deploy:
  skip_cleanup: true
  provider: script
  script:
    - /bin/sh ./deploy.sh
  on:
    tags: true
```

```sh
#!/usr/bin/env bash
mono nuget.exe pack Travis.Nuget.Example/Travis.Nuget.Example.nuspec -Version $TEST_VERSION -Verbosity detailed && \
mono nuget.exe push Travis.Nuget.Example.$TEST_VERSION.nupkg -ApiKey $NUGET_API_KEY -Verbosity detailed -Source nuget.org
```

---

參考資料：

- [持續集成服務Travis CI 教程](http://www.ruanyifeng.com/blog/2017/12/travis_ci_tutorial.html)
- [Travis CI Docs - Customizing Your Build](https://docs.travis-ci.com/user/customizing-the-build/)
