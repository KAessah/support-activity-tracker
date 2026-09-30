"use client";

import { useState, type ReactNode } from "react";
import { AppSidebar } from "./AppSidebar";
import { AppTopbar } from "./AppTopbar";

/** Fixed-viewport frame from the design: sidebar + scrollable content column. */
export function AppShell({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-canvas lg:p-4">
      {menuOpen && <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setMenuOpen(false)} />}
      <AppSidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />

      <div className="flex h-full min-w-0 flex-1 flex-col overflow-hidden px-4 sm:px-6">
        <AppTopbar onMenu={() => setMenuOpen(true)} />
        <main
          tabIndex={-1}
          // The top fade lets content slide softly under the top bar instead of being cut on a hard edge.
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain pt-4 pb-8 [mask-image:linear-gradient(to_bottom,transparent,black_20px)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <div className="mx-auto max-w-[1280px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
