// Product class
class Product {
	constructor(id, name, price) {
		this.id = id;
		this.name = name;
		this.price = price;
	}
}

// ShoppingCartItem
class ShoppingCartItem {
	constructor(product, quantity = 1) {
		this.product = product;
		this.quantity = quantity;
	}

	// Calculate total price
	totalPrice() {
		return this.product.price * this.quantity;
	}
}

// ShoppingCart
class ShoppingCart {
	constructor() {
		this.items = [];
	}

	// Get total number of items
	getTotalItems() {
		return this.items.reduce((sum, it) => sum + it.quantity, 0);
	}

	// Add items
	addItem(product, quantity = 1) {
		const existing = this.items.find(i => i.product.id === product.id);
		if (existing) {
			existing.quantity += quantity;
		} else {
			this.items.push(new ShoppingCartItem(product, quantity));
		}
	}

	// Remove items Returns true if something was removed.
	removeItem(productId, quantity = null) {
		const idx = this.items.findIndex(i => i.product.id === productId);
		if (idx === -1) return false;

		if (quantity === null || this.items[idx].quantity <= quantity) {
			// remove whole item
			this.items.splice(idx, 1);
		} else {
			// decrease quantity
			this.items[idx].quantity -= quantity;
		}
		return true;
	}

	// Display cart items to console with totals
	displayItems() {
		if (this.items.length === 0) {
			console.log('Cart is empty.');
			return;
		}

		console.log('Cart items:');
		this.items.forEach((item, i) => {
			const line = `${i + 1}. ${item.product.name} (id:${item.product.id}) - $${item.product.price.toFixed(2)} x ${item.quantity} = $${item.totalPrice().toFixed(2)}`;
			console.log(line);
		});

		console.log(`Total items: ${this.getTotalItems()}`);
		const totalPrice = this.items.reduce((sum, it) => sum + it.totalPrice(), 0);
		console.log(`Cart total price: $${totalPrice.toFixed(2)}`);
	}
}

// Export classes for external use
module.exports = { Product, ShoppingCartItem, ShoppingCart };

