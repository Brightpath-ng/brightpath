import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  action?: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function PageHeader({ title, description, action, backHref, backLabel }: PageHeaderProps) {
  return (
    <div
      className="flex items-start justify-between gap-4 px-8 py-6"
      style={{ borderBottom: "1px solid var(--bg-border-subtle)" }}
    >
      <div>
        {backHref ? (
          <Link
            href={backHref}
            className="mb-2 inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft aria-hidden="true" className="size-3.5" />
            {backLabel ?? "Back"}
          </Link>
        ) : null}
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
