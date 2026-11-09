require("dotenv").config();

const path = require("node:path");
const express = require("express");
const mongoose = require("mongoose");
const ContactMessage = require("./models/ContactMessage");

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ limit: "10kb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", database: mongoose.connection.readyState === 1 });
});

// Validate and store contact form submissions in MongoDB.
app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body;

  if (
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof message !== "string" ||
    !name.trim() ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
    !message.trim() ||
    name.trim().length > 100 ||
    email.trim().length > 254 ||
    message.trim().length > 5000
  ) {
    return res.status(400).json({ error: "Please enter a valid name, email, and message." });
  }

  try {
    await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });
    res.status(201).json({ message: "Thanks for reaching out. I'll be in touch soon." });
  } catch (error) {
    console.error("Could not save contact message:", error);
    res.status(500).json({ error: "Your message could not be sent. Please try again." });
  }
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
  const uri = process.env.MONGO_URI;
  if (!uri || uri.includes("<")) {
    throw new Error("Set a valid MongoDB Atlas MONGO_URI in your .env file.");
  }

  await mongoose.connect(uri);
  app.listen(port, () => {
    console.log(`Portfolio server listening on port ${port}.`);
  });
}

if (require.main === module) {
  start().catch((error) => {
    console.error("Could not start the portfolio:", error.message);
    process.exitCode = 1;
  });
}

module.exports = { app, start };
