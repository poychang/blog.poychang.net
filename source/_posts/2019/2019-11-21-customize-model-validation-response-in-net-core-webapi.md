---
layout: post
title: 自訂 ASP.NET Core WebAPI 模型繫結的驗證訊息
date: 2019-11-21 14:31
author: Poy Chang
comments: true
categories: [CSharp, Dotnet, WebAPI]
permalink: customize-model-validation-response-in-net-core-webapi/
---

在使用複雜的 JSON 資料作為呼叫 ASP.NET Core WebAPI 的 HTTP Body 的時候，ASP.NET Core 會將 JSON 資料做對應的模型繫結，當模型繫結失敗的時候，ASP.NET Core WebAPI 有預設的錯誤訊息回饋給呼叫端，而在 ASP.NET Core 的架構中，保留了很多修改的彈性，如何自訂 ASP.NET Core WebAPI 模型繫結的驗證訊息，是這篇想要介紹的。

## 修改模型繫結錯誤訊息

![預設 ASP.NET Core 模型繫結錯誤時所回應的訊息](https://i.imgur.com/gFCxaGk.png)

預設的情況下，ASP.NET Core 模型繫結錯誤時所回應的訊息如上圖，最關鍵的錯誤訊息為 `"The value 'InvalidValue' is not valid."` 這句話，如果你想要修改這段句子，你可以在 `ConfigureServices()` 中，針對 MVC 的選項作調整，參考下面的程式碼：

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc()
        .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
        .AddMvcOptions(options =>
        {
            // 把預設的訊息樣板 "The value '{0}' is not valid." 改成中文的 "'{x}' 是不合法的參數"
            options.ModelBindingMessageProvider.SetNonPropertyAttemptedValueIsInvalidAccessor((x) => $"'{x}' 是不合法的參數");
        });
}
```

這裡透過 `AddMvcOptions()` 來修改 MVC 內所使用的選項，在預設的 `ModelBindingMessageProvider` 模型繫結訊息供應器中，有以下 11 種訊息（或參考[官方文件](https://docs.microsoft.com/zh-tw/dotnet/api/microsoft.aspnetcore.mvc.modelbinding.metadata.modelbindingmessageprovider?view=aspnetcore-3.0&WT.mc_id=DT-MVP-5003022)）：

| 屬性                                          | 預設的訊息樣板                                                  |
| -------------------------------------------- | ------------------------------------------------------------- |
| `MissingBindRequiredValueAccessor`           | A value for the '{0}' parameter or property was not provided. |
| `MissingKeyOrValueAccessor`                  | A value is required.                                          |
| `MissingRequestBodyRequiredValueAccessor`    | A non-empty request body is required.                         |
| `ValueMustNotBeNullAccessor`                 | The value '{0}' is invalid.                                   |
| `AttemptedValueIsInvalidAccessor`            | The value '{0}' is not valid for {1}.                         |
| `NonPropertyAttemptedValueIsInvalidAccessor` | The value '{0}' is not valid.                                 |
| `UnknownValueIsInvalidAccessor`              | The supplied value is invalid for {0}.                        |
| `NonPropertyUnknownValueIsInvalidAccessor`   | The supplied value is invalid.                                |
| `ValueIsInvalidAccessor`                     | The value '{0}' is invalid.                                   |
| `ValueMustBeANumberAccessor`                 | The field {0} must be a number.                               |
| `NonPropertyValueMustBeANumberAccessor`      | The field must be a number.                                   |


但你無法直接修改該屬性，必須透過存取器來修改，例如 `NonPropertyAttemptedValueIsInvalidAccessor` 的存取器為 `SetNonPropertyAttemptedValueIsInvalidAccessor()` 基本上就是名稱前面加上 Set 前綴就是了。

接著每個訊息的修改方式稍有不同，在注意一下他需要接收幾個參數做修正就可以了。

這些資訊你可以從 GitHub 上的 [aspnet/Mvc](https://github.com/aspnet/Mvc) 儲存庫找到 [DefaultModelBindingMessageProvider.cs](https://github.com/aspnet/Mvc/blob/master/src/Microsoft.AspNetCore.Mvc.Core/ModelBinding/Metadata/DefaultModelBindingMessageProvider.cs)，裡面就會有所有模型繫結訊息的屬性，然後你可以在 [Microsoft.AspNetCore.Mvc.Core 的 Resources.resx 資源擋](https://github.com/aspnet/Mvc/blob/master/src/Microsoft.AspNetCore.Mvc.Core/Resources.resx)找到預設的訊息樣板。

## 修改整個模型繫結錯誤訊息物件

如果你想要將整個模型繫結錯誤時所回應的訊息都改掉，一樣可以在 `ConfigureServices()` 中，針對 MVC 的選項作調整，參考下面的程式碼：

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.AddMvc()
        .SetCompatibilityVersion(CompatibilityVersion.Version_2_2)
        .ConfigureApiBehaviorOptions(options =>
        {
            options.InvalidModelStateResponseFactory = actionContext => new BadRequestObjectResult(new { Message = "Model binding occurs problem." });
        });
}
```

這段程式碼我改成很簡單，當模型繫結錯誤時，直接回傳一個包含 `Message` 屬性值為 `Model binding occurs problem.` 的物件，修改後的效果如下：

![修改整個 ASP.NET Core 模型繫結錯誤時所回應的訊息](https://i.imgur.com/8wsvFqz.png)

透過 `ConfigureApiBehaviorOptions()` 來修改 MVC 內用來產生模型繫結回應的工廠物件 `InvalidModelStateResponseFactory`，你可以自訂當發生模型繫結錯誤時，你要做甚麼動作，以及要回傳怎樣的訊息給呼叫端。

上面的程式碼我改得很簡單，只利用 `BadRequestObjectResult` 來產生一個 HTTP 400 狀態的回應，並包一個簡單訊息物件在裡面，你大可以將這段單獨抽除來處理，加上你想要的自訂邏輯，例如發生模型繫結錯誤時做對應的 log 或通知到某個頻道之類的，然後再自訂你想要的回應訊息。

>本篇完整範例程式碼請參考 [poychang/Demo-WebAPI-Model-Validation-Response](https://github.com/poychang/Demo-WebAPI-Model-Validation-Response)。

## 後記

ASP.NET Core 的架構包含了很多彈性和擴充點，你會發現上面的程式碼都很少，透過簡單幾行就可以將你要的自訂擴充邏輯添加進去，或完成修改，這樣的架構設計真是不錯。

----------

參考資料：

* [ASP.NET Core Model Binding Error Messages Localization](https://stackoverflow.com/questions/40828570/asp-net-core-model-binding-error-messages-localization/41669552)
* [Customizing a Model Validation Response which results in an HTTP 400 Error Code](https://www.c-sharpcorner.com/blogs/customizing-model-validation-response-resulting-as-http-400-in-net-core)
* [Exploring the ApiControllerAttribute and its features for ASP.NET Core MVC 2.1](https://www.strathweb.com/2018/02/exploring-the-apicontrollerattribute-and-its-features-for-asp-net-core-mvc-2-1/)
