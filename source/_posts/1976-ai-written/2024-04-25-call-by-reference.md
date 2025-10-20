---
layout: post
title: C# 中透過 call by reference 的方式來修改原始變數
date: 2024-04-25 12:00
author: Poy Chang
comments: true
categories: [AI-Written, CSharp, Develop]
permalink: call-by-reference/
---

> 聲明：此篇文章使用 AI 工具產生，請自行判斷文章內容的正確性。

在 C# 中，透過 call by reference（參考呼叫）來修改傳遞的參數值是一種常見的程式設計方法，特別是當你需要在方法中修改一個或多個參數的值，並希望這些變更能反映到原始變數上時。這種做法可以透過使用 `ref` 和 `out` 關鍵字來實現。

## 使用 `ref` 關鍵字

當你使用 `ref` 關鍵字時，你必須在方法呼叫和方法定義中都明確使用 `ref`。這表示傳入的參數是通過其記憶體地址來傳遞的，因此方法中對參數的任何修改都會影響到原始變數。

### 優點
- **直接修改值**：允許在方法內部直接修改傳入參數的值，而不需要返回新的值
- **減少使用額外的返回值**：可以在不使用返回值的情況下，進行多個參數的修改

### 缺點
- **增加錯誤風險**：使用 `ref` 可能會不小心改變原始數據，尤其是在大型項目或多人協作的環境中
- **降低可讀性和可維護性**：當方法可以修改其參數的實際內容時，其他程式碼的讀者可能需要追蹤參數在哪裡被修改，這會使得程式碼難以理解和維護

另外，由於在 C# 中，物件類型的參數傳遞時，傳遞的是對象的引用（reference）的副本，而非物件本身。這種行為有時被稱為 "call by reference value" 或 "call by sharing"，意味著方法中對物件成員的修改會影響到原始物件，但是如果嘗試重新賦值整個物件引用本身，這個變化不會反映到呼叫方。

然而，如果你希望在方法內部將物件的引用指向一個全新的實例，並且希望這個變更能夠影響到原始引用，這時你就需要使用 `ref` 關鍵字。這樣做會使得方法外的原始引用也指向新的實例。這在某些情況下是有用的，比如當你需要重置引用或將其換成另一個已存在的對象實例。

### 範例

以下是一個簡單的範例來說明這個概念：

```csharp
public class Person {
    public string Name { get; set; }
}

public void ModifyObject(Person person) {
    // 修改物件內部狀態
    person.Name = "New Name";
}

public void ChangeReference(ref Person person) {
    // 改變引用，指向一個新的實例
    person = new Person { Name = "Another Name" };
}
```

在這個例子中：

- `ModifyObject` 方法修改了 `Person` 對象的 `Name` 屬性。這個變更會反映到方法外部，因為你正在修改原始引用所指向的對象的內部狀態
- `ChangeReference` 方法則需要 `ref` 關鍵字，因為它將引用本身改為指向一個全新的 `Person` 實例。如果沒有使用 `ref`，則外部的引用不會更新，它仍然指向原來的對象

因此，是否使用 `ref` 取決於你是否需要在方法內部改變引用本身。如果只是需要修改對象的屬性或調用其方法而不更改引用本身，則不需要 `ref`。但請注意這樣的寫法對於可讀性以及後續的理解，是否能更清晰地表達所設計的行為和預期的影響。

## 使用 `out` 關鍵字

`out` 關鍵字與 `ref` 類似，但它用於當一個方法需要輸出一個值而該變數未初始化的情況。`out` 參數必須在方法中被賦予一個值。

### 優點
- **明確的意圖表達**：使用 `out` 表示該參數是用於輸出的，這讓方法的使用更加直觀
- **強制初始化**：確保在方法結束時，`out` 參數已被賦值

### 缺點
- **必須初始化**：這可能導致額外的處理或初始化成本，特別是當方法有多條退出路徑時

## 總結

透過參考呼叫來修改參數在某些情況下非常有用，例如當你需要修改多個變數或處理大型數據結構且不希望進行昂貴的複製時。然而，這種做法也應謹慎使用，因為它可能會對程式的可讀性和維護性造成負面影響。在設計 API 和系統架構時，應該考慮到這些利弊。

---

參考資料：

* [MS Learn - ref (C# 參考)](https://learn.microsoft.com/zh-tw/dotnet/csharp/language-reference/keywords/ref?WT.mc_id=DT-MVP-5003022)
* [MS Learn - ref 參數修飾元](https://learn.microsoft.com/zh-tw/dotnet/csharp/language-reference/keywords/method-parameters#ref-parameter-modifier?WT.mc_id=DT-MVP-5003022)
* [MS Learn - out (泛型修飾詞) (C# 參考)](https://learn.microsoft.com/zh-tw/dotnet/csharp/language-reference/keywords/out-generic-modifier?WT.mc_id=DT-MVP-5003022)
