interface Track {
  id: string;
  name: string;
  description: string;
  ctaLabel: string;
  href: string;
}

const tracks: Track[] = [
  {
    id: "tutor-led",
    name: "Tutor-led",
    description:
      "A tutor matched and assigned by BrightPath teaches scheduled lessons — online or in-person — with lesson reports and monthly re-assessment.",
    ctaLabel: "Explore Tutor-led",
    href: "/tracks/tutor-led",
  },
  {
    id: "hybrid",
    name: "Hybrid",
    description:
      "Reduced tutor frequency plus full access to our self-directed content library for reinforcement between lessons.",
    ctaLabel: "Explore Hybrid",
    href: "/tracks/hybrid",
  },
  {
    id: "self-directed",
    name: "Self-directed",
    description:
      "Full access to courses, practice sets, past-paper drills, and self-assessments — with the same progress dashboard tracking scores over time.",
    ctaLabel: "Explore Self-directed",
    href: "/tracks/self-directed",
  },
];

export function TracksGrid() {
  return (
    <section className="px-6 py-16 sm:py-24">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-3xl font-bold sm:text-4xl" style={{ color: "var(--text-primary)" }}>
            Support that grows with your child
          </h2>
          <p className="max-w-xl text-base" style={{ color: "var(--text-secondary)" }}>
            Every student is matched to the right level of support — and can move between tracks
            as their progress changes.
          </p>
        </div>

        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {tracks.map((track) => (
            <div
              key={track.id}
              className="flex flex-col items-center gap-4 p-8 text-center"
              style={{
                background: "var(--bg-surface)",
                borderRadius: "var(--mkt-radius-card)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
                {track.name}
              </h3>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {track.description}
              </p>
              <a
                href={track.href}
                className="mt-auto rounded-[var(--radius-button)] px-5 py-2.5 text-sm font-semibold"
                style={{ background: "var(--accent)", color: "var(--text-on-accent)" }}
              >
                {track.ctaLabel}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
