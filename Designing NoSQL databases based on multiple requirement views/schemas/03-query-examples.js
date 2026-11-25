const database = db.getSiblingDB("ecommerce_initial");

const customerId = ObjectId("65a000000000000000000001");
const productId = ObjectId("65a000000000000000000002");
const orderId = ObjectId("65a000000000000000000003");

// Text search and category browse use separate product indexes.
database.products.find(
  { $text: { $search: "whole bean coffee" }, status: "active" },
  { score: { $meta: "textScore" }, title: 1, priceMinor: 1, currency: 1 }
).sort({ score: { $meta: "textScore" } }).limit(20);

database.products.find(
  { status: "active", categoryIds: "coffee" },
  { title: 1, priceMinor: 1, currency: 1, popularityScore: 1 }
).sort({ popularityScore: -1, _id: 1 }).limit(40);

// Include the shard key so the router can target a customer's orders.
database.orders.find({ customerId }).sort({ createdAt: -1 }).limit(25);
database.orders.findOne({ _id: orderId, customerId });

// Compare-and-set guards against stale status updates.
database.orders.updateOne(
  { _id: orderId, customerId, version: 3, status: "confirmed" },
  {
    $set: { status: "fulfilling", updatedAt: new Date() },
    $inc: { version: 1 }
  }
);

const analytics = db.getSiblingDB("ecommerce_refactored");

// Recompute a day from immutable, uniquely keyed contributions and replace
// its buckets. Re-running this pipeline does not increment totals twice.
analytics.salesContributions.aggregate([
  { $match: { day: "2026-11-25" } },
  {
    $group: {
      _id: {
        day: "$day",
        productId: "$productId",
        categoryId: "$categoryId",
        currency: "$currency",
        writeBucket: "$writeBucket"
      },
      units: { $sum: "$unitsDelta" },
      orders: { $sum: "$ordersDelta" },
      grossMinor: { $sum: "$grossMinorDelta" }
    }
  },
  {
    $project: {
      _id: {
        $concat: [
          "$_id.day",
          "#",
          { $toString: "$_id.productId" },
          "#",
          "$_id.currency",
          "#",
          { $toString: "$_id.writeBucket" }
        ]
      },
      day: "$_id.day",
      productId: "$_id.productId",
      categoryId: "$_id.categoryId",
      currency: "$_id.currency",
      writeBucket: "$_id.writeBucket",
      units: 1,
      orders: 1,
      grossMinor: 1,
      updatedAt: "$$NOW"
    }
  },
  {
    $merge: {
      into: "dailyProductSales",
      on: ["day", "productId", "currency", "writeBucket"],
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }
]);

// Aggregate precomputed buckets for a dashboard query.
analytics.dailyProductSales.aggregate([
  {
    $match: {
      day: { $gte: "2026-01-01", $lt: "2027-01-01" },
      categoryId: "coffee",
      currency: "USD"
    }
  },
  {
    $group: {
      _id: "$productId",
      units: { $sum: "$units" },
      orders: { $sum: "$orders" },
      grossMinor: { $sum: "$grossMinor" }
    }
  },
  { $sort: { grossMinor: -1 } },
  { $limit: 100 }
]);
