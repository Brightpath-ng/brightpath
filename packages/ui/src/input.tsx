import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@brightpath/utils";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "h-10 w-full rounded-[var(--radius-md)] px-3 text-sm",
          "bg-[var(--bg-surface)] text-[var(--text-primary)]",
          "border outline-none transition-all duration-150",
          "placeholder:text-[var(--text-tertiary)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error
            ? "border-[var(--red)] focus:ring-2 focus:ring-[var(--red-bg)]"
            : "border-[var(--bg-border)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-dim)]",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
