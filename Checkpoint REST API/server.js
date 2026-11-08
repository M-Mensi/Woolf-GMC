require("dotenv").config({ path: "config/.env" });

const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");

const app = express();
const port = process.env.PORT || 3000;

// Parse JSON request bodies before they reach the routes.
app.use(express.json());

// Return every user in the database.
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Validate and save a new user from the request body.
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update a user by ID and return the updated document.
app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a user by ID and return the removed document.
app.delete("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    res.json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start listening only after MongoDB is connected.
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}.`);
    });
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB:", error.message);
    process.exitCode = 1;
  });
