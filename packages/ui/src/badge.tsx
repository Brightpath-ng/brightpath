import type { HTMLAttributes, CSSProperties } from "react";
import { cn } from "@brightpath/utils";

type BadgeVariant = "default" | "success" | "warning" | "destructive" | "accent";

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
};

const styles: Record<BadgeVariant, CSSProperties> = {
  default: {
    background: "var(--bg-elevated)",
    color: "var(--text-secondary)",
    border: "1px solid var(--bg-border-subtle)",
  },
  success: {
    background: "var(--green-bg)",
    color: "var(--green)",
    border: "1px solid var(--green-border)",
  },
  warning: {
    background: "var(--amber-bg)",
    color: "var(--amber)",
    border: "1px solid var(--amber-border)",
  },
  destructive: {
    background: "var(--red-bg)",
    color: "var(--red)",
    border: "1px solid var(--red-border)",
  },
  accent: {
    background: "var(--accent-dim)",
    color: "var(--accent)",
    border: "1px solid var(--accent-border)",
  },
};

export function Badge({ variant = "default", className, style, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5",
        "rounded-[var(--radius-full)] text-xs font-medium",
        className
      )}
      style={{ ...styles[variant], ...style }}
      {...props}
    />
  );
}
