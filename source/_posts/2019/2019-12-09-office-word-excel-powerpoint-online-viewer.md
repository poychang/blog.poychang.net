---
layout: post
title: 快速在網頁上預覽 Office 檔案
date: 2019-12-9 17:50
author: Poy Chang
comments: true
categories: [WebAPI, Develop, Tools]
permalink: office-word-excel-powerpoint-online-viewer/
---

在網頁上預覽檔案的需求越來越常見，尤其是 Office 類型的檔案，使用者希望能在不用另存檔案的情況下，直接在網頁上預覽，過去比較常見的對應方式是將 Office 檔案轉成 PDF 檔，在透過 [PDF.js](https://mozilla.github.io/pdf.js/) 或其他 JavaScript 函示庫來處理，但缺點就在於要先將 Office 檔案轉成 PDF 才能呈現，這裡提供兩種方式，讓你能在網頁上快速成預覽 Office 檔案。


## Microsoft Office Viewer

在 2013 年的時候，Microsoft 就已經推出 Office Web Viewer 服務，只要檔案是在 Internet 上可以被存取到的，就可以讓使用者僅透過瀏覽器就預覽 Office 檔案，用法非常簡單，只要在下面網址，並在 `src=` 後面加上檔案的 URL 位置即可：

```
https://view.officeapps.live.com/op/view.aspx?src=
```

例如我有個 Word 檔網址是 `https://github.com/poychang/blog.poychang.net/raw/master/assets/post-files/THIS-IS-WORD.docx`，你的預覽網址便是長這樣 `https://view.officeapps.live.com/op/view.aspx?src=https://github.com/poychang/blog.poychang.net/raw/master/assets/post-files/THIS-IS-WORD.docx`，直接連到此網址結果如下：

![Microsoft Office Viewer 預覽 Word 文件](https://i.imgur.com/Uq0rk0y.png)

直接透過 Office Online 的服務，輕鬆又快速的在瀏覽器上預覽 Office 檔案，而且如果你想要鑲嵌在自己的網頁上，可以透過下面網址，並在 `src=` 後面加上檔案的 URL 位置，在搭配 `iframe` 即可：

```
https://view.officeapps.live.com/op/embed.aspx?src=
```

搭配 `iframe` 來呈現的範例如下：

```html
<iframe
    src='https://view.officeapps.live.com/op/embed.aspx?src=https://github.com/poychang/blog.poychang.net/raw/master/assets/post-files/THIS-IS-WORD.docx'
    width='500px' height='300px' frameborder='0'>
    This is an embedded <a target='_blank' href='http://office.com'>Microsoft Office</a> document, powered by <a target='_blank' href='http://office.com/webapps'>Office Online</a>.
</iframe>
```

Microsoft Office Viewer 支援的檔案格式有下面這幾種，基本上只支援 Office 家族的檔案格式：

- Word: .DOCX, .DOCM, .DOTM, .DOTX, .DOC
- Excel: .XLSX, .XLSB, .XLS, .XLSM
- PowerPoint: .PPTX, .PPSX, .PPT, .PPS, .PPTM, .POTM, .PPAM, .POTX, .PPSM

另外這免費 Office Online 服務會有一些限制，例如檔案大小不能超過 10 MB，如果你有自己架設的 Office Web Apps Server，你應該可以透過修改其設定來達到更廣泛的支援。

## Google Docs Viewer

除了 Microsoft 以提供瀏覽器預覽的服務外，Google 也有相同的服務存在，如果你有使用 Gmail 了話，該郵件服務所使用的附件預覽功能，便是使用 Google Docs Viewer 這個服務。

這個服務在使用上也相當簡單，透過下面網址，並在 `src=` 後面加上檔案的 URL 位置即可：

```
https://docs.google.com/viewer?url=
```

![Google Docs Viewer 預覽 Word 文件](https://i.imgur.com/Z1nckmH.png)

這個服務支援的檔案類型就不限於 Office 家族的檔案類型，而檔案大小必須在 25MB 以下，所支援的檔案類型請參考以下列表：

- Image files (.JPEG, .PNG, .GIF, .TIFF, .BMP)
- Video files (WebM, .MPEG4, .3GPP, .MOV, .AVI, .MPEGPS, .WMV, .FLV)
- Text files (.TXT)
- Markup/Code (.CSS, .HTML, .PHP, .C, .CPP, .H, .HPP, .JS)
- Microsoft Word (.DOC and .DOCX)
- Microsoft Excel (.XLS and .XLSX)
- Microsoft PowerPoint (.PPT and .PPTX)
- Adobe Portable Document Format (.PDF)
- Apple Pages (.PAGES)
- Adobe Illustrator (.AI)
- Adobe Photoshop (.PSD)
- Tagged Image File Format (.TIFF)
- Autodesk AutoCad (.DXF)
- Scalable Vector Graphics (.SVG)
- PostScript (.EPS, .PS)
- TrueType (.TTF)
- XML Paper Specification (.XPS)
- Archive file types (.ZIP and .RAR)

## 測試範例

上面兩種使用方式都很簡單，範例可以參考這個網址 [https://blog.poychang.net/apps/online-docs-viewer/](https://blog.poychang.net/apps/online-docs-viewer/)，可以體驗看看至兩個服務的效果如何。

完整範例程式碼請參考 [poychang/demo-online-docs-viewer](https://github.com/poychang/demo-online-docs-viewer)。

----------

參考資料：

- [Office Web Viewer：在瀏覽器中查看 Office 文檔](https://blogs.technet.microsoft.com/office_chs/2013/05/08/office-web-viewer-office/)
- [Get started with Office for the web in Office 365](https://support.office.com/en-us/article/get-started-with-office-for-the-web-in-office-365-5622c7c9-721d-4b3d-8cb9-a7276c2470e5)
- [Online Doc Viewer](https://stackoverflow.com/questions/39630273/online-doc-viewer)
- [How do I render a Word document (.doc, .docx) in the browser using JavaScript?](https://stackoverflow.com/questions/27957766/how-do-i-render-a-word-document-doc-docx-in-the-browser-using-javascript)
