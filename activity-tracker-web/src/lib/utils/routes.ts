export const APP_ROUTES = {
  ROOT: "/",
  LOGIN: "/login",
  LOGOUT: "/logout",
  BOARD: "/board",
  ACTIVITY_DETAIL: (id: number | string, date?: string) => `/board/${id}${date ? `?date=${date}` : ""}`,
  REPORTS: "/reports",
  ACTIVITIES: "/activities",
  TEAM: "/team",
  ACCOUNT: "/account",
} as const;

const V1 = "/v1";

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${V1}/auth/login`,
    LOGOUT: `${V1}/auth/logout`,
    ME: `${V1}/auth/me`,
  },
  PROFILE: {
    UPDATE: `${V1}/profile`,
    PASSWORD: `${V1}/profile/password`,
  },
  BOARD: `${V1}/board`,
  ACTIVITIES: {
    LIST: `${V1}/activities`,
    OPTIONS: `${V1}/activities/options`,
    DETAIL: (id: number | string) => `${V1}/activities/${encodeURIComponent(id)}`,
    TOGGLE_STATUS: (id: number | string) => `${V1}/activities/${encodeURIComponent(id)}/toggle-status`,
    RECORD_UPDATE: (id: number | string) => `${V1}/activities/${encodeURIComponent(id)}/updates`,
  },
  REPORTS: {
    LIST: `${V1}/reports`,
    SUMMARY: `${V1}/reports/summary`,
    EXPORT: `${V1}/reports/export`,
  },
  USERS: {
    LIST: `${V1}/users`,
    OPTIONS: `${V1}/users/options`,
    DETAIL: (id: number | string) => `${V1}/users/${encodeURIComponent(id)}`,
    TOGGLE_STATUS: (id: number | string) => `${V1}/users/${encodeURIComponent(id)}/toggle-status`,
  },
  ROLES: `${V1}/roles`,
} as const;
