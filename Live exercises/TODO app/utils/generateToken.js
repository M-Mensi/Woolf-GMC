const jwt = require("jsonwebtoken");

const JWT_SECRET = "my_super_secret_key";

const generateToken = (user) => {
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
};

module.exports = generateToken;
