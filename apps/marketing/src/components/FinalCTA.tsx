export function FinalCTA() {
  return (
    <section className="px-6 py-14" style={{ background: "var(--bg-surface)" }}>
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Have a question?
          </h2>
          <p className="text-base" style={{ color: "var(--text-secondary)" }}>
            Our support team is here to help, every day.
          </p>
        </div>
        <a
          href="/support"
          className="shrink-0 rounded-[var(--radius-full)] px-6 py-3 text-sm font-semibold"
          style={{ background: "var(--accent)", color: "var(--text-on-accent)" }}
        >
          Get help
        </a>
      </div>
    </section>
  );
}
