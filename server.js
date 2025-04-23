// server.js
require("./db/database"); // 初始化資料庫
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const orderRoutes = require("./routes/order");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// 靜態資源
app.use(express.static("public"));
app.use("/data", express.static("data"));

// 正確掛載 API
app.use("/api/order", orderRoutes);

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
