"use client";

import { createContext, useContext, type ReactNode } from "react";
import { hasPermission, type Permission } from "@/lib/auth/access";
import type { AuthUser } from "@/types/Account";

const AccessContext = createContext<AuthUser | null>(null);

/** Supplies the signed-in user (fetched server-side in the main layout). */
export function AccessProvider({ user, children }: { user: AuthUser; children: ReactNode }) {
  return <AccessContext.Provider value={user}>{children}</AccessContext.Provider>;
}

export function useAccess() {
  const user = useContext(AccessContext);
  if (!user) throw new Error("useAccess must be used inside <AccessProvider>");
  return { user, can: (permission: Permission) => hasPermission(user, permission) };
}

/** UI-only gate — hides controls the user can't use. The API still enforces access. */
export function AccessGate({ permission, children, fallback = null }: { permission: Permission; children: ReactNode; fallback?: ReactNode }) {
  const { can } = useAccess();
  return <>{can(permission) ? children : fallback}</>;
}
