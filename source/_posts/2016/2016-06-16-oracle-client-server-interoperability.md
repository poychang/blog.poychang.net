---
layout: post
title: Oracle Client/Server 支援對照表
date: 2016-06-16 11:00
author: Poy Chang
comments: true
categories: [SQL, Tools]
permalink: oracle-client-server-interoperability/
---

工作環境中有台歷史的資料庫，Oracle Database 8.1.7，這出生於 Windows 98 時代的資料庫，要跟他索取資料，那就一定要注意所使用的 Oracle Client 是否符合版本需求，不然你可是會得到 `Connections to this server version are no longer supported.` 這種令人沮喪的訊息。

一直以來在尋找 Oracle Client 和 Server 的對照表，到底我們的 Oracle Database 8.1.7 能夠支援到多新的 Oracle Client，這個問號藏在心中已久，今天終於找到答案了，就是下表。

<table border="1" width="100%">
    <tbody>
        <tr>
            <td></td>
            <td align="center" colspan="12"><strong>Server Version</strong></td>
        </tr>
        <tr>
            <td><strong>Client Version</strong></td>
            <td bgcolor="#E2EFD9">11.2.0</td>
            <td bgcolor="#E2EFD9">11.1.0</td>
            <td bgcolor="#FFF2CC">10.2.0</td>
            <td bgcolor="#FFF2CC">10.1.0</td>
            <td bgcolor="#FFF2CC">9.2.0</td>
            <td bgcolor="#DEEAF6">9.0.1</td>
            <td bgcolor="#DEEAF6">8.1.7</td>
            <td bgcolor="#DEEAF6">8.1.6</td>
            <td bgcolor="#DEEAF6">8.1.5</td>
            <td bgcolor="#DEEAF6">8.0.6</td>
            <td bgcolor="#DEEAF6">8.0.5</td>
            <td bgcolor="#DEEAF6">7.3.4</td>
        </tr>
        <tr>
            <td bgcolor="#E2EFD9">11.2.0</td>
            <td bgcolor="#E2EFD9">Yes</td>
            <td bgcolor="#E2EFD9">Yes</td>
            <td bgcolor="#FFF2CC">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#117" sl-processed="1">
              ES #7</a></td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FFF2CC">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#115" sl-processed="1">
              LES #5</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
        </tr>
        <tr>
            <td bgcolor="#E2EFD9">11.1.0</td>
            <td bgcolor="#E2EFD9">Yes</td>
            <td bgcolor="#E2EFD9">Yes</td>
            <td bgcolor="#FFF2CC">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#117" sl-processed="1">
              ES #7</a></td>
            <td bgcolor="#FFF2CC">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#116" sl-processed="1">
              ES #6</a></td>
            <td bgcolor="#FFF2CC">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#115" sl-processed="1">
              LES #5</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
        </tr>
        <tr>
            <td bgcolor="#FFF2CC">10.2.0</td>
            <td bgcolor="#FFF2CC">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#117" sl-processed="1">
              ES #7</a></td>
            <td bgcolor="#FFF2CC">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#117" sl-processed="1">
              ES #7</a></td>
            <td bgcolor="#FFF2CC">ES</td>
            <td bgcolor="#FFF2CC">ES</td>
            <td bgcolor="#FFF2CC">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#115" sl-processed="1">
              LES #5</a></td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
        </tr>
        <tr>
            <td bgcolor="#FFF2CC">10.1.0<a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">(#4)</a></td>
            <td bgcolor="#FFF2CC">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#116" sl-processed="1">
              ES #6</a></td>
            <td bgcolor="#FFF2CC">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#116" sl-processed="1">
              ES #6</a></td>
            <td bgcolor="#FFF2CC">ES</td>
            <td bgcolor="#FFF2CC">ES</td>
            <td bgcolor="#FFF2CC">LES</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#108" sl-processed="1">
              Was #2</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#109" sl-processed="1">
              No #3</a></td>
        </tr>
        <tr>
            <td bgcolor="#FFF2CC">9.2.0</td>
            <td bgcolor="#FFF2CC">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#115" sl-processed="1">
              LES #5</a></td>
            <td bgcolor="#FFF2CC">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#115" sl-processed="1">
              LES #5</a></td>
            <td bgcolor="#FFF2CC">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#115" sl-processed="1">
              LES #5</a></td>
            <td bgcolor="#FFF2CC">LES</td>
            <td bgcolor="#FFF2CC">LES</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#92" sl-processed="1">
              No #1</a></td>
        </tr>
        <tr>
            <td bgcolor="#DEEAF6">9.0.1</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#DEEAF6">Was</td>
        </tr>
        <tr>
            <td bgcolor="#DEEAF6">8.1.7</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
        </tr>
        <tr>
            <td bgcolor="#DEEAF6">8.1.6</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
        </tr>
        <tr>
            <td bgcolor="#DEEAF6">8.1.5</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
        </tr>
        <tr>
            <td bgcolor="#DEEAF6">8.0.6</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
        </tr>
        <tr>
            <td bgcolor="#DEEAF6">8.0.5</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
        </tr>
        <tr>
            <td bgcolor="#DEEAF6">7.3.4</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#FF9999">No</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
            <td bgcolor="#DEEAF6">Was</td>
        </tr>
    </tbody>
</table>

----------

<table border="1" style="width: 100%">
    <tbody>
        <tr bgcolor="#E2EFD9">
            <td>Yes</td>
            <td>Supported</td>
        </tr>
        <tr bgcolor="#FFF2CC">
            <td>LES</td>
            <td>Supported but fixes only possible for severity 1 issues for customers with
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#MAINT" sl-processed="1">Extended Support</a> . Limitations apply - see
                <a href="http://www.oracle.com/us/support/library/057419.pdf" sl-processed="1" target="_blank">click here for policy details for 9.2</a>.</td>
        </tr>
        <tr bgcolor="#FFF2CC">
            <td>ES</td>
            <td>Supported but fixes only possible for customers with
                <a href="https://support.oracle.com/CSP/main/article?cmd=show&amp;type=NOT&amp;doctype=BULLETIN&amp;id=207303.1&amp;addClickInfo=%3Cdata%20search_text=%22207303.1%22%20search_result_size=%2220%22%20search_result_count=%2220%22%20powerview_id=%22%22%20on_off=%22off%22%20item_position_in_list=%223%22/%3E#MAINT" sl-processed="1">Extended Support</a> .</td>
        </tr>
        <tr bgcolor="#DEEAF6">
            <td>Was</td>
            <td>Was a supported combination but one of the releases is no longer covered by any of Premier Support , Primary Error Correct support , Extended Support nor Extended Maintenance Support so fixes are no longer possible.</td>
        </tr>
        <tr bgcolor="#FF9999">
            <td>No</td>
            <td>Has never been Supported</td>
        </tr>
    </tbody>
</table>

----------

參考資料：

* [Oracle client version higher and lower than database version tips](http://www.dba-oracle.com/t_oracle_client_versions_higher_lower_database_release.htm)
