"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { buildQuery, type Query } from "@/lib/helpers/queryParams";

/**
 * Filters live in the URL so they're shareable and survive refresh.
 * Patching the query re-renders the server page with fresh data;
 * `isPending` lets the UI dim while that happens.
 */
export function useUrlQuery() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const setQuery = useCallback(
    (patch: Query, { resetPage = true } = {}) => {
      const next: Query = { ...Object.fromEntries(params.entries()), ...patch };
      if (resetPage && !("page" in patch)) delete next.page;
      startTransition(() => router.push(`${pathname}${buildQuery(next)}`, { scroll: false }));
    },
    [params, pathname, router],
  );

  return { setQuery, isPending };
}
