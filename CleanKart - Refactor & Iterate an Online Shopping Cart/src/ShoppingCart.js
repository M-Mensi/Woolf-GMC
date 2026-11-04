import { NoDiscount } from "./DiscountStrategies.js";

export class ShoppingCart {
  constructor(discountStrategy = new NoDiscount()) {
    this.items = [];
    this.discountStrategy = discountStrategy;
  }

  add(product, quantity = 1) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new TypeError("Quantity must be a positive integer");
    }

    const item = this.items.find((entry) => entry.product === product);
    if (item) {
      item.quantity += quantity;
    } else {
      this.items.push({ product, quantity });
    }
  }

  remove(productName) {
    this.items = this.items.filter((item) => item.product.name !== productName);
  }

  clear() {
    this.items = [];
  }

  getSummary() {
    const subtotal = this.items.reduce(
      (sum, { product, quantity }) => sum + product.price * quantity,
      0,
    );
    const total = this.discountStrategy.calculate(subtotal);

    return { items: [...this.items], subtotal, total, savings: subtotal - total };
  }
}
