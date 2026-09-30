"use client";

import clsx from "clsx";
import { ArrowLeft, Hash, Layers, Pencil, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PersonCell } from "@/components/reusables/InitialsAvatar";
import { MetricCard } from "@/components/reusables/MetricCard";
import { StatusBadge } from "@/components/reusables/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Cell, EmptyRow, Row, Table } from "@/components/ui/Table";
import { day, initials, longDay, time } from "@/lib/helpers/formatters";
import { useUrlQuery } from "@/lib/hooks/useUrlQuery";
import { APP_ROUTES } from "@/lib/utils/routes";
import type { ActivityHistory } from "@/types/Activity";
import { UpdateStatusDialog } from "./UpdateStatusDialog";

export function ActivityDetailContent({ history }: { history: ActivityHistory }) {
  const { activity, stats, trend, date, isToday } = history;
  const { setQuery, isPending } = useUrlQuery();
  const [editing, setEditing] = useState(false);
  const updates = activity.updates ?? [];

  return (
    <div className={clsx("transition-opacity", isPending && "pointer-events-none opacity-60")}>
      <div className="mb-4 flex items-center gap-3">
        <Link href={isToday ? APP_ROUTES.BOARD : `${APP_ROUTES.BOARD}?date=${date}`}>
          <Button variant="secondary" className="bg-surface"><ArrowLeft className="size-4" /> Back</Button>
        </Link>
        <p className="truncate text-xs text-tertiary">
          Daily Board <span className="mx-1">/</span> <span className="text-strong">{activity.title}</span>
        </p>
      </div>

      <Card className="mb-4 flex flex-wrap items-center gap-4">
        <span className="grid size-14 place-items-center rounded-full bg-brand-600 text-lg font-medium text-white">{initials(activity.title)}</span>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl font-medium tracking-tight">{activity.title}</h1>
          <p className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-tertiary">
            <span className="flex items-center gap-1.5"><Hash className="size-3.5" /> ACT-{String(activity.id).padStart(4, "0")}</span>
            <span className="flex items-center gap-1.5"><Layers className="size-3.5" /> {activity.category ?? "Uncategorised"}</span>
            <span className="flex items-center gap-1.5"><RefreshCw className="size-3.5" /> {stats.totalUpdates} updates all-time</span>
          </p>
          {activity.description && <p className="mt-2 max-w-3xl text-[13px] text-body">{activity.description}</p>}
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={activity.latestUpdate?.status} />
          {isToday && activity.can?.updateStatus && (
            <Button onClick={() => setEditing(true)}><Pencil className="size-3.5" /> Update status</Button>
          )}
        </div>
      </Card>

      <section className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard title={`Updates ${isToday ? "today" : `on ${day(date)}`}`}>{updates.length}</MetricCard>
        <MetricCard title="Days done (14d)" tone="done">{stats.daysDone}</MetricCard>
        <MetricCard title="Days left pending (14d)" tone="pending">{stats.daysPending}</MetricCard>
        <MetricCard title="Days not updated (14d)" tone="none">{stats.daysMissed}</MetricCard>
      </section>

      <Card className="mb-4">
        <CardHeader
          title="14-day status history"
          subtitle="How this activity ended each day. Select a day to see its updates."
          actions={
            <div className="flex items-center gap-3 text-[11px] text-tertiary">
              <Legend className="bg-emerald-500" label="Done" />
              <Legend className="bg-amber-400" label="Pending" />
              <Legend className="bg-[#e4e4e4]" label="Not updated" />
            </div>
          }
        />
        <div className="grid grid-cols-7 gap-2 md:grid-cols-14">
          {trend.map((d) => (
            <button
              key={d.date}
              onClick={() => setQuery({ date: d.date === trend.at(-1)?.date && isToday ? undefined : d.date })}
              aria-label={`${day(d.date)}: ${d.status ?? "not updated"}`}
              className={clsx("group rounded-xl p-1.5 text-center transition hover:bg-surface-muted", d.date === date && "bg-surface-muted ring-2 ring-brand-500/40")}
            >
              <span
                className={clsx(
                  "block h-14 rounded-lg transition group-hover:scale-[1.03]",
                  d.status === "done" && "bg-emerald-500",
                  d.status === "pending" && "bg-amber-400",
                  !d.status && "bg-[#e4e4e4]",
                )}
              />
              <span className="mt-1.5 block text-[11px] text-strong">{day(d.date, { day: "2-digit", month: "short" })}</span>
              <span className="block text-[10px] text-tertiary">{d.updates} upd.</span>
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <CardHeader title={`Updates on ${longDay(date)}`} subtitle="Who updated this activity, what they recorded and when" />
        <Table head={["Time", "Status", "Remark", "Updated by", "Phone", "Email", "Role"]}>
          {!updates.length && <EmptyRow colSpan={7}>No updates were recorded on this day.</EmptyRow>}
          {updates.map((u) => (
            <Row key={u.id}>
              <Cell className="whitespace-nowrap tabular-nums">{time(u.createdAt)}</Cell>
              <Cell><StatusBadge status={u.status} /></Cell>
              <Cell className="text-body" width="max-w-80">{u.remark ?? "—"}</Cell>
              <Cell><PersonCell name={u.personnel.name} staffId={u.personnel.staffId} position={u.personnel.position} /></Cell>
              <Cell className="whitespace-nowrap">{u.personnel.phone ?? "—"}</Cell>
              <Cell>{u.personnel.email}</Cell>
              <Cell className="capitalize">{u.personnel.role ?? "—"}</Cell>
            </Row>
          ))}
        </Table>
      </Card>

      <UpdateStatusDialog activity={editing ? activity : null} onClose={() => setEditing(false)} />
    </div>
  );
}

function Legend({ className, label }: { className: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={clsx("size-2.5 rounded-sm", className)} /> {label}
    </span>
  );
}
