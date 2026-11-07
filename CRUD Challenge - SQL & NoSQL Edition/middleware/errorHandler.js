module.exports = (error, req, res, next) => {
  let statusCode = error.statusCode || 500;
  let message = error.message || "An unexpected error occurred.";

  if (error.type === "entity.parse.failed") {
    statusCode = 400;
    message = "Request body must contain valid JSON.";
  } else if (error.name === "ValidationError") {
    statusCode = 400;
    message = "The submitted product is invalid.";
  } else if (error.name === "CastError") {
    statusCode = 400;
    message = "Invalid product id.";
  }

  if (statusCode >= 500) {
    console.error(error);
    message = "An unexpected error occurred.";
  }

  res.status(statusCode).json({ error: message });
};
