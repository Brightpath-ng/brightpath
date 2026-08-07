function Bar({ className }: { className: string }) {
  return <div className={`skeleton rounded-[var(--radius-sm)] ${className}`} />;
}

// Used from loading.tsx files nested under a role's layout.tsx. AppShell
// already renders (and persists across navigation) by the time any of these
// fallbacks show, so this is only ever the *content* half of the page --
// no sidebar here, or it doubles up on top of the real one.
export function PageLoading() {
  return (
    <>
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
    </>
  );
}
