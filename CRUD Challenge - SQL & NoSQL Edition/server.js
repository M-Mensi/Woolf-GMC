require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const mysql = require("mysql2/promise");
const createNoSQLController = require("./controllers/NoSQLcontroller");
const createSQLController = require("./controllers/SQLcontroller");
const createProductRoutes = require("./routes/productRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "10kb" }));

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI must be set.");
  }

  await mongoose.connect(process.env.MONGODB_URI);

  const mysqlPool = mysql.createPool({
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: Number(process.env.MYSQL_PORT || 3306),
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASSWORD || "",
    database: process.env.MYSQL_DATABASE || "product_crud",
    waitForConnections: true,
    connectionLimit: 10,
  });

  await mysqlPool.query("SELECT 1");

  app.use(
    "/api/mongo/products",
    createProductRoutes(createNoSQLController())
  );
  app.use(
    "/api/mysql/products",
    createProductRoutes(createSQLController(mysqlPool))
  );

  app.use((req, res) => {
    res.status(404).json({ error: "Route not found." });
  });
  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Product CRUD API listening on http://localhost:${port}`);
  });
}

start().catch((error) => {
  console.error("Could not start the Product CRUD API:", error);
  process.exit(1);
});
