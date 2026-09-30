import clsx from "clsx";
import type { ReactNode } from "react";
import type { ActivityStatus } from "@/types/Activity";

type Tone = "done" | "pending" | "neutral" | "brand";

const tones: Record<Tone, string> = {
  done: "bg-status-success-bg text-status-success-fg",
  pending: "bg-status-warning-bg text-status-warning-fg",
  neutral: "bg-status-neutral-bg text-status-neutral-fg",
  brand: "bg-brand-50 text-brand-700",
};

export function Badge({ tone = "neutral", children, className }: { tone?: Tone; children: ReactNode; className?: string }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap capitalize", tones[tone], className)}>
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status?: ActivityStatus | null }) {
  if (status === "done") return <Badge tone="done">Done</Badge>;
  if (status === "pending") return <Badge tone="pending">Pending</Badge>;
  return <Badge>Not updated</Badge>;
}

export function ActiveBadge({ active, inactiveLabel = "Inactive" }: { active: boolean; inactiveLabel?: string }) {
  return active ? <Badge tone="done">Active</Badge> : <Badge>{inactiveLabel}</Badge>;
}
