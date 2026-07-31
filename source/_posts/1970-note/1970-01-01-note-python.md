---
layout: post
title: Python 筆記
date: 1970-01-01 12:00
author: Poy Chang
comments: true
categories: [Python, Note, Develop]
permalink: note-python/
---

本篇作為筆記用途，記錄 Python 參考資料

# Python Script 基礎實作手冊

## 1. Python Script 是什麼

Python Script 是使用 Python 撰寫並直接執行的程式檔案，副檔名通常為：

```text
.py
```

Python Script 常見用途包括：

* 自動處理檔案
* 轉換 JSON、CSV、Excel 等資料
* 呼叫 HTTP API
* 執行排程工作
* 批次更新資料
* 建立命令列工具
* 串接資料庫或雲端服務
* 自動產生報表

一個最簡單的 Python Script：

```python
print("Hello, Python")
```

將程式儲存成：

```text
hello.py
```

執行：

```bash
python hello.py
```

部分環境可能需要使用：

```bash
python3 hello.py
```

---

# 2. 安裝與環境確認

## 2.1 確認 Python 版本

```bash
python --version
```

輸出範例：

```text
Python 3.14.0
```

## 2.2 使用虛擬環境

每個 Python 專案建議建立獨立的虛擬環境，避免套件版本互相影響。

建立虛擬環境：

```bash
python -m venv .venv
```

Windows 啟用：

```powershell
.venv\Scripts\Activate.ps1
```

Windows 命令提示字元：

```cmd
.venv\Scripts\activate.bat
```

Linux 或 macOS：

```bash
source .venv/bin/activate
```

停用虛擬環境：

```bash
deactivate
```

## 2.3 安裝套件

```bash
pip install requests
```

將目前套件輸出成檔案：

```bash
pip freeze > requirements.txt
```

依照套件清單安裝：

```bash
pip install -r requirements.txt
```

---

# 3. Python 基本語法

## 3.1 註解

註解是寫給開發者閱讀的說明文字，不會被 Python 當成程式執行。

### 單行註解

Python 使用 `#` 撰寫單行註解：

```python
# 顯示歡迎訊息
print("Hello, Python")
```

也可以寫在程式碼後方：

```python
timeout = 30  # HTTP API 逾時秒數
```

行尾註解應保持簡短。較長的說明應放在程式碼上方。

```python
# API 最多等待 30 秒，避免服務無回應時
# 程式持續停留在 HTTP 呼叫階段
timeout = 30
```

### 多行註解

Python 沒有專用的多行註解語法。多行註解通常是在每一行前面加上 `#`：

```python
# 取得遠端使用者資料
# 將欄位轉換成系統需要的格式
# 最後輸出成 JSON 檔案
```

部分程式碼會使用三個引號：

```python
"""
這段文字可以跨越多行，
但它本質上是一個字串，
不是正式的 Python 註解。
"""
```

三引號通常應用於文件字串，而不是一般註解。

### 文件字串 Docstring

Docstring 用來說明模組、函式、類別或方法的用途。

#### 函式 Docstring

```python
def calculate_total(price: float, quantity: int) -> float:
    """計算指定數量商品的總金額。"""
    return price * quantity
```

較完整的寫法：

```python
def calculate_total(price: float, quantity: int) -> float:
    """
    計算商品總金額。

    Args:
        price: 商品單價。
        quantity: 商品數量。

    Returns:
        商品單價乘以數量後的總金額。

    Raises:
        ValueError: 當價格或數量小於零時。
    """
    if price < 0:
        raise ValueError("商品單價不可小於零")

    if quantity < 0:
        raise ValueError("商品數量不可小於零")

    return price * quantity
```

#### 類別 Docstring

```python
class ApiClient:
    """負責呼叫遠端 HTTP API。"""

    def get_users(self) -> list[dict]:
        """取得所有使用者資料。"""
        return []
```

#### 模組 Docstring

模組說明通常放在 `.py` 檔案最上方：

```python
"""
使用者資料匯出工具。

此模組負責呼叫使用者 API、轉換資料，
並將結果輸出成 JSON 檔案。
"""

import json
import requests
```

### 註解原則

* 使用 `#` 撰寫一般註解。
* 使用 Docstring 說明模組、類別與函式。
* 說明程式採用某種做法的原因。
* 不要逐行翻譯明顯的程式碼。
* 不要長期保留大量被註解掉的舊程式碼。
* 修改程式碼時同步更新註解。
* API 限制、資料格式與相容性處理應留下說明。
* 複雜程式應優先改善命名與結構，而不是用大量註解補救。

## 3.2 變數

Python 不需要事先宣告變數型別。

```python
name = "Poy"
age = 40
height = 180.5
is_developer = True
```

## 3.3 常見資料型別

| 型別      | 說明    | 範例                |
| ------- | ----- | ----------------- |
| `str`   | 字串    | `"Python"`        |
| `int`   | 整數    | `100`             |
| `float` | 浮點數   | `3.14`            |
| `bool`  | 布林值   | `True`            |
| `list`  | 清單    | `[1, 2, 3]`       |
| `tuple` | 不可變序列 | `(1, 2, 3)`       |
| `dict`  | 鍵值資料  | `{"name": "Poy"}` |
| `set`   | 不重複集合 | `{1, 2, 3}`       |
| `None`  | 空值    | `None`            |

查看資料型別：

```python
value = 100

print(type(value))
```

輸出：

```text
<class 'int'>
```

## 3.4 型別提示

Python 支援型別提示，建議在正式專案中使用。

```python
name: str = "Poy"
age: int = 40
price: float = 99.5
enabled: bool = True
```

函式也可以標示參數及回傳型別：

```python
def calculate_total(price: float, quantity: int) -> float:
    return price * quantity
```

型別提示不會在執行時強制檢查，但能提高可讀性，並協助 IDE 找出錯誤。

---

# 4. 字串處理

## 4.1 字串串接

```python
first_name = "Poy"
last_name = "Chang"

full_name = first_name + " " + last_name
print(full_name)
```

## 4.2 f-string

建議使用 f-string 組合字串。

```python
name = "Poy"
age = 40

message = f"{name} is {age} years old."
print(message)
```

## 4.3 常用字串操作

```python
text = "  Python Script  "

print(text.strip())
print(text.lower())
print(text.upper())
print(text.replace("Script", "Programming"))
```

切割字串：

```python
value = "apple,banana,orange"

items = value.split(",")

print(items)
```

輸出：

```python
["apple", "banana", "orange"]
```

組合字串：

```python
items = ["apple", "banana", "orange"]

result = ",".join(items)

print(result)
```

---

# 5. 資料轉型

資料轉型是 Python Script 中最常見的工作之一，特別是在處理 API、CSV、環境變數或使用者輸入時。

## 5.1 字串轉整數

```python
text = "123"

number = int(text)

print(number)
print(type(number))
```

必須注意字串內容必須是有效整數：

```python
text = "12.5"

number = int(text)
```

以上程式會發生 `ValueError`。

若字串是小數，可以先轉成 `float`：

```python
text = "12.5"

number = float(text)
integer = int(number)

print(integer)
```

結果為：

```text
12
```

`int()` 會直接移除小數部分，不會四捨五入。

四捨五入：

```python
number = round(12.5)

print(number)
```

## 5.2 字串轉浮點數

```python
text = "99.95"

price = float(text)

print(price)
```

## 5.3 數字轉字串

```python
number = 100

text = str(number)

print(text)
```

使用 f-string 通常更方便：

```python
number = 100

text = f"{number}"
```

## 5.4 字串轉布林值

不建議直接使用：

```python
bool("false")
```

因為只要字串不是空字串，結果都是 `True`。

正確做法：

```python
def to_bool(value: str) -> bool:
    normalized = value.strip().lower()

    if normalized in {"true", "1", "yes", "y"}:
        return True

    if normalized in {"false", "0", "no", "n"}:
        return False

    raise ValueError(f"無法轉換成布林值：{value}")
```

使用：

```python
enabled = to_bool("true")
print(enabled)
```

## 5.5 安全轉型

外部資料可能包含空值或錯誤格式，因此應加入錯誤處理。

```python
def to_int(value: object, default: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default
```

使用：

```python
print(to_int("123"))
print(to_int("abc"))
print(to_int(None))
```

輸出：

```text
123
0
0
```

## 5.6 字串轉日期

```python
from datetime import datetime

text = "2026-07-31"

date_value = datetime.strptime(text, "%Y-%m-%d")

print(date_value)
```

常見格式：

| 格式碼  | 說明        |
| ---- | --------- |
| `%Y` | 四位數年份     |
| `%m` | 月份        |
| `%d` | 日期        |
| `%H` | 24 小時制的小時 |
| `%M` | 分鐘        |
| `%S` | 秒         |

日期時間轉字串：

```python
from datetime import datetime

now = datetime.now()

text = now.strftime("%Y-%m-%d %H:%M:%S")

print(text)
```

## 5.7 ISO 8601 日期轉型

API 經常使用 ISO 8601 格式：

```text
2026-07-31T10:30:00+08:00
```

可以使用：

```python
from datetime import datetime

text = "2026-07-31T10:30:00+08:00"

date_value = datetime.fromisoformat(text)

print(date_value)
```

---

# 6. List 資料處理

## 6.1 建立 List

```python
numbers = [1, 2, 3, 4, 5]
```

## 6.2 取得元素

```python
numbers = [10, 20, 30]

print(numbers[0])
print(numbers[-1])
```

## 6.3 新增與移除元素

```python
items = ["A", "B"]

items.append("C")
items.remove("A")

print(items)
```

## 6.4 使用迴圈

```python
items = ["apple", "banana", "orange"]

for item in items:
    print(item)
```

同時取得索引：

```python
for index, item in enumerate(items):
    print(index, item)
```

## 6.5 List Comprehension

將數字乘以二：

```python
numbers = [1, 2, 3, 4, 5]

results = [number * 2 for number in numbers]

print(results)
```

篩選偶數：

```python
numbers = [1, 2, 3, 4, 5, 6]

even_numbers = [
    number
    for number in numbers
    if number % 2 == 0
]

print(even_numbers)
```

字串轉整數：

```python
values = ["10", "20", "30"]

numbers = [int(value) for value in values]

print(numbers)
```

## 6.6 使用 map 與 filter

```python
values = ["1", "2", "3"]

numbers = list(map(int, values))
```

篩選：

```python
numbers = [1, 2, 3, 4, 5, 6]

even_numbers = list(
    filter(lambda number: number % 2 == 0, numbers)
)
```

一般情況下，List Comprehension 通常比 `map` 和 `filter` 更容易閱讀。

---

# 7. Dictionary 資料處理

Dictionary 是 Python 中處理結構化資料的重要型別，也是 JSON 解析後最常見的型別。

## 7.1 建立 Dictionary

```python
user = {
    "id": 1,
    "name": "Poy",
    "email": "poy@example.com",
}
```

## 7.2 取得欄位

```python
print(user["name"])
```

當欄位不存在時，使用 `[]` 會產生 `KeyError`。

較安全的方式：

```python
name = user.get("name")
phone = user.get("phone")
```

指定預設值：

```python
phone = user.get("phone", "")
```

## 7.3 修改資料

```python
user["name"] = "Poy Chang"
user["enabled"] = True
```

## 7.4 移除欄位

```python
user.pop("email", None)
```

## 7.5 遍歷 Dictionary

```python
for key, value in user.items():
    print(key, value)
```

## 7.6 轉換欄位名稱

假設原始資料：

```python
source = {
    "user_id": "100",
    "user_name": "Poy",
    "is_enabled": "true",
}
```

轉換成新的資料結構：

```python
target = {
    "id": int(source["user_id"]),
    "name": source["user_name"],
    "enabled": to_bool(source["is_enabled"]),
}
```

---

# 8. 條件判斷

```python
score = 85

if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")
```

判斷空值：

```python
value = None

if value is None:
    print("沒有資料")
```

判斷 List 是否為空：

```python
items = []

if not items:
    print("清單是空的")
```

Python 中常見的假值包括：

```python
False
None
0
0.0
""
[]
{}
set()
```

---

# 9. 函式

## 9.1 建立函式

```python
def greet(name: str) -> str:
    return f"Hello, {name}"
```

使用：

```python
message = greet("Poy")

print(message)
```

## 9.2 預設參數

```python
def greet(name: str, prefix: str = "Hello") -> str:
    return f"{prefix}, {name}"
```

```python
print(greet("Poy"))
print(greet("Poy", "Hi"))
```

## 9.3 關鍵字參數

```python
def create_user(name: str, age: int, enabled: bool) -> dict:
    return {
        "name": name,
        "age": age,
        "enabled": enabled,
    }
```

呼叫：

```python
user = create_user(
    name="Poy",
    age=40,
    enabled=True,
)
```

## 9.4 不定數量參數

```python
def calculate_total(*numbers: float) -> float:
    return sum(numbers)
```

```python
print(calculate_total(10, 20, 30))
```

---

# 10. 錯誤處理

## 10.1 try-except

```python
try:
    number = int("abc")
except ValueError as error:
    print(f"轉型失敗：{error}")
```

## 10.2 finally

```python
try:
    print("執行工作")
except Exception as error:
    print(error)
finally:
    print("一定會執行")
```

## 10.3 主動拋出錯誤

```python
def calculate_price(price: float) -> float:
    if price < 0:
        raise ValueError("價格不可小於零")

    return price
```

## 10.4 不要任意忽略所有錯誤

不建議：

```python
try:
    execute_task()
except:
    pass
```

這種寫法會隱藏真正的問題。

較適當的方式：

```python
try:
    execute_task()
except ValueError as error:
    print(f"資料格式錯誤：{error}")
except OSError as error:
    print(f"系統或檔案錯誤：{error}")
```

---

# 11. 檔案處理

## 11.1 讀取文字檔案

```python
from pathlib import Path

file_path = Path("data.txt")

content = file_path.read_text(encoding="utf-8")

print(content)
```

## 11.2 寫入文字檔案

```python
from pathlib import Path

file_path = Path("output.txt")

file_path.write_text(
    "Hello, Python",
    encoding="utf-8",
)
```

## 11.3 逐行讀取

```python
from pathlib import Path

file_path = Path("data.txt")

with file_path.open("r", encoding="utf-8") as file:
    for line in file:
        print(line.strip())
```

## 11.4 追加內容

```python
from pathlib import Path

file_path = Path("log.txt")

with file_path.open("a", encoding="utf-8") as file:
    file.write("新增一筆資料\n")
```

## 11.5 檢查檔案是否存在

```python
from pathlib import Path

file_path = Path("data.txt")

if file_path.exists():
    print("檔案存在")
```

## 11.6 建立目錄

```python
from pathlib import Path

output_directory = Path("output")

output_directory.mkdir(
    parents=True,
    exist_ok=True,
)
```

---

# 12. JSON 資料處理

JSON 是 HTTP API 最常見的資料格式。

## 12.1 JSON 字串轉 Dictionary

```python
import json

text = """
{
    "id": 1,
    "name": "Poy",
    "enabled": true
}
"""

data = json.loads(text)

print(data["name"])
```

## 12.2 Dictionary 轉 JSON 字串

```python
import json

data = {
    "id": 1,
    "name": "Poy",
    "enabled": True,
}

text = json.dumps(
    data,
    ensure_ascii=False,
    indent=2,
)

print(text)
```

`ensure_ascii=False` 可以避免中文字被轉換成 Unicode 跳脫字元。

## 12.3 讀取 JSON 檔案

```python
import json
from pathlib import Path

file_path = Path("data.json")

with file_path.open("r", encoding="utf-8") as file:
    data = json.load(file)
```

## 12.4 寫入 JSON 檔案

```python
import json
from pathlib import Path

data = {
    "name": "Poy",
    "skills": ["Python", "C#", "Azure"],
}

file_path = Path("output.json")

with file_path.open("w", encoding="utf-8") as file:
    json.dump(
        data,
        file,
        ensure_ascii=False,
        indent=2,
    )
```

---

# 13. CSV 資料處理

## 13.1 讀取 CSV

假設 `users.csv`：

```csv
id,name,age
1,Alice,30
2,Bob,35
```

讀取：

```python
import csv
from pathlib import Path

file_path = Path("users.csv")

with file_path.open(
    "r",
    encoding="utf-8-sig",
    newline="",
) as file:
    reader = csv.DictReader(file)

    users = list(reader)

print(users)
```

CSV 讀取後的欄位預設都是字串。

進行資料轉型：

```python
converted_users = [
    {
        "id": int(user["id"]),
        "name": user["name"],
        "age": int(user["age"]),
    }
    for user in users
]
```

## 13.2 寫入 CSV

```python
import csv
from pathlib import Path

users = [
    {
        "id": 1,
        "name": "Alice",
        "age": 30,
    },
    {
        "id": 2,
        "name": "Bob",
        "age": 35,
    },
]

file_path = Path("output.csv")

with file_path.open(
    "w",
    encoding="utf-8-sig",
    newline="",
) as file:
    writer = csv.DictWriter(
        file,
        fieldnames=["id", "name", "age"],
    )

    writer.writeheader()
    writer.writerows(users)
```

`utf-8-sig` 通常能讓 Windows Excel 正確辨識 UTF-8 中文內容。

---

# 14. 呼叫 HTTP API

Python 可以使用內建的 `urllib`，也可以使用第三方套件 `requests`。

一般腳本建議使用 `requests`，語法較簡潔。

安裝：

```bash
pip install requests
```

## 14.1 HTTP GET

```python
import requests

url = "https://api.example.com/users"

response = requests.get(
    url,
    timeout=30,
)

print(response.status_code)
print(response.text)
```

`timeout` 應該明確設定，避免 API 沒有回應時程式永久等待。

## 14.2 解析 JSON 回應

```python
import requests

response = requests.get(
    "https://api.example.com/users",
    timeout=30,
)

response.raise_for_status()

data = response.json()

print(data)
```

`raise_for_status()` 會在 HTTP 狀態碼為 4xx 或 5xx 時拋出例外。

## 14.3 Query String 參數

```python
import requests

params = {
    "page": 1,
    "pageSize": 20,
    "keyword": "Python",
}

response = requests.get(
    "https://api.example.com/users",
    params=params,
    timeout=30,
)

response.raise_for_status()
```

實際請求可能會變成：

```text
https://api.example.com/users?page=1&pageSize=20&keyword=Python
```

## 14.4 設定 HTTP Header

```python
import requests

headers = {
    "Accept": "application/json",
    "User-Agent": "PythonScript/1.0",
}

response = requests.get(
    "https://api.example.com/users",
    headers=headers,
    timeout=30,
)
```

## 14.5 Bearer Token 驗證

```python
import requests

token = "your-access-token"

headers = {
    "Authorization": f"Bearer {token}",
    "Accept": "application/json",
}

response = requests.get(
    "https://api.example.com/users",
    headers=headers,
    timeout=30,
)

response.raise_for_status()
```

不要將正式 API Key 或 Token 直接寫在程式碼中。

建議從環境變數讀取：

```python
import os

token = os.environ["API_TOKEN"]
```

Windows PowerShell 設定環境變數：

```powershell
$env:API_TOKEN = "your-access-token"
```

## 14.6 HTTP POST JSON

```python
import requests

payload = {
    "name": "Poy",
    "email": "poy@example.com",
    "enabled": True,
}

response = requests.post(
    "https://api.example.com/users",
    json=payload,
    timeout=30,
)

response.raise_for_status()

result = response.json()

print(result)
```

使用 `json=payload` 時，`requests` 會自動：

* 將 Dictionary 轉換成 JSON
* 設定 `Content-Type: application/json`

## 14.7 HTTP PUT

```python
import requests

payload = {
    "name": "Poy Chang",
    "enabled": True,
}

response = requests.put(
    "https://api.example.com/users/1",
    json=payload,
    timeout=30,
)

response.raise_for_status()
```

## 14.8 HTTP PATCH

```python
import requests

payload = {
    "enabled": False,
}

response = requests.patch(
    "https://api.example.com/users/1",
    json=payload,
    timeout=30,
)

response.raise_for_status()
```

## 14.9 HTTP DELETE

```python
import requests

response = requests.delete(
    "https://api.example.com/users/1",
    timeout=30,
)

response.raise_for_status()
```

## 14.10 HTTP API 錯誤處理

```python
import requests


def get_users() -> list[dict]:
    try:
        response = requests.get(
            "https://api.example.com/users",
            timeout=30,
        )

        response.raise_for_status()

        data = response.json()

        if not isinstance(data, list):
            raise ValueError("API 回傳格式不是 List")

        return data

    except requests.Timeout:
        print("HTTP API 呼叫逾時")

    except requests.ConnectionError:
        print("無法連線至 HTTP API")

    except requests.HTTPError as error:
        status_code = error.response.status_code
        print(f"HTTP API 回傳錯誤：{status_code}")

    except requests.JSONDecodeError:
        print("API 回應不是有效的 JSON")

    except ValueError as error:
        print(f"資料格式錯誤：{error}")

    return []
```

---

# 15. 使用 Session 重複呼叫 API

當程式需要多次呼叫相同服務時，可以使用 `requests.Session`。

```python
import requests

with requests.Session() as session:
    session.headers.update({
        "Accept": "application/json",
        "User-Agent": "PythonScript/1.0",
    })

    response = session.get(
        "https://api.example.com/users",
        timeout=30,
    )

    response.raise_for_status()
```

Session 可以重複使用 TCP 連線，也可以共用：

* Header
* Cookie
* 驗證資訊
* Proxy 設定

---

# 16. API 分頁處理

許多 API 會分頁回傳資料。

```python
import requests


def get_all_users() -> list[dict]:
    all_users: list[dict] = []
    page = 1
    page_size = 100

    while True:
        response = requests.get(
            "https://api.example.com/users",
            params={
                "page": page,
                "pageSize": page_size,
            },
            timeout=30,
        )

        response.raise_for_status()

        data = response.json()
        items = data.get("items", [])

        all_users.extend(items)

        if len(items) < page_size:
            break

        page += 1

    return all_users
```

實際分頁欄位可能是：

```text
items
data
results
nextPage
nextToken
totalCount
```

必須依照 API 文件調整。

---

# 17. API 重試機制

網路錯誤、服務暫時無法使用或流量限制可能造成 API 呼叫失敗。

```python
import time

import requests


def get_with_retry(
    url: str,
    max_attempts: int = 3,
) -> requests.Response:
    for attempt in range(1, max_attempts + 1):
        try:
            response = requests.get(
                url,
                timeout=30,
            )

            response.raise_for_status()

            return response

        except (
            requests.Timeout,
            requests.ConnectionError,
        ):
            if attempt == max_attempts:
                raise

            wait_seconds = attempt * 2

            print(
                f"第 {attempt} 次呼叫失敗，"
                f"{wait_seconds} 秒後重試"
            )

            time.sleep(wait_seconds)

    raise RuntimeError("HTTP API 呼叫失敗")
```

不應對所有錯誤無條件重試。例如：

* `400 Bad Request`
* `401 Unauthorized`
* `403 Forbidden`
* `404 Not Found`

這些通常無法透過重試解決。

---

# 18. 環境變數與設定

## 18.1 讀取環境變數

```python
import os

api_url = os.environ["API_URL"]
api_token = os.environ["API_TOKEN"]
```

提供預設值：

```python
api_url = os.getenv(
    "API_URL",
    "https://api.example.com",
)
```

## 18.2 驗證必要設定

```python
import os


def get_required_environment_variable(name: str) -> str:
    value = os.getenv(name)

    if not value:
        raise RuntimeError(
            f"缺少必要環境變數：{name}"
        )

    return value
```

使用：

```python
api_token = get_required_environment_variable(
    "API_TOKEN"
)
```

---

# 19. Logging

正式腳本不建議全部使用 `print()`。

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format=(
        "%(asctime)s "
        "%(levelname)s "
        "%(message)s"
    ),
)

logger = logging.getLogger(__name__)

logger.info("程式開始")
logger.warning("發現異常資料")
logger.error("工作執行失敗")
```

錯誤發生時記錄 Stack Trace：

```python
try:
    number = int("abc")
except ValueError:
    logger.exception("資料轉型失敗")
```

---

# 20. 命令列參數

可以使用內建的 `argparse` 接收命令列參數。

```python
import argparse


def parse_arguments() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="使用者資料匯出工具"
    )

    parser.add_argument(
        "--output",
        required=True,
        help="輸出檔案路徑",
    )

    parser.add_argument(
        "--page-size",
        type=int,
        default=100,
        help="每頁資料筆數",
    )

    return parser.parse_args()


arguments = parse_arguments()

print(arguments.output)
print(arguments.page_size)
```

執行：

```bash
python app.py --output users.json --page-size 50
```

---

# 21. Python Script 標準入口

建議使用以下結構：

```python
def main() -> int:
    print("執行主要工作")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

這種寫法有幾個優點：

* 程式流程清楚
* 可以被其他模組匯入
* 可以使用結束碼表示成功或失敗
* 容易進行單元測試

錯誤結束：

```python
def main() -> int:
    try:
        execute_task()
        return 0
    except Exception as error:
        print(f"執行失敗：{error}")
        return 1
```

---

# 22. 完整範例：呼叫 API、轉型並輸出 JSON

以下範例會：

1. 從環境變數取得 API 設定
2. 呼叫 HTTP API
3. 驗證回傳格式
4. 進行資料轉型
5. 將結果輸出為 JSON 檔案
6. 記錄執行過程

```python
import json
import logging
import os
from pathlib import Path
from typing import Any

import requests


logging.basicConfig(
    level=logging.INFO,
    format=(
        "%(asctime)s "
        "%(levelname)s "
        "%(message)s"
    ),
)

logger = logging.getLogger(__name__)


def get_required_environment_variable(name: str) -> str:
    value = os.getenv(name)

    if not value:
        raise RuntimeError(
            f"缺少必要環境變數：{name}"
        )

    return value


def to_int(value: Any, default: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def to_bool(value: Any, default: bool = False) -> bool:
    if isinstance(value, bool):
        return value

    if value is None:
        return default

    normalized = str(value).strip().lower()

    if normalized in {"true", "1", "yes", "y"}:
        return True

    if normalized in {"false", "0", "no", "n"}:
        return False

    return default


def get_users(
    api_url: str,
    api_token: str,
) -> list[dict[str, Any]]:
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Accept": "application/json",
        "User-Agent": "PythonUserExporter/1.0",
    }

    response = requests.get(
        f"{api_url.rstrip('/')}/users",
        headers=headers,
        timeout=30,
    )

    response.raise_for_status()

    data = response.json()

    if isinstance(data, list):
        return data

    if isinstance(data, dict):
        items = data.get("items")

        if isinstance(items, list):
            return items

    raise ValueError(
        "API 回傳格式不符合預期"
    )


def transform_user(
    source: dict[str, Any],
) -> dict[str, Any]:
    return {
        "id": to_int(source.get("id")),
        "name": str(
            source.get("name", "")
        ).strip(),
        "email": str(
            source.get("email", "")
        ).strip().lower(),
        "enabled": to_bool(
            source.get("enabled")
        ),
    }


def write_json_file(
    output_path: Path,
    data: list[dict[str, Any]],
) -> None:
    output_path.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    with output_path.open(
        "w",
        encoding="utf-8",
    ) as file:
        json.dump(
            data,
            file,
            ensure_ascii=False,
            indent=2,
        )


def main() -> int:
    try:
        api_url = get_required_environment_variable(
            "API_URL"
        )

        api_token = get_required_environment_variable(
            "API_TOKEN"
        )

        output_path = Path(
            os.getenv(
                "OUTPUT_PATH",
                "output/users.json",
            )
        )

        logger.info("開始取得使用者資料")

        users = get_users(
            api_url=api_url,
            api_token=api_token,
        )

        transformed_users = [
            transform_user(user)
            for user in users
        ]

        write_json_file(
            output_path,
            transformed_users,
        )

        logger.info(
            "完成，共處理 %s 筆資料，輸出至 %s",
            len(transformed_users),
            output_path,
        )

        return 0

    except requests.Timeout:
        logger.exception("HTTP API 呼叫逾時")
        return 1

    except requests.ConnectionError:
        logger.exception("無法連線至 HTTP API")
        return 1

    except requests.HTTPError as error:
        status_code = error.response.status_code

        logger.exception(
            "HTTP API 回傳錯誤，狀態碼：%s",
            status_code,
        )

        return 1

    except Exception:
        logger.exception("程式執行失敗")
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
```

Windows PowerShell 執行：

```powershell
$env:API_URL = "https://api.example.com"
$env:API_TOKEN = "your-access-token"
$env:OUTPUT_PATH = "output\users.json"

python app.py
```

---

# 23. 模組拆分

當腳本規模變大時，不要將所有程式放在同一個檔案。

建議結構：

```text
python-script/
├─ .venv/
├─ app.py
├─ api_client.py
├─ converters.py
├─ models.py
├─ file_writer.py
├─ requirements.txt
└─ output/
```

`converters.py`：

```python
from typing import Any


def to_int(value: Any, default: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default
```

`app.py`：

```python
from converters import to_int


def main() -> int:
    number = to_int("123")

    print(number)

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
```

---

# 24. 使用 dataclass 建立資料模型

Dictionary 很方便，但大型專案中容易因欄位名稱錯誤而產生問題。

可以使用 `dataclass`：

```python
from dataclasses import dataclass


@dataclass
class User:
    id: int
    name: str
    email: str
    enabled: bool
```

建立物件：

```python
user = User(
    id=1,
    name="Poy",
    email="poy@example.com",
    enabled=True,
)

print(user.name)
```

轉成 Dictionary：

```python
from dataclasses import asdict

data = asdict(user)

print(data)
```

---

# 25. 使用 pandas 進行大量資料轉型

若需要處理大量表格資料，可以使用 `pandas`。

安裝：

```bash
pip install pandas
```

讀取 CSV：

```python
import pandas as pd

dataframe = pd.read_csv("users.csv")

print(dataframe)
```

欄位轉型：

```python
dataframe["id"] = (
    dataframe["id"]
    .fillna(0)
    .astype(int)
)

dataframe["name"] = (
    dataframe["name"]
    .fillna("")
    .str.strip()
)

dataframe["email"] = (
    dataframe["email"]
    .fillna("")
    .str.strip()
    .str.lower()
)
```

篩選資料：

```python
enabled_users = dataframe[
    dataframe["enabled"] == True
]
```

輸出 CSV：

```python
dataframe.to_csv(
    "output.csv",
    index=False,
    encoding="utf-8-sig",
)
```

輸出 JSON：

```python
dataframe.to_json(
    "output.json",
    orient="records",
    force_ascii=False,
    indent=2,
)
```

對於少量資料或簡單腳本，Python 原生的 `csv`、`list` 和 `dict` 已經足夠。只有在需要大量表格運算時才需要導入 pandas。

---

# 26. 常見錯誤

## 26.1 縮排錯誤

Python 使用縮排表示程式區塊。

錯誤：

```python
if True:
print("Hello")
```

正確：

```python
if True:
    print("Hello")
```

建議統一使用四個空格，不要混用 Tab 與空格。

## 26.2 None 與空字串混淆

```python
value = None
```

表示沒有值。

```python
value = ""
```

表示有一個字串，但內容為空。

## 26.3 CSV 欄位都是字串

即使 CSV 中的內容是：

```text
100
```

讀取後仍然是：

```python
"100"
```

必須自行轉型：

```python
number = int(row["id"])
```

## 26.4 API 沒有設定 Timeout

不建議：

```python
requests.get(url)
```

建議：

```python
requests.get(
    url,
    timeout=30,
)
```

## 26.5 將 API Token 寫入原始碼

不建議：

```python
token = "production-secret-token"
```

建議：

```python
import os

token = os.environ["API_TOKEN"]
```

## 26.6 忽略 HTTP 狀態碼

不建議：

```python
response = requests.get(url)
data = response.json()
```

建議：

```python
response = requests.get(
    url,
    timeout=30,
)

response.raise_for_status()

data = response.json()
```

## 26.7 使用可變物件作為預設參數

不建議：

```python
def add_item(item, items=[]):
    items.append(item)
    return items
```

建議：

```python
def add_item(
    item: str,
    items: list[str] | None = None,
) -> list[str]:
    if items is None:
        items = []

    items.append(item)

    return items
```

---

# 27. 程式碼風格建議

變數與函式使用 snake_case：

```python
user_name = "Poy"


def get_user_data() -> dict:
    return {}
```

類別使用 PascalCase：

```python
class ApiClient:
    pass
```

常數使用大寫：

```python
DEFAULT_TIMEOUT_SECONDS = 30
MAX_RETRY_COUNT = 3
```

Boolean 變數使用具有判斷意義的名稱：

```python
is_enabled = True
has_permission = False
can_execute = True
```

避免過短或意義不明的變數：

```python
x = get_data()
```

改成：

```python
user_records = get_user_records()
```

---

# 28. 建議學習順序

第一階段：

1. 變數與資料型別
2. 字串處理
3. `list` 與 `dict`
4. 條件判斷
5. `for` 與 `while`
6. 函式
7. 錯誤處理

第二階段：

1. 檔案讀寫
2. JSON
3. CSV
4. 資料轉型
5. 命令列參數
6. Logging
7. 模組拆分

第三階段：

1. HTTP API
2. 驗證與 Token
3. 分頁
4. 重試
5. Timeout
6. 資料模型
7. 單元測試

---

# 29. 實作練習

## 練習一：CSV 轉 JSON

需求：

1. 讀取 `users.csv`
2. 將 `id` 和 `age` 轉成整數
3. 移除姓名前後空白
4. 將 Email 轉成小寫
5. 輸出成 `users.json`

## 練習二：呼叫 API 並保存資料

需求：

1. 從環境變數讀取 API URL
2. 呼叫 GET API
3. 設定 30 秒 Timeout
4. 驗證 HTTP 狀態碼
5. 解析 JSON
6. 將結果輸出到檔案

## 練習三：批次資料轉換

原始資料：

```python
records = [
    {
        "id": "1",
        "name": " Alice ",
        "enabled": "true",
    },
    {
        "id": "2",
        "name": " Bob ",
        "enabled": "false",
    },
]
```

轉換後：

```python
[
    {
        "id": 1,
        "name": "Alice",
        "enabled": True,
    },
    {
        "id": 2,
        "name": "Bob",
        "enabled": False,
    },
]
```

---

# 30. 重點整理

撰寫 Python Script 時，應掌握以下原則：

* 使用 Python 3
* 每個專案建立虛擬環境
* 使用型別提示提高可讀性
* 外部資料必須進行驗證及轉型
* CSV 欄位預設都是字串
* JSON 通常會轉換成 `dict` 或 `list`
* 呼叫 HTTP API 必須設定 Timeout
* 使用 `raise_for_status()` 檢查 HTTP 錯誤
* API Token 應放在環境變數
* 使用 `try-except` 處理可預期錯誤
* 正式腳本使用 `logging` 取代大量 `print`
* 使用 `main()` 管理程式入口
* 程式變大後應拆分成多個模組
* 資料量不大時優先使用 Python 原生功能
* 只有在大量表格運算時才導入 pandas


---

參考資料：

- [Python 官方網站](https://www.python.org/)
