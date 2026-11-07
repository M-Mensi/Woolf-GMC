const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { validateProduct } = require("../utils/validateProduct");

function createSQLController(pool) {
  return {
    create: catchAsync(async (req, res, next) => {
      const input = validateProduct(req.body, true, next);
      if (!input) return;

      const [result] = await pool.execute(
        "INSERT INTO products (name, price, category, inStock) VALUES (?, ?, ?, ?)",
        [
          input.name,
          input.price,
          input.category === undefined ? null : input.category,
          input.inStock === undefined ? true : input.inStock,
        ]
      );
      const [rows] = await pool.execute("SELECT * FROM products WHERE id = ?", [
        result.insertId,
      ]);

      res.status(201).json({ product: rows[0] });
    }),

    getAll: catchAsync(async (req, res) => {
      const [products] = await pool.execute(
        "SELECT * FROM products ORDER BY id DESC"
      );
      res.json({ products });
    }),

    getOne: catchAsync(async (req, res, next) => {
      const id = parseId(req.params.id, next);
      if (id === null) return;

      const [rows] = await pool.execute("SELECT * FROM products WHERE id = ?", [id]);
      if (rows.length === 0) return next(new AppError("Product not found.", 404));

      res.json({ product: rows[0] });
    }),

    update: catchAsync(async (req, res, next) => {
      const id = parseId(req.params.id, next);
      if (id === null) return;

      const input = validateProduct(req.body, false, next);
      if (!input) return;

      const fields = Object.keys(input);
      if (fields.length === 0) {
        return next(new AppError("Provide at least one product field to update.", 400));
      }

      const columns = {
        name: "name",
        price: "price",
        category: "category",
        inStock: "inStock",
      };
      const assignments = fields.map((field) => `${columns[field]} = ?`).join(", ");
      const values = fields.map((field) => input[field]);
      const [result] = await pool.execute(
        `UPDATE products SET ${assignments} WHERE id = ?`,
        [...values, id]
      );
      if (result.affectedRows === 0) {
        const [existing] = await pool.execute("SELECT id FROM products WHERE id = ?", [id]);
        if (existing.length === 0) return next(new AppError("Product not found.", 404));
      }

      const [rows] = await pool.execute("SELECT * FROM products WHERE id = ?", [id]);
      res.json({ product: rows[0] });
    }),

    delete: catchAsync(async (req, res, next) => {
      const id = parseId(req.params.id, next);
      if (id === null) return;

      const [result] = await pool.execute("DELETE FROM products WHERE id = ?", [id]);
      if (result.affectedRows === 0) return next(new AppError("Product not found.", 404));

      res.json({ message: "Product deleted." });
    }),
  };
}

function parseId(value, next) {
  if (!/^[1-9]\d*$/.test(value)) {
    next(new AppError("Invalid product id.", 400));
    return null;
  }

  const id = Number(value);
  if (!Number.isSafeInteger(id)) {
    next(new AppError("Invalid product id.", 400));
    return null;
  }

  return id;
}

module.exports = createSQLController;
