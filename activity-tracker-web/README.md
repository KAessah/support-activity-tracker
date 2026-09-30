# Support Activity Tracker: Web

A Next.js 16 (App Router) client for the Laravel API in `../activity-tracker`. It uses Manrope, Tailwind v4 and Recharts.

## Architecture

```
src/
├── actions/            "use server" mutations: auth, board, activities, team, account
├── app/
│   ├── (auth)/         login page, logout route handler
│   └── (main)/         layout (loads profile) + page.tsx/loading.tsx per route, error.tsx
├── components/
│   ├── <feature>/      <Feature>Content (client) + dialogs
│   ├── layout/         AppShell, AppSidebar, AppTopbar
│   ├── reusables/      MetricCard, StatusBadge, Filter, SearchPanel, Pagination, AccessGate, ConfirmationDialog…
│   └── ui/             primitives: Button, Card, Form, Modal, Popover, Table, Skeleton
├── lib/
│   ├── api/            apiHandler (single fetch wrapper), errors, per-page loaders + query parsers
│   ├── auth/access.ts  PERMISSIONS, hasPermission, routePolicies, canAccessPath, getLandingPath
│   ├── helpers/        formatters, queryParams, toast
│   ├── hooks/          useUrlQuery (filters live in the URL)
│   ├── session.ts      iron-session config
│   └── utils/routes.ts APP_ROUTES, API_ROUTES
├── proxy.ts            page gate driven by the sealed session
└── types/              Api, Account, Activity, Report, Team
```

- **Pages.** Each `page.tsx` is a server component. It parses `searchParams`, loads data through `lib/api/*`, and renders a client `<XContent />`. Filters are stored in the URL, so a filtered view can be shared and survives a refresh.
- **Mutations.** Changes go through server actions that return `{ ok, message, data } | { ok: false, message, fieldErrors }`. The UI shows a toast for the message and inline errors for `fieldErrors`.
- **Session.** The API token lives in an **iron-session sealed httpOnly cookie**, so browser JavaScript never sees it. All API calls happen on the Next.js server through `apiHandler`, so no CORS setup is needed. A 401 from the API ends the session through `/logout`.
- **Access control.** `proxy.ts` and the sidebar share the same `routePolicies`, so links a user can't open are also hidden. `AccessGate` hides controls the user isn't allowed to use. The API still enforces every permission on its own.

## Run

```bash
npm install
cp .env.example .env.local   # set API_BASE_URL and a 32+ char SESSION_PASSWORD
npm run dev                  # http://localhost:3000 (API must be running on :8000)
npm run build && npm start   # production
```
