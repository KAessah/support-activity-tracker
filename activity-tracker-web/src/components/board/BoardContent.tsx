"use client";

import clsx from "clsx";
import { CalendarDays, ChevronLeft, ChevronRight, CornerDownRight, Eye, Pencil } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FilterChip, FilterPopover, FilterSummary } from "@/components/reusables/Filter";
import { PersonCell } from "@/components/reusables/InitialsAvatar";
import { MetricCard } from "@/components/reusables/MetricCard";
import { PageHeader } from "@/components/reusables/PageHeader";
import { Pagination } from "@/components/reusables/Pagination";
import { SearchPanel } from "@/components/reusables/SearchPanel";
import { StatusBadge } from "@/components/reusables/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Form";
import { Cell, EmptyRow, Row, Table } from "@/components/ui/Table";
import { day, longDay, shiftYmd, time, todayYmd } from "@/lib/helpers/formatters";
import { useUrlQuery } from "@/lib/hooks/useUrlQuery";
import { APP_ROUTES } from "@/lib/utils/routes";
import type { Activity, Board } from "@/types/Activity";
import { ActivityTimeline } from "./ActivityTimeline";
import { UpdateStatusDialog } from "./UpdateStatusDialog";

type StatusFilter = "" | "done" | "pending" | "none";

const STATUS_LABELS: Record<Exclude<StatusFilter, "">, string> = { done: "Done", pending: "Pending", none: "Not updated" };

export function BoardContent({ board }: { board: Board }) {
  const today = todayYmd();
  const { setQuery, isPending } = useUrlQuery();

  // The day's list is small, so search/filter/paging happen in the browser.
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [editing, setEditing] = useState<Activity | null>(null);

  const goTo = (date: string) => setQuery({ date: date === today ? undefined : date });

  /** Metric cards double as the status filter; clicking the active one clears it. */
  const filterBy = (next: StatusFilter) => {
    setStatus((current) => (current === next ? "" : next));
    setPage(1);
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return board.activities.filter((a) => {
      const current = a.latestUpdate?.status ?? "none";
      return (
        (!status || current === status) &&
        (!term || a.title.toLowerCase().includes(term) || !!a.latestUpdate?.personnel.name.toLowerCase().includes(term))
      );
    });
  }, [board, search, status]);

  const lastPage = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, lastPage);
  const rows = filtered.slice((current - 1) * perPage, current * perPage);
  const filterCount = [status, board.isToday ? "" : board.date].filter(Boolean).length;

  return (
    <div className={clsx("transition-opacity", isPending && "pointer-events-none opacity-60")}>
      <PageHeader
        title="Daily Board"
        subtitle="Track the team's activities for the day, who updated them and what's pending for handover."
        actions={
          <div className="flex h-11 items-center gap-1 rounded-full bg-surface p-1">
            <button onClick={() => goTo(shiftYmd(board.date, -1))} className="grid size-9 place-items-center rounded-full hover:bg-surface-muted" aria-label="Previous day">
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-36 px-2 text-center text-[13px]">{board.isToday ? "Today" : day(board.date)}</span>
            <button
              onClick={() => goTo(shiftYmd(board.date, 1))}
              disabled={board.isToday}
              className="grid size-9 place-items-center rounded-full hover:bg-surface-muted disabled:opacity-30 disabled:hover:bg-transparent"
              aria-label="Next day"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        }
      />

      <section aria-label="Day summary" className="mb-4 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <MetricCard title="Total Activities" onClick={() => filterBy("")}>{board.stats.total}</MetricCard>
        <MetricCard title="Done" tone="done" onClick={() => filterBy("done")} active={status === "done"}>{board.stats.done}</MetricCard>
        <MetricCard title="Pending" tone="pending" onClick={() => filterBy("pending")} active={status === "pending"}>{board.stats.pending}</MetricCard>
        <MetricCard title="Not Updated" tone="none" onClick={() => filterBy("none")} active={status === "none"}>{board.stats.notUpdated}</MetricCard>
        <MetricCard title="Completion">
          <span className="flex items-center gap-3">
            {board.stats.progress}%
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-muted">
              <span className="block h-full rounded-full bg-brand-600" style={{ width: `${board.stats.progress}%` }} />
            </span>
          </span>
        </MetricCard>
      </section>

      <SearchPanel
        label="Search activities"
        placeholder="Activity title or the name of the person who updated it"
        tip={board.isToday ? "Tip: click Done, Pending or Not Updated above to filter the list." : `You're viewing ${longDay(board.date)}. Past days are read-only.`}
        onSearch={(v) => { setSearch(v); setPage(1); }}
      >
        <FilterPopover<string> title="Show activities for" label="Filter by date" icon={<CalendarDays className="size-4" />} value={board.date} empty={today} onApply={(d) => d && goTo(d)}>
          {(draft, setDraft) => (
            <>
              <Input type="date" value={draft} max={today} onChange={(e) => setDraft(e.target.value)} />
              <div className="flex gap-1.5">
                <Button variant="secondary" size="sm" onClick={() => setDraft(today)}>Today</Button>
                <Button variant="secondary" size="sm" onClick={() => setDraft(shiftYmd(today, -1))}>Yesterday</Button>
              </div>
            </>
          )}
        </FilterPopover>

        {status && <FilterChip label="Status" value={STATUS_LABELS[status]} onRemove={() => filterBy(status)} />}
        {!board.isToday && <FilterChip label="Date" value={day(board.date)} onRemove={() => goTo(today)} />}
        <FilterSummary
          count={filterCount}
          onClear={() => {
            setStatus("");
            if (!board.isToday) goTo(today);
          }}
        />
      </SearchPanel>

      {board.carriedOver.length > 0 && (
        <Card className="mb-4">
          <CardHeader
            title={`Handed over from ${day(shiftYmd(board.date, -1))}`}
            subtitle="Activities left pending at the end of the previous day. Pick these up first."
          />
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {board.carriedOver.map((u) => (
              <Link key={u.id} href={APP_ROUTES.ACTIVITY_DETAIL(u.activityId, board.isToday ? undefined : board.date)} className="rounded-xl bg-status-warning-bg/60 p-4 transition hover:bg-status-warning-bg">
                <p className="flex items-start gap-2 text-[13px] text-strong">
                  <CornerDownRight className="mt-0.5 size-4 shrink-0 text-amber-600" />
                  {u.activity?.title}
                </p>
                {u.remark && <p className="mt-1.5 pl-6 text-[13px] text-body">“{u.remark}”</p>}
                <p className="mt-2 pl-6 text-[11px] text-tertiary">{u.personnel.name} · {time(u.createdAt)}</p>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Card className="mb-4">
        <CardHeader title="Activities" subtitle={`Showing ${rows.length} of ${filtered.length} activities`} />
        <Table head={["Activity", "Status", "Last update", "Remark", "Actions"]}>
          {!rows.length && <EmptyRow colSpan={5}>No activities match your filters.</EmptyRow>}
          {rows.map((a) => (
            <Row key={a.id} dim={!a.isActive}>
              <Cell width="max-w-56 2xl:max-w-80">
                <p className="truncate">{a.title}</p>
                <p className="text-[11px] text-tertiary">
                  {a.category ?? "Uncategorised"}
                  {!!a.updates?.length && ` · ${a.updates.length} update${a.updates.length > 1 ? "s" : ""}`}
                  {!a.isActive && " · Retired"}
                </p>
              </Cell>
              <Cell><StatusBadge status={a.latestUpdate?.status} /></Cell>
              <Cell>
                {a.latestUpdate ? (
                  <PersonCell name={a.latestUpdate.personnel.name} staffId={a.latestUpdate.personnel.staffId} position={`at ${time(a.latestUpdate.createdAt)}`} />
                ) : (
                  <span className="text-tertiary">—</span>
                )}
              </Cell>
              <Cell width="max-w-40 2xl:max-w-64"><p className="truncate text-body" title={a.latestUpdate?.remark ?? ""}>{a.latestUpdate?.remark ?? "—"}</p></Cell>
              <Cell>
                <div className="flex gap-1.5">
                  {board.isToday && a.can?.updateStatus && (
                    <Button size="sm" onClick={() => setEditing(a)} aria-label={`Update ${a.title}`} title="Update status"><Pencil className="size-3" /><span className="hidden min-[1400px]:inline">Update</span></Button>
                  )}
                  <Link href={APP_ROUTES.ACTIVITY_DETAIL(a.id, board.isToday ? undefined : board.date)}>
                    <Button size="sm" variant="secondary" aria-label={`View ${a.title}`} title="View history"><Eye className="size-3.5" /></Button>
                  </Link>
                </div>
              </Cell>
            </Row>
          ))}
        </Table>
        {filtered.length > 0 && (
          <Pagination
            page={current}
            lastPage={lastPage}
            total={filtered.length}
            from={(current - 1) * perPage + 1}
            to={Math.min(current * perPage, filtered.length)}
            perPage={perPage}
            onPageChange={setPage}
            onPerPageChange={(n) => { setPerPage(n); setPage(1); }}
          />
        )}
      </Card>

      <Card>
        <CardHeader
          title="Activity log"
          subtitle={`Every update made on ${longDay(board.date)}, newest first, with who made it and when`}
          actions={<span className="text-xs text-tertiary">{board.timeline.length} update{board.timeline.length === 1 ? "" : "s"}</span>}
        />
        <ActivityTimeline updates={board.timeline} date={board.isToday ? undefined : board.date} />
      </Card>

      <UpdateStatusDialog activity={editing} onClose={() => setEditing(null)} />
    </div>
  );
}
