const database = db.getSiblingDB("ecommerce_initial");

const validators = {
  customers: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "name", "createdAt"],
      properties: {
        email: { bsonType: "string", minLength: 3, maxLength: 254 },
        name: { bsonType: "string", minLength: 1, maxLength: 120 },
        defaultAddress: {
          bsonType: "object",
          properties: {
            recipient: { bsonType: "string", maxLength: 120 },
            line1: { bsonType: "string", maxLength: 160 },
            line2: { bsonType: "string", maxLength: 160 },
            city: { bsonType: "string", maxLength: 100 },
            region: { bsonType: "string", maxLength: 100 },
            postalCode: { bsonType: "string", maxLength: 24 },
            countryCode: { bsonType: "string", pattern: "^[A-Z]{2}$" }
          }
        },
        createdAt: { bsonType: "date" }
      }
    }
  },
  products: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sku", "title", "description", "categoryIds", "priceMinor", "currency", "status", "updatedAt"],
      properties: {
        sku: { bsonType: "string", minLength: 1, maxLength: 64 },
        title: { bsonType: "string", minLength: 1, maxLength: 200 },
        description: { bsonType: "string", maxLength: 12000 },
        categoryIds: { bsonType: "array", minItems: 1, maxItems: 20, items: { bsonType: "string" } },
        priceMinor: { bsonType: ["int", "long"], minimum: 0 },
        currency: { bsonType: "string", pattern: "^[A-Z]{3}$" },
        status: { enum: ["active", "draft", "archived"] },
        popularityScore: { bsonType: ["int", "long", "double"], minimum: 0 },
        updatedAt: { bsonType: "date" }
      }
    }
  },
  orders: {
    $jsonSchema: {
      bsonType: "object",
      required: ["customerId", "customerSnapshot", "items", "totalMinor", "currency", "status", "delivery", "createdAt", "updatedAt", "version"],
      properties: {
        customerId: { bsonType: "objectId" },
        customerSnapshot: {
          bsonType: "object",
          required: ["name", "email"],
          properties: {
            name: { bsonType: "string", maxLength: 120 },
            email: { bsonType: "string", maxLength: 254 }
          }
        },
        items: {
          bsonType: "array",
          minItems: 1,
          maxItems: 100,
          items: {
            bsonType: "object",
            required: ["productId", "sku", "title", "quantity", "unitPriceMinor"],
            properties: {
              productId: { bsonType: "objectId" },
              sku: { bsonType: "string", maxLength: 64 },
              title: { bsonType: "string", maxLength: 200 },
              quantity: { bsonType: ["int", "long"], minimum: 1, maximum: 10000 },
              unitPriceMinor: { bsonType: ["int", "long"], minimum: 0 }
            }
          }
        },
        totalMinor: { bsonType: ["int", "long"], minimum: 0 },
        currency: { bsonType: "string", pattern: "^[A-Z]{3}$" },
        status: { enum: ["pending", "confirmed", "fulfilling", "shipped", "delivered", "cancelled"] },
        delivery: {
          bsonType: "object",
          required: ["status", "addressSnapshot"],
          properties: {
            status: { enum: ["unfulfilled", "packed", "in_transit", "delivered", "exception"] },
            addressSnapshot: { bsonType: "object" },
            trackingCode: { bsonType: "string", maxLength: 128 },
            updatedAt: { bsonType: "date" }
          }
        },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        version: { bsonType: ["int", "long"], minimum: 1 }
      }
    }
  }
};

for (const [collectionName, validator] of Object.entries(validators)) {
  if (!database.getCollectionNames().includes(collectionName)) {
    database.createCollection(collectionName, { validator, validationLevel: "strict", validationAction: "error" });
  } else {
    database.runCommand({
      collMod: collectionName,
      validator,
      validationLevel: "strict",
      validationAction: "error"
    });
  }
}

database.customers.createIndex({ email: 1 }, { name: "customer_email_unique", unique: true });
database.products.createIndex({ sku: 1 }, { name: "product_sku_unique", unique: true });
database.products.createIndex(
  { status: 1, categoryIds: 1, popularityScore: -1, _id: 1 },
  { name: "active_category_popularity" }
);
database.products.createIndex(
  { status: 1, categoryIds: 1, priceMinor: 1, _id: 1 },
  { name: "active_category_price" }
);
database.products.createIndex(
  { title: "text", description: "text" },
  { name: "product_text_search" }
);
database.orders.createIndex(
  { customerId: "hashed" },
  { name: "order_customer_shard_key" }
);
database.orders.createIndex(
  { customerId: 1, createdAt: -1 },
  { name: "customer_order_history" }
);
database.orders.createIndex(
  { status: 1, "delivery.status": 1, createdAt: 1 },
  { name: "fulfillment_queue" }
);
