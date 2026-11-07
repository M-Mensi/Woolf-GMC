const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { validateProduct } = require("../utils/validateProduct");

function createNoSQLController() {
  return {
    create: catchAsync(async (req, res, next) => {
      const input = validateProduct(req.body, true, next);
      if (!input) return;

      const product = await Product.create(input);
      res.status(201).json({ product });
    }),

    getAll: catchAsync(async (req, res) => {
      const products = await Product.find().sort({ createdAt: -1 });
      res.json({ products });
    }),

    getOne: catchAsync(async (req, res, next) => {
      if (!Product.db.base.isValidObjectId(req.params.id)) {
        return next(new AppError("Invalid product id.", 400));
      }

      const product = await Product.findById(req.params.id);
      if (!product) return next(new AppError("Product not found.", 404));

      res.json({ product });
    }),

    update: catchAsync(async (req, res, next) => {
      if (!Product.db.base.isValidObjectId(req.params.id)) {
        return next(new AppError("Invalid product id.", 400));
      }

      const input = validateProduct(req.body, false, next);
      if (!input) return;
      if (Object.keys(input).length === 0) {
        return next(new AppError("Provide at least one product field to update.", 400));
      }

      const product = await Product.findByIdAndUpdate(req.params.id, input, {
        new: true,
        runValidators: true,
      });
      if (!product) return next(new AppError("Product not found.", 404));

      res.json({ product });
    }),

    delete: catchAsync(async (req, res, next) => {
      if (!Product.db.base.isValidObjectId(req.params.id)) {
        return next(new AppError("Invalid product id.", 400));
      }

      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) return next(new AppError("Product not found.", 404));

      res.json({ message: "Product deleted." });
    }),
  };
}

module.exports = createNoSQLController;
