"use server";

import { revalidatePath } from "next/cache";
import { apiRequest } from "@/lib/api/apiHandler";
import { toActionFailure } from "@/lib/api/errors";
import { APP_ROUTES, API_ROUTES } from "@/lib/utils/routes";
import type { Activity, ActivityInput } from "@/types/Activity";
import type { ActionResult } from "@/types/Api";

const clean = (input: ActivityInput) => ({
  title: input.title.trim(),
  category: input.category || null,
  description: input.description?.trim() || null,
});

export async function saveActivity(id: number | null, input: ActivityInput): Promise<ActionResult> {
  const res = await apiRequest<Activity>({
    method: id ? "PUT" : "POST",
    url: id ? API_ROUTES.ACTIVITIES.DETAIL(id) : API_ROUTES.ACTIVITIES.LIST,
    data: clean(input),
  });

  if (!res.ok) return toActionFailure(res, "Could not save the activity.");

  revalidatePath(APP_ROUTES.ACTIVITIES);
  return { ok: true, message: res.data.message, data: undefined };
}

export async function toggleActivityStatus(id: number): Promise<ActionResult> {
  const res = await apiRequest<Activity>({ method: "PATCH", url: API_ROUTES.ACTIVITIES.TOGGLE_STATUS(id) });

  if (!res.ok) return toActionFailure(res, "Could not change the activity status.");

  revalidatePath(APP_ROUTES.ACTIVITIES);
  return { ok: true, message: res.data.message, data: undefined };
}
