const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

let dbPath = path.resolve(__dirname, "orders.db");

// ✅ Render 平台專用：使用 /mnt/data 可保資料持久化
if (process.env.RENDER) {
    const renderPath = "/mnt/data/orders.db";

    try {
        fs.accessSync("/mnt/data", fs.constants.W_OK);
        dbPath = renderPath;
        console.log("📂 Render 寫入權限確認 ✅ 使用 /mnt/data/orders.db");
    } catch (err) {
        console.warn("⚠️ 無法寫入 /mnt/data，改用本地資料庫");
    }
}

// ✅ 初始化 SQLite 資料庫
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ SQLite 開啟失敗：", err.message);
    } else {
        console.log("✅ SQLite 已連線：", dbPath);
    }
});

// ✅ 建立 orders 資料表（若尚未存在）
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        order_no TEXT,
        items TEXT,
        total INTEGER,
        created_at TEXT,
        note TEXT,
        table_no TEXT,
        status TEXT DEFAULT 'pending'
    )`);
});

module.exports = db;
