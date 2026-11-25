# E-commerce NoSQL schema design

This project models a MongoDB document database for product discovery and an e-commerce order flow. It includes a schema for the initial requirements, a refactored schema for analytics and higher availability, example query patterns, and a 200–300-word reflection.

## Files

- `schemas/01-initial-schema.js` — collection validators and query indexes.
- `schemas/01-initial-sharding.js` — initial hashed-customer order shard key; run only on a sharding-capable cluster.
- `schemas/02-refactored-schema.js` — refactored validators and indexes for time-bucketed orders and analytics collections.
- `schemas/02-refactored-sharding.js` — sharding setup for the refactored database; run only on a sharding-capable cluster.
- `schemas/00-demo-data.js` — repeatable sample customer, product and order documents.
- `schemas/03-query-examples.js` — product, order, status update, rebuildable rollup and analytics query patterns.
- `reflection-report.md` — short design reflection.

## Local syntax checks

The schema files are `mongosh` scripts and can be syntax-checked with Node.js:

```powershell
node --check schemas\01-initial-schema.js
node --check schemas\01-initial-sharding.js
node --check schemas\02-refactored-schema.js
node --check schemas\02-refactored-sharding.js
node --check schemas\00-demo-data.js
node --check schemas\03-query-examples.js
```

These checks do not prove compatibility with a particular MongoDB server version. Test the scripts on a disposable database before adapting or migrating real data.

## Run the initial schema on MongoDB Atlas Free

Atlas Free is useful to demonstrate document validation, indexing and example queries. It is not a substitute for testing the high-throughput sharded topology: Atlas explicitly does not allow Free clusters to be deployed as sharded clusters. In addition, the initial sharding script cannot be run against an Atlas Free deployment.

1. Create a MongoDB Atlas account and a project. Create one **Free** cluster in an available cloud region.
2. Create a database user with a strong password. Add only your own IP to the project network access list while developing. Do not commit the connection string or credentials.
3. Install MongoDB Shell (`mongosh`) and copy the cluster connection string from **Connect → Shell**.
4. From this folder, run the initial schema script (replace the placeholder with your own connection URI):

   ```powershell
   mongosh "mongodb+srv://<your-cluster-uri>/ecommerce_initial" --file schemas\01-initial-schema.js
   mongosh "mongodb+srv://<your-cluster-uri>/ecommerce_initial" --file schemas\00-demo-data.js
   ```

5. In `mongosh`, inspect indexes and collections:

   ```javascript
   use ecommerce_initial
   show collections
   db.products.getIndexes()
   db.orders.getIndexes()
   ```

6. To test the full-text index, first insert a product document that satisfies the validator, then run:

   ```javascript
   db.products.find({ $text: { $search: "coffee beans" }, status: "active" })
   ```

   For a real catalog, Atlas Search is a stronger full-text/autocomplete choice where available; the included portable `$text` index is the baseline.

## Deploy the refactored schema

`02-refactored-schema.js` targets a separate database named `ecommerce_refactored`. It creates validators and indexes but does not migrate production orders. A migration must copy each order, populate its `bucket` field from `createdAt` in UTC, reconcile totals/status, and verify counts before traffic is switched.

Run the refactored collection definitions against a **disposable** database first:

```powershell
mongosh "mongodb+srv://<your-cluster-uri>/ecommerce_refactored" --file schemas\02-refactored-schema.js
```

The sharding scripts require an initialized MongoDB sharded cluster and cluster-level authorization:

```powershell
mongosh "mongodb+srv://<sharded-cluster-uri>/admin" --file schemas\01-initial-sharding.js
mongosh "mongodb+srv://<sharded-cluster-uri>/admin" --file schemas\02-refactored-sharding.js
```

Do not run both sharding scripts on one database; they target separate example databases and represent successive designs. Provision each shard as a replica set, choose members and regions to match recovery objectives, and test failover before claiming availability. The free Atlas cluster has three replica-set nodes, but no configurable sharding and no production SLA; it cannot validate this exercise's sharded design or prove thousands of transactions per second. A sharding-capable environment may incur charges. Check current provider pricing and limits before provisioning one.

## Host the deliverables publicly for free

Cloudflare Pages can host this folder as a static project; the schema scripts are downloadable files, not a running database service.

1. Push the repository to GitHub so the project folder is available from the `main` branch.
2. Create a Cloudflare account and select **Workers & Pages → Create → Pages → Connect to Git**. Choose the repository.
3. Set the **Root directory** to `Designing NoSQL databases based on multiple requirement views`, leave the build command empty, and set the output directory to `.`.
4. Deploy and open the `*.pages.dev` address. The home page links to each design file.
5. Share the corresponding GitHub project-folder URL for source review:
   `https://github.com/M-Mensi/Woolf-GMC/tree/main/Designing%20NoSQL%20databases%20based%20on%20multiple%20requirement%20views`

The GitHub URL becomes publicly accessible after the project changes are committed and pushed. Do not include an Atlas password, connection URI, customer data, or other secrets in the repository or public Pages site.

## Design and operational limits

- The order document embeds customer and product snapshots to preserve what was purchased when catalog or profile data changes.
- In the refactored event stream, use a stable `eventId` per order/product/status version and derive `writeBucket` deterministically as `hash(eventId) % 32`; this makes retries address the same contribution and rollup bucket.
- Order state is written to one document. Use version checks / conditional updates for valid state transitions; do not treat a read from a lagging secondary as authoritative for checkout.
- Search results are not a transactional stock reservation. Inventory needs a separate atomic reservation strategy to prevent overselling.
- Sales totals are materialized from immutable, uniquely keyed contribution records. The example rollup replaces the selected day's buckets, making a rebuild repeatable; production must also remove stale buckets when rebuilding an empty/changed day and reconcile against orders.
- Choose shard keys from measured query distributions and write rates. Sharding distributes workload but adds scatter/gather, balancing, operational complexity and cost.
- Replica sets improve resilience; majority acknowledgement improves durability. Neither creates an unconditional availability guarantee during every network partition.

## References

- MongoDB Manual, [Choose a shard key](https://www.mongodb.com/docs/manual/core/sharding-shard-key/).
- MongoDB Manual, [Write concern for replica sets](https://www.mongodb.com/docs/manual/core/replica-set-write-concern/).
- MongoDB Manual, [Text indexes](https://www.mongodb.com/docs/manual/core/indexes/index-types/index-text/).
- MongoDB Atlas, [Free cluster limits](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/).
- Cloudflare, [Pages documentation](https://developers.cloudflare.com/pages/).
