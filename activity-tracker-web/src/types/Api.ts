/** Body envelope returned by every Laravel endpoint (toJSONResponse). */
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
  meta: Partial<PaginationMeta>;
};

export type PaginationMeta = {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
  from: number | null;
  to: number | null;
};

export type Paginated<T> = { items: T[]; meta: PaginationMeta };

/** What a server action hands back to a client component. */
export type ActionResult<T = undefined> =
  | { ok: true; message: string; data: T }
  | { ok: false; message: string; fieldErrors?: Record<string, string> };

export type Option = { id: number; label: string; hint?: string };
