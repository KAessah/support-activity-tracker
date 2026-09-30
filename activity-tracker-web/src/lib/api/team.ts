import "server-only";

import { hasPermission, PERMISSIONS } from "@/lib/auth/access";
import { API_ROUTES } from "@/lib/utils/routes";
import type { AuthUser } from "@/types/Account";
import type { Paginated, PaginationMeta } from "@/types/Api";
import type { ListQuery, Role, TeamMember } from "@/types/Team";
import { load } from "./loader";

export type TeamPageData = {
  members: Paginated<TeamMember>;
  counts: { active: number; inactive: number };
  roles: Role[];
};

export async function getTeamPageData(query: ListQuery, user: AuthUser): Promise<TeamPageData> {
  const canCreate = hasPermission(user, PERMISSIONS.MODIFY_USERS);

  const [list, roles] = await Promise.all([
    load<TeamMember[]>(API_ROUTES.USERS.LIST, { search: query.search, page: query.page, "per-page": query.perPage }),
    canCreate ? load<Role[]>(API_ROUTES.ROLES) : null,
  ]);

  return {
    members: { items: list.data, meta: list.meta as PaginationMeta },
    counts: (list.meta as { counts?: TeamPageData["counts"] }).counts ?? { active: 0, inactive: 0 },
    roles: roles?.data ?? [],
  };
}
