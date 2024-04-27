---
layout: post
title: 測試用
date: 1972-01-01 12:00
author: Poy Chang
comments: true
categories: [App]
---

測試用

<div id="app">
    <input id="height" type="text" placeholder="Height">
    <input id="width" type="text" placeholder="Width">
    <h1 id="output"></h1>
</div>

<script>
    // 獲取 input 欄位和 output 標籤的引用
    const heightInput = document.getElementById('height');
    const widthInput = document.getElementById('width');
    const output = document.getElementById('output');

    // 處理輸入改變的事件函數
    function handleInput() {
        const height = parseFloat(heightInput.value);
        const width = parseFloat(widthInput.value);

        // 確保兩個值都是數字
        if (!isNaN(height) && !isNaN(width)) {
            const product = height * width;
            output.textContent = `Product: ${product}`;
        } else {
            output.textContent = '';  // 清空 output 如果任何一個欄位不是有效的數字
        }
    }

    // 為兩個輸入欄位新增輸入事件監聽器
    heightInput.addEventListener('input', handleInput);
    widthInput.addEventListener('input', handleInput);
</script>
