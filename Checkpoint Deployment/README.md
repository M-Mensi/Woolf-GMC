# Mohamed Mensi — Portfolio

## Run locally

1. Install Node.js, then run `npm install`.
2. Copy `.env.example` to `.env` and set `MONGO_URI` to your MongoDB Atlas connection string.
3. Allow your development IP in the Atlas network access settings.
4. Run `npm run dev` and open `http://localhost:5173`.

The contact form saves messages in MongoDB Atlas. For production, build with
`npm run build` and run `npm start`; Express serves the built React app and API
on the configured `PORT`. Set `MONGO_URI` and `PORT` as Azure app settings
rather than committing credentials.
