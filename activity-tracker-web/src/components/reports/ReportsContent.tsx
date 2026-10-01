"use client";

import clsx from "clsx";
import { CalendarDays, Download } from "lucide-react";
import Link from "next/link";
import { FilterChip, FilterPopover, FilterSummary } from "@/components/reusables/Filter";
import { PersonCell } from "@/components/reusables/InitialsAvatar";
import { MetricCard } from "@/components/reusables/MetricCard";
import { PageHeader } from "@/components/reusables/PageHeader";
import { Pagination } from "@/components/reusables/Pagination";
import { StatusBadge } from "@/components/reusables/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Input, Select } from "@/components/ui/Form";
import { Cell, EmptyRow, Row, Table } from "@/components/ui/Table";
import { day, number, shiftYmd, time, todayYmd } from "@/lib/helpers/formatters";
import { buildQuery } from "@/lib/helpers/queryParams";
import { useUrlQuery } from "@/lib/hooks/useUrlQuery";
import { APP_ROUTES } from "@/lib/utils/routes";
import type { ReportPageData, ReportQuery } from "@/types/Report";
import { TrendChart } from "./TrendChart";

type Refinements = Pick<ReportQuery, "activityId" | "userId" | "status">;

function presets(today: string) {
  const monthStart = `${today.slice(0, 7)}-01`;
  const lastMonthEnd = shiftYmd(monthStart, -1);
  return [
    { label: "Today", from: today, to: today },
    { label: "Yesterday", from: shiftYmd(today, -1), to: shiftYmd(today, -1) },
    { label: "Last 7 days", from: shiftYmd(today, -6), to: today },
    { label: "Last 30 days", from: shiftYmd(today, -29), to: today },
    { label: "This month", from: monthStart, to: today },
    { label: "Last month", from: `${lastMonthEnd.slice(0, 7)}-01`, to: lastMonthEnd },
  ];
}

const longDate = (ymd: string) => day(ymd, { day: "numeric", month: "short", year: "numeric" });

export function ReportsContent({ data, query }: { data: ReportPageData; query: ReportQuery }) {
  const today = todayYmd();
  const { setQuery, isPending } = useUrlQuery();
  const { history, totals, trend, activities, personnel } = data;
  const meta = history.meta;

  const activityName = activities.find((a) => String(a.id) === query.activityId)?.label;
  const personName = personnel.find((p) => String(p.id) === query.userId)?.label;
  const filterCount = [query.activityId, query.userId, query.status].filter(Boolean).length;

  const refine = (r: Refinements) => setQuery({ activity: r.activityId, person: r.userId, status: r.status });
  const exportHref = `${APP_ROUTES.REPORTS}/export${buildQuery({
    from: query.from, to: query.to, activity_id: query.activityId, user_id: query.userId, status: query.status,
  })}`;

  return (
    <div className={clsx("transition-opacity", isPending && "opacity-60")}>
      <PageHeader
        title="Reports"
        subtitle="Query activity history over any period, by activity, personnel or status."
        actions={
          <a href={exportHref} download>
            <Button variant="secondary" className="bg-surface"><Download className="size-4" /> Export CSV</Button>
          </a>
        }
      />

      <section aria-label="Report summary" className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <MetricCard title="Total Updates">{number(totals.total)}</MetricCard>
        <MetricCard title="Marked Done" tone="done">{number(totals.done)}</MetricCard>
        <MetricCard title="Marked Pending" tone="pending">{number(totals.pending)}</MetricCard>
        <MetricCard title="Personnel Involved">{totals.personnel}</MetricCard>
        <MetricCard title="Days Covered" tone="none">{totals.days}</MetricCard>
      </section>

      <section className="mb-4 rounded-2xl bg-surface p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 text-[13px] text-strong">Period</span>
          {presets(today).map((p, i, all) => {
            // Highlight only the first matching preset: on the 1st of a month,
            // "Today" and "This month" cover the same range.
            const matches = (x: { from: string; to: string }) => x.from === query.from && x.to === query.to;
            const active = matches(p) && all.findIndex(matches) === i;
            return (
              <button
                key={p.label}
                onClick={() => setQuery({ from: p.from, to: p.to })}
                aria-pressed={active}
                className={clsx("h-9 rounded-full px-4 text-[13px] transition", active ? "bg-brand-600 text-white" : "bg-surface-muted text-strong hover:bg-[#ebebeb]")}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 pl-1 text-[11px] text-tertiary">Showing {longDate(query.from)} to {longDate(query.to)}</p>

        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
          <FilterPopover<Refinements>
            title="Filter history"
            value={{ activityId: query.activityId, userId: query.userId, status: query.status }}
            empty={{ activityId: "", userId: "", status: "" }}
            onApply={refine}
          >
            {(draft, setDraft) => (
              <>
                <Field label="Activity">
                  <Select value={draft.activityId} onChange={(e) => setDraft({ ...draft, activityId: e.target.value })}>
                    <option value="">All activities</option>
                    {activities.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
                  </Select>
                </Field>
                <Field label="Personnel">
                  <Select value={draft.userId} onChange={(e) => setDraft({ ...draft, userId: e.target.value })}>
                    <option value="">Everyone</option>
                    {personnel.map((p) => <option key={p.id} value={p.id}>{p.label} ({p.hint})</option>)}
                  </Select>
                </Field>
                <Field label="Status">
                  <Select value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value as Refinements["status"] })}>
                    <option value="">Any status</option>
                    <option value="done">Done</option>
                    <option value="pending">Pending</option>
                  </Select>
                </Field>
              </>
            )}
          </FilterPopover>

          <FilterPopover<{ from: string; to: string }>
            title="Custom date range"
            label="Filter by date"
            icon={<CalendarDays className="size-4" />}
            value={{ from: query.from, to: query.to }}
            empty={{ from: shiftYmd(today, -6), to: today }}
            onApply={(r) => r.from && r.to && setQuery({ from: r.from, to: r.to < r.from ? r.from : r.to })}
          >
            {(draft, setDraft) => (
              <div className="grid grid-cols-2 gap-3">
                <Field label="From"><Input type="date" value={draft.from} max={today} onChange={(e) => setDraft({ ...draft, from: e.target.value })} /></Field>
                <Field label="To"><Input type="date" value={draft.to} min={draft.from} max={today} onChange={(e) => setDraft({ ...draft, to: e.target.value })} /></Field>
              </div>
            )}
          </FilterPopover>

          {query.activityId && <FilterChip label="Activity" value={activityName ?? "Unknown"} onRemove={() => setQuery({ activity: undefined })} />}
          {query.userId && <FilterChip label="Personnel" value={personName ?? "Unknown"} onRemove={() => setQuery({ person: undefined })} />}
          {query.status && <FilterChip label="Status" value={query.status === "done" ? "Done" : "Pending"} onRemove={() => setQuery({ status: undefined })} />}
          <FilterSummary count={filterCount} onClear={() => setQuery({ activity: undefined, person: undefined, status: undefined })} />
        </div>
      </section>

      <Card className="mb-4">
        <CardHeader
          title="Daily activity"
          subtitle="Updates marked done vs pending per day"
          actions={
            <div className="flex items-center gap-4 text-xs text-tertiary">
              <span className="flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-brand-600" /> Done</span>
              <span className="flex items-center gap-1.5"><span className="w-4 border-t-2 border-dashed border-amber-500" /> Pending</span>
            </div>
          }
        />
        <TrendChart data={trend} />
      </Card>

      <Card>
        <CardHeader title="Activity history" subtitle={`Showing ${meta.from ?? 0}–${meta.to ?? 0} of ${number(meta.total)} updates`} />
        <Table head={["Date & time", "Activity", "Status", "Remark", "Updated by"]}>
          {!history.items.length && <EmptyRow colSpan={5}>No updates match these filters.</EmptyRow>}
          {history.items.map((u) => (
            <Row key={u.id}>
              <Cell className="whitespace-nowrap">
                <Link href={u.activityDate === today ? APP_ROUTES.BOARD : `${APP_ROUTES.BOARD}?date=${u.activityDate}`} className="hover:text-brand-700" title="Open this day on the board">
                  {day(u.activityDate, { day: "2-digit", month: "short", year: "numeric" })}
                </Link>
                <p className="text-[11px] text-tertiary tabular-nums">{time(u.createdAt)}</p>
              </Cell>
              <Cell width="max-w-64">
                <Link href={APP_ROUTES.ACTIVITY_DETAIL(u.activityId, u.activityDate)} className="block truncate hover:text-brand-700">{u.activity?.title}</Link>
                <p className="text-[11px] text-tertiary">{u.activity?.category}</p>
              </Cell>
              <Cell><StatusBadge status={u.status} /></Cell>
              <Cell width="max-w-56"><p className="truncate text-body" title={u.remark ?? ""}>{u.remark ?? "—"}</p></Cell>
              <Cell><PersonCell name={u.personnel.name} staffId={u.personnel.staffId} /></Cell>
            </Row>
          ))}
        </Table>
        {meta.total > 0 && (
          <Pagination
            page={meta.currentPage}
            lastPage={meta.lastPage}
            total={meta.total}
            from={meta.from}
            to={meta.to}
            perPage={query.perPage}
            onPageChange={(page) => setQuery({ page }, { resetPage: false })}
            onPerPageChange={(perPage) => setQuery({ perPage })}
          />
        )}
      </Card>
    </div>
  );
}
