"use server";

import { apiRequest } from "@/lib/api/apiHandler";
import { toActionFailure } from "@/lib/api/errors";
import { getLandingPath } from "@/lib/auth/access";
import { getSession } from "@/lib/session";
import { API_ROUTES } from "@/lib/utils/routes";
import type { AuthUser } from "@/types/Account";
import type { ActionResult } from "@/types/Api";

/** Exchanges credentials for an API token and seals it into the session cookie. */
export async function login(input: { email: string; password: string }): Promise<ActionResult<string>> {
  const email = String(input.email ?? "").trim();
  const password = String(input.password ?? "");

  if (!email || !password) {
    return { ok: false, message: "Enter your email and password." };
  }

  const res = await apiRequest<{ token: string; user: AuthUser }>({
    method: "POST",
    url: API_ROUTES.AUTH.LOGIN,
    data: { email, password },
    opts: { skipAuth: true },
  });

  if (!res.ok) return toActionFailure(res, "Unable to sign in right now.");

  const session = await getSession();
  session.bearerToken = res.data.data.token;
  session.user = res.data.data.user;
  await session.save();

  return { ok: true, message: res.data.message, data: getLandingPath(res.data.data.user) };
}

/** Fresh profile + permissions for the signed-in user (the session holds a login-time snapshot). */
export async function getAuthenticatedUser() {
  return apiRequest<AuthUser>({ url: API_ROUTES.AUTH.ME });
}
