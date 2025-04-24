# 🥪 山葉早餐點餐系統

本系統為一套適用於小型早餐店的 **網頁點餐與廚房管理系統**，支援顧客掃描 QR Code 自行下單，並即時顯示於廚房後台，提升接單效率與顧客體驗。

---

## 📦 功能簡介

### 🔸 顧客前台（點餐頁面）

-   商品分類切換、圖片顯示
-   商品加料選項（加蛋、加起司）
-   加料價格自動計算
-   購物車管理（調整數量、加備註）
-   支援手機瀏覽、自適應排版
-   訂單送出顯示總金額

🔗 前台網址：  
👉 https://order-system-zy3x.onrender.com/

---

### 🔸 廚房後台（訂單管理）

-   顯示當日未完成訂單
-   含商品名稱、加料、數量、備註
-   完成後點選 ✅ 即可從畫面中移除
-   新訂單自動提示「叮咚」聲音

🔗 廚房後台：  
👉 https://order-system-zy3x.onrender.com/kitchen.html

---

## 🛠 開發與建置說明

### ✅ 開發技術

| 類別   | 技術                           |
| ------ | ------------------------------ |
| 前端   | HTML, JavaScript, Tailwind CSS |
| 後端   | Node.js + Express              |
| 資料庫 | SQLite                         |
| 其他   | UUID, RESTful API              |
| 部署   | Render.com 免費服務            |

---

### ⚙️ 開發環境安裝

```bash
# 1. 下載專案
git clone https://github.com/BSC1107/Order-System.git
cd Order-System

# 2. 安裝套件
npm install

# 3. 啟動開發環境
npm run dev

# 4. 打開瀏覽器進入系統
http://localhost:3000
```
