# SharePlate

SharePlate is a small cloud-hosted community food-sharing pilot. Community coordinators can publish surplus food offers, and visitors can search, filter and claim portions. The browser application is plain HTML, CSS and JavaScript; Cloudflare Pages Functions provide the API and Cloudflare D1 stores listings and claims.

## Run locally

Requirements: Node.js 20+ and npm.

The page's stylesheet and script use paths relative to `index.html`, so the design also loads when you open the file directly. The API is server-side, however, so listings and claims will not work from a `file://` URL; run the local Pages server below for the complete application.

1. In this directory, run `npm install`.
2. Create a local secret file named `.dev.vars` containing:

   ```text
   ADMIN_KEY="choose-a-long-random-local-key"
   ```

3. In `wrangler.toml`, replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` with a real D1 database ID, or use the local database command below.
4. Initialize a local D1 database and populate example offers:

   ```powershell
   npx wrangler d1 execute shareplate-db --local --file=db/schema.sql
   npx wrangler d1 execute shareplate-db --local --file=db/seed.sql
   ```

5. Start the Pages development server with `npm run dev`, then open the local address Wrangler prints.

The sample offers in `db/seed.sql` are fictional. To publish an offer, open **List a food offer** and enter the same coordinator key as `ADMIN_KEY`.

## Deploy for free on Cloudflare

Cloudflare's free plan offers Pages hosting and D1. Free-plan features and quotas can change; check the current plan details before relying on them for a production service. This guide deploys the project from a public GitHub repository.

1. Create a Cloudflare account and a GitHub repository containing this project folder.
2. In Cloudflare, create a **D1 SQL database** named `shareplate-db`. Copy its database ID.
3. Edit `wrangler.toml` and replace `REPLACE_WITH_YOUR_D1_DATABASE_ID` with that ID. Commit and push this change.
4. In the Cloudflare dashboard, open **Workers & Pages → Create → Pages → Connect to Git**. Select the repository and configure:
   - Root directory: `Cloud-Based Web System Design` (or `.` if this folder is the repository root).
   - Build command: leave blank.
   - Build output directory: `.`.
5. Before or after the first deployment, attach the D1 database to the Pages project. In **Settings → Bindings**, add a D1 database binding named `DB` and select `shareplate-db`. Redeploy after adding or changing bindings.
6. In **Settings → Variables and Secrets**, create the secret `ADMIN_KEY`. Choose a long random value and keep it out of source control. Redeploy after changing variables.
7. Initialize the hosted database from this project directory:

   ```powershell
   npx wrangler d1 execute shareplate-db --remote --file=db/schema.sql
   npx wrangler d1 execute shareplate-db --remote --file=db/seed.sql
   ```

   Authenticate Wrangler when prompted and confirm the target database. Run `seed.sql` only if you want the fictional demonstration offers.
8. Open the `*.pages.dev` URL shown in the Pages project. Test browsing, a coordinator-only listing, and a claim. Use **Deployments** to inspect build and function logs if something fails.

Alternative command-line deployment: run `npx wrangler login`, create the D1 database, update `wrangler.toml`, initialize it with the `--remote` commands above, set `ADMIN_KEY` using `npx wrangler pages secret put ADMIN_KEY --project-name shareplate-community`, then run `npm run deploy`. The dashboard workflow is preferable for continuous deployment from GitHub.

## Verification

Run `npm test` for the focused API tests. Run `node --check app.js` and `node --check functions/api/listings.js` for syntax checks. The D1 schema and seed scripts can be exercised against local Wrangler D1 using the commands above.

## Safety and pilot limits

The coordinator key is a shared pilot credential, not an account system. Claims are anonymous counters and do not provide identity, direct contact, or a confirmed handoff. Do not list temperature-sensitive, recalled, expired, or otherwise unsafe food; providers must make and communicate appropriate safety, storage, and allergen decisions. Before real public operation, add verified organization accounts, claim confirmation and cancellation, abuse controls/rate limits, accessibility and food-safety review, data-retention rules, operational monitoring, backup/recovery procedures, and jurisdiction-specific legal review. Do not use the demonstration seed offers as real availability.
