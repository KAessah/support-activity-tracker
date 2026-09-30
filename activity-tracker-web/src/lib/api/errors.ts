import type { ActionResult } from "@/types/Api";
import type { ApiFailure } from "./apiHandler";

/** Prefers the backend's own message, falling back to something sensible for the status. */
export function getApiErrorMessage(failure: ApiFailure, fallback: string): string {
  if (failure.body?.message) return failure.body.message;
  if (failure.status === 503) return "The server can't be reached right now. Please try again.";
  if (failure.status >= 500) return "The server could not complete the request. Please try again.";
  return fallback;
}

/** Laravel validation errors arrive as data: { field: [messages] } on a 422. */
export function getApiFieldErrors(failure: ApiFailure): Record<string, string> | undefined {
  if (failure.status !== 422 || !failure.body?.data || typeof failure.body.data !== "object") return undefined;

  const entries = Object.entries(failure.body.data as Record<string, unknown>).flatMap(([field, value]) => {
    const message = Array.isArray(value) ? value[0] : value;
    return typeof message === "string" ? [[field, message]] : [];
  });

  return entries.length ? Object.fromEntries(entries) : undefined;
}

/** Shapes a failed request into what server actions return to the UI. */
export function toActionFailure(failure: ApiFailure, fallback: string): Extract<ActionResult, { ok: false }> {
  return { ok: false, message: getApiErrorMessage(failure, fallback), fieldErrors: getApiFieldErrors(failure) };
}
