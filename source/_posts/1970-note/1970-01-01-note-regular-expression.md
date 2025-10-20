---
layout: post
title: 正規表示式 Regular Expression
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note]
permalink: note-regular-expression/
---

正規表示式通常被稱為一個模式（pattern），為用來描述或者符合一系列符合某個句法規則的字串，透過他我們可以快速搜尋符合指定模式的文字。

## 工具網站

- [iHateRegex](https://ihateregex.io/) 查詢常用的正規表示式
- [RegExr - Regular Expression Online](http://regexr.com/) 線上測試正規表示式
- [JavaScript Regular Expression Visualizer](https://jex.im/regulex/) 視覺化呈現正規表示式的規則路徑
- [Pyrexp - Python Regex Tester](https://pythonium.net/regex) 正規表示式的可視化測試工具

## 效能

正規表示式可以幫助我們快速找到符合文字模式的字串，但執行效率未必"快速"，不精確的寫法還是很容易造成效能低落的問題。

以 C# 為例，有幾個提升效率的注意事項：

### 能使用靜態全域變數時盡量用

如下寫法，透過設定 `RegexOptions.Compiled` 可將該正規表達式編譯並成程式集，這設定雖然會增加啟動時間，但重複使用時，會有更好的執行速度。

```
readonly static Regex regex = new Regex("[ABC]", RegexOptions.Compiled);
```

另外還有一些設定項，可以參考看看，但不確定是否影響執行速度：

- `RegexOptions.IgnoreCase` 不區分大小寫，只限用在英文字
- `RegexOptions.Multiline` 多行模式
- `RegexOptions.Singleline` 單行模式

### 小技巧

- 善用 `^` 標示起始位置，如 `Regex("^Abc")` 只會找 `Abc` 開頭的字串，而 `aAbc` 就忽略
- 善用 `\b` 偵測字元邊界，和 `^` 意思很類似
- 善用 `.*?` 忽略後續字串，如 `Regex("^A.*?")` 只比對字串第一個字是否為 `A`，後面忽略

## 正規表示式說明

<table class="table table-striped">
  <thead>
    <tr>
      <th>正規表示式</th>
      <th>說明及範例</th>
      <th>比對不成立之字串</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>/a/</td>
      <td width="230">含字母 &#8220;a&#8221; 的字串，例如 &#8220;ab&#8221;, &#8220;bac&#8221;, &#8220;cba&#8221;</td>
      <td>&#8220;xyz&#8221;</td>
    </tr>
    <tr>
      <td>/a./</td>
      <td width="230">含字母 &#8220;a&#8221; 以及其後任一個字元的字串，例如 &#8220;ab&#8221;, &#8220;bac&#8221;（若要比對.，請使用 \.）</td>
      <td>&#8220;a&#8221;, &#8220;ba&#8221;</td>
    </tr>
    <tr>
      <td>/^xy/</td>
      <td width="230">以 &#8220;xy&#8221; 開始的字串，例如 &#8220;xyz&#8221;, &#8220;xyab&#8221;（若要比對 ^，請使用 \^）</td>
      <td>&#8220;axy&#8221;, &#8220;bxy&#8221;</td>
    </tr>
    <tr>
      <td>/xy$/</td>
      <td width="230">以 &#8220;xy&#8221; 結尾的字串，例如 &#8220;axy&#8221;, &#8220;abxy&#8221;以 &#8220;xy&#8221; 結尾的字串，例如 &#8220;axy&#8221;, &#8220;abxy&#8221; （若要比對 $，請使用 \$）</td>
      <td>&#8220;xya&#8221;, &#8220;xyb&#8221;</td>
    </tr>
    <tr>
      <td>[13579]</td>
      <td width="230">包含 &#8220;1&#8221; 或 &#8220;3&#8221; 或 &#8220;5&#8221; 或 &#8220;7&#8221; 或 &#8220;9&#8221; 的字串，例如：&#8221;a3b&#8221;, &#8220;1xy&#8221;</td>
      <td>&#8220;y2k&#8221;</td>
    </tr>
    <tr>
      <td>[0-9]</td>
      <td>含數字之字串</td>
      <td>不含數字之字串</td>
    </tr>
    <tr>
      <td>[a-z0-9]</td>
      <td>含數字或小寫字母之字串</td>
      <td>不含數字及小寫字母之字串</td>
    </tr>
    <tr>
      <td>[a-zA-Z0-9]</td>
      <td>含數字或字母之字串</td>
      <td>不含數字及字母之字串</td>
    </tr>
    <tr>
      <td>b[aeiou]t</td>
      <td>&#8220;bat&#8221;, &#8220;bet&#8221;, &#8220;bit&#8221;, &#8220;bot&#8221;, &#8220;but&#8221;</td>
      <td>&#8220;bxt&#8221;, &#8220;bzt&#8221;</td>
    </tr>
    <tr>
      <td>[^0-9]</td>
      <td>不含數字之字串（若要比對 ^，請使用 \^）</td>
      <td>含數字之字串</td>
    </tr>
    <tr>
      <td>[^aeiouAEIOU]</td>
      <td>不含母音之字串（若要比對 ^，請使用 \^）</td>
      <td>含母音之字串</td>
    </tr>
    <tr>
      <td>[^\^]</td>
      <td>不含 &#8220;^&#8221; 之字串，例如 &#8220;xyz&#8221;, &#8220;abc&#8221;</td>
      <td>&#8220;xy^&#8221;, &#8220;a^bc&#8221;</td>
    </tr>
  </tbody>
</table>
<br>
<table class="table table-striped">
  <thead>
    <tr>
      <th>正規表示式的特定字元</th>
      <th>說明</th>
      <th>等效的正規表示式</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>\d</td>
      <td><mark>數字</mark></td>
      <td>[0-9]</td>
    </tr>
    <tr>
      <td>\D</td>
      <td>非數字</td>
      <td>[^0-9]</td>
    </tr>
    <tr>
      <td>\w</td>
      <td><mark>數字、字母、底線</mark></td>
      <td>[a-zA-Z0-9_]</td>
    </tr>
    <tr>
      <td>\W</td>
      <td>非 \w</td>
      <td>[^a-zA-Z0-9_]</td>
    </tr>
    <tr>
      <td>\s</td>
      <td>空白字元</td>
      <td>[ \r\t\n\f]</td>
    </tr>
    <tr>
      <td>\S</td>
      <td>非空白字元</td>
      <td>[^ \r\t\n\f]</td>
    </tr>
  </tbody>
</table>
<br>
<table class="table table-striped">
  <thead>
    <tr>
      <th>正規表示式</th>
      <th>說明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>/a?/</td>
      <td>零或一個 a（若要比對? 字元，請使用 \?）</td>
    </tr>
    <tr>
      <td>/a+/</td>
      <td>一或多個 a（若要比對+ 字元，請使用 \+）</td>
    </tr>
    <tr>
      <td>/a*/</td>
      <td>零或多個 a（若要比對* 字元，請使用 \*）</td>
    </tr>
    <tr>
      <td>/a{4}/</td>
      <td>四個 a</td>
    </tr>
    <tr>
      <td>/a{5,10}/</td>
      <td>五至十個 a</td>
    </tr>
    <tr>
      <td>/a{5,}/</td>
      <td>至少五個 a</td>
    </tr>
    <tr>
      <td>/a{,3}/</td>
      <td>至多三個 a</td>
    </tr>
    <tr>
      <td>/a.{5}b/</td>
      <td>a 和 b中間夾五個（非換行）字元</td>
    </tr>
  </tbody>
</table>
<br>
<table class="table table-striped">
  <thead>
    <tr>
      <th>字元</th>
      <th>說明</th>
      <th>簡單範例</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>\</td>
      <td>避開<a href="https://stackoverflow.com/questions/399078/what-special-characters-must-be-escaped-in-regular-expressions?answertab=active#tab-top">特殊字元</a></td>
      <td>/A\*/ 可用於比對 &#8220;A*&#8221;，其中 * 是一個特殊字元，為避開其特殊意義，所以必須加上 &#8220;\&#8221;</td>
    </tr>
    <tr>
      <td>^</td>
      <td>比對輸入列的啟始位置</td>
      <td>/^A/ 可比對 &#8220;Abcd&#8221; 中的 &#8220;A&#8221;，但不可比對 &#8220;aAb&#8221;</td>
    </tr>
    <tr>
      <td>$</td>
      <td>比對輸入列的結束位置</td>
      <td>/A$/ 可比對 &#8220;bcdA&#8221; 中的 &#8220;A&#8221;，但不可比對 &#8220;aAb&#8221;</td>
    </tr>
    <tr>
      <td>*</td>
      <td>比對前一個字元零次或更多次</td>
      <td>/bo*/ 可比對 &#8220;Good boook&#8221; 中的 &#8220;booo&#8221;，亦可比對 &#8220;Good bk&#8221; 中的 &#8220;b&#8221;</td>
    </tr>
    <tr>
      <td>+</td>
      <td>比對前一個字元一次或更多次，等效於 {1,}</td>
      <td>/a+/ 可比對 &#8220;caaandy&#8221; 中的 &#8220;aaa&#8221;，但不可比對 &#8220;cndy&#8221;</td>
    </tr>
    <tr>
      <td>?</td>
      <td>比對前一個字元零次或一次</td>
      <td>/e?l/ 可比對 &#8220;angel&#8221; 中的 &#8220;el&#8221;，也可以比對 &#8220;angle&#8221; 中的 &#8220;l&#8221;</td>
    </tr>
    <tr>
      <td>.</td>
      <td><mark>比對任何一個字元（但換行符號不算）</mark></td>
      <td>/.n/ 可比對 &#8220;nay, an apple is on the tree&#8221; 中的 &#8220;an&#8221; 和 &#8220;on&#8221;，但不可比對 &#8220;nay&#8221;</td>
    </tr>
    <tr>
      <td>(x)</td>
      <td>比對 x 並將符合的部分存入一個變數</td>
      <td>/(a*) and (b*)/ 可比對 &#8220;aaa and bb&#8221; 中的 &#8220;aaa&#8221; 和 &#8220;bb&#8221;，並將這兩個比對得到的字串設定至變數 RegExp.$1 和 RegExp.$2。</td>
    </tr>
    <tr>
      <td>xy</td>
      <td>比對 x 或 y</td>
      <td>/a*b*/g 可比對 &#8220;aaa and bb&#8221; 中的 &#8220;aaa&#8221; 和 &#8220;bb&#8221;</td>
    </tr>
    <tr>
      <td>{n}</td>
      <td>比對前一個字元 n 次，n 為一個正整數</td>
      <td>/a{3}/ 可比對 &#8220;lllaaalaa&#8221; 其中的 &#8220;aaa&#8221;，但不可比對 &#8220;aa&#8221;</td>
    </tr>
    <tr>
      <td>{n,}</td>
      <td>比對前一個字元至少 n 次，n 為一個正整數</td>
      <td>/a{3,}/ 可比對 &#8220;aa aaa aaaa&#8221; 其中的 &#8220;aaa&#8221; 及 &#8220;aaaa&#8221;，但不可比對 &#8220;aa&#8221;</td>
    </tr>
    <tr>
      <td>{n,m}</td>
      <td>比對前一個字元至少 n 次，至多 m 次，m、n 均為正整數</td>
      <td>/a{3,4}/ 可比對 &#8220;aa aaa aaaa aaaaa&#8221; 其中的 &#8220;aaa&#8221; 及 &#8220;aaaa&#8221;，但不可比對 &#8220;aa&#8221; 及 &#8220;aaaaa&#8221;</td>
    </tr>
    <tr>
      <td>[xyz]</td>
      <td>比對中括弧內的任一個字元</td>
      <td>/[ecm]/ 可比對 &#8220;welcome&#8221; 中的 &#8220;e&#8221; 或 &#8220;c&#8221; 或 &#8220;m&#8221;</td>
    </tr>
    <tr>
      <td>[^xyz]</td>
      <td>比對不在中括弧內出現的任一個字元</td>
      <td>/[^ecm]/ 可比對 &#8220;welcome&#8221; 中的 &#8220;w&#8221;、&#8221;l&#8221;、&#8221;o&#8221;，可見出其與 [xyz] 功能相反。（同時請注意 /^/ 與 [^] 之間功能的不同。）</td>
    </tr>
    <tr>
      <td>[\b]</td>
      <td>比對退位字元（Backspace character）</td>
      <td>可以比對一個 backspace ，也請注意 [\b] 與 \b 之間的差別</td>
    </tr>
    <tr>
      <td>\b</td>
      <td>比對英文字的邊界，例如空格</td>
      <td>例如 /\bn\w/ 可以比對 &#8220;noonday&#8221; 中的 &#8220;no&#8221;<br />
      /\wy\b/ 可比對 &#8220;possibly yesterday.&#8221; 中的 &#8220;ly&#8221;</td>
    </tr>
    <tr>
      <td>\B</td>
      <td>比對非「英文字的邊界」</td>
      <td>例如, /\w\Bn/ 可以比對 &#8220;noonday&#8221; 中的 &#8220;on&#8221;<br />
      另外 /y\B\w/ 可以比對 &#8220;possibly yesterday.&#8221; 中的 &#8220;ye&#8221;</td>
    </tr>
    <tr>
      <td>\cX</td>
      <td>比對控制字元（Control character），其中 X 是一個控制字元</td>
      <td>/\cM/ 可以比對 一個字串中的 control-M</td>
    </tr>
    <tr>
      <td>\d</td>
      <td>比對任一個數字，等效於 [0-9]</td>
      <td>/[\d]/ 可比對 由 &#8220;0&#8221; 至 &#8220;9&#8221; 的任一數字 但其餘如字母等就不可比對</td>
    </tr>
    <tr>
      <td>\D</td>
      <td>比對任一個非數字，等效於 [^0-9]</td>
      <td>/[\D]/ 可比對 &#8220;w&#8221; &#8220;a&#8221;&#8230; 但不可比對如 &#8220;7&#8221; &#8220;1&#8221; 等數字</td>
    </tr>
    <tr>
      <td>\f</td>
      <td>比對 form-feed</td>
      <td>若是在文字中有發生 &#8220;換頁&#8221; 的行為 則可以比對成功</td>
    </tr>
    <tr>
      <td>\n</td>
      <td>比對換行符號</td>
      <td>若是在文字中有發生 &#8220;換行&#8221; 的行為 則可以比對成功</td>
    </tr>
    <tr>
      <td>\r</td>
      <td>比對 carriage return</td>
      <td></td>
    </tr>
    <tr>
      <td>\s</td>
      <td>比對任一個空白字元（White space character），等效於 [ \f\n\r\t\v]</td>
      <td>/\s\w*/ 可比對 &#8220;A b&#8221; 中的 &#8220;b&#8221;</td>
    </tr>
    <tr>
      <td>\S</td>
      <td>比對任一個非空白字元，等效於 [^ \f\n\r\t\v]</td>
      <td>/\S/\w* 可比對 &#8220;A b&#8221; 中的 &#8220;A&#8221;</td>
    </tr>
    <tr>
      <td>\t</td>
      <td>比對定位字元（Tab）</td>
      <td></td>
    </tr>
    <tr>
      <td>\v</td>
      <td>比對垂直定位字元（Vertical tab）</td>
      <td></td>
    </tr>
    <tr>
      <td>\w</td>
      <td>比對數字字母字元（Alphanumerical characters）或底線字母（&#8220;_&#8221;），等效於 [A-Za-z0-9_]</td>
      <td>/\w/ 可比對 &#8220;.A _!9&#8221; 中的 &#8220;A&#8221;、&#8220;_&#8221;、&#8220;9&#8221;。</td>
    </tr>
    <tr>
      <td>\W</td>
      <td>比對非「數字字母字元或底線字母」，等效於 [^A-Za-z0-9_]</td>
      <td>/\W/ 可比對 &#8220;.A _!9&#8221; 中的 &#8220;.&#8221;、&#8220; &#8221;、&#8220;!&#8221;，可見其功能與 /\w/ 恰好相反。</td>
    </tr>
    <tr>
      <td>\o<em>octal</em></td>
      <td>比對八進位，其中<em>octal<em>是八進位數目 </em></em></td>
      <td>/\oocetal123/ 可比對 與 八進位的ASCII中 &#8220;123&#8221; 所相對應的字元值。</td>
    </tr>
    <tr>
      <td>\x<em>hex</em></td>
      <td>比對十六進位，其中<em>hex<em>是十六進位數目 </em></em></td>
      <td>/\xhex38/ 可比對 與 16進位的ASCII中 &#8220;38&#8221; 所相對應的字元。</td>
    </tr>
    <tr>
      <td>?:</td>
      <td>不予擷取的群組，括號括住的部份不列入 Group 中</td>
      <td>(a(b*))+ 會有 Group#1 和 Group#2 但是 (a(?:b*))+ 只會有 Group#1 一個群組</td>
    </tr>
  </tbody>
</table>

REF:

- [不予擷取的群組](https://dotblogs.com.tw/johnny/2010/03/02/13855)

## 常用範例

- IPv4

```regex
/^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))*$/
```

- MAC
  _ IEEE 802 MAC-48 標準格式
  _ 6 組由 `:` 或 `-` 做區隔的雙位數 16 進制數字

```
/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/
```

- 驗證使用者帳號，第一個字不為數字，只接受 大小寫字母、數字及底線

```regex
/^[a-zA-Z]\w*$/
```

- 密碼
  _ 高強度密碼，6 位數以上，並且至少包含**大寫字母**、**小寫字母**、**數字**、**符號**各一
  _ 若需要調整，將其對應的小括號內容拿掉即可

```regex
/^(?=.*[^a-zA-Z0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{6,}$/
```

- 電子郵件，以下的範例並沒有相容 RFC5322 規範，但是已經可以驗證大多數的電子郵件

```regex
/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/
```

- URL 網址，允許 http, https, ftp 協定，並且可取出 Protocol, Domain, Path, Query

```regex
/^(?:(https?|ftp):\/\/)?((?:[a-zA-Z0-9.\-]+\.)+(?:[a-zA-Z0-9]{2,4}))((?:/[\w+=%&.~\-]*)*)\??([\w+=%&.~\-]*)$/
```

- 主流信用卡

```regex
/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6011[0-9]{12}|622((12[6-9]|1[3-9][0-9])|([2-8][0-9][0-9])|(9(([0-1][0-9])|(2[0-5]))))[0-9]{10}|64[4-9][0-9]{13}|65[0-9]{14}|3(?:0[0-5]|[68][0-9])[0-9]{11}|3[47][0-9]{13})*$/
```

- 美國運通信用卡

```regex
/^(3[47][0-9]{13})*$/
```

- MasterCard

```regex
/^(5[1-5][0-9]{14})*$/
```

- Visa 卡

```regex
/^(4[0-9]{12}(?:[0-9]{3})?)*$/
```

- 日期 (MM/DD/YYYY)

```regex
/^((0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01])[- /.](19|20)?[0-9]{2})*$/
```

- 日期 (YYYY/MM/DD)

```regex
/^(((?:19|20)[0-9]{2})[- /.](0?[1-9]|1[012])[- /.](0?[1-9]|[12][0-9]|3[01]))*$/
```

- 台灣手機號碼

```regex
/^09\d{2}-?\d{3}-?\d{3}$/
```

- 中文 (Unicode)

```regex
[\u4e00-\u9fa5]
```

- 簡易驗證台灣身份證，仍然需要一些進階的檢查，如*驗證檢查碼*，或前往[內政部戶政司](http://www.ris.gov.tw/zh_TW/307)驗證

```regex
/^[A-Za-z][1-2]\d{8}$/
```

- 正整數

```regex
/^\+?\d+$/
```

- 整數

```regex
/^[+-]?\d+$/
```

- float

```regex
/^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/
```

---

參考資料：

- [RegExr - Regular Expression Online](http://regexr.com/)
- [就是愛程式 - 正規表示式 Regular Expression](https://atedev.wordpress.com/2007/11/23/%E6%AD%A3%E8%A6%8F%E8%A1%A8%E7%A4%BA%E5%BC%8F-regular-expression/)
- [A Single Page Perl Regular Expression Quick Reference](http://www.erudil.com/pdf/preqr.pdf)
- [What special characters must be escaped in regular expressions?](https://stackoverflow.com/questions/399078/what-special-characters-must-be-escaped-in-regular-expressions?answertab=active#tab-top)
- [JavaScript Regular Expression Visualizer](https://jex.im/regulex/)
- [i Hate Regex](https://ihateregex.io/)
