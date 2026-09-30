"use server";

import { revalidatePath } from "next/cache";
import { apiRequest } from "@/lib/api/apiHandler";
import { toActionFailure } from "@/lib/api/errors";
import { getSession } from "@/lib/session";
import { APP_ROUTES, API_ROUTES } from "@/lib/utils/routes";
import type { AuthUser } from "@/types/Account";
import type { ActionResult } from "@/types/Api";

type ProfileInput = { name: string; email: string; phone: string | null; position: string | null };

export async function updateProfile(input: ProfileInput): Promise<ActionResult> {
  const res = await apiRequest<AuthUser>({
    method: "PUT",
    url: API_ROUTES.PROFILE.UPDATE,
    data: { ...input, phone: input.phone?.trim() || null, position: input.position?.trim() || null },
  });

  if (!res.ok) return toActionFailure(res, "Could not update your profile.");

  // Keep the session snapshot (used by proxy + sidebar) in sync.
  const session = await getSession();
  session.user = res.data.data;
  await session.save();

  revalidatePath(APP_ROUTES.ROOT, "layout");
  return { ok: true, message: res.data.message, data: undefined };
}

type PasswordInput = { current_password: string; password: string; password_confirmation: string };

export async function updatePassword(input: PasswordInput): Promise<ActionResult> {
  const res = await apiRequest({ method: "PUT", url: API_ROUTES.PROFILE.PASSWORD, data: input });

  if (!res.ok) return toActionFailure(res, "Could not change your password.");

  return { ok: true, message: res.data.message, data: undefined };
}
