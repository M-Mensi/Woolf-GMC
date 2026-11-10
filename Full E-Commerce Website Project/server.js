require("dotenv").config();

const path = require("node:path");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Order = require("./models/Order");
const Product = require("./models/Product");
const User = require("./models/User");

const app = express();
const port = process.env.PORT || 5000;
const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role };
}

function setSession(res, user) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not configured.");
  const token = jwt.sign(
    { sub: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
  res.cookie("shop_session", token, cookieOptions);
}

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies.shop_session;
    if (!token || !process.env.JWT_SECRET) {
      return res.status(401).json({ error: "Please sign in to continue." });
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.sub);
    if (!user) return res.status(401).json({ error: "Please sign in to continue." });
    req.user = user;
    next();
  } catch {
    res.clearCookie("shop_session", cookieOptions);
    res.status(401).json({ error: "Your session expired. Please sign in again." });
  }
}

function requireAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Administrator access is required." });
  }
  next();
}

function validId(id) {
  return mongoose.isValidObjectId(id);
}

function validateProduct(body = {}) {
  const { name, description, category, image = "", price, stock = 0 } = body;
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.trim().length > 160 ||
    typeof description !== "string" ||
    !description.trim() ||
    description.trim().length > 3000 ||
    typeof category !== "string" ||
    !category.trim() ||
    category.trim().length > 80 ||
    typeof image !== "string" ||
    image.length > 2000 ||
    !Number.isFinite(Number(price)) ||
    Number(price) < 0 ||
    !Number.isInteger(Number(stock)) ||
    Number(stock) < 0
  ) {
    return null;
  }
  return {
    name: name.trim(),
    description: description.trim(),
    category: category.trim(),
    image: image.trim(),
    price: Number(price),
    stock: Number(stock),
    featured: body.featured === true,
  };
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: mongoose.connection.readyState === 1 });
});

app.post("/api/auth/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (
    typeof name !== "string" ||
    !name.trim() ||
    name.trim().length > 100 ||
    typeof email !== "string" ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    typeof password !== "string" ||
    password.length < 8 ||
    password.length > 128
  ) {
    return res.status(400).json({
      error: "Enter a name, valid email, and password between 8 and 128 characters.",
    });
  }
  try {
    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role:
        normalizedEmail === process.env.ADMIN_EMAIL?.trim().toLowerCase()
          ? "admin"
          : "customer",
    });
    setSession(res, user);
    res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ error: "An account with that email already exists." });
    }
    console.error("Could not register user:", error);
    res.status(500).json({ error: "Could not create your account." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ error: "Enter your email and password." });
  }
  try {
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Email or password is incorrect." });
    }
    setSession(res, user);
    res.json({ user: publicUser(user) });
  } catch (error) {
    console.error("Could not sign in:", error);
    res.status(500).json({ error: "Could not sign in right now." });
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

app.post("/api/auth/logout", (req, res) => {
  const { maxAge, ...clearOptions } = cookieOptions;
  res.clearCookie("shop_session", clearOptions);
  res.json({ message: "Signed out." });
});

app.get("/api/products", async (req, res) => {
  const query = {};
  if (typeof req.query.category === "string" && req.query.category !== "All") {
    query.category = req.query.category;
  }
  if (typeof req.query.search === "string" && req.query.search.trim()) {
    const escaped = req.query.search.trim().slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    query.$or = [
      { name: new RegExp(escaped, "i") },
      { description: new RegExp(escaped, "i") },
      { category: new RegExp(escaped, "i") },
    ];
  }
  try {
    const products = await Product.find(query).sort({ featured: -1, createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Could not load products:", error);
    res.status(500).json({ error: "Could not load products." });
  }
});

app.post("/api/products", requireAuth, requireAdmin, async (req, res) => {
  const product = validateProduct(req.body);
  if (!product) return res.status(400).json({ error: "Enter valid product details." });
  try {
    res.status(201).json(await Product.create(product));
  } catch (error) {
    console.error("Could not create product:", error);
    res.status(500).json({ error: "Could not create product." });
  }
});

app.put("/api/products/:id", requireAuth, requireAdmin, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid product ID." });
  const product = validateProduct(req.body);
  if (!product) return res.status(400).json({ error: "Enter valid product details." });
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, product, {
      new: true,
      runValidators: true,
    });
    if (!updated) return res.status(404).json({ error: "Product not found." });
    res.json(updated);
  } catch (error) {
    console.error("Could not update product:", error);
    res.status(500).json({ error: "Could not update product." });
  }
});

app.delete("/api/products/:id", requireAuth, requireAdmin, async (req, res) => {
  if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid product ID." });
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Product not found." });
    res.json({ message: "Product deleted." });
  } catch (error) {
    console.error("Could not delete product:", error);
    res.status(500).json({ error: "Could not delete product." });
  }
});

app.post("/api/orders", requireAuth, async (req, res) => {
  const { items, shipping } = req.body || {};
  const shippingLimits = { name: 100, address: 200, city: 100, postalCode: 20 };
  if (
    !Array.isArray(items) ||
    items.length < 1 ||
    items.length > 50 ||
    !shipping ||
    Object.entries(shippingLimits).some(
      ([field, limit]) =>
        typeof shipping[field] !== "string" ||
        !shipping[field].trim() ||
        shipping[field].trim().length > limit
    )
  ) {
    return res.status(400).json({ error: "Enter valid shipping details and cart items." });
  }
  const quantities = new Map();
  for (const item of items) {
    if (
      !item ||
      typeof item !== "object" ||
      !validId(item.product) ||
      !Number.isInteger(item.quantity) ||
      item.quantity < 1
    ) {
      return res.status(400).json({ error: "The cart contains an invalid item or quantity." });
    }
    quantities.set(item.product, (quantities.get(item.product) || 0) + item.quantity);
  }
  const session = await mongoose.startSession();
  let order;
  try {
    await session.withTransaction(async () => {
      const products = await Product.find({
        _id: { $in: [...quantities.keys()] },
      }).session(session);
      if (products.length !== quantities.size) {
        const error = new Error("A cart product is no longer available.");
        error.status = 400;
        throw error;
      }

      for (const product of products) {
        if (product.stock < quantities.get(product._id.toString())) {
          const error = new Error(`${product.name} does not have enough stock.`);
          error.status = 409;
          throw error;
        }
      }

      const orderItems = products.map((product) => ({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        quantity: quantities.get(product._id.toString()),
      }));
      const [createdOrder] = await Order.create(
        [
          {
            user: req.user._id,
            items: orderItems,
            total: orderItems.reduce(
              (total, item) => total + item.price * item.quantity,
              0
            ),
            shipping: Object.fromEntries(
              ["name", "address", "city", "postalCode"].map((field) => [
                field,
                shipping[field].trim(),
              ])
            ),
          },
        ],
        { session }
      );
      for (const item of orderItems) {
        const result = await Product.updateOne(
          { _id: item.product, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session }
        );
        if (result.modifiedCount !== 1) {
          throw new Error(`${item.name} stock changed during checkout. Please try again.`);
        }
      }
      order = createdOrder;
    });
    res.status(201).json(order);
  } catch (error) {
    if (error.status) return res.status(error.status).json({ error: error.message });
    console.error("Could not place order:", error);
    res.status(500).json({ error: "Could not place order." });
  } finally {
    await session.endSession();
  }
});

app.get("/api/orders/mine", requireAuth, async (req, res) => {
  try {
    res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
  } catch (error) {
    console.error("Could not load orders:", error);
    res.status(500).json({ error: "Could not load orders." });
  }
});

app.get("/api/orders", requireAuth, requireAdmin, async (req, res) => {
  try {
    res.json(await Order.find().populate("user", "name email").sort({ createdAt: -1 }));
  } catch (error) {
    console.error("Could not load orders:", error);
    res.status(500).json({ error: "Could not load orders." });
  }
});

app.patch("/api/orders/:id/status", requireAuth, requireAdmin, async (req, res) => {
  const statuses = ["processing", "shipped", "delivered", "cancelled"];
  if (!validId(req.params.id)) return res.status(400).json({ error: "Invalid order ID." });
  if (!statuses.includes(req.body.status)) {
    return res.status(400).json({ error: "Invalid order status." });
  }
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true, runValidators: true }
    );
    if (!order) return res.status(404).json({ error: "Order not found." });
    res.json(order);
  } catch (error) {
    console.error("Could not update order:", error);
    res.status(500).json({ error: "Could not update order." });
  }
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error instanceof SyntaxError && "body" in error) {
    return res.status(400).json({ error: "Request body must be valid JSON." });
  }
  console.error("Unhandled API error:", error);
  res.status(500).json({ error: "An unexpected server error occurred." });
});

const buildPath = path.join(__dirname, "dist");
app.use(express.static(buildPath));
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(buildPath, "index.html"), (error) => {
    if (error) next();
  });
});

async function start() {
  if (!process.env.MONGO_URI || !process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    throw new Error("Set MONGO_URI and a JWT_SECRET of at least 32 characters in .env.");
  }
  await mongoose.connect(process.env.MONGO_URI);
  if (process.env.SEED_DEMO_PRODUCTS !== "false" && (await Product.countDocuments()) === 0) {
    await Product.insertMany([
      {
        name: "Ridge Ceramic Mug",
        description: "A softly sculpted stoneware mug for the first cup and the last.",
        category: "Ceramics",
        price: 28,
        stock: 18,
        featured: true,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Everyday Linen Tote",
        description: "A sturdy, roomy carry-all in washed natural linen.",
        category: "Carry",
        price: 36,
        stock: 24,
        image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Soft Form Table Lamp",
        description: "Warm light, a quiet silhouette, and a place in any corner.",
        category: "Home",
        price: 84,
        stock: 9,
        featured: true,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Field Notes Set",
        description: "Three uncoated notebooks for lists, sketches, and small plans.",
        category: "Paper",
        price: 19,
        stock: 32,
        image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Sunday Glass Vase",
        description: "Hand-finished clear glass made for a single stem or gathered blooms.",
        category: "Home",
        price: 42,
        stock: 12,
        image: "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=900&q=85",
      },
      {
        name: "Woven Market Basket",
        description: "A natural woven basket for market mornings and everyday storage.",
        category: "Carry",
        price: 58,
        stock: 7,
        image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=85",
      },
    ]);
  }
  app.listen(port, () => console.log(`Shop server listening on port ${port}.`));
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Could not start the shop:", error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, start };
