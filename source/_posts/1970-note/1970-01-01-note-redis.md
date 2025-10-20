---
layout: post
title: Redis 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Note, Develop]
permalink: note-redis/
---

本篇作為筆記用途，紀錄 Redis 參考資料

## StackExchange.Redis - Configuration

REF: [StackExchange.Redis - Configuration](https://stackexchange.github.io/StackExchange.Redis/Configuration.html)

## Redis 命令参考

REF: [Redis 命令参考](http://redisdoc.com/)

## Error Code 說明

- REF: [ASP.NET Thread Pool 與 Redis Timeout Exception](https://blog.marsen.me/2016/11/21/aspdotnet_threadpool_and_redis/)
- REF: [Investigating timeout exceptions in StackExchange.Redis for Azure Redis Cache](https://azure.microsoft.com/zh-tw/blog/investigating-timeout-exceptions-in-stackexchange-redis-for-azure-redis-cache/)

```
System.TimeoutException: Timeout performing MGET 2728cc84-58ae-406b-8ec8-3f962419f641,
inst: 1,mgr: Inactive, queue: 73, qu=6, qs=67, qc=0, wr=1/1, in=0/0
```

<table class="table table-striped">
<thead>
  <tr>
    <th>Error code</th>
    <th>Details</th>
    <th>範例</th>
    <th>說明</th>
  </tr>
</thead>
<tbody>
  <tr>
    <td>inst</td>
    <td>in the last time slice: 0 commands have been issued</td>
    <td>在最後時脈：已發出 0 個命令</td>
    <td>最後的時脈發出的命令個數</td>
  </tr>
  <tr>
    <td>mgr</td>
    <td>the socket manager is performing “socket.select”, which means it is asking the OS to indicate a socket that has something to do; basically: the reader is not actively reading from the network because it doesn’t think there is anything to do</td>
    <td></td>
    <td>最後的操作命令</td>
  </tr>
  <tr>
    <td>queue</td>
    <td>there are 73 total in-progress operations</td>
    <td>73 個正在排隊中的操作</td>
    <td>正在排隊中的操作</td>
  </tr>
  <tr>
    <td>qu</td>
    <td>6 of those are in unsent queue: they have not yet been written to the outbound network</td>
    <td>6 個未發送的 queue</td>
    <td>未發送的 queue</td>
  </tr>
  <tr>
    <td>qs</td>
    <td>67 of those have been sent to the server but a response is not yet available. The response could be: Not yet sent by the server sent by the server but not yet processed by the client.</td>
    <td>67 個已發送的 queue</td>
    <td>已發送的 queue</td>
  </tr>
  <tr>
    <td>qc</td>
    <td>0 of those have seen replies but have not yet been marked as complete due to waiting on the completion loop</td>
    <td>0 個已發送未標記完成的 queue</td>
    <td>已發送未標記完成的 queue</td>
  </tr>
  <tr>
    <td>wr</td>
    <td>there is an active writer (meaning - those 6 unsent are not being ignored) bytes/activewriters</td>
    <td>有 1 個啟用的 writer,(意味著 qu 的工作並沒有被忽略) bytes/activewriters</td>
    <td>bytes/activewriters</td>
  </tr>
  <tr>
    <td>in</td>
    <td>there are no active readers and zero bytes are available to be read on the NIC bytes/activereaders</td>
    <td>0 個 reader</td>
    <td>bytes/activereaders</td>
  </tr>
  <tr>
    <td colspan="4">For more information, please see this <a href="https://gist.github.com/JonCole/db0e90bedeb3fc4823c2">link</a></td>
  </tr>
</tbody>
</table>

---

參考資料：

- [StackExchange.Redis - Configuration](#stackexchangeredis---configuration)
- [Redis 命令参考](#redis-%E5%91%BD%E4%BB%A4%E5%8F%82%E8%80%83)
- [Error Code 說明](#error-code-%E8%AA%AA%E6%98%8E)
- [如何监控Redis的工作状态——INFO命令详解](http://ghoulich.xninja.org/2016/10/15/how-to-monitor-redis-status/)
