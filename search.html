---
layout: page
title: Search
---

<div class="col-md-12 col-sm-12 col-xs-12">
    <ul class="list-unstyled" id="search-results"></ul>
</div>

<div class="col-md-12 col-sm-12 col-xs-12" style="visibility:hidden">
    <form action="/search" method="get">
        <input type="text" id="search-box" name="query" placeholder="keyword...">
        <input type="submit" value="GO">
    </form>
</div>

<div class="clearfix"></div>

<script>
    window.store = {
        {% for post in site.posts %}
            "{{ post.url | slugify }}": {
                "title": "{{ post.title | xml_escape }}",
                "date": "{{ post.date | xml_escape }}",
                "author": "{{ post.author | xml_escape }}",
                "category": "{{ post.category | xml_escape }}",
                "content": {{ post.content | strip_html | strip_newlines | jsonify }},
                "url": "{{ post.url | xml_escape }}"
            }
            {% unless forloop.last %},{% endunless %}
        {% endfor %}
    };
</script>
<script src="/assets/js/lunr.min.js"></script>
<script src="/assets/js/search.js"></script>
