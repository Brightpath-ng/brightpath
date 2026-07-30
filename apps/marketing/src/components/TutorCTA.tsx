import { Button } from "@brightpath/ui";

export function TutorCTA() {
  return (
    <section
      className="relative overflow-hidden px-6 py-24 text-center sm:py-32"
      style={{
        background:
          "linear-gradient(160deg, var(--mkt-hero-gradient-start), var(--mkt-hero-gradient-end))",
      }}
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-6">
        <h2
          className="text-4xl font-black sm:text-5xl md:text-6xl"
          style={{
            color: "var(--mkt-text-on-dark)",
            letterSpacing: "var(--mkt-heading-tracking)",
          }}
        >
          Teach With Us, On Your Terms
        </h2>

        <p
          className="max-w-xl text-lg sm:text-xl"
          style={{ color: "var(--mkt-text-on-dark-muted)" }}
        >
          Earn a steady income, get trained by our team, and teach students matched to your
          strengths — all within a managed structure that handles pricing, payments, and
          scheduling for you.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <a
            href="/become-a-tutor"
            className={
              "inline-flex h-10 items-center justify-center gap-2 rounded-[var(--radius-full)] " +
              "px-5 text-sm font-medium transition-all duration-150 " +
              "bg-[var(--mkt-section-dark)] text-[var(--mkt-text-on-dark)] hover:opacity-90"
            }
          >
            Apply to Teach
          </a>
          <Button
            variant="outline"
            size="lg"
            className="border-[var(--mkt-text-on-dark)] text-[var(--mkt-text-on-dark)] hover:bg-white/10"
          >
            See How It Works
          </Button>
        </div>
      </div>
    </section>
  );
}
