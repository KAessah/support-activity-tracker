import { Skeleton } from "@/components/ui/Skeleton";
import { MetricCard } from "./MetricCard";

/** Shared loading.tsx layout: header, metric row, search card, table. */
export function PageSkeleton({ label, metrics = [], search = true }: { label: string; metrics?: string[]; search?: boolean }) {
  return (
    <div role="status" aria-busy="true" aria-label={label} className="space-y-4">
      <header className="mb-5 space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-[30rem] max-w-full" />
      </header>

      {metrics.length > 0 && (
        <section className={metrics.length > 4 ? "grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5" : "grid grid-cols-2 gap-4 lg:grid-cols-4"}>
          {metrics.map((title) => (
            <MetricCard key={title} title={title}>
              <Skeleton className="h-8 w-16" />
            </MetricCard>
          ))}
        </section>
      )}

      {search && (
        <section className="space-y-4 rounded-2xl bg-surface p-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-5 w-28 shrink-0" />
            <Skeleton className="h-12 flex-1 rounded-full" />
            <Skeleton className="h-12 w-24 rounded-full" />
          </div>
          <div className="border-t border-hairline pt-4">
            <Skeleton className="h-10 w-28 rounded-full" />
          </div>
        </section>
      )}

      <section className="rounded-2xl bg-surface p-5">
        <Skeleton className="mb-4 h-5 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </section>
    </div>
  );
}
