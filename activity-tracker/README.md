# Support Activity Tracker: API

A Laravel 13 JSON API for tracking the daily activities of an applications support team. The Next.js client is in `../activity-tracker-web`.

## Architecture

The request path is **Route → Controller → Action → Service → Model**, with a JsonResource shaping the response.

```
app/
├── Common/             constants.php (ROLES, PERMISSIONS), helpers.php (toJSONResponse, pagination, dateOrToday)
├── Enum/               ActivityStatus
├── Http/
│   ├── Actions/<Domain>/   one use case per class, exposing handle(), returns JsonResponse
│   ├── Controllers/        thin: inject the Action and return $action->handle(...)
│   ├── Middleware/         ForceJsonResponse, EnsureUserIsActive
│   ├── Requests/           FormRequests (validation only)
│   └── Resources/          camelCase JsonResources
├── Models/             User, Role, Permission, Activity, ActivityUpdate
├── Policies/           ActivityPolicy, ReportPolicy, UserPolicy
├── Services/           business and query logic
└── Traits/             HasRole (hasPermission, isSuperAdmin, permissionNames)
routes/api/v1.php       all endpoints, served under /v1
```

Every response uses the same envelope:

```json
{ "success": true, "message": "Process completed.", "data": {}, "meta": {} }
```

Paginated lists put `currentPage`, `lastPage`, `total`, `perPage`, `from` and `to` in `meta`. Errors go through `bootstrap/app.php`, which maps each status to a friendly message. Validation errors (422) return the field errors in `data`.

### Auth, roles, permissions

- **Authentication** uses Sanctum bearer tokens. Tokens expire after 12h (`SANCTUM_TOKEN_EXPIRATION`). Login is rate-limited to 5 attempts per minute per email and IP. A deactivated account gets the same error as wrong credentials, and deactivating a user revokes all of their tokens immediately.
- **Roles** (`super admin`, `admin`, `support`) and **permissions** are stored in the database and seeded by `RolePermissionSeeder`. Their names are constants in `app/Common/constants.php`.
- **Named gates** are registered in `AppServiceProvider` and point at policy methods. Routes enforce them with `can:` middleware, e.g. `->middleware('can:activity.update-status,activity')`.
- **Super admin** bypasses all permission checks through `HasRole::hasPermission()`.

| Role | Permissions |
|------|-------------|
| super admin | everything |
| admin | view/modify activities, update status, view reports, view/modify users |
| support | view activities, update status, view reports |

## Endpoints (`/v1`)

| Method | Path | Gate |
|---|---|---|
| POST | `auth/login` | public, throttled |
| GET / POST | `auth/me`, `auth/logout` | authenticated |
| PUT | `profile`, `profile/password` | authenticated |
| GET | `board?date=Y-m-d` | activity.view |
| GET | `activities/{id}?date=` (day's updates plus a 14-day trend) | activity.view |
| POST | `activities/{id}/updates` | activity.update-status |
| GET / POST / PUT / PATCH | `activities`, `activities/{id}`, `activities/{id}/toggle-status` | activity.manage |
| GET | `reports`, `reports/summary`, `reports/export` (CSV) | report.view |
| GET / POST / PUT / PATCH | `users`, `users/{id}`, `users/{id}/toggle-status`, `roles` | user.* |

## Design decisions

- **Append-only updates.** Every status change is a new row, so the full trail is kept for handover and audit. For example: pending at 09:10 by Kofi, then done at 14:30 by Efua.
- **Bio snapshot.** The updater's name, staff ID, position, phone, email and role are saved on each update. History stays accurate even if a profile changes later.
- **Server-side dates.** Updates are always recorded against today, so they can't be backdated.
- **Remarks for pending items.** A pending status requires a remark, so the next shift knows what's left.
- **Retire, don't delete.** Activities and users are deactivated, never deleted, so reports stay intact.
- **Performance.** Composite indexes on `(activity_date, activity_id)` and `(user_id, activity_date)`, eager loading (with `preventLazyLoading()` enabled outside production), and a CSV export that streams through `lazy()`.

## Run

```bash
composer install
cp .env.example .env && php artisan key:generate
php artisan migrate --seed
php artisan serve          # http://127.0.0.1:8000
php artisan test           # 31 feature tests
```

Outside production, the seed adds demo users (password `password`) and two weeks of history: `admin@npontu.test` (super admin), `ama@npontu.test` (admin), and `kofi@`, `efua@` and `yaw@npontu.test` (support).
