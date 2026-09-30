"use client";

import { CalendarDays, ChevronDown, LogOut, Menu, UserRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useAccess } from "@/components/reusables/AccessGate";
import { InitialsAvatar } from "@/components/reusables/InitialsAvatar";
import { longDay, todayYmd } from "@/lib/helpers/formatters";
import { APP_ROUTES } from "@/lib/utils/routes";

export function AppTopbar({ onMenu }: { onMenu: () => void }) {
  const { user } = useAccess();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <header className="flex shrink-0 items-center gap-3 py-4">
      <button onClick={onMenu} className="grid size-11 place-items-center rounded-full bg-surface lg:hidden" aria-label="Open menu">
        <Menu className="size-5" />
      </button>

      <div className="ml-auto hidden h-11 items-center gap-2 rounded-full bg-surface px-4 text-[13px] text-tertiary sm:flex">
        <CalendarDays className="size-4" strokeWidth={1.75} />
        {longDay(todayYmd())}
      </div>

      <div ref={ref} className="relative max-sm:ml-auto">
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex h-12 items-center gap-2.5 rounded-full bg-surface py-1 pr-4 pl-1.5"
        >
          <InitialsAvatar name={user.name} solid />
          <span className="hidden text-left leading-tight sm:block">
            <span className="block text-[13px] text-strong">{user.name}</span>
            <span className="block text-[11px] text-tertiary capitalize">{user.role} · {user.staffId}</span>
          </span>
          <ChevronDown className="size-4 text-tertiary" />
        </button>

        {open && (
          <div className="absolute right-0 z-30 mt-2 w-52 rounded-2xl bg-surface p-2 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
            <Link href={APP_ROUTES.ACCOUNT} onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm hover:bg-surface-muted">
              <UserRound className="size-4" /> My account
            </Link>
            <a href={APP_ROUTES.LOGOUT} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-600 hover:bg-red-50">
              <LogOut className="size-4" /> Sign out
            </a>
          </div>
        )}
      </div>
    </header>
  );
}
