---
layout: post
title: 使用 dynamic 做 ASP.NET Core API 的資料繫結
date: 2020-12-04 12:22
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, WebAPI]
permalink: using-dynamic-type-to-bind-data-in-asp-net-core/
---

在開發表單型系統的時候，尤其是專案初期，表單的格式一直在改變，有時候增加欄位，有時候又要修改欄位，而在前後端分離的架構下，每改一次前後端的資料模型就要跟著動一次，改到最後其實有點煩躁，於是開始思考能否用 `dynamic` 型別來接收這一直還沒確定下來的資料模型物件，於是出現了這篇方法。

>這作法只是為了在專案變動性很大的時候，加速專案開發，一般還是建議基於有規範的資料模型往下開發，對之後的維護比較有幫助。

要實現用 `dynamic` 型別來接收傳進來的資料，其實動作很簡單，只是有一個小問題要先處理，就是在 ASP.NET Core 3.x 以後的專案都是使用 `System.Text.Json` 來處理 JSON 資料繫結，而這會讓後面處理變得比較不漂亮，因此請先參考這篇[在 ASP.NET Core 專案中改用 JSON.NET 做資料繫結](/using-newtonsoft-json-in-asp-net-core-projects/)文章，改用 JSON.NET 做資料繫結才會比較漂亮。

處理完上面的問題後，我新增了一個 `FormController` 及一個 `Data` Action，這裡我使用 `[FromRoute]` 來取得表單類型，然後從 `[FromBody]` 取得該表單的詳細資料並用 `dynamic` 型別來接，裡面再搭配 C# 8 的 Switch 寫法來分別轉到特定表單的處理細節，程式碼其實非常簡單：

```csharp
// POST /form/{type}/
[HttpPost]
[Route("{type}")]
public IActionResult Data([FromRoute] string type, [FromBody] dynamic query)
{
    return type switch
    {
        "AForm" => Ok($"{(string)query.Title} - {(string)query.Description}"),
        "BForm" => Ok($"{(string)query.Name} {(int)query.Number}"),
        _ => Ok("Not support this form."),
    };
}
```

>如果沒有改用 JSON.NET 做資料繫結，那這裡執行時就會出現 `RuntimeBinderException: 'System.Text.Json.JsonElement' does not contain a definition for 'XXX'` 例外訊息。

這裡要注意的是，因為 `dynamic` 是執行時期判斷資料型別，因此為避免資料型別錯亂，在每一次使用 `dynamic` 資料變數的時候，建議都手動強制轉型，避免後續處理發生錯誤。

呼叫結果如下：

![A Form](https://i.imgur.com/42tuuUm.png)

![B Form](https://i.imgur.com/Vi25ZL5.png)

當然，這邊只是簡單展示一下想要表達的概念，後續其實還有很多要藉接商業邏輯的動作，這裡就不多敘述了。

>本篇完整範例程式碼請參考 [poychang/Demo-DynamicDataModelWebAPI](https://github.com/poychang/Demo-DynamicDataModelWebAPI)。

----------

參考資料：

* [在 ASP.NET Core 專案中改用 JSON.NET 做資料繫結](/using-newtonsoft-json-in-asp-net-core-projects/)
* [MS Docs](?WT.mc_id=DT-MVP-5003022)

