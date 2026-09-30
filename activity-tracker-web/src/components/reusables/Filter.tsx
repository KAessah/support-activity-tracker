"use client";

import { Plus, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Popover } from "@/components/ui/Popover";

/** "Status is Pending ×" chip for an applied filter. */
export function FilterChip({ label, value, onRemove }: { label: string; value: string; onRemove: () => void }) {
  return (
    <span className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline bg-surface pr-2 pl-3.5 text-[13px] text-tertiary">
      {label} <span>is</span> <span className="text-strong">{value}</span>
      <button onClick={onRemove} className="ml-1 grid size-5 place-items-center rounded-full hover:bg-surface-muted" aria-label={`Remove ${label} filter`}>
        <X className="size-3.5" />
      </button>
    </span>
  );
}

export function FilterSummary({ count, onClear }: { count: number; onClear: () => void }) {
  if (!count) return <span className="text-[13px] text-tertiary">No filters applied</span>;

  return (
    <>
      <span className="text-[13px] text-tertiary">
        {count} filter{count > 1 ? "s" : ""} applied
      </span>
      <button onClick={onClear} className="ml-1 text-[13px] text-brand-700 hover:underline">
        Clear all
      </button>
    </>
  );
}

type FilterPopoverProps<T> = {
  title: string;
  label?: string;
  icon?: ReactNode;
  value: T;
  empty: T;
  onApply: (value: T) => void;
  /** Renders the fields for the draft value. */
  children: (draft: T, setDraft: (value: T) => void) => ReactNode;
};

/**
 * "Add filter" popover: edits a draft copy and only applies it on "Filter",
 * so the list doesn't reload on every keystroke.
 */
export function FilterPopover<T>({ title, label = "Add filter", icon = <Plus className="size-4" />, value, empty, onApply, children }: FilterPopoverProps<T>) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      title={title}
      trigger={
        <Button variant="outline" onClick={() => { setDraft(value); setOpen((o) => !o); }}>
          {icon} {label}
        </Button>
      }
      footer={
        <>
          <Button variant="outline" size="sm" onClick={() => setDraft(empty)}>Reset</Button>
          <Button size="sm" onClick={() => { onApply(draft); setOpen(false); }}>Filter</Button>
        </>
      }
    >
      {children(draft, setDraft)}
    </Popover>
  );
}
