import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@brightpath/utils";

// Button (packages/ui) only ever renders a <button> -- for internal
// navigation styled to match it (Edit, Add child, Cancel), this mirrors its
// exact class strings rather than wrapping <Link><Button/></Link>, which
// would nest an interactive button inside an anchor. Same approach
// apps/marketing already uses for its hand-rolled Button-styled <a> CTAs.
type LinkButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";
type LinkButtonSize = "sm" | "md" | "lg";

export type LinkButtonProps = LinkProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    variant?: LinkButtonVariant;
    size?: LinkButtonSize;
  };

const base =
  "inline-flex items-center justify-center gap-2 font-medium " +
  "rounded-[var(--radius-button)] cursor-pointer " +
  "transition-all duration-150 select-none " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

const variants: Record<LinkButtonVariant, string> = {
  primary:
    "border-none bg-[var(--accent)] text-white " +
    "hover:bg-[var(--accent-hover)] hover:-translate-y-px " +
    "hover:shadow-[var(--shadow-accent)] " +
    "focus-visible:ring-[var(--accent)]",
  secondary:
    "border border-[var(--bg-border-subtle)] bg-[var(--bg-elevated)] text-[var(--text-primary)] " +
    "hover:bg-[var(--bg-border-subtle)] " +
    "focus-visible:ring-[var(--accent)]",
  outline:
    "border border-[var(--accent)] bg-transparent text-[var(--accent)] " +
    "hover:bg-[var(--accent-dim)] " +
    "focus-visible:ring-[var(--accent)]",
  ghost:
    "border-none bg-transparent text-[var(--text-secondary)] " +
    "hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] " +
    "focus-visible:ring-[var(--accent)]",
  destructive:
    "border-none bg-[var(--red)] text-white " +
    "hover:opacity-90 " +
    "focus-visible:ring-[var(--red)]",
};

const sizes: Record<LinkButtonSize, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
  lg: "h-10 px-5 text-sm",
};

export function LinkButton({
  variant = "primary",
  size = "md",
  className,
  ...props
}: LinkButtonProps) {
  return <Link className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
