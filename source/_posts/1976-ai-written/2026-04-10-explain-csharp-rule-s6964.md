---
layout: post
title: 解釋 C# 規則 S6964
date: 2026-04-10 16:07
author: Poy Chang
comments: true
categories: [Develop, PowerShell, Tools]
permalink: explain-csharp-rule-s6964/
---

> 聲明：此篇文章使用 AI 工具產生，請自行判斷文章內容的正確性。

# 問題

根據 **C# 規則 S6964：Value type property used as input in a controller action should be nullable, required or annotated with JsonRequiredAttribute**），解讀這在說什麼？是建議我做什麼操作嗎？為甚麼？

# Bing 回答

## ✅ 這頁在說什麼？

這頁在說明 SonarQube 的 **Code Smell 規則 S6964**。  
核心訊息非常清楚：

> **如果你的 Web API 接收一個 model，而 model 裡有「非 nullable 的 value type 屬性」（例如 int、bool、DateTime），那麼當 client 沒傳這些欄位時，ASP.NET 會自動填入「預設值」，造成 under‑posting（資料缺失但你不知道）。**

頁面內容指出（  [sonarqube.kingston.com.tw](https://sonarqube.kingston.com.tw/coding_rules?activation=false&compareToProfile=AXlJSRKSwtX2HsgO5Qd7&languages=cs&qprofile=AXlOnDDRGNQienSndRSI&severities=MAJOR&open=csharpsquid%3AS6964)）：

- Under‑posting = client 傳來的資料比你預期的少  
- Value type（int、bool、DateTime…）如果沒收到資料 → 會被自動填成 default  
  - int → 0  
  - bool → false  
  - DateTime → 0001-01-01  
- 這會造成：
  - **資料不一致**
  - **邏輯錯誤**
  - **安全問題**（例如 role 欄位被省略 → 變成預設值 → 權限錯誤）

---

## ✅ 它是在建議你做什麼操作嗎？

**是的，它建議你：所有 value type 屬性都必須採取其中一種方式，避免 under‑posting。**

你有三種選擇：

---

### ✔ 1. 把 value type 改成 nullable（最常見）
```csharp
public int? Age { get; set; }
```

這樣如果 client 沒傳 Age → 會是 null，而不是 0。

---

### ✔ 2. 加上 [Required]
```csharp
[Required]
public int Age { get; set; }
```

這樣 client 不傳 Age → ModelState 會失敗 → 不會 silently 填入 0。

---

### ✔ 3. 使用 JsonRequired（System.Text.Json 或 Newtonsoft.Json）
```csharp
[JsonRequired]
public int Age { get; set; }
```

這會要求 JSON 一定要包含這個欄位。

---

## ❌ 它不是叫你做的事

這頁 **不是**叫你：

- 移除 value type  
- 改變你的資料庫 schema  
- 停用這條規則  

它只是提醒你：

> **你的 API 目前可能會在 client 少傳欄位時默默填入 default 值，造成資料錯誤。**

---

## ✅ 為什麼要這樣做？

頁面內容（  [sonarqube.kingston.com.tw](https://sonarqube.kingston.com.tw/coding_rules?activation=false&compareToProfile=AXlJSRKSwtX2HsgO5Qd7&languages=cs&qprofile=AXlOnDDRGNQienSndRSI&severities=MAJOR&open=csharpsquid%3AS6964)）已經說得很清楚：

---

### 1. **避免資料不一致**

例如：

```json
{
  "name": "Poy"
}
```

但你的 model 是：

```csharp
public string Name { get; set; }
public int Age { get; set; } // client 沒傳
```

結果 Age 會變成 0 → 這是錯的資料。

---

### 2. **避免安全漏洞**

頁面舉例（  [sonarqube.kingston.com.tw](https://sonarqube.kingston.com.tw/coding_rules?activation=false&compareToProfile=AXlJSRKSwtX2HsgO5Qd7&languages=cs&qprofile=AXlOnDDRGNQienSndRSI&severities=MAJOR&open=csharpsquid%3AS6964)）：

- 如果 client 省略 role 欄位  
- 你的系統可能會把 role 設成 default（例如 Admin = false → 反而變成一般使用者？或反之）  
- 這會造成權限錯誤

---

### 3. **避免不可預期的行為**

你的程式可能以為：

- Age = 0 → 使用者真的填 0  
- IsActive = false → 使用者真的選 false  

但其實 client 根本沒傳這些欄位。

---

### 4. **ASP.NET 的 model binding 行為本來就會填 default**

這不是 bug，是框架設計。  
所以你必須自己保護你的 model。

---

## 🎯 最簡短總結

**這頁是在告訴你：你的 API model 裡的 value type 屬性如果不是 nullable、不是 required、也沒有 JsonRequired，就會在 client 少傳欄位時被自動填成 default 值，造成 under‑posting。  
它建議你把這些屬性改成 nullable、加上 [Required]，或加上 JsonRequired。  
原因是：避免資料錯誤、避免安全問題、避免不可預期的行為。**
