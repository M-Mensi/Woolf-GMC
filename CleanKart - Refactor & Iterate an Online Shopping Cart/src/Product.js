export class Product {
  constructor({ name, price, category = "general" }) {
    if (typeof name !== "string" || name.trim() === "") {
      throw new TypeError("Product name is required");
    }
    if (!Number.isFinite(price) || price < 0) {
      throw new TypeError("Product price must be a non-negative number");
    }

    this.name = name;
    this.price = price;
    this.category = category;
  }
}

export class ProductBuilder {
  withName(name) {
    this.name = name;
    return this;
  }

  withPrice(price) {
    this.price = price;
    return this;
  }

  withCategory(category) {
    this.category = category;
    return this;
  }

  build() {
    return new Product({
      name: this.name,
      price: this.price,
      category: this.category,
    });
  }
}
