import clsx from "clsx";
import type { ReactNode } from "react";

/** Soft, rounded rows with zebra striping — as in the design reference. */
export function Table({ head, children }: { head: ReactNode[]; children: ReactNode }) {
  return (
    <div className="-mx-1 overflow-x-auto px-1">
      <table className="w-full border-separate border-spacing-y-1 text-left">
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-3 pb-2 text-xs font-medium whitespace-nowrap text-tertiary">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&>tr:nth-child(odd)>td]:bg-surface-row">{children}</tbody>
      </table>
    </div>
  );
}

export function Row({ children, onClick, dim }: { children: ReactNode; onClick?: () => void; dim?: boolean }) {
  return (
    <tr
      onClick={onClick}
      className={clsx(
        "[&>td:first-child]:rounded-l-xl [&>td:last-child]:rounded-r-xl",
        onClick && "cursor-pointer [&>td]:transition hover:[&>td]:bg-brand-50/60",
        dim && "opacity-60",
      )}
    >
      {children}
    </tr>
  );
}

/**
 * `width` caps long text (e.g. "max-w-64"). Browsers ignore max-width on a <td>
 * in an auto-layout table, so the cap goes on an inner wrapper instead; children
 * with `truncate` then ellipsize rather than stretching the table.
 */
export function Cell({ children, className, width }: { children?: ReactNode; className?: string; width?: string }) {
  return (
    <td className={clsx("px-3 py-3 text-[13px] text-strong", className)}>
      {width ? <div className={clsx(width, "min-w-0")}>{children}</div> : children}
    </td>
  );
}

export function EmptyRow({ colSpan, children }: { colSpan: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={colSpan} className="rounded-xl py-14 text-center text-sm text-tertiary">
        {children}
      </td>
    </tr>
  );
}

export function SkeletonRows({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, r) => (
        <Row key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <Cell key={c}>
              <div className="h-3.5 w-3/4 animate-pulse rounded-full bg-[#e9e9e9]" />
            </Cell>
          ))}
        </Row>
      ))}
    </>
  );
}
