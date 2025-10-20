---
layout: post
title: 取得資料模型的屬性設定
date: 2018-02-13 19:18
author: Poy Chang
comments: true
categories: [Dotnet]
permalink: retrieve-data-annotations-from-model/
---

建立資料模型時，我們可以透過 Data Annotations 的方式來設定該資料模型的資料欄位屬性，藉此增加資料欄位的特性，例如使用 `DisplayAttribute` 標示該資料欄位要顯示的字樣，在用 ASP.NET MVC 時常透過這樣的方式來設定資料模型，甚至在 Entity Framework 中，也會用這樣的方式來設定欄位屬性，但我們怎樣用程式來抓到這屬性的值呢？

假設我們建立了一個 `Student` 資料模型如下：

```csharp
public class Student
{
    [Display(Name = "姓名")]
    public string Name { get; set; }

    [Display(Name = "生日")]
    public DateTime Birthday { get; set; }
}
```

[system.componentmodel.dataannotations](https://docs.microsoft.com/zh-tw/dotnet/api/system.componentmodel.dataannotations?view=netframework-4.7.1&WT.mc_id=DT-MVP-5003022) 這個命名空間提供了很多資料欄位屬性給我們使用，這裡我們透過 `DisplayAttribute` 指定各個資料欄位要顯示的名稱，例如 `Name` 的顯示名稱為`姓名`，我們可以用下面的程式碼來輕鬆建立一個 `Student` 物件，並存取該物件的值：

```csharp
public class Program
{
    public static void Main()
    {
        var obj = new Student()
        {
            Name = "王大明",
            Birthday = DateTime.Now
        };

        Console.WriteLine(obj.Name);
        Console.WriteLine(obj.Birthday);
    }
}
```

這時若要取得該資料模型的資料欄位屬性時，可以先建立一個 `Object` 的擴充方法，方便我們調用，程式碼如下：

```csharp
public static class ObjectExtension
{
    public static T GetAttributeFrom<T>(this object instance, string propertyName) where T : Attribute
    {
        var attributeType = typeof(T);
        var property = instance.GetType().GetProperty(propertyName);
        if (property == null) return null;
        return (T)property.GetCustomAttributes(attributeType, false).First();
    }
}
```

這個擴充方法主要的動作如下：

1. 使用 `GetType()` 判斷實體物件的類型，並透過 `GetProperty()` 取得指定的資料欄位(`propertyName`)
2. 如果沒有指定的資料欄位，回傳 `null`
3. 取到指定的資料欄位後，透過 `GetCustomAttributes()` 取得自訂屬性的陣列，接收以下參數：
   - `attributeType` 要搜尋的屬性成員的型別
   - `inherit` 是否透過繼承鏈結一路搜尋到這個屬性成員

注意，這個擴充方法所接受的泛型對象(`T`)，請限定必須是繼承至 `Attribute` 的類型。

> 擴充方法的寫法，可以參考這份[官方文件](https://docs.microsoft.com/zh-tw/dotnet/csharp/programming-guide/classes-and-structs/extension-methods?WT.mc_id=DT-MVP-5003022)。

如此一來，就可輕鬆使用我們自訂的擴充方法 `GetAttributeFrom()` 來取得資料欄位的屬性值：

```csharp
public class Program
{
    public static void Main()
    {
        var obj = new Student()
        {
            Name = "王大明",
            Birthday = DateTime.Now
        };

        Console.WriteLine(obj.GetAttributeFrom<DisplayAttribute>(nameof(Student.Name)).Name);
        Console.WriteLine(obj.Name);
        Console.WriteLine(obj.GetAttributeFrom<DisplayAttribute>(nameof(Student.Birthday)).Name);
        Console.WriteLine(obj.Birthday);
    }
}
```

## Sample Code

<iframe width="100%" height="900" src="https://dotnetfiddle.net/Widget/6ET5mj" frameborder="0"></iframe>

## Retrieve Data Annotations Gist

以下為針對 `Object` 和 `Type` 這兩個類型的擴充方法，方便取用資料模型的屬性設定。

<script src="https://gist.github.com/poychang/801e785e3556e0928fc7fbb990a46dc9.js"></script>

---

參考資料：

- [How to retrieve Data Annotations from code?](https://stackoverflow.com/questions/7027613/how-to-retrieve-data-annotations-from-code-programmatically)
- [屬性中的屬性: 自訂 Attributes](https://dotblogs.com.tw/johnny/2015/07/31/csharp-custom-attributes)
- [Microsoft/referencesource - DataAnnotations/DisplayAttribute.cs](https://github.com/Microsoft/referencesource/blob/master/System.ComponentModel.DataAnnotations/DataAnnotations/DisplayAttribute.cs)
