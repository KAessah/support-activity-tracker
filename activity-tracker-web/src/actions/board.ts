"use server";

import { revalidatePath } from "next/cache";
import { apiRequest } from "@/lib/api/apiHandler";
import { toActionFailure } from "@/lib/api/errors";
import { APP_ROUTES, API_ROUTES } from "@/lib/utils/routes";
import type { ActivityUpdate, StatusUpdateInput } from "@/types/Activity";
import type { ActionResult } from "@/types/Api";

export async function recordStatusUpdate(activityId: number, input: StatusUpdateInput): Promise<ActionResult> {
  const res = await apiRequest<ActivityUpdate>({
    method: "POST",
    url: API_ROUTES.ACTIVITIES.RECORD_UPDATE(activityId),
    data: { status: input.status, remark: input.remark?.trim() || null },
  });

  if (!res.ok) return toActionFailure(res, "Could not save the update.");

  revalidatePath(APP_ROUTES.BOARD, "layout");
  return { ok: true, message: res.data.message, data: undefined };
}
