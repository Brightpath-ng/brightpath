import type { LabelHTMLAttributes } from "react";
import { cn } from "@brightpath/utils";

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

export function Label({ className, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "text-sm font-medium text-[var(--text-primary)] leading-none select-none",
        className
      )}
      style={{ letterSpacing: "-0.01em" }}
      {...props}
    />
  );
}
