import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";

const variants: Record<Variant, string> = {
  primary: "bg-brand-600 text-white hover:bg-brand-700",
  secondary: "bg-surface-muted text-strong hover:bg-[#ebebeb]",
  outline: "border border-dashed border-[#d4d4d4] bg-white text-strong hover:border-brand-500 hover:text-brand-700",
  ghost: "text-brand-700 hover:bg-brand-50",
  danger: "bg-red-50 text-red-700 hover:bg-red-100",
};

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: "sm" | "md";
  loading?: boolean;
};

export function Button({ variant = "primary", size = "md", loading, className, children, disabled, ...props }: Props) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-1.5 rounded-full font-medium whitespace-nowrap transition",
        "focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:outline-none",
        "disabled:cursor-not-allowed disabled:opacity-50",
        size === "sm" ? "h-8 px-3.5 text-xs" : "h-10 px-5 text-sm",
        variants[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />}
      {children}
    </button>
  );
}
