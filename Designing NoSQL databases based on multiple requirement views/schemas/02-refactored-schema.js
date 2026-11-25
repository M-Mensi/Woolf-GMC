const database = db.getSiblingDB("ecommerce_refactored");

const validators = {
  customers: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "name", "createdAt"],
      properties: {
        email: { bsonType: "string", minLength: 3, maxLength: 254 },
        name: { bsonType: "string", minLength: 1, maxLength: 120 },
        defaultAddress: { bsonType: "object" },
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
      required: ["bucket", "customerId", "customerSnapshot", "items", "totalMinor", "currency", "status", "delivery", "createdAt", "updatedAt", "version"],
      properties: {
        bucket: { bsonType: "string", pattern: "^\\d{4}-(0[1-9]|1[0-2])$" },
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
            required: ["productId", "sku", "title", "categoryId", "quantity", "unitPriceMinor"],
            properties: {
              productId: { bsonType: "objectId" },
              sku: { bsonType: "string", maxLength: 64 },
              title: { bsonType: "string", maxLength: 200 },
              categoryId: { bsonType: "string", maxLength: 80 },
              quantity: { bsonType: ["int", "long"], minimum: 1, maximum: 10000 },
              unitPriceMinor: { bsonType: ["int", "long"], minimum: 0 }
            }
          }
        },
        totalMinor: { bsonType: ["int", "long"], minimum: 0 },
        currency: { bsonType: "string", pattern: "^[A-Z]{3}$" },
        status: { enum: ["pending", "confirmed", "fulfilling", "shipped", "delivered", "cancelled"] },
        delivery: { bsonType: "object", required: ["status", "addressSnapshot"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" },
        version: { bsonType: ["int", "long"], minimum: 1 }
      }
    }
  },
  salesContributions: {
    $jsonSchema: {
      bsonType: "object",
      required: ["eventId", "day", "productId", "writeBucket", "categoryId", "currency", "unitsDelta", "ordersDelta", "grossMinorDelta", "occurredAt"],
      properties: {
        eventId: { bsonType: "string", minLength: 1, maxLength: 180 },
        day: { bsonType: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
        productId: { bsonType: "objectId" },
        writeBucket: { bsonType: ["int", "long"], minimum: 0, maximum: 31 },
        categoryId: { bsonType: "string", maxLength: 80 },
        currency: { bsonType: "string", pattern: "^[A-Z]{3}$" },
        unitsDelta: { bsonType: ["int", "long"] },
        ordersDelta: { bsonType: ["int", "long"] },
        grossMinorDelta: { bsonType: ["int", "long"] },
        occurredAt: { bsonType: "date" }
      }
    }
  },
  dailyProductSales: {
    $jsonSchema: {
      bsonType: "object",
      required: ["day", "productId", "categoryId", "currency", "writeBucket", "units", "orders", "grossMinor", "updatedAt"],
      properties: {
        day: { bsonType: "string", pattern: "^\\d{4}-\\d{2}-\\d{2}$" },
        productId: { bsonType: "objectId" },
        categoryId: { bsonType: "string", maxLength: 80 },
        currency: { bsonType: "string", pattern: "^[A-Z]{3}$" },
        writeBucket: { bsonType: ["int", "long"], minimum: 0, maximum: 31 },
        units: { bsonType: ["int", "long"] },
        orders: { bsonType: ["int", "long"] },
        grossMinor: { bsonType: ["int", "long"] },
        updatedAt: { bsonType: "date" }
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
database.products.createIndex({ title: "text", description: "text" }, { name: "product_text_search" });
database.orders.createIndex({ bucket: 1, customerId: "hashed" }, { name: "order_bucket_customer_shard" });
database.orders.createIndex(
  { bucket: 1, customerId: 1, createdAt: -1 },
  { name: "order_bucket_customer_history" }
);
database.orders.createIndex(
  { status: 1, "delivery.status": 1, createdAt: 1 },
  { name: "fulfillment_queue" }
);
database.salesContributions.createIndex(
  { day: 1, productId: 1, eventId: 1 },
  { name: "sales_event_deduplication", unique: true }
);
database.salesContributions.createIndex(
  { day: 1, categoryId: 1, currency: 1 },
  { name: "sales_contribution_reporting" }
);
database.dailyProductSales.createIndex(
  { day: 1, productId: 1, currency: 1, writeBucket: 1 },
  { name: "daily_sales_shard_key", unique: true }
);
database.dailyProductSales.createIndex(
  { day: 1, categoryId: 1, currency: 1 },
  { name: "daily_sales_category_reporting" }
);
