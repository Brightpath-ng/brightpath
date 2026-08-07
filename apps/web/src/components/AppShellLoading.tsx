function Bar({ className }: { className: string }) {
  return <div className={`skeleton rounded-[var(--radius-sm)] ${className}`} />;
}

export function AppShellLoading() {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg-base)" }}>
      <div
        className="hidden w-60 shrink-0 flex-col p-3 lg:flex"
        style={{ background: "var(--bg-elevated)", borderRight: "1px solid var(--bg-border-subtle)" }}
      >
        <div className="flex items-center gap-2 px-2 pt-1 pb-4">
          <div className="skeleton size-5 shrink-0 rounded-[var(--radius-sm)]" />
          <Bar className="h-3.5 w-24" />
        </div>

        <div className="flex flex-col gap-2.5 px-1 py-1">
          {[1, 2].map((i) => (
            <div key={i} className="flex items-center gap-2.5 px-1.5">
              <div className="skeleton size-3.5 shrink-0 rounded-[var(--radius-sm)]" />
              <Bar className="h-2.5 w-20" />
            </div>
          ))}
        </div>

        <div className="flex-1" />

        <div
          className="flex items-center gap-2 px-2 py-2"
          style={{ borderTop: "1px solid var(--bg-border-subtle)" }}
        >
          <div className="skeleton size-6 shrink-0 rounded-full" />
          <Bar className="h-2.5 w-16" />
        </div>
      </div>

      <main className="min-w-0 flex-1">
        <div
          className="flex items-start justify-between gap-4 px-8 py-6"
          style={{ borderBottom: "1px solid var(--bg-border-subtle)" }}
        >
          <div className="flex flex-col gap-2">
            <Bar className="h-5 w-40" />
            <Bar className="h-3 w-64" />
          </div>
          <div className="skeleton h-8 w-24 shrink-0 rounded-[var(--radius-button)]" />
        </div>

        <div className="px-8 py-6">
          <div className="flex flex-col">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3.5 py-4"
                style={{ borderBottom: "1px solid var(--bg-border-subtle)" }}
              >
                <div className="skeleton size-8 shrink-0 rounded-full" />
                <div className="flex flex-1 flex-col gap-2">
                  <Bar className="h-3 w-36" />
                  <Bar className="h-2.5 w-24" />
                </div>
                <div className="skeleton h-5 w-16 shrink-0 rounded-[var(--radius-full)]" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
