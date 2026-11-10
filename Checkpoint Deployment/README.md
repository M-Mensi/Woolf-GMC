# Shiftly — Team attendance

## Run locally

1. Install Node.js and run `npm install`.
2. Copy `.env.example` to `.env` and set `MONGO_URI` to your MongoDB Atlas connection string.
3. Allow your development IP under Atlas **Network Access** and create a database user under **Database Access**.
4. Run `npm run dev` and open `http://localhost:5173`.

The app records employee check-ins and check-outs in MongoDB and shows daily
attendance, completed hours, and a seven-day chart. For production, run
`npm run build` and `npm start`; Express serves the React app and API on `PORT`.
Configure `MONGO_URI` and `PORT` as Azure app settings. Never commit `.env` or
expose the app publicly before adding authentication and business access controls.
