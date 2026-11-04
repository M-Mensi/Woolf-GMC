let cart = [];

function validateItem(name, quantity, price) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new TypeError("Item name must be a non-empty string");
  }
  if (!Number.isInteger(quantity) || quantity <= 0) {
    throw new TypeError("Quantity must be a positive integer");
  }
  if (!Number.isFinite(price) || price < 0) {
    throw new TypeError("Price must be a non-negative number");
  }
}

export function addItem(name, quantity, price) {
  validateItem(name, quantity, price);
  cart.push({ name, quantity, price });
}

export function viewCart() {
  const lines = cart.map(({ name, quantity, price }) =>
    `${name} (x${quantity}) - ${(quantity * price).toFixed(2)} TND`,
  );
  const total = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);
  lines.push(`Total: ${total.toFixed(2)} TND`);
  return lines.join("\n");
}

export function removeItem(name) {
  const index = cart.findIndex((item) => item.name === name);
  if (index !== -1) {
    cart.splice(index, 1);
  }
}

export function clearCart() {
  cart = [];
}
