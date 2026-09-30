# Npontu: Applications Support Activity Tracker

A system for tracking the daily activities of an applications support team, built as two separate apps:

| Folder | What | Stack |
|---|---|---|
| `activity-tracker/` | JSON API | Laravel 13, Sanctum, SQLite/MySQL |
| `activity-tracker-web/` | Web client | Next.js 16, Tailwind v4, iron-session |

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
