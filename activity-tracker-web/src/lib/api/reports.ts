import "server-only";

import { shiftYmd, todayYmd } from "@/lib/helpers/formatters";
import { intParam, isYmd, param } from "@/lib/helpers/queryParams";
import { API_ROUTES } from "@/lib/utils/routes";
import type { ActivityUpdate } from "@/types/Activity";
import type { PaginationMeta } from "@/types/Api";
import type { ReportPageData, ReportQuery, ReportTotals, ReportTrendPoint } from "@/types/Report";
import { load } from "./loader";

type SearchParams = Record<string, string | string[] | undefined>;

export function parseReportQuery(params: SearchParams): ReportQuery {
  const today = todayYmd();
  const from = param(params, "from");
  const to = param(params, "to");
  const status = param(params, "status");

  const validTo = isYmd(to) && to <= today ? to : today;
  const validFrom = isYmd(from) && from <= validTo ? from : shiftYmd(validTo, -6);

  return {
    from: validFrom,
    to: validTo,
    activityId: param(params, "activity"),
    userId: param(params, "person"),
    status: status === "done" || status === "pending" ? status : "",
    page: intParam(params, "page", 1),
    perPage: intParam(params, "perPage", 10, 100),
  };
}

/** Maps UI query → API filter params. */
export const reportFilters = (q: ReportQuery) => ({
  from: q.from,
  to: q.to,
  activity_id: q.activityId,
  user_id: q.userId,
  status: q.status,
});

export async function getReportPageData(query: ReportQuery): Promise<ReportPageData> {
  const filters = reportFilters(query);

  const [history, summary, activities, personnel] = await Promise.all([
    load<ActivityUpdate[]>(API_ROUTES.REPORTS.LIST, { ...filters, page: query.page, "per-page": query.perPage }),
    load<{ totals: ReportTotals; trend: ReportTrendPoint[] }>(API_ROUTES.REPORTS.SUMMARY, filters),
    load<{ activities: { id: number; title: string }[] }>(API_ROUTES.ACTIVITIES.OPTIONS),
    load<{ id: number; name: string; staffId: string }[]>(API_ROUTES.USERS.OPTIONS),
  ]);

  return {
    history: { items: history.data, meta: history.meta as PaginationMeta },
    totals: summary.data.totals,
    trend: summary.data.trend,
    activities: activities.data.activities.map((a) => ({ id: a.id, label: a.title })),
    personnel: personnel.data.map((p) => ({ id: p.id, label: p.name, hint: p.staffId })),
  };
}
