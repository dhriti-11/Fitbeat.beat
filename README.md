# FitBeat — Next.js App

3D animated fitness platform for women, teens and kids. Trainer/client dashboards with progress tracking, diet plans, class calendars, tasks, messages, and announcements.

**Live:** [fitbeat-beat.vercel.app](https://fitbeat-beat.vercel.app)

## Stack

- **Next.js 15** + React 19 + TypeScript
- **Tailwind CSS 4** — blue/orange glassmorphism design
- **React Three Fiber** — 3D hero animations
- **Framer Motion** — scroll reveals and transitions
- **Auth.js (NextAuth v5)** — Google OAuth + email OTP via Resend
- **Upstash Redis** — persistent storage (users, client data, appointments, messages, tasks)
- **FullCalendar** — visual class/diet calendars
- **Recharts** — progress charts

## Local Development

```bash
npm install
cp .env.example .env.local   # fill in values
npm run dev                  # http://localhost:3000
```

## Environment Variables

Set these in `.env.local` (local) and Vercel project settings (production):

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | Random secret — run `openssl rand -base64 32` |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `RESEND_API_KEY` | Resend API key for OTP emails |
| `EMAIL_FROM` | Sender address, e.g. `FitBeat <hello@fitbeat.studio>` |
| `CONTACT_EMAIL` | Where contact form messages go |
| `KV_REST_API_URL` | Upstash Redis REST URL (auto-injected on Vercel) |
| `KV_REST_API_TOKEN` | Upstash Redis REST token |

## Trainer Access

Trainer emails are configured in [`src/lib/constants.ts`](src/lib/constants.ts):

```ts
export const TRAINER_EMAILS = [
  "rashmi.chokshi15@gmail.com",
  "chit_ronak@yahoo.com",
];
```

Any other email signs in as a **client**. New clients must be approved by a trainer before accessing their full dashboard.

## Deployment (GitHub + Vercel)

1. Push to `https://github.com/dhriti-11/Fitbeat.beat.git`
2. Vercel auto-deploys from `main`
3. Framework preset: **Next.js** (also enforced via `vercel.json`)
4. **Important:** In Vercel → Project Settings → Build & Development, leave **Output Directory blank**. If it was set to `.` or `public` from the old static site, clear it — otherwise every route returns `404: NOT_FOUND`.
5. Connect Upstash Redis via Vercel Storage marketplace
6. Add all env vars above in Vercel project settings (at minimum `AUTH_SECRET`)
7. Set production branch to `main` after merging the Next.js redesign

### Vercel env vars (minimum for deploy)

| Variable | Value |
|----------|-------|
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `AUTH_URL` | Your Vercel URL, e.g. `https://fitbeat-beat.vercel.app` |
| `KV_REST_API_URL` | From Upstash |
| `KV_REST_API_TOKEN` | From Upstash |

## Media Assets

Drop photos/videos into `public/` and update [`src/lib/media.ts`](src/lib/media.ts):

- Hero video: `public/fitbeat-showcase.mp4`
- About clip: `public/fitbeat-about-clip.mp4`
- Branch images: `public/branches/kuwait.jpg`, etc.
- Trainer photos: `public/trainers/`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages & API routes
├── components/
│   ├── three/              # R3F 3D scenes
│   ├── marketing/          # Landing page sections
│   ├── dashboard/          # Dashboard UI components
│   └── ui/                 # Shared UI primitives
└── lib/                    # Auth, Redis, constants, types
```

## Client Flow

1. Sign in (Google or email OTP)
2. Book free demo if new
3. Trainer grants dashboard access
4. Full dashboard: diet, classes, progress, tasks, messages, announcements

## Trainer Flow

1. Sign in with registered trainer email
2. View/manage all clients
3. Grant/revoke access, assign diet plans, schedule classes
4. Log progress, assign tasks, message clients, post announcements
