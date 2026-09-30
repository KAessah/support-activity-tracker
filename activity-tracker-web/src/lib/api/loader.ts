import "server-only";

import { apiRequest } from "./apiHandler";
import { getApiErrorMessage } from "./errors";

/**
 * GET helper for page loaders: returns the payload or throws, which lets the
 * route's error.tsx boundary render a friendly message.
 */
export async function load<T>(url: string, query?: Record<string, string | number | undefined>, fallback = "Unable to load this page.") {
  const res = await apiRequest<T>({ url, opts: { query } });
  if (!res.ok) throw new Error(getApiErrorMessage(res, fallback));
  return res.data;
}
