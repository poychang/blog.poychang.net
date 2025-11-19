---
title: Search
type: search
---
<script type="text/javascript">
  (function() {
    function getQueryVariable(variable) {
      var query = window.location.search.substring(1);
      var vars = query.split('&');
      for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (pair[0] === variable) {
          return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
        }
      }
    }

    var searchTerm = getQueryVariable('query');
    if (!searchTerm) return;

    var searchInput = document.getElementById('search-input');
    if (!searchInput) return;
  
    window.addEventListener('load', function() {
      searchInput.focus();
      searchInput.value = searchTerm;
    });

    // TODO: 目前還需要手動輸入一個字元才能觸發搜尋，之後可改進自動觸發
  })();
</script>