const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath =
    process.env.NODE_ENV === "production"
        ? "/mnt/data/orders.db" // ✅ 在 Render 上可寫入的地方
        : path.resolve(__dirname, "orders.db");

const db = new sqlite3.Database(dbPath);

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
