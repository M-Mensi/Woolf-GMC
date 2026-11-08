const mongoose = require("mongoose");

// Define the fields stored for each user.
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, min: 0 },
});

// Export the model so the API routes can access the users collection.
module.exports = mongoose.model("User", userSchema);
