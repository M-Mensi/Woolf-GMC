# Product CRUD: SQL & NoSQL

This Express API exposes the same product CRUD routes for MongoDB and MySQL:

- MongoDB: `/api/mongo/products`
- MySQL: `/api/mysql/products`

Both use `POST /`, `GET /`, `GET /:id`, `PUT /:id`, and `DELETE /:id`. Product JSON fields are `name` (required string), `price` (required non-negative number), `category` (optional string or null), and `inStock` (optional boolean, defaults to `true`).

## Run

1. Copy `.env.example` to `.env` and set your database connection values.
2. Create the MySQL database/table by running `sql/schema.sql`.
3. Install the dependencies listed in `package.json`.
4. Run `npm start`.

MongoDB's collection is created by Mongoose when needed. MySQL statements use placeholders for all request values. Both controllers share request validation and route definitions to keep their API behavior consistent.

Example create request:

```json
{
  "name": "Notebook",
  "price": 4.5,
  "category": "Stationery"
}
```
