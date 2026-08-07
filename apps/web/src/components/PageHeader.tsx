import type { ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div
      className="flex items-start justify-between gap-4 px-8 py-6"
      style={{ borderBottom: "1px solid var(--bg-border-subtle)" }}
    >
      <div>
        <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.01em" }}>
          {title}
        </h1>
        <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
          {description}
        </p>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
