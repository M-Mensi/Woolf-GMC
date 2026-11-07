const express = require("express");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const passport = require("passport");
const configureGoogleOAuth = require("./config/passport");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");
const AppError = require("./utils/AppError");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const googleOAuthEnabled = configureGoogleOAuth(passport);

app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 10 * 60 * 1000,
    },
  })
);
app.use(passport.initialize());

app.get("/", (req, res) => {
  res.json({ message: "Secure Task Manager API" });
});
app.use("/auth", authRoutes(passport, googleOAuthEnabled));
app.use("/tasks", taskRoutes);

app.use((req, res, next) => {
  next(new AppError("Route not found.", 404));
});
app.use(errorHandler);

module.exports = app;
