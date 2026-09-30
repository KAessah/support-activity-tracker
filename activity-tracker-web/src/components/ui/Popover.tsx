"use client";

import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
};

/** Floating panel anchored under its trigger, closed by outside click or Escape. */
export function Popover({ open, onClose, trigger, title, children, footer }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && onClose();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div ref={ref} className="relative">
      {trigger}
      {open && (
        <div className="absolute top-full left-0 z-30 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl bg-surface p-4 shadow-[0_12px_40px_rgba(0,0,0,0.12)]">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-medium text-strong">{title}</p>
            <button onClick={onClose} className="text-tertiary hover:text-strong" aria-label="Close">
              <X className="size-4" />
            </button>
          </div>
          <div className="space-y-3">{children}</div>
          {footer && <div className="mt-4 flex items-center justify-between border-t border-hairline pt-3">{footer}</div>}
        </div>
      )}
    </div>
  );
}
