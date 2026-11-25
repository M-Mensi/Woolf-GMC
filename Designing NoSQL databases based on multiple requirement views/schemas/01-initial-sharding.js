const databaseName = "ecommerce_initial";

sh.enableSharding(databaseName);
sh.shardCollection(`${databaseName}.orders`, { customerId: "hashed" });
