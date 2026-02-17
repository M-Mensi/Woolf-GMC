const { Product, ShoppingCart } = require('./index');

// --- Demo / Tests ---
// Create products
const p1 = new Product(1, 'T-shirt', 19.99);
const p2 = new Product(2, 'Jeans', 49.5);
const p3 = new Product(3, 'Cap', 9.25);

// Create a shopping cart
const cart = new ShoppingCart();

// Add items to the cart
cart.addItem(p1, 2); // 2 T-shirts
cart.addItem(p2);    // 1 Jeans
cart.addItem(p3, 3); // 3 Caps

// Display the cart
console.log('\n--- Cart after adding items ---');
cart.displayItems();

// Remove an item from the cart (remove Jeans entirely)
cart.removeItem(2);
console.log('\n--- Cart after removing product id 2 (Jeans) ---');
cart.displayItems();

// Remove 2 caps (partial removal)
cart.removeItem(3, 2);
console.log('\n--- Cart after removing 2 units of product id 3 (Cap) ---');
cart.displayItems();
