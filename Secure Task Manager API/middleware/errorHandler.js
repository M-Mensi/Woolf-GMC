module.exports = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "An unexpected error occurred.";

  if (error.code === 11000) {
    statusCode = 409;
    message = "An account with that email already exists.";
  } else if (error.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Request body must contain valid JSON.";
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    message = "The submitted data is invalid.";
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "The supplied identifier is invalid.";
  }

  if (statusCode >= 500) {
    console.error(error);
    message = "An unexpected error occurred.";
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV !== "production" && statusCode >= 500
      ? { details: error.message }
      : {}),
  });
};
