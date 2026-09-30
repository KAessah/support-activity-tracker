"use client";

import { Search } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";

type Props = {
  label: string;
  placeholder: string;
  tip?: string;
  defaultValue?: string;
  onSearch: (value: string) => void;
  /** Filter row rendered below the search bar ("Add filter", chips…). */
  children?: ReactNode;
};

/** The design's search card: labelled pill search, tip, then a filter row. */
export function SearchPanel({ label, placeholder, tip, defaultValue = "", onSearch, children }: Props) {
  const [value, setValue] = useState(defaultValue);

  return (
    <section className="mb-4 rounded-2xl bg-surface p-5">
      <form
        className="flex flex-wrap items-center gap-3"
        onSubmit={(e) => {
          e.preventDefault();
          onSearch(value.trim());
        }}
      >
        <label htmlFor="page-search" className="text-[13px] text-strong">{label}</label>
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-tertiary" />
          <input
            id="page-search"
            type="search"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              if (!e.target.value) onSearch("");
            }}
            placeholder={placeholder}
            className="h-12 w-full rounded-full bg-surface-muted pr-4 pl-11 text-sm outline-none placeholder:text-placeholder focus:ring-2 focus:ring-brand-500/30"
          />
        </div>
        <Button type="submit" className="h-12 px-7">Search</Button>
      </form>
      {tip && <p className="mt-2 pl-1 text-[11px] text-tertiary">{tip}</p>}

      {children && <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-hairline pt-4">{children}</div>}
    </section>
  );
}
