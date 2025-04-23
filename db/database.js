const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = process.env.RENDER
    ? "/mnt/data/orders.db" // ✅ Render 會自動建立這個資料夾，直接使用即可
    : path.resolve(__dirname, "orders.db");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error("❌ SQLite 開啟失敗：", err.message);
    } else {
        console.log("✅ SQLite 已連線：", dbPath);
    }
});

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
