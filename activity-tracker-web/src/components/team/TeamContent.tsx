"use client";

import clsx from "clsx";
import { Pencil, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { toggleMemberStatus } from "@/actions/team";
import { AccessGate } from "@/components/reusables/AccessGate";
import { ConfirmationDialog } from "@/components/reusables/ConfirmationDialog";
import { InitialsAvatar } from "@/components/reusables/InitialsAvatar";
import { MetricCard } from "@/components/reusables/MetricCard";
import { PageHeader } from "@/components/reusables/PageHeader";
import { Pagination } from "@/components/reusables/Pagination";
import { SearchPanel } from "@/components/reusables/SearchPanel";
import { ActiveBadge, Badge } from "@/components/reusables/StatusBadge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { Cell, EmptyRow, Row, Table } from "@/components/ui/Table";
import { PERMISSIONS } from "@/lib/auth/access";
import { number, relative } from "@/lib/helpers/formatters";
import { handleError, handleSuccess } from "@/lib/helpers/toast";
import { useUrlQuery } from "@/lib/hooks/useUrlQuery";
import type { TeamPageData } from "@/lib/api/team";
import type { ListQuery, TeamMember } from "@/types/Team";
import { MemberFormDialog } from "./MemberFormDialog";

export function TeamContent({ members, counts, roles, query }: TeamPageData & { query: ListQuery }) {
  const { setQuery, isPending } = useUrlQuery();
  const [editing, setEditing] = useState<TeamMember | "new" | null>(null);
  const [confirming, setConfirming] = useState<TeamMember | null>(null);
  const [isToggling, startToggle] = useTransition();
  const { items, meta } = members;

  function toggle() {
    if (!confirming) return;
    startToggle(async () => {
      const res = await toggleMemberStatus(confirming.id);
      (res.ok ? handleSuccess : handleError)({ message: res.message });
      setConfirming(null);
    });
  }

  return (
    <div className={clsx("transition-opacity", isPending && "opacity-60")}>
      <PageHeader
        title="Team"
        subtitle="Applications support personnel, their roles and account status."
        actions={
          <AccessGate permission={PERMISSIONS.MODIFY_USERS}>
            <Button onClick={() => setEditing("new")}><Plus className="size-4" /> Add member</Button>
          </AccessGate>
        }
      />

      <section className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <MetricCard title="Team Members">{number(counts.active + counts.inactive)}</MetricCard>
        <MetricCard title="Active Accounts" tone="done">{number(counts.active)}</MetricCard>
        <MetricCard title="Deactivated Accounts" tone="none">{number(counts.inactive)}</MetricCard>
      </section>

      <SearchPanel label="Search team" placeholder="Name, email or staff ID" defaultValue={query.search} onSearch={(search) => setQuery({ search })} />

      <Card>
        <CardHeader title="Members" subtitle={`Showing ${meta.from ?? 0}–${meta.to ?? 0} of ${number(meta.total)} members`} />
        <Table head={["Member", "Staff ID", "Phone", "Role", "Updates", "Last sign-in", "Status", "Actions"]}>
          {!items.length && <EmptyRow colSpan={8}>No team members found.</EmptyRow>}
          {items.map((m) => (
            <Row key={m.id} dim={!m.isActive}>
              <Cell>
                <div className="flex items-center gap-2.5">
                  <InitialsAvatar name={m.name} size="sm" />
                  <div className="leading-tight">
                    <p className="text-[13px]">{m.name}</p>
                    <p className="text-[11px] text-tertiary">{m.email}{m.position && ` · ${m.position}`}</p>
                  </div>
                </div>
              </Cell>
              <Cell className="whitespace-nowrap">{m.staffId}</Cell>
              <Cell className="whitespace-nowrap">{m.phone ?? "—"}</Cell>
              <Cell><Badge tone="brand">{m.role?.name}</Badge></Cell>
              <Cell className="tabular-nums">{number(m.updatesCount ?? 0)}</Cell>
              <Cell className="whitespace-nowrap text-body">{relative(m.lastLoginAt)}</Cell>
              <Cell><ActiveBadge active={m.isActive} inactiveLabel="Deactivated" /></Cell>
              <Cell>
                <div className="flex gap-1.5">
                  {m.can?.update && <Button size="sm" onClick={() => setEditing(m)}><Pencil className="size-3" /> Edit</Button>}
                  {m.can?.toggleStatus && (
                    <Button size="sm" variant={m.isActive ? "secondary" : "ghost"} onClick={() => setConfirming(m)}>
                      {m.isActive ? "Deactivate" : "Activate"}
                    </Button>
                  )}
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
      </Card>

      <MemberFormDialog target={editing} roles={roles} onClose={() => setEditing(null)} />

      <ConfirmationDialog
        open={!!confirming}
        title={confirming?.isActive ? `Deactivate ${confirming.name}?` : `Activate ${confirming?.name}?`}
        description={
          confirming?.isActive
            ? "They will be signed out everywhere immediately and won't be able to sign in. Their past updates remain in the history."
            : "They will be able to sign in and record activity updates again."
        }
        confirmLabel={confirming?.isActive ? "Deactivate" : "Activate"}
        destructive={confirming?.isActive}
        pending={isToggling}
        onConfirm={toggle}
        onClose={() => setConfirming(null)}
      />
    </div>
  );
}
