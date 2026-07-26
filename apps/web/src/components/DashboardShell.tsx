import { UserButton } from "@clerk/nextjs";
import { Card, CardHeader, CardTitle, CardDescription } from "@brightpath/ui";

interface DashboardShellProps {
  brandLabel: string;
  greeting: string;
  description: string;
}

export function DashboardShell({ brandLabel, greeting, description }: DashboardShellProps) {
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
      <main className="flex flex-1 items-center justify-center p-6">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{greeting}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
        </Card>
      </main>
    </div>
  );
}
