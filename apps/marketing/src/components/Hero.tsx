import { Button } from "@brightpath/ui";

export function Hero() {
  return (
    <section
      className="relative overflow-hidden px-6 py-24 text-center sm:py-32"
      style={{
        background:
          "linear-gradient(160deg, var(--mkt-hero-gradient-start), var(--mkt-hero-gradient-end))",
      }}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <h1
          className="text-5xl font-black sm:text-6xl md:text-7xl"
          style={{
            color: "var(--mkt-text-on-dark)",
            letterSpacing: "var(--mkt-heading-tracking)",
          }}
        >
          Helping Every Child Reach Their Full Potential
        </h1>

        <p
          className="max-w-xl text-lg sm:text-xl"
          style={{ color: "var(--mkt-text-on-dark-muted)" }}
        >
          We train exceptional tutors, monitor every lesson, and give parents complete visibility
          into their child&apos;s academic progress.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="bg-[var(--mkt-section-dark)] text-[var(--mkt-text-on-dark)] hover:bg-[var(--mkt-section-dark)] hover:opacity-90"
          >
            Find a Tutor
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-[var(--mkt-text-on-dark)] text-[var(--mkt-text-on-dark)] hover:bg-white/10"
          >
            Become a Tutor
          </Button>
        </div>

        <div
          className="mt-2 inline-flex items-center gap-2 rounded-[var(--radius-full)] px-4 py-2 text-sm font-medium"
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.24)",
            color: "var(--mkt-text-on-dark)",
          }}
        >
          <span aria-hidden="true">★★★★☆</span>
          <span>Excellent — 95% parent satisfaction</span>
        </div>
      </div>
    </section>
  );
}
