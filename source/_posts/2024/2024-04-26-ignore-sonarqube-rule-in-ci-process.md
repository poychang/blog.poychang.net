---
layout: post
title: 在 CI 流程中忽略 SonarQube 的特定分析規則
date: 2024-04-26 15:18
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, Develop, Tools]
permalink: ignore-sonarqube-rule-in-ci-process/
---

SonarQube 提供了一個很好的方式來幫助我們檢查程式碼的品質，但有時候可能會遇到一些特定的規則並不適用於我們的專案，這時候可以透過設定來忽略這些特定的規則，這篇文章將會介紹如何在 CI 流程中忽略 SonarQube 的特定分析規則。

由於是要針對特定專案做規則忽略，因此我們不是要在 SonarQube 平台中來關閉分析規則，而是要在專案的分析設定檔中下手，有兩個切入點可以做這樣的設定，一個是使用 `sonar-project.properties` 的設定檔，一個是在 SonarQube 平台中，針對該專案做設定。

## 透過 sonar-project.properties 設定檔

我們可以在專案中加入 `sonar-project.properties` 設定檔，然後再設定檔中加入 [Analysis Parameters](https://docs.sonarsource.com/sonarqube/latest/analyzing-source-code/analysis-parameters/)，也就是我們要設定的設定值，下面範例就是用來來忽略特定的分析規則：

```yaml
# Ignore Issues
sonar.issue.ignore.multicriteria=e1
# Skip Rule: Mark members as static
sonar.issue.ignore.multicriteria.e1.ruleKey=roslyn:CA1822
sonar.issue.ignore.multicriteria.e1.resourceKey=**/*.cs
```

這裡我們定義了一個名為 `e1` 的忽略規則，`ruleKey` 設定成忽略 `roslyn:CA1822` 這個分析規則，並且在 `resourceKey` 中設定只針對專案資料夾中所有 `.cs` 的檔案做忽略。

如果想要增加多個規則，可以再加入 `e2`、`e3`...等等，然後在 `sonar.issue.ignore.multicriteria` 中加入這些規則，寫法如下：

```yaml
# Ignore Issues
sonar.issue.ignore.multicriteria=e1,e2
# Skip Rule: Mark members as static
sonar.issue.ignore.multicriteria.e1.ruleKey=roslyn:CA1822
sonar.issue.ignore.multicriteria.e1.resourceKey=**/*.cs
# Skip Rule: Prefer 'AsSpan' over 'Substring'
sonar.issue.ignore.multicriteria.e2.ruleKey=roslyn:CA1846
sonar.issue.ignore.multicriteria.e2.resourceKey=**/*.cs
```

這裡我們定義了兩個忽略規則，至於 `ruleKey` 的 Identifier 值要從哪裡查到，最簡單的方式就是在 SonarQube 平台中找，如下圖：

![從 Rule 中查詢 ruleKey Identifier](https://i.imgur.com/onUjhNx.png)

或是在已經分析過的專案中，點擊 `Why is this an issue?` 連結，接著會出現該規則的詳細資訊，右上角就會有 `ruleKey` 的 Identifier 值，如下圖：

![專案中已經被分析的問題，查詢 Why is this an issue](https://i.imgur.com/whoCnId.png)

![Why is this an issue 詳細資料的右上角有 ruleKey 的 Identifier 值](https://i.imgur.com/bwpErTO.png)

## 直接在 CI 上設定

上述提到的透過 `sonar-project.properties` 設定檔來設定，讓你可以將設定值提交到你的版本庫中，而同樣的設定值，其實也可以直接在 CI 上面做設定，這裡以 Azure DevOps 為例，透過 Azure DevOps 的 Pipeline 設定，可以在 `Prepare analysis on SonarQube` 這個步驟中，加入 `Additional Properties` 來設定，如下圖：

![直接在 Azure DevOps Pipeline 中設定要排除的規則](https://i.imgur.com/QUdgYif.png)

## 從 SonarQube 平台中設定

我們也可以透過 SonarQube 平台中的專案設定來設定，在 `Project Settings` > `General Settings` 中，有一個 `Analysis Scope` 的設定頁面，裡面的 `Ignore Issues on Multiple Criteria` 段落，可以在這裡設定要排除的規則，這樣的設定會直接影響到該專案的分析結果，如下圖：

![在 Analysis Scope 設定頁面中設定 Ignore Issues on Multiple Criteria](https://i.imgur.com/qoQlbXN.png)

---

參考資料：

* [Configuring a Project to Exclude Certain Sonar Violations](https://www.baeldung.com/sonar-exclude-violations)
* [SonarQube Analysis scope - Excluding specific rules from specific files](https://docs.sonarsource.com/sonarqube/latest/project-administration/analysis-scope/#excluding-specific-rules-from-specific-files)