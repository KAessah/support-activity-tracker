import "server-only";

import { intParam, param } from "@/lib/helpers/queryParams";
import { API_ROUTES } from "@/lib/utils/routes";
import type { Activity } from "@/types/Activity";
import type { Paginated, PaginationMeta } from "@/types/Api";
import type { ListQuery } from "@/types/Team";
import { load } from "./loader";

type SearchParams = Record<string, string | string[] | undefined>;

export function parseListQuery(params: SearchParams): ListQuery {
  const status = param(params, "status");
  return {
    search: param(params, "search").slice(0, 100),
    status: status === "active" || status === "inactive" ? status : "",
    page: intParam(params, "page", 1),
    perPage: intParam(params, "perPage", 10, 100),
  };
}

export async function getActivitiesPageData(query: ListQuery): Promise<{ activities: Paginated<Activity>; categories: string[] }> {
  const [list, options] = await Promise.all([
    load<Activity[]>(API_ROUTES.ACTIVITIES.LIST, { search: query.search, status: query.status, page: query.page, "per-page": query.perPage }),
    load<{ categories: string[] }>(API_ROUTES.ACTIVITIES.OPTIONS),
  ]);

  return {
    activities: { items: list.data, meta: list.meta as PaginationMeta },
    categories: options.data.categories,
  };
}
