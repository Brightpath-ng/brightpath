import type { ReactNode } from "react";
import { UserButton } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@brightpath/ui";

interface DashboardShellProps {
  brandLabel: string;
  greeting: string;
  description: string;
  children?: ReactNode;
}

// children is optional and additive -- the 4 existing call sites (one per
// role dashboard, none passing it yet) keep their original centered,
// max-w-sm layout untouched. Passing children switches to a wider,
// top-aligned layout suited to real content (a status card, an admin list)
// rather than the placeholder single-card look.
export function DashboardShell({ brandLabel, greeting, description, children }: DashboardShellProps) {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--bg-base)" }}>
      <header
        className="flex items-center justify-between border-b px-6 py-4"
        style={{ borderColor: "var(--bg-border-subtle)" }}
      >
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {brandLabel}
        </span>
        <UserButton />
      </header>
      <main className={children ? "flex-1 p-6" : "flex flex-1 items-center justify-center p-6"}>
        <Card className={children ? "mx-auto w-full max-w-2xl" : "w-full max-w-sm"}>
          <CardHeader>
            <CardTitle>{greeting}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          {children ? <CardContent>{children}</CardContent> : null}
        </Card>
      </main>
    </div>
  );
}
