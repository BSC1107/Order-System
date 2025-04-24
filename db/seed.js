const db = require("./database");

const seedOrders = [
    {
        id: "order-march-1",
        order_no: "O-20240225-001",
        items: JSON.stringify([
            {
                id: "ham_pork",
                name: "豬肉堡",
                price: 30,
                qty: 2,
                addons: [{ label: "加蛋", price: 10 }],
            },
        ]),
        total: 80,
        created_at: "2024-02-25T09:30:00",
        note: "無備註",
        table_no: "A1",
        status: "done",
    },
    {
        id: "order-march-2",
        order_no: "O-20241125-002",
        items: JSON.stringify([
            {
                id: "toast_total",
                name: "總匯吐司",
                price: 50,
                qty: 1,
                addons: [],
            },
        ]),
        total: 50,
        created_at: "2024-11-25T10:45:00",
        note: "",
        table_no: "A2",
        status: "done",
    },
    {
        id: "order-march-3",
        order_no: "O-20250108-001",
        items: JSON.stringify([
            {
                id: "egg_ham",
                name: "火腿蛋餅",
                price: 35,
                qty: 1,
                addons: [{ label: "加起司", price: 10 }],
            },
        ]),
        total: 45,
        created_at: "2025-01-08T08:15:00",
        note: "加辣",
        table_no: "A3",
        status: "done",
    },
    {
        id: "order-april-1",
        order_no: "O-20250320-001",
        items: JSON.stringify([
            {
                id: "ham_cheese",
                name: "香脆雞腿堡",
                price: 60,
                qty: 1,
                addons: [],
            },
        ]),
        total: 60,
        created_at: "2025-03-20T10:00:00",
        note: "",
        table_no: "B1",
        status: "done",
    },
    {
        id: "order-april-2",
        order_no: "O-20250422-001",
        items: JSON.stringify([
            {
                id: "toast_porkchop",
                name: "豬排吐司",
                price: 30,
                qty: 2,
                addons: [{ label: "加蛋", price: 10 }],
            },
        ]),
        total: 80,
        created_at: "2025-04-22T09:00:00",
        note: "",
        table_no: "B2",
        status: "done",
    },
    {
        id: "order-april-3",
        order_no: "O-20250423-001",
        items: JSON.stringify([
            {
                id: "egg_meat",
                name: "夾肉蛋餅",
                price: 35,
                qty: 1,
                addons: [],
            },
            {
                id: "drink_milktea",
                name: "奶茶",
                price: 15,
                qty: 1,
                addons: [],
            },
        ]),
        total: 50,
        created_at: "2025-04-23T11:00:00",
        note: "少糖",
        table_no: "B3",
        status: "done",
    },
];

db.serialize(() => {
    const stmt = db.prepare(`
        INSERT INTO orders (id, order_no, items, total, created_at, note, table_no, status)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (const order of seedOrders) {
        stmt.run([
            order.id,
            order.order_no,
            order.items,
            order.total,
            order.created_at,
            order.note,
            order.table_no,
            order.status,
        ]);
    }

    stmt.finalize(() => {
        console.log("✅ 假資料已插入完成！");
        db.close();
    });
});
