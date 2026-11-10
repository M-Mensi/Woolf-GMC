# Form & Field — MERN shop

## Run locally

1. Install Node.js and MongoDB, or create a MongoDB Atlas cluster.
2. Run `npm install`.
3. Copy `.env.example` to `.env`. Set `MONGO_URI`, a random `JWT_SECRET` with at least 32 characters, and `ADMIN_EMAIL`.
4. Run `npm run dev`, then open `http://localhost:5173`.

The configured `ADMIN_EMAIL` becomes an administrator when that email registers.
Administrators can add, edit, and remove products. The shop seeds a small demo
catalog when the selected database has no products; set `SEED_DEMO_PRODUCTS=false`
to disable this.

Customers can register, sign in, browse/filter products, keep a local shopping
bag, submit delivery details, and review their orders. Checkout uses **cash on
delivery**; no card processor is configured. Product prices and available stock
are verified on the server, and order creation/stock updates use a MongoDB
transaction.

## Production and security

Run `npm run build` and `npm start`; Express serves the built React app and API.
Set `MONGO_URI`, `JWT_SECRET`, `ADMIN_EMAIL`, `PORT`, and optionally
`SEED_DEMO_PRODUCTS` as Azure App Settings. Never commit `.env`. For a public
store, configure HTTPS and add operational features such as rate limiting,
password reset, real payment processing, tax/shipping rules, and order support.
