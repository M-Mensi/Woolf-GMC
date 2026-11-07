const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

module.exports = catchAsync(async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return next(new AppError("Authentication is required.", 401));
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
      return next(new AppError("Your session is invalid or has expired.", 401));
    }

    throw error;
  }

  const user = await User.findById(payload.sub);

  if (!user) {
    return next(new AppError("The account for this session no longer exists.", 401));
  }

  req.user = user;
  return next();
});
