const mongoose = require("mongoose");

const MONGO_URI = "mongodb://127.0.0.1:27017/notes-api";

const connectToDb = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

module.exports = connectToDb;
