import test from "node:test";
import assert from "node:assert/strict";
import * as procedural from "../procedural.js";
import { shoppingCart } from "../modulePattern.js";

for (const [name, cart] of [
  ["procedural", procedural],
  ["Module pattern", shoppingCart],
]) {
  test(`${name}: adds, displays, removes, and clears items`, () => {
    cart.clearCart();
    cart.addItem("Apple", 2, 1.5);
    cart.addItem("Orange", 3, 2);

    assert.equal(
      cart.viewCart(),
      "Apple (x2) - 3.00 TND\nOrange (x3) - 6.00 TND\nTotal: 9.00 TND",
    );

    cart.removeItem("Apple");
    assert.equal(cart.viewCart(), "Orange (x3) - 6.00 TND\nTotal: 6.00 TND");

    cart.clearCart();
    assert.equal(cart.viewCart(), "Total: 0.00 TND");
  });

  test(`${name}: rejects invalid item details`, () => {
    cart.clearCart();
    assert.throws(() => cart.addItem("", 1, 1), /Item name/);
    assert.throws(() => cart.addItem("Apple", 0, 1), /Quantity/);
    assert.throws(() => cart.addItem("Apple", 1, -1), /Price/);
  });
}
