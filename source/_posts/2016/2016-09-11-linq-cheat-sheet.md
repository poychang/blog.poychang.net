---
layout: post
title: LINQ Cheat Sheet
date: 2016-09-11 08:19
author: Poy Chang
comments: true
categories: [CSharp, Develop]
permalink: linq-cheat-sheet/
---

LINQ 語言整合查詢（Language Integrated Query），提供標準且容易學習的資料查詢與更新方法，並且從 .NET Framework 3.5 開始就可以在 C# 以及 VB.NET 中使用此查詢語法。寫法分兩種方式：

* 宣告式(Declarative) -> LINQ
* 編程式(Imerative) -> Lambda 表示式

![LINQ 架構圖](http://i.imgur.com/eCR8amU.gif)

LINQ 如何改善我們對資料存取的開發效率，以及在各種使用情境下如何有效撰寫 LINQ 語法，請參考下列情境。

## Filtering 過濾

將取回來的資料在程式中做進一步的資料篩選，在同一批資料中做不同條件的篩選資料時，不用再做一次資料庫連線及重新抓資料，降低資料庫負擔。

```csharp
// Query Syntax
var col1 = from o in Orders
           where o.CustomerID == 23
           select o;

// Lambda Syntax
var col2 = Orders.Where(o => o.CustomerID == 23);
```

## Return Anonymous Type 回傳匿名型別

匿名型別，讓開發人員建立物件執行個體，不需要先撰寫型別的類別定義，簡單來說就是沒有名稱的 `class`，作為暫時的物件，方便後續使用。

如果要使用具名型別，在 `new` 後面加上你要的資料型別即可。

```csharp
// Query Syntax
var col1 = from o in Orders
           select new
           {
               OrderID = o.OrderID,
               Cost = o.Cost
           }

// Lambda Syntax
var col2 = Orders.Select(o => new
{
    OrderID = o.OrderID,
    Cost = o.Cost
});
```

## Ording 排序

```csharp
// Query Syntax
var col1 = from o in Orders
           orderby o.Cost ascending
           select o;

// Lambda Syntax
var col2 = Orders.OrderBy(o => o.Cost);
```

---

```csharp
// Query Syntax
var col1 = from o in Orders
           orderby o.Cost descending
           select o;

// Lambda Syntax
var col2 = Orders.OrderByDescending(o => o.Cost);
```

---

```csharp
// Query Syntax
var col1 = from o in Orders
           orderby o.CustomerID, o.Cost descending
           select o;
var col2 = from o in Orders
           orderby o.Cost descending
           orderby o.CustomerID
           select o;

// Lambda Syntax
var col3 = Orders.OrderBy(o => o.CustomerID)
     .ThenByDescending(o => o.Cost);
```

## Joining 合併

LINQ 的 Join 很容易讓人看不懂，建議 Join 的動作在 SQL server 中完成，程式會有比較好的維護性。

```csharp
// Query Syntax
var col1 = from c in Customers
           join o in Orders on
           c.CustomerID equals o.CustomerID
           select new
           {
               c.CustomerID,
               c.Name,
               o.OrderID,
               o.Cost
           };

// Lambda Syntax
var col2 = Customers.Join(Orders,
           c => c.CustomerID, o => CustomerID,
           (c, o) => new
           {
               c.CustomerID,
               c.Name,
               o.OrderID,
               o.Cost
           });
```

## Grouping 群組

使用 Grouping 時，其 `Key` 的型別會和 `Value` 一樣，例如 `o.CustomerID` 型別是 `int` 則其 `Key` 也是 `int`型別。

```csharp
// Query Syntax
var OrderCounts1 = from o in Orders
                   group o by o.CustomerID into g
                   select new
                   {
                       CustomerID = g.Key,
                       TotalOrders = g.Count()
                   };

// Lambda Syntax
var OrderCounts2 = Orders.GroupBy(o => o.CustomerID)
                   .Select(g => new
                   {
                       CustomerID = g.Key,
                       TotalOrders = g.Count()
                   });
```

## Paging 分頁

分頁基本上就是 `Skip` 和 `Take` 的應用。

```csharp
// select top 3
// Query Syntax
var col1 = (from o in Orders
            where o.CustomerID == 23
            select o).Take(3);

// Lambda Syntax
var col2 = Orders.Where(o => o.CustomerID == 23)
                 .Take(3);
```

---

```csharp
// skip first 2 and return the 2 after
// Query Syntax
var col1 = (from o in Orders
            where o.CustomerID == 23
            orderby o.Cost
            select o).Skip(2).Take(2);

// Lambda Syntax
var col2 = Orders.Where(o => o.CustomerID == 23)
                 .Skip(2).Take(2);
```

## Element Operators 

使用 Single、Last、First、ElementAt 時，如果遇到資料來源是空的，會拋例外。

使用 SingleOrDefault、LastOrDefault、FirstOrDefault、ElementAtOrDefault 時，如果遇到資料來源是空的，會回傳 default(T)。會有以下兩種情境：

* 若 T 是參考型別或是 nullable 資料型別，會回傳 NULL。
* 若 T 是非 nullable 資料型別（如：int、bool）則會回傳 default(T)。

```csharp
// throws exception if no elements
// Query Syntax
var cust1 = (from c in Customers
            where c.CustomerID == 23
            select c).Single();

// Lambda Syntax
var cust2 = Customer.Single(c => c.CustomerID == 23);
```

---

```csharp
// returns null if no elements
// Query Syntax
var cust1 = (from c in Customers
            where c.CustomerID == 23
            select c).SingleOrDefault();

// Lambda Syntax
var cust2 = Customer.SingleOrDefault(c => c.CustomerID == 23);
```

---

```csharp
// returns a new customer instance if no elements
// Query Syntax
var cust1 = (from c in Customers
            where c.CustomerID == 21
            select c)
            .DefaultIfEmpty(new Customer()).Single();

// Lambda Syntax
var cust2 = Customer.Where(c => c.CustomerID == 21)
                    .DefaultIfEmpty(new Customer()).Single();
```

---

```csharp
// First, Last and ElementAt used in same way
// Query Syntax
var cust1 = (from o in Orders
            where o.CustomerID == 23
            orderby o.Cost
            select o).Last();

// Lambda Syntax
var cust2 = Orders.Where(o => o.CustomerID == 23)
                  .OrderBy(o => o.Cost).Last();
```

---

```csharp
// returns 0 if no elements
// Query Syntax
var i = (from c in Customers
        where c.CustomerID == 23
        select c.CustomerID).SingleOrDefault();

// Lambda Syntax
var cust2 = Customer.Where(c => c.CustomerID == 23)
                    .Select(c => c.CustomerID).SingleOrDefault();
```

## Conversions 轉換

LINQ 提供將查詢結果轉成各種 IEnumerable 資料型別，方便後續做資料處理

* Array
* Dictionary
* List
* ILookup

```csharp
// To Array
string[] names = (from c in Customers
                  select c.Name).ToArray();

// To Dictionary
Dictionary<int, Customer> col = Customers.ToDictionary(c => c.CustomerID);
Dictionary<string, double> customerOrdersWithMaxCost = (from oc in 
    (from o in Orders
    join c in Customers on o.CustomerID equals c.CustomerID
    select new { c.Name, o.Cost})

    group oc by oc.Name into g
    select g).ToDictionary(g => g.Key, g => g.Max(oc => oc.Cost));

// ToList
List<Order> ordersOver10 = (from o in Orders
    where o.Cost > 10
    orderby o.Cost).ToList();

//To Lookup
ILookup<int, string> customerLookup =
    customers.ToLookup(c => c.CustomerID, c => c.Name);
```

----------

參考資料：

* [LINQ 查詢運算式 (C# 程式設計手冊)](https://msdn.microsoft.com/zh-tw/library/bb397676.aspx)
* [保哥線上講堂：LINQ 快速上手](http://www.slideshare.net/WillHuangTW/linq-46081487)
* [LINQ Cheat Sheet](http://weblogs.asp.net/bradvincent/linq-cheat-sheet)
* [LINQ to Everything](https://blogs.msdn.microsoft.com/charlie/2008/02/28/link-to-everything-a-list-of-linq-providers/)
