export class PriceDropNotifier {
  #observers = new Set();

  subscribe(observer) {
    if (typeof observer !== "function") {
      throw new TypeError("Observer must be a function");
    }
    this.#observers.add(observer);
    return () => this.#observers.delete(observer);
  }

  updatePrice(product, newPrice) {
    if (!Number.isFinite(newPrice) || newPrice < 0) {
      throw new TypeError("Product price must be a non-negative number");
    }

    const oldPrice = product.price;
    product.price = newPrice;

    if (newPrice < oldPrice) {
      const event = { product, oldPrice, newPrice };
      for (const observer of this.#observers) {
        observer(event);
      }
    }
  }
}
