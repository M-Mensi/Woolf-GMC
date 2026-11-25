const databaseName = "ecommerce_refactored";

sh.enableSharding(databaseName);
sh.shardCollection(`${databaseName}.orders`, { bucket: 1, customerId: "hashed" });
sh.shardCollection(`${databaseName}.salesContributions`, { day: 1, productId: 1, eventId: 1 });
sh.shardCollection(`${databaseName}.dailyProductSales`, { day: 1, productId: 1, currency: 1, writeBucket: 1 });
