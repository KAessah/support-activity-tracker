import clsx from "clsx";
import type { ReactNode } from "react";

type Tone = "brand" | "done" | "pending" | "none";

const dots: Record<Tone, string> = {
  brand: "bg-brand-600",
  done: "bg-emerald-500",
  pending: "bg-amber-500",
  none: "bg-[#a3a3a3]",
};

type Props = {
  title: string;
  tone?: Tone;
  children: ReactNode;
  /** Makes the card a toggle (e.g. to filter a list by this metric). */
  onClick?: () => void;
  active?: boolean;
};

/** Dot + label + large figure, as on the design's metric row. */
export function MetricCard({ title, tone = "brand", children, onClick, active }: Props) {
  const content = (
    <>
      <p className="flex items-center gap-2 text-[13px] text-tertiary">
        <span className={clsx("size-1.5 rounded-full", dots[tone])} />
        {title}
      </p>
      <div className="mt-2 text-[26px] leading-tight text-strong tabular-nums">{children}</div>
    </>
  );

  if (!onClick) return <div className="rounded-2xl bg-surface px-5 py-4">{content}</div>;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "rounded-2xl bg-surface px-5 py-4 text-left transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)]",
        "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-inset focus-visible:outline-none",
        // Inset so the ring isn't clipped by the scroll container.
        active && "bg-brand-50/50 ring-2 ring-brand-500 ring-inset",
      )}
    >
      {content}
    </button>
  );
}
