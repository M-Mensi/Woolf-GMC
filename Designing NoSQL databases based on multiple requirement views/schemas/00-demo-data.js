const database = db.getSiblingDB("ecommerce_initial");
const customerId = ObjectId("65a000000000000000000001");
const productId = ObjectId("65a000000000000000000002");
const orderId = ObjectId("65a000000000000000000003");
const createdAt = ISODate("2026-11-25T10:00:00Z");

database.customers.updateOne(
  { _id: customerId },
  {
    $setOnInsert: {
      email: "reader@example.test",
      name: "Sample Customer",
      defaultAddress: {
        recipient: "Sample Customer",
        line1: "10 Example Street",
        city: "Example City",
        region: "Example Region",
        postalCode: "E1 1AA",
        countryCode: "GB"
      },
      createdAt
    }
  },
  { upsert: true }
);

database.products.updateOne(
  { _id: productId },
  {
    $setOnInsert: {
      sku: "COFFEE-001",
      title: "Whole Bean Coffee",
      description: "A sample medium-roast whole bean coffee.",
      categoryIds: ["coffee", "pantry"],
      priceMinor: NumberLong(1299),
      currency: "USD",
      status: "active",
      popularityScore: 100,
      updatedAt: createdAt
    }
  },
  { upsert: true }
);

database.orders.updateOne(
  { _id: orderId },
  {
    $setOnInsert: {
      customerId,
      customerSnapshot: { name: "Sample Customer", email: "reader@example.test" },
      items: [{
        productId,
        sku: "COFFEE-001",
        title: "Whole Bean Coffee",
        quantity: NumberInt(1),
        unitPriceMinor: NumberLong(1299)
      }],
      totalMinor: NumberLong(1299),
      currency: "USD",
      status: "confirmed",
      delivery: {
        status: "unfulfilled",
        addressSnapshot: { city: "Example City", countryCode: "GB" }
      },
      createdAt,
      updatedAt: createdAt,
      version: NumberInt(1)
    }
  },
  { upsert: true }
);
