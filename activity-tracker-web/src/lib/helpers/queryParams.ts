export type Query = Record<string, string | number | undefined | null>;

export function buildQuery(params: Query = {}): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") search.set(key, String(value));
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

type SearchParams = Record<string, string | string[] | undefined>;

export const param = (params: SearchParams, key: string): string => {
  const value = params[key];
  return (Array.isArray(value) ? value[0] : value) ?? "";
};

export const intParam = (params: SearchParams, key: string, fallback: number, max = Infinity): number => {
  const n = Number.parseInt(param(params, key), 10);
  return Number.isFinite(n) && n > 0 ? Math.min(n, max) : fallback;
};

export const isYmd = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
