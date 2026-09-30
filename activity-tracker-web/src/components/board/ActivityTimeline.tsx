import clsx from "clsx";
import Link from "next/link";
import { InitialsAvatar } from "@/components/reusables/InitialsAvatar";
import { time } from "@/lib/helpers/formatters";
import { APP_ROUTES } from "@/lib/utils/routes";
import type { ActivityUpdate } from "@/types/Activity";

/**
 * The day's story: every status change, who made it (bio details as captured
 * at the time), when, and what they said. This is what the next shift reads.
 */
export function ActivityTimeline({ updates, date }: { updates: ActivityUpdate[]; date?: string }) {
  if (!updates.length) {
    return <p className="py-10 text-center text-sm text-tertiary">No updates recorded for this day yet.</p>;
  }

  return (
    <ol className="relative ml-1.5 border-l border-hairline">
      {updates.map((u) => {
        const done = u.status === "done";
        const bio = [u.personnel.staffId, u.personnel.position, u.personnel.role].filter(Boolean).join(" · ");

        return (
          <li key={u.id} className="relative pb-6 pl-6 last:pb-0">
            <span
              aria-hidden
              className={clsx("absolute top-1 -left-[7px] size-3.5 rounded-full ring-4 ring-surface", done ? "bg-emerald-500" : "bg-amber-500")}
            />
            <time dateTime={u.createdAt} className="text-xs text-tertiary tabular-nums">{time(u.createdAt)}</time>

            <p className="mt-1 text-sm leading-relaxed text-body">
              <span className="font-medium text-strong">{u.personnel.name}</span> marked{" "}
              <Link href={APP_ROUTES.ACTIVITY_DETAIL(u.activityId, date)} className="font-medium text-strong hover:text-brand-700">
                {u.activity?.title}
              </Link>{" "}
              as <span className={clsx("font-medium", done ? "text-status-success-fg" : "text-status-warning-fg")}>{u.status}</span>
            </p>

            {u.remark && <p className="mt-1 text-sm text-tertiary">“{u.remark}”</p>}

            <p className="mt-2 flex items-center gap-2 text-[11px] text-tertiary">
              <InitialsAvatar name={u.personnel.name} size="sm" />
              <span className="capitalize">{bio}</span>
            </p>
          </li>
        );
      })}
    </ol>
  );
}
