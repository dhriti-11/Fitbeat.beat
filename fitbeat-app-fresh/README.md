# FitBeat — Deployment Guide (Fresh Start)

Static site (`index.html`) + one serverless API route (`api/storage.js`)
that persists everything — users, appointments, updates, client diet/
calendar/progress data, and reviews — in a real Redis database.

## What's in this folder
```
fitbeat-app/
├── api/
│   └── storage.js          ← serverless backend (Upstash Redis)
├── index.html               ← the entire site
├── fitbeat-showcase.mp4     ← hero showcase video (~6.7MB, compressed)
├── fitbeat-about-clip.mp4   ← About section video (~2MB)
├── package.json
├── .gitignore
└── README.md
```

## 1. Push to a brand-new GitHub repo

```bash
cd fitbeat-app
git init
git add .
git commit -m "FitBeat site — fresh start"
```

Create a new **empty** repo on github.com (don't add a README, .gitignore,
or license there — you already have those locally), then:

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git branch -M main
git push -u origin main
```

## 2. Import into Vercel

1. Go to https://vercel.com/new and import that GitHub repo.
2. Framework preset: **Other**. No build command needed.
3. Deploy. It'll go live even before the database is connected — storage
   calls will just silently fail until step 3.

## 3. Connect the database (Upstash Redis via Vercel Marketplace)

1. Vercel project → **Storage** tab → **Marketplace Database Providers** → **Upstash** → **Redis**.
2. Create a database, connect it to this project — Vercel auto-injects
   `KV_REST_API_URL` and `KV_REST_API_TOKEN`, which `api/storage.js`
   already reads. No extra config needed.
3. Redeploy when prompted (Deployments tab → latest → ⋯ → Redeploy).

## 4. Test it

- Sign in with `rashmi.chokshi15@gmail.com` or `chit_ronak@yahoo.com` → Trainer Dashboard.
- Sign in with any other email → client "book a free demo" flow.
- In the Trainer Dashboard, open a client and click **Grant Access** to
  unlock their personalized dashboard on their next sign-in.

## 5. Trainer login emails

Controlled by `TRAINER_EMAILS` near the top of the `<script>` in
`index.html`:
```js
const TRAINER_EMAILS = ["rashmi.chokshi15@gmail.com", "chit_ronak@yahoo.com"];
```
Edit this array directly to add/remove trainer access.

## 6. Still open

- Trainer #3's real name, role, and bio (currently a placeholder in the
  `TRAINERS` array in `index.html`).
- Real trainer photos (currently initials avatars — RP / RC / FB).

## A note on Git history and large files

Keep the two `.mp4` files under GitHub's 100MB limit. If you ever swap
in a new, larger video, compress it first (e.g. with ffmpeg) — a file
over 100MB will get your push rejected, and once it's in your Git
history it stays rejected even after you delete it, forcing a full
history reset to fix. Starting this repo fresh avoids that problem
entirely.
