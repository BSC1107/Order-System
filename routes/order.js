const express = require("express");
const router = express.Router();
const db = require("../db/database");
const { v4: uuidv4 } = require("uuid");

// ✅ 取得今日未完成訂單（廚房用）
router.get("/today", (req, res) => {
    const sql = `
        SELECT id, order_no, items, total, table_no, created_at 
        FROM orders 
        WHERE DATE(created_at, 'localtime') = DATE('now', 'localtime') AND status = 'pending'
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

// ✅ 取得所有已完成訂單（不指定日期，歷史查詢用）
router.get("/history", (req, res) => {
    const sql = `
        SELECT id, order_no, items, total, table_no, created_at 
        FROM orders 
        WHERE status = 'done'
        ORDER BY created_at DESC`;

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("查詢歷史訂單失敗：", err);
            return res.status(500).json({ error: "資料庫錯誤" });
        }

        const result = rows.map((order) => ({
            ...order,
            items: JSON.parse(order.items),
        }));

        res.json(result);
    });
});

// ✅ 查詢特定日期的已完成訂單（歷史查詢）
router.get("/history/:date", (req, res) => {
    const date = req.params.date;
    const sql = `
        SELECT id, order_no, items, total, table_no, created_at
        FROM orders
        WHERE DATE(created_at, 'localtime') = ? AND status = 'done'
        ORDER BY created_at DESC`;

    db.all(sql, [date], (err, rows) => {
        if (err) {
            console.error("查詢歷史訂單失敗：", err);
            return res.status(500).json({ error: "資料庫錯誤" });
        }

        const result = rows.map((order) => ({
            ...order,
            items: JSON.parse(order.items),
        }));

        res.json(result);
    });
});

// ✅ 建立新訂單（含加料計算與訂單編號）
router.post("/", (req, res) => {
    const { items, table_no } = req.body;

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

    const today = new Date();
    const dateString = today.toISOString().split("T")[0]; // 2025-04-24
    const yyyymmdd = dateString.replace(/-/g, ""); // 20250424

    const countSql = `SELECT COUNT(*) AS count FROM orders WHERE DATE(created_at, 'localtime') = DATE('now', 'localtime')`;

    db.get(countSql, [], (err, row) => {
        if (err) {
            console.error("取得當日訂單筆數失敗：", err);
            return res.status(500).json({ error: "訂單編號產生失敗" });
        }

        const count = row.count + 1;
        const order_no = `O-${yyyymmdd}-${String(count).padStart(3, "0")}`;

        const order = {
            id: uuidv4(),
            order_no,
            items: JSON.stringify(items),
            total,
            created_at: new Date().toISOString(),
            table_no,
            status: "pending",
        };

        const insertSql = `
            INSERT INTO orders (id, order_no, items, total, created_at, table_no, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.run(
            insertSql,
            [
                order.id,
                order.order_no,
                order.items,
                order.total,
                order.created_at,
                order.table_no,
                order.status,
            ],
            (err) => {
                if (err) {
                    console.error("新增訂單失敗：", err);
                    return res.status(500).json({ error: "資料庫錯誤" });
                }
                res.json({
                    success: true,
                    id: order.id,
                    order_no: order.order_no,
                    total: order.total,
                });
            }
        );
    });
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
