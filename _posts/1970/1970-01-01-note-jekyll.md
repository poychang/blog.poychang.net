---
layout: post
title: Jekyll 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Jekyll]
---

本篇作為書籤用途，紀錄網路上的 Jekyll 參考資料

## 跳脫大括號

{% raw %}
Jekyll 使用 [Liquid Variable](https://jekyllrb.com/docs/liquid/) 也就是使用雙大括號 `{{ variable }}` 或 `{% if statement %}` 來處理樣板，這會讓文章內容使用到這些符號的時候造成問題，這時候可以使用 `{% raw %}` 和 `{% endraw %}` 來告訴 Jekyll 這段落不要處理。

```
{% raw %}
content with liquid variable
{% endraw %}
```

REF: [Escaping double curly braces inside a markdown code block in Jekyll](https://stackoverflow.com/questions/24102498/escaping-double-curly-braces-inside-a-markdown-code-block-in-jekyll)
{% endraw %}

---

參考資料：

- [Azure Speed Test](http://azurespeedtest.azurewebsites.net/)
