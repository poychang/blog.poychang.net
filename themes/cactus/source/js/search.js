// A local search script with the help of
// [hexo-generator-search](https://github.com/PaicHyperionDev/hexo-generator-search)
// Copyright (C) 2015
// Joseph Pan <http://github.com/wzpan>
// Shuhao Mao <http://github.com/maoshuhao>
// This library is free software; you can redistribute it and/or modify
// it under the terms of the GNU Lesser General Public License as
// published by the Free Software Foundation; either version 2.1 of the
// License, or (at your option) any later version.
//
// This library is distributed in the hope that it will be useful, but
// WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// Lesser General Public License for more details.
//
// You should have received a copy of the GNU Lesser General Public
// License along with this library; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA
// 02110-1301 USA
//
// Modified by:
// Pieter Robberechts <http://github.com/probberechts>

/*exported searchFunc*/
var searchFunc = function(path, searchId, contentId) {
  window.__hexoSearchState = window.__hexoSearchState || {};
  var cacheKey = [path, searchId, contentId].join("::");
  var state = window.__hexoSearchState[cacheKey];

  if (state && state.initialized) {
    return;
  }

  if (!state) {
    state = window.__hexoSearchState[cacheKey] = {
      initialized: false,
      datas: null
    };
  }

  function stripHtml(html) {
    html = html.replace(/<style([\s\S]*?)<\/style>/gi, "");
    html = html.replace(/<script([\s\S]*?)<\/script>/gi, "");
    html = html.replace(/<figure([\s\S]*?)<\/figure>/gi, "");
    html = html.replace(/<\/div>/ig, "\n");
    html = html.replace(/<\/li>/ig, "\n");
    html = html.replace(/<li>/ig, "  *  ");
    html = html.replace(/<\/ul>/ig, "\n");
    html = html.replace(/<\/p>/ig, "\n");
    html = html.replace(/<br\s*[\/]?>/gi, "\n");
    html = html.replace(/<[^>]+>/ig, "");
    return html;
  }

  function getAllCombinations(keywords) {
    var i, j, result = [];

    for (i = 0; i < keywords.length; i++) {
        for (j = i + 1; j < keywords.length + 1; j++) {
            result.push(keywords.slice(i, j).join(" "));
        }
    }
    return result;
  }

  function showLoadError(message) {
    var $resultContent = document.getElementById(contentId);
    var $noResult = document.querySelector(".search-no-result");

    if ($noResult) {
      $noResult.style.display = "none";
    }

    if ($resultContent) {
      $resultContent.innerHTML = "<p class=\"search-result\">" + message + "</p>";
    }
  }

  function buildSnippet(content, firstOccur) {
    var radius = 50;
    var start = Math.max(0, firstOccur - radius);
    var end = Math.min(content.length, firstOccur + radius);
    var snippet = content.substring(start, end);

    if (start > 0) {
      snippet = "..." + snippet;
    }

    if (end < content.length) {
      snippet += "...";
    }

    return snippet;
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function bindSearch(datas) {
    var $input = document.getElementById(searchId);
    if (!$input) { return; }
    var $resultContent = document.getElementById(contentId);
    if (!$resultContent) { return; }
    var $noResult = document.querySelector(".search-no-result");

    function handleInput() {
      var resultList = [];
      var keywords = getAllCombinations(this.value.trim().toLowerCase().split(" "))
        .sort(function(a,b) { return b.split(" ").length - a.split(" ").length; });
      var highlightKeywords = keywords
        .filter(function(keyword) { return keyword.length > 0; })
        .map(escapeRegExp);
      $resultContent.innerHTML = "";
      if ($noResult) {
        $noResult.style.display = "none";
      }
      if (this.value.trim().length <= 0) {
        return;
      }
      // perform local searching
      datas.forEach(function(data) {
        var titleMatches = 0;
        var contentMatches = 0;
        if (!data.title || data.title.trim() === "") {
          data.title = "Untitled";
        }
        var dataTitle = data.title.trim();
        var dataTitleLowerCase = dataTitle.toLowerCase();
        var dataContent = stripHtml(data.content.trim());
        var dataContentLowerCase = dataContent.toLowerCase();
        var dataUrl = data.url.startsWith('//') ? data.url.substring(1) : data.url;
        var indexTitle = -1;
        var indexContent = -1;
        var firstOccur = -1;
        keywords.forEach(function(keyword) {
          indexTitle = dataTitleLowerCase.indexOf(keyword);
          if (dataContent !== "") {
            indexContent = dataContentLowerCase.indexOf(keyword);
          } else {
            indexContent = -1;
          }

          if( indexTitle >= 0 || indexContent >= 0 ){
            if (indexTitle >= 0) {
              titleMatches += 1;
            }
            if (indexContent >= 0) {
              contentMatches += 1;
            }
            if (indexContent >= 0 && firstOccur < 0) {
              firstOccur = indexContent;
            }
          }
        });
        // show search results
        if (titleMatches > 0 || contentMatches > 0) {
          var searchResult = {};
          searchResult.rank = (titleMatches * 1000) + (contentMatches * 10);
          searchResult.titleMatches = titleMatches;
          searchResult.contentMatches = contentMatches;
          searchResult.firstOccur = firstOccur < 0 ? Number.MAX_SAFE_INTEGER : firstOccur;
          searchResult.str = "<li><a href='"+ dataUrl +"' class='search-result-title'>"+ dataTitle +"</a>";
          if (firstOccur >= 0) {
            var matchContent = buildSnippet(dataContent, firstOccur);

            // highlight all keywords
            if (highlightKeywords.length > 0) {
              var regS = new RegExp(highlightKeywords.join("|"), "gi");
              matchContent = matchContent.replace(regS, function(keyword) {
                return "<em class=\"search-keyword\">"+keyword+"</em>";
              });
            }

            searchResult.str += "<p class=\"search-result\">" + matchContent +"</p>";
          }
          searchResult.str += "</li>";
          resultList.push(searchResult);
        }
      });
      if (resultList.length) {
        resultList.sort(function(a, b) {
            if (b.rank !== a.rank) {
              return b.rank - a.rank;
            }
            if (b.titleMatches !== a.titleMatches) {
              return b.titleMatches - a.titleMatches;
            }
            if (b.contentMatches !== a.contentMatches) {
              return b.contentMatches - a.contentMatches;
            }
            return a.firstOccur - b.firstOccur;
        });
        var result ="<ul class=\"search-result-list\">";
        for (var i = 0; i < resultList.length; i++) {
          result += resultList[i].str;
        }
        result += "</ul>";
        $resultContent.innerHTML = result;
      } else if ($noResult) {
        $noResult.style.display = "block";
      }
    }
    $input.addEventListener("input", handleInput);
    if ($input.value.trim().length > 0) {
      handleInput.call($input);
    }
    state.initialized = true;
  }

  if (state.datas) {
    bindSearch(state.datas);
    return;
  }

  $.ajax({
    url: path,
    dataType: "xml",
    success: function(xmlResponse) {
      // get the contents from search data
      state.datas = $("entry", xmlResponse).map(function() {
        return {
          title: $("title", this).text(),
          content: $("content", this).text(),
          url: $("link", this).attr("href")
        };
      }).get();

      bindSearch(state.datas);
    },
    error: function(jqXHR, textStatus, errorThrown) {
      var errorMessage = errorThrown || textStatus || "unknown error";

      console.error("Failed to load search index from " + path + ":", errorMessage);
      showLoadError("Search index failed to load. Please refresh the page and try again.");
    }
  });
};
