import "server-only";

import { redirect } from "next/navigation";
import { buildQuery, type Query } from "@/lib/helpers/queryParams";
import { getSession } from "@/lib/session";
import { APP_ROUTES } from "@/lib/utils/routes";
import type { ApiResponse } from "@/types/Api";

export type ApiSuccess<T> = { ok: true; data: ApiResponse<T>; status: number };
export type ApiFailure = { ok: false; status: number; body: ApiResponse<unknown> | null };
export type ApiRequestResult<T> = ApiSuccess<T> | ApiFailure;

type ApiRequestOptions = {
  /** Public endpoints (login) — no bearer token and no logout redirect. */
  skipAuth?: boolean;
  query?: Query;
};

export const API_BASE_URL = process.env.API_BASE_URL ?? "http://127.0.0.1:8000";

export async function authHeader(): Promise<Record<string, string>> {
  const token = (await getSession()).bearerToken;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Single entry point for talking to the Laravel API from the server.
 * Returns a discriminated union so call sites never need try/catch.
 * A 401 on an authenticated request ends the session via /logout.
 */
export async function apiRequest<T>({
  method = "GET",
  url,
  data,
  opts = {},
}: {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  url: string;
  data?: unknown;
  opts?: ApiRequestOptions;
}): Promise<ApiRequestResult<T>> {
  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}${url}${buildQuery(opts.query)}`, {
      method,
      headers: {
        Accept: "application/json",
        ...(data !== undefined ? { "Content-Type": "application/json" } : {}),
        ...(opts.skipAuth ? {} : await authHeader()),
      },
      body: data !== undefined ? JSON.stringify(data) : undefined,
      cache: "no-store",
    });
  } catch {
    return { ok: false, status: 503, body: null };
  }

  const body = (await response.json().catch(() => null)) as ApiResponse<T> | null;

  if (response.status === 401 && !opts.skipAuth) {
    redirect(APP_ROUTES.LOGOUT);
  }

  if (!response.ok || !body?.success) {
    return { ok: false, status: response.status, body };
  }

  return { ok: true, data: body, status: response.status };
}
