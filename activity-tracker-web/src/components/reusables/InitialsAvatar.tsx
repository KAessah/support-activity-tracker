import clsx from "clsx";
import { initials } from "@/lib/helpers/formatters";

export function InitialsAvatar({ name, solid, size = "md" }: { name?: string | null; solid?: boolean; size?: "sm" | "md" | "lg" }) {
  return (
    <span
      className={clsx(
        "inline-grid shrink-0 place-items-center rounded-full font-medium",
        solid ? "bg-brand-600 text-white" : "bg-brand-50 text-brand-700",
        { sm: "size-7 text-[11px]", md: "size-8 text-xs", lg: "size-14 text-lg" }[size],
      )}
    >
      {initials(name)}
    </span>
  );
}

/** Name + staff ID/position — the bio details captured on an update. */
export function PersonCell({ name, staffId, position }: { name: string; staffId?: string | null; position?: string | null }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <InitialsAvatar name={name} size="sm" />
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[13px] text-strong">{name}</p>
        <p className="truncate text-[11px] text-tertiary">{[staffId, position].filter(Boolean).join(" · ")}</p>
      </div>
    </div>
  );
}
