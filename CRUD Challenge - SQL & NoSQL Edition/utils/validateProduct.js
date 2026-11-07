const AppError = require("./AppError");

const allowedFields = ["name", "price", "category", "inStock"];
const hasOwn = (object, field) => Object.prototype.hasOwnProperty.call(object, field);

function validateProduct(body, creating, next) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    next(new AppError("Request body must be a JSON object.", 400));
    return null;
  }

  const unknownFields = Object.keys(body).filter((field) => !allowedFields.includes(field));
  if (unknownFields.length > 0) {
    next(new AppError(`Unknown product field: ${unknownFields[0]}.`, 400));
    return null;
  }

  const input = {};

  if (creating || hasOwn(body, "name")) {
    if (typeof body.name !== "string" || body.name.trim() === "") {
      next(new AppError("Name is required and must be a non-empty string.", 400));
      return null;
    }
    input.name = body.name.trim();
  }

  if (creating || hasOwn(body, "price")) {
    if (typeof body.price !== "number" || !Number.isFinite(body.price) || body.price < 0) {
      next(new AppError("Price is required and must be a non-negative number.", 400));
      return null;
    }
    input.price = body.price;
  }

  if (hasOwn(body, "category")) {
    if (body.category !== null && typeof body.category !== "string") {
      next(new AppError("Category must be a string or null.", 400));
      return null;
    }
    input.category = body.category === null ? null : body.category.trim();
  }

  if (hasOwn(body, "inStock")) {
    if (typeof body.inStock !== "boolean") {
      next(new AppError("inStock must be a boolean.", 400));
      return null;
    }
    input.inStock = body.inStock;
  }

  return input;
}

module.exports = { validateProduct };
