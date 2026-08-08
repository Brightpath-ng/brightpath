// Used from loading.tsx files nested under a role's layout.tsx. AppShell
// already renders (and persists across navigation) by the time any of these
// fallbacks show, so this only ever fills the *content* area -- no sidebar
// here, or it doubles up on top of the real one.
//
// Deliberately generic rather than content-shaped: a skeleton mimicking one
// page's layout (a list, a table, a form) goes stale the moment that page's
// UI changes, and every page ends up needing its own upkeep. One spinner,
// reused everywhere via this same import, never drifts from anything.
export function PageLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <svg
        className="h-8 w-8 animate-spin"
        style={{ color: "var(--accent)" }}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        role="status"
        aria-label="Loading"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
        />
      </svg>
    </div>
  );
}
