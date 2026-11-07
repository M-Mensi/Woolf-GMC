require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");

const requiredSecrets = ["JWT_SECRET", "SESSION_SECRET"];

for (const name of requiredSecrets) {
  if (!process.env[name] || process.env[name].length < 32) {
    throw new Error(`${name} must be set to a secret with at least 32 characters.`);
  }
}

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI must be set.");
}

const port = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`Task Manager API listening on http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Could not connect to MongoDB:", error);
    process.exit(1);
  });
