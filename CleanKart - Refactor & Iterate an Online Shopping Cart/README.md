# CleanKart

A small JavaScript shopping-cart example showing incremental refactoring. Run the tests with `npm test`.

## Iterations

1. **Extracted product and cart responsibilities:** Products are created separately, while `ShoppingCart` owns add, remove, clear, and summary operations. This avoids mixing unrelated logic and keeps cart methods short.
2. **Added discount Strategy:** The cart accepts a discount object, so pricing behavior can change without rewriting cart operations. `NoDiscount` is the default; `PercentageDiscount` is an alternative.
3. **Added price-drop Observer:** `PriceDropNotifier` lets listeners subscribe and notifies them only when a product's price decreases. The returned unsubscribe function allows listeners to detach.
4. **Added Product Builder:** `ProductBuilder` provides a readable way to create products with required and optional properties while `Product` validates its data.

## Clean-code and design summary

The code uses descriptive names, small focused classes, validation at public entry points, and one implementation per responsibility. Shared cart behavior is kept in `ShoppingCart`, and discount calculation is injected instead of hard-coded into it. The Strategy pattern makes discount rules replaceable; Observer separates price updates from the listeners that react to drops; Builder makes product creation easier to extend without a long positional-argument list. These patterns make the example easier to change and test while avoiding unnecessary infrastructure.
