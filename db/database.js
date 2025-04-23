const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

// 取得正確路徑
const dbPath = process.env.RENDER
    ? "/mnt/data/orders.db" // ✅ Render 專用資料夾
    : path.resolve(__dirname, "orders.db");

// 如果是 Render，確認資料夾存在
if (process.env.RENDER) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log("✅ 已建立資料夾：", dir);
    }
}

// 建立資料庫連線
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ 無法打開 SQLite 資料庫：", err.message);
    } else {
        console.log("✅ SQLite 資料庫連線成功：", dbPath);
    }
});

// 建表
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    items TEXT,
    total INTEGER,
    created_at TEXT,
    note TEXT,
    table_no TEXT,
    status TEXT DEFAULT 'pending'
  )`);
});

module.exports = db;
