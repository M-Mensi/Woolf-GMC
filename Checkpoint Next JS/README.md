# Mensi — Portfolio

A responsive, multi-page portfolio built with Next.js App Router. The pages are server-rendered, and the project artwork is stored locally in `public/images`.

## Run locally

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create a production build with `npm run build`, then serve it with `npm start`.

## Pages

- `/` — Home and featured work
- `/about` — Background and skills
- `/projects` — Project collection
- `/contact` — Contact links

## Personalize

Update the name, biography, skills, projects, and GitHub profile in `app`, `components`, and `data/projects.js`. Replace `hello@mensi.dev` in `app/contact/page.js` with the email address you want to publish.

## Deploy

Import this folder as a project in [Vercel](https://vercel.com/new), or deploy with the Vercel CLI. Vercel detects Next.js automatically; use `npm run build` as the build command and leave the output directory at its default.
