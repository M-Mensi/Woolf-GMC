const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

const cookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
});

function issueToken(user, res) {
  const token = jwt.sign({}, process.env.JWT_SECRET, {
    subject: user.id,
    expiresIn: "1d",
  });

  res.cookie("token", token, cookieOptions());
}

function publicUser(user) {
  return { id: user.id, email: user.email };
}

function normalizedEmail(email) {
  if (typeof email !== "string") {
    throw new AppError("A valid email and password are required.", 400);
  }

  const value = email.trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    throw new AppError("A valid email and password are required.", 400);
  }

  return value;
}

exports.signUp = catchAsync(async (req, res, next) => {
  const body = req.body || {};
  const email = normalizedEmail(body.email);
  const password = body.password;

  if (
    typeof password !== "string" ||
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    return next(
      new AppError("Password must be at least 8 characters and no more than 72 bytes.", 400)
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ email, passwordHash });

  issueToken(user, res);
  res.status(201).json({ user: publicUser(user) });
});

exports.login = catchAsync(async (req, res, next) => {
  const body = req.body || {};
  const email = normalizedEmail(body.email);
  const password = body.password;

  if (typeof password !== "string") {
    return next(new AppError("Invalid email or password.", 401));
  }

  const user = await User.findOne({ email }).select("+passwordHash");
  const passwordMatches =
    user && user.passwordHash ? await bcrypt.compare(password, user.passwordHash) : false;

  if (!passwordMatches) {
    return next(new AppError("Invalid email or password.", 401));
  }

  issueToken(user, res);
  res.json({ user: publicUser(user) });
});

exports.googleCallback = (req, res, next) => {
  if (!req.user) {
    return next(new AppError("Google sign-in could not be completed.", 401));
  }

  issueToken(req.user, res);
  return res.json({ user: publicUser(req.user) });
};

exports.logout = (req, res) => {
  res.clearCookie("token", cookieOptions());
  res.status(200).json({ message: "You have been logged out." });
};
