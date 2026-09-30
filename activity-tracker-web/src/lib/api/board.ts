import "server-only";

import { todayYmd } from "@/lib/helpers/formatters";
import { isYmd, param } from "@/lib/helpers/queryParams";
import { API_ROUTES } from "@/lib/utils/routes";
import type { ActivityHistory, Board } from "@/types/Activity";
import { load } from "./loader";

type SearchParams = Record<string, string | string[] | undefined>;

/** A valid, non-future Y-m-d date from the URL, or today. */
export function parseBoardDate(params: SearchParams): string {
  const date = param(params, "date");
  const today = todayYmd();
  return isYmd(date) && date <= today ? date : today;
}

export async function getBoardPageData(date: string): Promise<Board> {
  return (await load<Board>(API_ROUTES.BOARD, { date }, "Unable to load the daily board.")).data;
}

export async function getActivityHistory(activityId: string, date: string): Promise<ActivityHistory> {
  return (await load<ActivityHistory>(API_ROUTES.ACTIVITIES.DETAIL(activityId), { date }, "Unable to load this activity.")).data;
}
