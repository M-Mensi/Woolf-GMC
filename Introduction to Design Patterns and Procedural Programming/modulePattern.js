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

export const shoppingCart = (() => {
  const items = [];

  function addItem(name, quantity, price) {
    validateItem(name, quantity, price);
    items.push({ name, quantity, price });
  }

  function viewCart() {
    const lines = items.map(({ name, quantity, price }) =>
      `${name} (x${quantity}) - ${(quantity * price).toFixed(2)} TND`,
    );
    const total = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
    lines.push(`Total: ${total.toFixed(2)} TND`);
    return lines.join("\n");
  }

  function removeItem(name) {
    const index = items.findIndex((item) => item.name === name);
    if (index !== -1) {
      items.splice(index, 1);
    }
  }

  function clearCart() {
    items.length = 0;
  }

  return { addItem, viewCart, removeItem, clearCart };
})();
