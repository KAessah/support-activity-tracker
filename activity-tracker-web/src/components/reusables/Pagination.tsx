"use client";

import { useState } from "react";
import { Select } from "@/components/ui/Form";

type Props = {
  page: number;
  lastPage: number;
  total: number;
  from: number | null;
  to: number | null;
  perPage: number;
  onPageChange: (page: number) => void;
  onPerPageChange: (perPage: number) => void;
};

const pill = "h-8 rounded-full bg-surface-muted px-3.5 text-[13px] text-strong transition hover:bg-[#ebebeb] disabled:opacity-40 disabled:hover:bg-surface-muted";

export function Pagination({ page, lastPage, total, from, to, perPage, onPageChange, onPerPageChange }: Props) {
  const [draft, setDraft] = useState<string | null>(null);
  const go = (p: number) => onPageChange(Math.min(Math.max(1, p), Math.max(1, lastPage)));

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
      <div className="flex items-center gap-3 text-xs whitespace-nowrap text-tertiary">
        <span>
          Showing {from ?? 0}–{to ?? 0} of {total.toLocaleString()}
        </span>
        <span className="h-3 w-px bg-[#ddd]" />
        <label className="flex items-center gap-2 text-[13px] text-strong">
          Rows per page
          {/* Fixed-width wrapper: Select is full-width by default. */}
          <span className="w-20">
            <Select value={perPage} onChange={(e) => onPerPageChange(Number(e.target.value))} className="!h-8 !rounded-full !pl-3.5 text-[13px]">
              {[10, 25, 50].map((n) => (
                <option key={n}>{n}</option>
              ))}
            </Select>
          </span>
        </label>
      </div>

      <div className="flex items-center gap-1.5">
        <button className={pill} disabled={page <= 1} onClick={() => go(1)}>First</button>
        <button className={pill} disabled={page <= 1} onClick={() => go(page - 1)}>Previous</button>
        <span className="flex items-center gap-1.5 px-1 text-xs text-tertiary">
          Page
          <input
            aria-label="Page number"
            className="h-8 w-12 rounded-full bg-surface-muted text-center text-[13px] text-strong outline-none focus:ring-2 focus:ring-brand-500/30"
            value={draft ?? page}
            onChange={(e) => setDraft(e.target.value.replace(/\D/g, ""))}
            onBlur={() => { if (draft) go(Number(draft)); setDraft(null); }}
            onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
          />
          of {Math.max(1, lastPage).toLocaleString()}
        </span>
        <button className={pill} disabled={page >= lastPage} onClick={() => go(page + 1)}>Next</button>
        <button className={pill} disabled={page >= lastPage} onClick={() => go(lastPage)}>Last</button>
      </div>
    </div>
  );
}
