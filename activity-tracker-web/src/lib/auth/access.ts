import { APP_ROUTES } from "@/lib/utils/routes";
import type { AuthUser } from "@/types/Account";

/** Mirrors PERMISSIONS in the API's app/Common/constants.php. */
export const PERMISSIONS = {
  VIEW_ACTIVITIES: "view activities",
  MODIFY_ACTIVITIES: "modify activities",
  UPDATE_ACTIVITY_STATUS: "update activity status",
  VIEW_REPORTS: "view reports",
  VIEW_USERS: "view users",
  MODIFY_USERS: "modify users",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export type AccessUser = Pick<AuthUser, "role" | "permissions">;

export function isSuperAdmin(user: AccessUser | null | undefined): boolean {
  return user?.role?.trim().toLowerCase() === "super admin";
}

export function hasPermission(user: AccessUser | null | undefined, permission: Permission): boolean {
  if (!user) return false;
  if (isSuperAdmin(user)) return true;
  return user.permissions.includes(permission);
}

/** Page → required permission. Used by both proxy.ts and the sidebar. */
export const routePolicies: readonly { path: string; permission: Permission }[] = [
  { path: APP_ROUTES.BOARD, permission: PERMISSIONS.VIEW_ACTIVITIES },
  { path: APP_ROUTES.REPORTS, permission: PERMISSIONS.VIEW_REPORTS },
  { path: APP_ROUTES.ACTIVITIES, permission: PERMISSIONS.MODIFY_ACTIVITIES },
  { path: APP_ROUTES.TEAM, permission: PERMISSIONS.VIEW_USERS },
];

export function canAccessPath(user: AccessUser | null | undefined, pathname: string): boolean {
  if (!user) return false;
  if (pathname === APP_ROUTES.ACCOUNT || pathname.startsWith(`${APP_ROUTES.ACCOUNT}/`)) return true;

  const policy = routePolicies.find(({ path }) => pathname === path || pathname.startsWith(`${path}/`));
  return policy ? hasPermission(user, policy.permission) : false;
}

export function getLandingPath(user: AccessUser): string {
  return [APP_ROUTES.BOARD, APP_ROUTES.REPORTS, APP_ROUTES.TEAM].find((path) => canAccessPath(user, path)) ?? APP_ROUTES.ACCOUNT;
}
