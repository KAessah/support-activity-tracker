"use client";

import clsx from "clsx";
import { Pencil, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleActivityStatus } from "@/actions/activities";
import { ConfirmationDialog } from "@/components/reusables/ConfirmationDialog";
import { FilterChip, FilterPopover, FilterSummary } from "@/components/reusables/Filter";
import { PageHeader } from "@/components/reusables/PageHeader";
import { Pagination } from "@/components/reusables/Pagination";
import { SearchPanel } from "@/components/reusables/SearchPanel";
import { ActiveBadge } from "@/components/reusables/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Field, Select } from "@/components/ui/Form";
import { Cell, EmptyRow, Row, Table } from "@/components/ui/Table";
import { number } from "@/lib/helpers/formatters";
import { handleError, handleSuccess } from "@/lib/helpers/toast";
import { useUrlQuery } from "@/lib/hooks/useUrlQuery";
import type { Activity } from "@/types/Activity";
import type { Paginated } from "@/types/Api";
import type { ListQuery } from "@/types/Team";
import { ActivityFormDialog } from "./ActivityFormDialog";

export function ActivitiesContent({ activities, categories, query }: { activities: Paginated<Activity>; categories: string[]; query: ListQuery }) {
  const { setQuery, isPending } = useUrlQuery();
  const [editing, setEditing] = useState<Activity | "new" | null>(null);
  const [confirming, setConfirming] = useState<Activity | null>(null);
  const [isToggling, startToggle] = useTransition();
  const { items, meta } = activities;

  function toggle() {
    if (!confirming) return;
    startToggle(async () => {
      const res = await toggleActivityStatus(confirming.id);
      (res.ok ? handleSuccess : handleError)({ message: res.message });
      setConfirming(null);
    });
  }

  return (
    <div className={clsx("transition-opacity", isPending && "opacity-60")}>
      <PageHeader
        title="Activities"
        subtitle="The checks the support team works through every day."
        actions={<Button onClick={() => setEditing("new")}><Plus className="size-4" /> New activity</Button>}
      />

      <SearchPanel label="Search activities" placeholder="Title or category" defaultValue={query.search} onSearch={(search) => setQuery({ search })}>
        <FilterPopover<string> title="Filter activities" value={query.status} empty="" onApply={(status) => setQuery({ status })}>
          {(draft, setDraft) => (
            <Field label="Status">
              <Select value={draft} onChange={(e) => setDraft(e.target.value)}>
                <option value="">Show all</option>
                <option value="active">Active</option>
                <option value="inactive">Retired</option>
              </Select>
            </Field>
          )}
        </FilterPopover>
        {query.status && <FilterChip label="Status" value={query.status === "active" ? "Active" : "Retired"} onRemove={() => setQuery({ status: undefined })} />}
        <FilterSummary count={query.status ? 1 : 0} onClear={() => setQuery({ status: undefined })} />
      </SearchPanel>

      <Card>
        <CardHeader title="All activities" subtitle={`Showing ${meta.from ?? 0}–${meta.to ?? 0} of ${number(meta.total)} activities`} />
        <Table head={["Activity", "Category", "Updates", "Status", "Actions"]}>
          {!items.length && <EmptyRow colSpan={5}>No activities found.</EmptyRow>}
          {items.map((a) => (
            <Row key={a.id} dim={!a.isActive}>
              <Cell width="max-w-72 2xl:max-w-md">
                <p className="truncate" title={a.title}>{a.title}</p>
                {a.description && <p className="truncate text-[11px] text-tertiary" title={a.description}>{a.description}</p>}
              </Cell>
              <Cell className="whitespace-nowrap">{a.category ?? "—"}</Cell>
              <Cell className="tabular-nums">{number(a.updatesCount ?? 0)}</Cell>
              <Cell><ActiveBadge active={a.isActive} inactiveLabel="Retired" /></Cell>
              <Cell>
                <div className="flex justify-end gap-1.5">
                  <Button size="sm" onClick={() => setEditing(a)}><Pencil className="size-3" /> Edit</Button>
                  <Button size="sm" variant={a.isActive ? "secondary" : "ghost"} onClick={() => setConfirming(a)}>
                    {a.isActive ? "Retire" : "Reactivate"}
                  </Button>
                </div>
              </Cell>
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
        <p className="mt-4 text-[11px] text-tertiary">Retired activities leave the daily board but keep their history for reports.</p>
      </Card>

      <ActivityFormDialog target={editing} categories={categories} onClose={() => setEditing(null)} />

      <ConfirmationDialog
        open={!!confirming}
        title={confirming?.isActive ? "Retire activity?" : "Reactivate activity?"}
        description={
          confirming?.isActive
            ? `"${confirming.title}" will no longer appear on the daily board. Its history stays available in reports.`
            : `"${confirming?.title}" will appear on the daily board again from today.`
        }
        confirmLabel={confirming?.isActive ? "Retire" : "Reactivate"}
        destructive={confirming?.isActive}
        pending={isToggling}
        onConfirm={toggle}
        onClose={() => setConfirming(null)}
      />
    </div>
  );
}
