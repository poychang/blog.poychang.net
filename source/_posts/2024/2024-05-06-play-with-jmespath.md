---
layout: post
title: 輕鬆上手 JMESPath
date: 2024-05-06 16:02
author: Poy Chang
comments: true
categories: [Typescript, Javascript, Python, CSharp, Develop]
permalink: play-with-jmespath/
---

JMESPath 是一種 JSON 的查詢語言，讓使用者可以透過簡單的語法，來查詢 JSON 格式的資料，甚至重新組合 JSON，如果運用得當可以幫助我們處理查詢複雜的 JSON 資料，甚至可以簡化程式碼、改善可讀性，這篇文章將帶你輕鬆上手 JMESPath。

## 支援語言

[JMESPath](https://jmespath.org/) 本身是種查詢語言的規格，不是特定程式語言的函示庫，不過 JMESPath 官方實作了各種程式語言的函示庫，目前支援：[Python](https://github.com/jmespath/jmespath.py)、Go、Lua、[Javascript](https://github.com/jmespath/jmespath.js)、PHP、Ruby、Rust。

除了官方的實作之外，社群也根據[JMESPath 規格](https://jmespath.org/specification.html)實作了以下語言的函示庫：C++、C++、Elixir、Java、[.NET](https://github.com/jdevillard/JmesPath.Net)、[TypeScript](https://github.com/nanoporetech/jmespath-ts)。

另外，每種程式語言會有自己的使用方式、呼叫方法，詳細請自行參考各語言的實作，這裡我們主要以 JMESPath 原生地的使用方式做介紹。

> 完整的支援列表請參考官方網站 [JMESPath Libraries](https://jmespath.org/libraries.html)。

## 快速上手

這裡我提供一個快速認識的切入點，幫助你快速理解 JMESPath 的使用語法。

JMESPath 要查詢的資料來源就是 JSON 格式，我們知道 JSON 本身主要會有兩種資料結構：物件（Object）和陣列（Array），因此我們主要可以利用 JMESPath 對 JSON 做兩種事：

1. 從物件中取得或計算我們關注的屬性值
2. 從陣列中執行查詢條件

這兩種資料結構，或者說對這兩種目的，分別有各自的處理函數和存取語法。

例如，我們要取值，就可以使用 `.` 來存取物件的屬性，例如 `location.name` 可以取得 `location` 物件中的 `name` 屬性值。

如果要查詢陣列，可以使用 `[]` 搭配函數來查詢陣列中的元素，例如 `locations[?contains(name == 'Seattle')]` 可以取得 `locations` 陣列中，那些物件的 `name` 屬性是 `Seattle` 的元素。

你可以這樣想，通常我們會用 `.` 來取得物件的屬性值，用 `[]` 來取得陣列資料，而在取得陣列資料的時候，通常會搭配一些查詢語法，進行資料過濾的動作，因此查詢的語法就是在 `[]` 中，並以 `?` 開頭來接收要查詢的條件。


基本上 JMESPath 的語法就這兩個方向，剩下的就是各種運算符、運算式、[函數](https://jmespath.org/specification.html#built-in-functions)的組合和搭配，最終透過所組合的表達式來取得我們想要的 JSON 資料樣貌。

> JMESPath 官網的 [Tutorial](https://jmespath.org/tutorial.html) 提供了許多範例可以參考。

## 範例：基本表達式 Basic Expressions

有以下 JSON 資料，要取得 `location` 的 `name` 屬性值，可以使用 `location.name` 表達式。

```json
{
    "location": {
        "name": "Seattle",
        "state": "WA"
    }
}
```

有以下 JSON 資料，要取得 `locations` 清單中的第 1 筆物件 (Seattle)，可以使用 `locations[0]` 表達式；要取得倒數第 2 筆物件 (New York)，可以使用 `locations[-2]` 表達式。索引值從 0 開始，負數則表示倒數，當查查無資料則會回傳 `null`。

```json
{
    "locations": [
        {"name": "Seattle", "state": "WA"},
        {"name": "New York", "state": "NY"},
        {"name": "Bellevue", "state": "WA"}
    ]
}
```

如果 JSON 資料本身就是陣列，如以下 JSON 資料，可以直接使用 `[]` 來查詢，例如要取得清單中第 2 筆資料，可以使用 `[1]` 表達式，這樣會取得 `{"name": "New York", "state": "NY"}`。

```json
[
    {"name": "Seattle", "state": "WA"},
    {"name": "New York", "state": "NY"},
    {"name": "Bellevue", "state": "WA"}
]
```

## 範例：切片表達式 Slicing Expressions

這裡我們統一有以下 JSON 資料：

```json
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
```

切片表達式是用來取得陣列中的一部分，主要會使用到 `:` 運算符，然後搭配索引值。

取得指定區間的資料，例如取得 3 到 6 的資料，可以使用 `[3:6]` 表達式。請注意，這裡的索引值是從 0 開始，所以 `[3:6]` 會取得 3, 4, 5 這三個元素。

這裡的表達式就是 `[start:stop]` 的意思，從哪裡開始（包含）到哪裡結束（不包含）。

如果 `start` 沒有給值則代表從第 1 個開始取值，因此要取得前 3 個元素，可以使用 `[0:3]` 表達式，也可以使用 `[:3]` 表達式。如果 `stop` 沒有給值則代表會取到最後一個元素。

在切片表達式中還可以設定 `step`，也就是取值的間隔，表達式就是 `[start:stop:step]`，例如 `[::2]` 會取得所有元素，但是間隔 2 個取值，所以會取得 0, 2, 4, 6, 8 這幾個元素。

## 範例：投影表達式 Projection Expressions

這個表達式非常常用，主要用來將物件轉換成另一種形式，例如將陣列中的某物件屬性值取出來成為清單，或是將取得的值指派給新的屬性，組合成新物件。

這裡我們統一有以下 JSON 資料：

```json
{
    "locations": [
        {"name": "Seattle", "state": "WA"},
        {"name": "New York", "state": "NY"},
        {"name": "Bellevue", "state": "WA"}
    ]
}
```

如果想要將資料轉換成 `{ "longName":"" }` 這樣的資料樣貌，可以使用 `locations[*].{longName:name}` 表達式，前段 `locations[*]` 用於取得所有 `locations` 陣列中的資料，後段 `.{longName:name}` 則是將原本的 `name` 屬性值值派給 `longName` 這個新屬性值，結果如下：

```json
[
    {"longName": "Seattle"},
    {"longName": "New York"},
    {"longName": "Bellevue"}
]
```

這裡做兩個延伸，如果不想要指定新的屬性名稱，可以直接使用 `locations[*].name` 表達式，這樣會取得 `locations` 陣列中所有物件的 `name` 屬性值，並轉換成一個陣列，結果如下：

```json
["Seattle", "New York", "Bellevue"]
```

另一個延伸，上面使用 `locations[*]` 取得所有 `locations` 陣列中的資料，這裡的 `*` 我們可替換成條件表達式，例如 `locations[?state == 'WA']` 可以取得 `locations` 陣列中，那些物件的 `state` 屬性是 `WA` 的元素，結果如下：

```json
[
    {"name": "Seattle", "state": "WA"},
    {"name": "Bellevue", "state": "WA"}
]
```

比較運算子清單如下：

| 比較運算子 | 範例                                           |
| ---------- | ---------------------------------------------- |
| `==`       | locations[?state == 'WA']                      |
| `>`        | people[?age > 18]                            |
| `<`        | people[?age < 20]                            |
| `||`       | people[?age == 18 \|\| age == 20]           |
| `&&`       | locations[?name == 'Seattle' && state == 'WA'] |

除了用條件表達式之外，也可以搭配內建的函數來做條件判斷，例如 `locations[?contains(name, 'a')]` 可以取得 `locations` 陣列中，那些物件的 `name` 屬性值包含 `e` 的元素。

> JMESPath 提供非常多內建的[函數](https://jmespath.org/specification.html#built-in-functions)，可以根據你的需要做各種條件判斷。

## 範例：管線表達式 (Pipe Expression)

這也是一個非常重要且非常強大的表達式，這裡的 Pipe 概念跟 Unix 的管線概念很像，可以將前一個表達式的結果當作下一個表達式的輸入，這樣可以將多個表達式串接在一起，達到更複雜的查詢結果。

舉一個簡單的例子，假設我們有以下 JSON 資料：

```json
{
    "locations": [
        {"name": "Seattle", "state": "WA"},
        {"name": "New York", "state": "NY"},
        {"name": "Bellevue", "state": "WA"},
        {"name": "Olympia", "state": "WA"}
    ]
}
```

我想要取得 `locations` 陣列中，那些物件的 `state` 屬性是 `WA` 的元素，並且只取得 `name` 屬性值，然後最終結果只需要前 2 筆資料即可，這時可以使用 `locations[?state == 'WA'].name | [:2]` 表達式，結果如下：

```json
["Seattle", "Bellevue"]
```

如果要先做字母排序再取資料了話，表達式可以寫成 `locations[?state == 'WA'].name | sort(@) | [:2]`，中間先使用 `sort(@)` 這個內建函數將 `name` 屬性值做排序，再取前 2 筆資料。

藉由管線表達式，我們就可以組合出更複雜的查詢效果。

## 範例：巢狀陣列過濾

這個範例比較複雜一點，假設我們有以下 JSON 資料：

```json
{
    "locations": [
        { "name": "Seattle", "list": [{ "id": "1" }, { "id": "3" }] },
        { "name": "New York", "list": [{ "id": "2" }, { "id": "3" }] },
        { "name": "Bellevue", "list": [{ "id": "2" }, { "id": "3" }] },
        { "name": "Olympia", "list": [{ "id": "1" }, { "id": "2" }] }
    ]
}
```

期望在這個巢狀陣列中針對 `list` 做過濾的動作，例如取得 `locations` 陣列中，那些物件的 `list` 陣列中有 `id` 屬性值是 `1` 的元素，這時可以使用 `locations[?list[?id == '1']]` 表達式，結果如下：

```json
[
    {
        "name": "Seattle",
        "list": [
            { "id": "1" },
            { "id": "3" }
        ]
    },
    {
        "name": "Olympia",
        "list": [
            { "id": "1" },
            { "id": "2" }
        ]
    }
]
```

接著想要列出 `list` 底下的物件，並且只取得 `id` 屬性值是 `1` 的元素，這時可以改寫成 `locations[?list[?id == '1']].list[] | [?contains(id,'1')]` 表達式，透過管線的處理，將所要的值過濾出來，結果如下：

```json
[
    { "id": "1" },
    { "id": "1" }
]
```

> 看到最後的輸出，你可能會想要把重複的資料作合併，可惜的是 JMESPath 本身並沒有提供這樣的功能，因此這樣的操作會需要透過程式做額外的處理。

## 後記

讀完這篇文章之後，基本上大部分的 JMESPath 表達式應該都能應付，如果有更複雜的需求，可以參考 JMESPath 官方網站提供的[規格](https://jmespath.org/specification.html)和[內建函數](https://jmespath.org/specification.html#built-in-functions)，特別是內建函數的部分，可以先掃過一遍，當實務上有需要的時候，再去文件找怎麼使用。

另外，在使用 Azure CLI 來查詢 Azure DevOps Pipeline 資訊的時候，可以透過 `--query` 參數並搭配 JMESPath 來做資料過濾，這樣可以讓你的查詢更精準，加快找到指定目標的作業。

# JMESPath Playground

<div id="app" class="container border">
    <h3>Data</h3>
    <textarea class="data form-control" rows="5" style="width:100%;">{"a": "foo", "b": "bar", "c": "hello-world"}</textarea>
    <h3>Expression</h3>
    <input class="expression form-control" type="text" placeholder="Expression" value="a" />
    <h3>Result</h3>
    <pre class="result form-control" style="height:100%;"></pre>
</div>

<script src="https://cdnjs.cloudflare.com/ajax/libs/jmespath/0.16.0/jmespath.min.js" integrity="sha512-w/sNKK/59oJUi6v+SjgfIijrkFN8Pfv5QFZSV4KvrNMJrlbVM3017ZGNCA2AwZ6PKJzTPxQaDs/TbPcVGnF+pQ==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script>
    const app = document.getElementById('app');
    function evaluateDemo(el) {
        var data = JSON.parse(el.querySelector('.data').value);
        var expression = el.querySelector('.expression').value;
        var result = jmespath.search(data, expression);
        el.querySelector('.result').textContent = JSON.stringify(result, null, 2);
    }
    evaluateDemo(app);
    app.querySelector('.expression').addEventListener('input', () => evaluateDemo(app));
    app.querySelector('.data').addEventListener('input', () => evaluateDemo(app));
</script>

---

參考資料：

* [JMESPath 官方網站](https://jmespath.org/)
* [JMESPath 簡體中文網站](https://www.osgeo.cn/jmespath/)
* [JMESPath Filtering](https://mixedanalytics.com/knowledge-base/filter-specific-fields-values/)
* [MS Learn - 如何使用 JMESPath 查詢來查詢 Azure CLI 命令輸出](https://learn.microsoft.com/zh-tw/cli/azure/query-azure-cli?WT.mc_id=DT-MVP-5003022)
* [A Gentle Introduction to JMESPath — an intuitive way to parse JSON documents](https://medium.com/toyota-connected-india/a-gentle-introduction-to-jmespath-an-intuitive-way-to-parse-json-documents-daa6d699467a)
* [Ycombinator News - JMESPath](https://news.ycombinator.com/item?id=16400320)
