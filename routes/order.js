const express = require("express");
const router = express.Router();
const db = require("../db/database");

// ✅ 取得今日訂單（只顯示未完成的）
router.get("/today", (req, res) => {
    const sql = `
    SELECT id, items, total, table_no, note, created_at
    FROM orders
    WHERE DATE(created_at) = DATE('now', 'localtime') AND status = 'pending'
    ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: "資料庫錯誤" });
        const formatted = rows.map((o) => ({
            ...o,
            items: JSON.parse(o.items),
        }));
        res.json(formatted);
    });
});

// ✅ 建立新訂單
router.post("/", (req, res) => {
    const { items, total, table_no = "", note = "" } = req.body;

    if (!items || !Array.isArray(items)) {
        return res.status(400).json({ error: "缺少訂單品項" });
    }

    const sql = `
    INSERT INTO orders (id, items, total, table_no, note, created_at, status)
    VALUES (?, ?, ?, ?, ?, datetime('now', 'localtime'), 'pending')`;
    const id = `ORD-${Date.now()}`;
    const itemsStr = JSON.stringify(items);

    db.run(sql, [id, itemsStr, total || 0, table_no, note], function (err) {
        if (err) return res.status(500).json({ error: "資料庫寫入錯誤" });
        res.json({ success: true, id, total });
    });
});

// ✅ 查詢所有訂單（備用）
router.get("/all", (req, res) => {
    const sql = `
    SELECT id, items, total, table_no, note, created_at, status
    FROM orders
    ORDER BY created_at DESC`;
    db.all(sql, [], (err, rows) => {
        if (err) return res.status(500).json({ error: "資料庫錯誤" });
        const formatted = rows.map((o) => ({
            ...o,
            items: JSON.parse(o.items),
        }));
        res.json(formatted);
    });
});

// ✅ 標記訂單為完成
router.post("/:id/complete", (req, res) => {
    const { id } = req.params;

    const sql = `UPDATE orders SET status = 'done' WHERE id = ?`;
    db.run(sql, [id], function (err) {
        if (err) {
            console.error("更新失敗:", err);
            return res.status(500).json({ error: "資料庫錯誤" });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "找不到訂單" });
        }

        res.json({ success: true });
    });
});

module.exports = router;
