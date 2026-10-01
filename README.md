# Support Activity Tracker

A system for tracking the daily activities of an applications support team, built as two separate apps:

| Folder | What | Stack |
|---|---|---|
| `activity-tracker/` | JSON API | Laravel 13, Sanctum, Postgres (SQLite locally) |
| `activity-tracker-web/` | Web client | Next.js 16, Tailwind v4, iron-session |

## Live demo

**App:** https://support-activity-tracker-roan.vercel.app  
**API:** https://npontu-activity-api.onrender.com (health check: [`/up`](https://npontu-activity-api.onrender.com/up))

| Email | Password | Role |
|---|---|---|
| `admin@npontu.test` | `password` | Super admin |
| `ama@npontu.test` | `password` | Admin (team lead) |
| `kofi@npontu.test` · `efua@npontu.test` · `yaw@npontu.test` | `password` | Support |

The demo is seeded with a sample team and two weeks of activity history.

## Requirements coverage

1. **Input activities.** The Activities page (admins) lets you create, edit and retire activities such as *Daily SMS count vs SMS count from logs*.
2. **Done / pending with a remark.** The Daily Board has an **Update** dialog on each activity. A remark is required when marking something pending.
3. **Bio details and time.** Every update stores a snapshot of the person's name, staff ID, position, phone, email and role, plus a timestamp.
4. **Daily view for handover.** The Daily Board shows each activity's latest status and who set it and when, a "Handed over from yesterday" panel, and a log of every update that day. Any past day can be opened with the date picker. Each activity also has a detail page with its updates for the day and a 14-day status strip.
5. **Reports over custom durations.** The Reports page offers preset and custom date ranges, filters by activity, personnel and status, summary metrics, a daily trend chart, paginated history and CSV export.
6. **Authentication.** Token auth with login throttling, no public sign-up, deactivated accounts locked out immediately, and role-based access (super admin, admin, support) enforced by gates and policies.

## Quick start

```bash
# API
cd activity-tracker
composer install && cp .env.example .env && php artisan key:generate
php artisan migrate --seed && php artisan serve

# Web (new terminal)
cd activity-tracker-web
npm install && cp .env.example .env.local   # fill SESSION_PASSWORD
npm run dev
```

Open http://localhost:3000 and sign in as `admin@npontu.test` / `password`.

## Deployment

```
push to main ─▶ Build and Test ─┬─▶ API: Render (Docker + Postgres) ─▶ health check
                                └─▶ Web: Vercel (Next.js)
```

| Piece | Where | Config |
|---|---|---|
| CI | GitHub Actions | `.github/workflows/build-and-test.yml`: builds the production Docker image with dev deps and runs PHPUnit inside it; lints, type-checks and builds the web app. Runs on every PR. |
| CD | GitHub Actions | `.github/workflows/deploy-production.yml`: on push to `main`, reruns the tests, then deploys the API (Render deploy hook, pinned to the commit) and the web app (Vercel CLI). |
| API | Render | `render.yaml` blueprint: Docker web service (`activity-tracker/Dockerfile`, Apache + PHP 8.4) and a Postgres database. The container migrates and seeds (idempotently) on start. |
| Web | Vercel | `activity-tracker-web/vercel.json`, Frankfurt region next to the API. Git auto-deploys are off, so Actions is the single deploy path. |
| Warm-up | GitHub Actions | `.github/workflows/keep-alive.yml` pings `/up` every 10 minutes so Render's free tier doesn't sleep. |

**Secrets and variables** (GitHub → Settings → Secrets and variables → Actions):

| Name | Type | Value |
|---|---|---|
| `RENDER_DEPLOY_HOOK_URL` | secret | Render service → Settings → Deploy Hook |
| `VERCEL_TOKEN` | secret | Vercel → Account Settings → Tokens |
| `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` | secret | Vercel project → Settings → General |
| `API_URL` | variable | e.g. `https://npontu-activity-api.onrender.com` |

Environment on the hosts: Render takes `APP_KEY` (from `php artisan key:generate --show`); everything else is in `render.yaml`. Vercel takes `API_BASE_URL` (the Render URL) and `SESSION_PASSWORD` (32+ random characters).
