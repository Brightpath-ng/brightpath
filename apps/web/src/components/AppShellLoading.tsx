export function AppShellLoading() {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div
        className="hidden w-60 shrink-0 p-3 lg:block"
        style={{ background: "var(--bg-elevated)", borderRight: "1px solid var(--bg-border-subtle)" }}
      >
        <div
          className="h-5 w-28 animate-pulse rounded-[var(--radius-sm)]"
          style={{ background: "var(--bg-border-subtle)" }}
        />
      </div>
      <main className="min-w-0 flex-1 p-8">
        <div
          className="h-40 w-full max-w-2xl animate-pulse rounded-[var(--radius-md)]"
          style={{ background: "var(--bg-elevated)" }}
        />
      </main>
    </div>
  );
}
