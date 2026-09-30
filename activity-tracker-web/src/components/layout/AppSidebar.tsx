"use client";

import clsx from "clsx";
import { BarChart3, ClipboardList, LayoutGrid, LogOut, UserRound, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccess } from "@/components/reusables/AccessGate";
import { canAccessPath } from "@/lib/auth/access";
import { APP_ROUTES } from "@/lib/utils/routes";
import { Logo } from "./Logo";

const navigation = [
  { href: APP_ROUTES.BOARD, label: "Daily Board", icon: LayoutGrid },
  { href: APP_ROUTES.REPORTS, label: "Reports", icon: BarChart3 },
  { href: APP_ROUTES.ACTIVITIES, label: "Activities", icon: ClipboardList },
  { href: APP_ROUTES.TEAM, label: "Team", icon: Users },
  { href: APP_ROUTES.ACCOUNT, label: "My Account", icon: UserRound },
];

export function AppSidebar({ open, onNavigate }: { open: boolean; onNavigate: () => void }) {
  const pathname = usePathname();
  const { user } = useAccess();

  return (
    <aside
      className={clsx(
        "flex w-56 shrink-0 flex-col bg-canvas px-3 py-6 lg:py-4",
        "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-40 max-lg:transition-transform",
        open ? "max-lg:translate-x-0 max-lg:shadow-xl" : "max-lg:-translate-x-full",
      )}
    >
      <div className="px-2">
        <Logo />
      </div>

      <nav className="mt-8 space-y-1" aria-label="Main">
        {/* Same policy the proxy enforces, so hidden links are also unreachable. */}
        {navigation.filter(({ href }) => canAccessPath(user, href)).map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={clsx(
                "flex h-10 items-center gap-3 rounded-full px-4 text-sm transition",
                active ? "bg-brand-600 text-white" : "text-strong hover:bg-surface",
              )}
            >
              <Icon className="size-[18px]" strokeWidth={1.75} />
              {label}
            </Link>
          );
        })}
      </nav>

      <a href={APP_ROUTES.LOGOUT} className="mt-auto flex h-10 items-center gap-3 rounded-full px-4 text-sm text-strong transition hover:bg-surface">
        <LogOut className="size-[18px]" strokeWidth={1.75} />
        Sign out
      </a>
    </aside>
  );
}
