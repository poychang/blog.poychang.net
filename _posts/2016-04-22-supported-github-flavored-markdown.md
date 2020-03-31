---
layout: post
title: 有支援 Github Flavored 的 Markdown 語言
date: 2016-04-22 20:22
author: Poy Chang
comments: true
categories: [Tools, Develop]
---

使用 Markdown 來撰寫文件真的相當方便，不只可以快速地將文件結構組織起來，現在我更拿它來作筆記、寫部落格，像現在這篇文章就是使用 [Github Pages](https://pages.github.com/) 的服務，加上使用 [jekyll](https://jekyllrb.com/) 工具，然後搭配 Markdown 來寫文章，基本的語法可以參考 [Markdown 語法說明](http://markdown.tw/)。

然而在文章中常會放上程式碼，這時候如果有語法高亮，那就完美了！[Github Flavored](https://help.github.com/articles/creating-and-highlighting-code-blocks/) 就是提供這樣的功能，寫法也很簡單：

<pre>
```javascript
function foo() {
  var bar = '';
  if (bar === 'Awesome'){
    return true
  }
}
```
</pre>

上面這樣的寫法，透過 Github Flavored 的 highlighter-rouge 去渲染後，就會變成這樣： 

```javascript
function foo() {
  var bar = '';
  if (bar === 'Awesome'){
    return true
  }
}
```

是不是看起來更清楚了！而且 Github Flavored 支援超多種語言，參考下面的語言識別碼做設定：

<table class="table table-striped">
<thead>
  <tr>
    <th>Language</th>
    <th>IDs</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>ASP</td>
    <td>asax • ascx • ashx • asmx • asp • aspx • aspx-vb • axd •</td>
  </tr>
  <tr>
    <td>Assembly</td>
    <td>a51 • asm • assembly • nasm •</td>
  </tr>
  <tr>
    <td>C</td>
    <td>c • cats • h • idc • w •</td>
  </tr>
  <tr>
    <td>C#</td>
    <td>c# • cs • csharp • cshtml • csx •</td>
  </tr>
  <tr>
    <td>C++	</td>
    <td>c++ • cc • cp • cpp • cxx • h • h++ • hh • hpp • hxx • inl • ipp • tcc • tpp •</td>
  </tr>
  <tr>
    <td>CSS</td>
    <td>css •</td>
  </tr>
  <tr>
    <td>F#</td>
    <td>f# • fs • fsharp • fsi • fsx •</td>
  </tr>
  <tr>
    <td>Go</td>
    <td>go •</td>
  </tr>
  <tr>
    <td>HTML</td>
    <td>htm • html • html.hl • st • xht • xhtml •</td>
  </tr>
  <tr>
    <td>HTTP</td>
    <td>http •</td>
  </tr>
  <tr>
    <td>Jasmin</td>
    <td>j • jasmin •</td>
  </tr>
  <tr>
    <td>JavaScript</td>
    <td>_js • bones • es6 • frag • gs • jake • javascript • js • jsb • jsfl • jsm • jss • jsx • njs • node • pac • sjs • ssjs • sublime-build • sublime-commands • sublime-completions • sublime-keymap • sublime-macro • sublime-menu • sublime-mousemap • sublime-project • sublime-settings • sublime-theme • sublime-workspace • sublime_metrics • sublime_session • xsjs • xsjslib •</td>
  </tr>
  <tr>
    <td>JSON</td>
    <td>json • lock •</td>
  </tr>
  <tr>
    <td>Markdown</td>
    <td>markdown • md • mkd • mkdn • mkdown • ron •</td>
  </tr>
  <tr>
    <td>PHP</td>
    <td>aw • ctp • fcgi • inc • php • php3 • php4 • php5 • phpt •</td>
  </tr>
  <tr>
    <td>PLSQL</td>
    <td>pkb • pks • plb • pls • plsql • sql •</td>
  </tr>
  <tr>
    <td>PowerShell</td>
    <td>posh • powershell • ps1 • psd1 • psm1 •</td>
  </tr>
  <tr>
    <td>SCSS</td>
    <td>scss •</td>
  </tr>
  <tr>
    <td>Shell	</td>
    <td>bash • bats • cgi • command • fcgi • ksh • sh • shell • tmux • zsh •</td>
  </tr>
  <tr>
    <td>SQL</td>
    <td>cql • ddl • prc • sql • tab • udf • viw •</td>
  </tr>
  <tr>
    <td>Stylus</td>
    <td>styl • stylus •</td>
  </tr>
  <tr>
    <td>Text</td>
    <td>fr • text • txt •</td>
  </tr>
  <tr>
    <td>TypeScript</td>
    <td>ts • typescript •</td>
  </tr>
  <tr>
    <td>Visual Basic</td>
    <td>bas • cls • frm • frx • vb • vb.net • vba • vbhtml • vbnet • vbs • visual-basic •</td>
  </tr>
  <tr>
    <td>XML</td>
    <td>ant • axml • ccxml • clixml • cproject • csproj • ct • dita • ditamap • ditaval • dll.config • filters • fsproj • fxml • glade • grxml • ivy • jelly • kml • launch • mm • mxml • nproj • nuspec • osm • plist • pluginspec • ps1xml • psc1 • pt • rdf • rss • scxml • srdf • storyboard • sttheme • sublime-snippet • targets • tmcommand • tml • tmlanguage • tmpreferences • tmsnippet • tmtheme • ts • ui • urdf • vbproj • vcxproj • vxml • wsdl • wsf • wxi • wxl • wxs • x3d • xacro • xaml • xib • xlf • xliff • xmi • xml • xml.dist • xsd • xul • zcml •</td>
  </tr>
  <tr>
    <td>YAML</td>
    <td>reek • rviz • yaml • yml •</td>
  </tr>
</tbody>
</table>

更多資訊請參考以下的參考資料。

----------

參考資料：

* [GitHub Guides - Mastering Markdown](https://guides.github.com/features/mastering-markdown/)
* [List of supported languages and lexers](https://github.com/jneen/rouge/wiki/list-of-supported-languages-and-lexers)
* [github/linguist - languages.yml](https://github.com/github/linguist/blob/master/lib/linguist/languages.yml)
* [GitHub Flavored Markdown (GFM) language IDs](https://github.com/jmm/gfm-lang-ids/wiki/GitHub-Flavored-Markdown-(GFM)-language-IDs)
