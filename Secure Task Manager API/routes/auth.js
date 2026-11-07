const express = require("express");
const rateLimit = require("express-rate-limit");
const passport = require("passport");
const authController = require("../controllers/authController");
const AppError = require("../utils/AppError");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new AppError("Too many authentication attempts. Try again later.", 429));
  },
});

module.exports = (passportInstance, googleOAuthEnabled) => {
  const router = express.Router();

  router.post("/signup", authLimiter, authController.signUp);
  router.post("/login", authLimiter, authController.login);
  router.post("/logout", authController.logout);

  if (googleOAuthEnabled) {
    router.get(
      "/google",
      passportInstance.authenticate("google", {
        scope: ["profile", "email"],
      })
    );
    router.get(
      "/google/callback",
      passportInstance.authenticate("google", {
        session: false,
        failureRedirect: "/auth/google/failed",
      }),
      authController.googleCallback
    );
  } else {
    const unavailable = (req, res, next) => {
      next(new AppError("Google sign-in is not configured.", 503));
    };
    router.get("/google", unavailable);
    router.get("/google/callback", unavailable);
  }

  router.get("/google/failed", (req, res, next) => {
    next(new AppError("Google sign-in could not be completed.", 401));
  });

  return router;
};
