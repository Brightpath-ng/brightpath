import type { MouseEvent, ReactNode } from "react";
import { cn } from "@brightpath/utils";

// Shared table chrome (border, radius, header/row/cell styling) so every
// tabular list in the dashboard looks the same -- feature components own
// their own columns and cell content, not the surrounding structure.

export function Table({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn("overflow-x-auto rounded-[var(--radius-lg)]", className)}
      style={{ border: "1px solid var(--bg-border-subtle)", background: "var(--bg-surface)" }}
    >
      <table className="w-full border-collapse text-left">{children}</table>
    </div>
  );
}

export function TableHeader({ children }: { children: ReactNode }) {
  return <thead style={{ borderBottom: "1px solid var(--bg-border-subtle)" }}>{children}</thead>;
}

export function TableBody({ children }: { children: ReactNode }) {
  return <tbody>{children}</tbody>;
}

type Align = "left" | "right";

interface TableRowProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function TableRow({ children, onClick, className }: TableRowProps) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        "border-b border-[var(--bg-border-subtle)] transition-colors last:border-b-0",
        onClick && "cursor-pointer hover:bg-[var(--bg-elevated)]",
        className
      )}
    >
      {children}
    </tr>
  );
}

interface TableHeadProps {
  children: ReactNode;
  align?: Align;
  className?: string;
}

export function TableHead({ children, align = "left", className }: TableHeadProps) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-xs font-semibold uppercase",
        align === "right" && "text-right",
        className
      )}
      style={{ color: "var(--text-tertiary)", letterSpacing: "0.04em" }}
    >
      {children}
    </th>
  );
}

interface TableCellProps {
  children: ReactNode;
  align?: Align;
  className?: string;
  onClick?: (event: MouseEvent<HTMLTableCellElement>) => void;
}

export function TableCell({ children, align = "left", className, onClick }: TableCellProps) {
  return (
    <td
      onClick={onClick}
      className={cn("px-4 py-3 text-sm", align === "right" && "text-right tabular-nums", className)}
      style={{ color: "var(--text-primary)" }}
    >
      {children}
    </td>
  );
}
