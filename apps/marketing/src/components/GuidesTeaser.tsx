interface Guide {
  id: string;
  title: string;
  teaser: string;
  href: string;
}

export const guides: Guide[] = [
  {
    id: "how-tracks-work",
    title: "How our three tracks work",
    teaser: "Tutor-led, Hybrid, or Self-directed — how we decide, and how you can change your mind.",
    href: "/guides/how-tracks-work",
  },
  {
    id: "first-assessment",
    title: "What to expect from your first assessment",
    teaser: "What we test, how long it takes, and what the results actually mean for your child.",
    href: "/guides/first-assessment",
  },
  {
    id: "verified-checkins",
    title: "How verified check-ins keep your child safe",
    teaser: "The tech behind every lesson's check-in, check-out, and location record.",
    href: "/guides/verified-checkins",
  },
];

export function GuidesTeaser() {
  return (
    <section className="px-6 py-16 sm:py-24" style={{ background: "var(--mkt-section-dark)" }}>
      <div className="mx-auto flex max-w-6xl flex-col gap-8">
        <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--mkt-text-on-dark)" }}>
          Guides for parents
        </h2>

        <div className="-mx-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-2">
          {guides.map((guide) => (
            <a
              key={guide.id}
              href={guide.href}
              className="flex w-72 shrink-0 snap-start flex-col gap-3 p-6 sm:w-80"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: "var(--mkt-radius-card)",
              }}
            >
              <span
                className="w-fit rounded-[var(--radius-full)] px-3 py-1 text-xs font-semibold uppercase tracking-wide"
                style={{ background: "rgba(255,255,255,0.12)", color: "var(--mkt-text-on-dark)" }}
              >
                Guide
              </span>
              <h3 className="text-lg font-semibold" style={{ color: "var(--mkt-text-on-dark)" }}>
                {guide.title}
              </h3>
              <p className="text-sm" style={{ color: "var(--mkt-text-on-dark-muted)" }}>
                {guide.teaser}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
