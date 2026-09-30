"use server";

import { revalidatePath } from "next/cache";
import { apiRequest } from "@/lib/api/apiHandler";
import { toActionFailure } from "@/lib/api/errors";
import { APP_ROUTES, API_ROUTES } from "@/lib/utils/routes";
import type { ActionResult } from "@/types/Api";
import type { MemberInput, TeamMember } from "@/types/Team";

export async function saveMember(id: number | null, input: MemberInput): Promise<ActionResult> {
  const data = { ...input, phone: input.phone?.trim() || null, position: input.position?.trim() || null };
  if (id && !data.password) {
    delete data.password;
    delete data.password_confirmation;
  }

  const res = await apiRequest<TeamMember>({
    method: id ? "PUT" : "POST",
    url: id ? API_ROUTES.USERS.DETAIL(id) : API_ROUTES.USERS.LIST,
    data,
  });

  if (!res.ok) return toActionFailure(res, "Could not save the team member.");

  revalidatePath(APP_ROUTES.TEAM);
  return { ok: true, message: res.data.message, data: undefined };
}

export async function toggleMemberStatus(id: number): Promise<ActionResult> {
  const res = await apiRequest<TeamMember>({ method: "PATCH", url: API_ROUTES.USERS.TOGGLE_STATUS(id) });

  if (!res.ok) return toActionFailure(res, "Could not change the account status.");

  revalidatePath(APP_ROUTES.TEAM);
  return { ok: true, message: res.data.message, data: undefined };
}
