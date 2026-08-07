export default function ParentStudentsLoading() {
  return (
    <div className="flex min-h-screen flex-col" style={{ background: "var(--bg-base)" }}>
      <div
        className="h-[57px] border-b"
        style={{ borderColor: "var(--bg-border-subtle)", background: "var(--bg-surface)" }}
      />
      <div className="flex-1 p-6">
        <div
          className="mx-auto h-40 w-full max-w-2xl animate-pulse rounded-[var(--radius-md)]"
          style={{ background: "var(--bg-elevated)" }}
        />
      </div>
    </div>
  );
}
