const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require("uuid");
const db = require("../db/database");

// ✅ 取得今日訂單
router.get("/today", (req, res) => {
    const sql = `
    SELECT id, items, total, table_no, note, created_at 
    FROM orders 
    WHERE DATE(created_at) = DATE('now') AND status = 'pending'
    ORDER BY created_at DESC`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("查詢失敗:", err);
            return res.status(500).json({ error: "資料庫錯誤" });
        }

        const result = rows.map((order) => ({
            ...order,
            items: JSON.parse(order.items),
        }));

        res.json(result);
    });
});

// ✅ 建立新訂單（含加料計算）
router.post("/", (req, res) => {
    const { items, table_no, note } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: "沒有商品資料" });
    }

    const total = items.reduce((sum, item) => {
        const addonTotal = (item.addons || []).reduce(
            (aSum, a) => aSum + (a.price || 0),
            0
        );
        return sum + (item.price + addonTotal) * item.qty;
    }, 0);

    const order = {
        id: uuidv4(),
        items: JSON.stringify(items),
        total,
        created_at: new Date().toISOString(),
        table_no,
        note,
        status: "pending",
    };

    const sql = `
        INSERT INTO orders (id, items, total, created_at, note, table_no, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(
        sql,
        [
            order.id,
            order.items,
            order.total,
            order.created_at,
            order.note,
            order.table_no,
            order.status,
        ],
        (err) => {
            if (err) {
                console.error("新增訂單失敗：", err);
                return res.status(500).json({ error: "資料庫錯誤" });
            }
            res.json({ success: true, id: order.id, total: order.total });
        }
    );
});

// ✅ 標記訂單為完成
router.post("/:id/complete", (req, res) => {
    const id = req.params.id;
    const sql = `UPDATE orders SET status = 'done' WHERE id = ?`;

    db.run(sql, [id], function (err) {
        if (err) {
            console.error("標記訂單完成失敗：", err);
            return res.status(500).json({ error: "更新失敗" });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: "找不到該訂單" });
        }

        res.json({ success: true });
    });
});

module.exports = router;
