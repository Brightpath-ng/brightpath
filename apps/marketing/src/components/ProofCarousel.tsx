"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, UserCheck } from "lucide-react";
import type { ProofCard } from "@brightpath/types";

export const proofCards: ProofCard[] = [
  {
    type: "stat",
    id: "score-improvement",
    value: "42% → 84%",
    label: "Average score improvement across our Term 2 tutor-led cohort",
    footnote: 1,
    footnoteText: "Baseline vs. latest assessment score, Term 2 2026 tutor-led cohort, n=134 students.",
  },
  {
    type: "trust_moment",
    id: "verified-checkin",
    imageAlt: "A BrightPath tutor greeting a student at the start of a lesson",
    headline: "Every lesson starts with a verified check-in",
    body: "Tutors check in and out of every session, so you always know exactly when your child's lesson happened.",
  },
  {
    type: "track",
    id: "self-directed",
    trackName: "Self-directed",
    description:
      "Full access to courses, practice sets, and past-paper drills — with the same progress dashboard tracking scores over time.",
    ctaLabel: "Explore Self-directed",
    href: "/tracks/self-directed",
  },
];

const AUTO_ADVANCE_MS = 6000;

function ProofCardContent({ card, isActive }: { card: ProofCard; isActive: boolean }) {
  const tabIndex = isActive ? undefined : -1;

  if (card.type === "stat") {
    return (
      <>
        <svg viewBox="0 0 160 60" className="h-14 w-40" aria-hidden="true">
          <polyline
            points="4,52 40,40 76,44 112,16 156,6"
            fill="none"
            stroke="var(--mkt-progress-line)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="text-4xl font-black sm:text-5xl" style={{ color: "var(--mkt-text-on-dark)" }}>
          {card.value}
          {card.footnote ? (
            <sup className="ml-1 text-base font-semibold" aria-hidden="true">
              {card.footnote}
            </sup>
          ) : null}
        </p>
        <p className="max-w-sm text-base" style={{ color: "var(--mkt-text-on-dark-muted)" }}>
          {card.label}
          {card.footnote ? <span className="sr-only"> (see footnote {card.footnote})</span> : null}
        </p>
      </>
    );
  }

  if (card.type === "trust_moment") {
    return (
      <>
        <div
          role="img"
          aria-label={card.imageAlt}
          className="flex h-40 w-full max-w-sm items-center justify-center rounded-[var(--mkt-radius-card)] sm:w-72"
          style={{ background: "rgba(255,255,255,0.08)" }}
        >
          <UserCheck aria-hidden="true" className="size-10" style={{ color: "var(--mkt-text-on-dark)" }} />
        </div>
        <p className="text-2xl font-bold sm:text-3xl" style={{ color: "var(--mkt-text-on-dark)" }}>
          {card.headline}
        </p>
        <p className="max-w-sm text-base" style={{ color: "var(--mkt-text-on-dark-muted)" }}>
          {card.body}
        </p>
      </>
    );
  }

  return (
    <>
      <span
        className="w-fit rounded-[var(--radius-full)] px-3 py-1 text-xs font-semibold uppercase tracking-wide"
        style={{ background: "rgba(255,255,255,0.12)", color: "var(--mkt-text-on-dark)" }}
      >
        {card.trackName}
      </span>
      <p className="max-w-sm text-base" style={{ color: "var(--mkt-text-on-dark-muted)" }}>
        {card.description}
      </p>
      <a
        href={card.href}
        tabIndex={tabIndex}
        className="w-fit rounded-[var(--radius-full)] px-5 py-2.5 text-sm font-semibold"
        style={{ background: "var(--mkt-text-on-dark)", color: "var(--mkt-section-dark)" }}
      >
        {card.ctaLabel}
      </a>
    </>
  );
}

export function ProofCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % proofCards.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [isPaused]);

  const goTo = (index: number) => {
    setActiveIndex((index + proofCards.length) % proofCards.length);
  };

  return (
    <section
      className="px-6 py-16 sm:py-24"
      style={{ background: "var(--mkt-section-dark)" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="mx-auto flex max-w-4xl flex-col items-center gap-8"
        role="group"
        aria-roledescription="carousel"
        aria-label="Proof of BrightPath's impact"
      >
        {/* Every card occupies the same grid cell (stacked, not swapped in/out) so the
            row's height is always the tallest card's height — switching cards can't
            change the section's height and shift the controls below it. */}
        <div className="grid w-full justify-items-center text-center">
          {proofCards.map((card, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={card.id}
                aria-hidden={!isActive}
                className="col-start-1 row-start-1 flex flex-col items-center gap-4 transition-opacity duration-300"
                style={{ opacity: isActive ? 1 : 0, pointerEvents: isActive ? "auto" : "none" }}
              >
                <ProofCardContent card={card} isActive={isActive} />
              </div>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            aria-label="Previous proof card"
            onClick={() => goTo(activeIndex - 1)}
            className="flex size-9 items-center justify-center rounded-full"
            style={{ border: "1px solid rgba(255,255,255,0.3)", color: "var(--mkt-text-on-dark)" }}
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>

          <div className="flex items-center gap-2">
            {proofCards.map((card, index) => (
              <button
                key={card.id}
                type="button"
                aria-label={`Show proof card ${index + 1} of ${proofCards.length}`}
                aria-current={index === activeIndex}
                onClick={() => goTo(index)}
                className="size-2.5 rounded-full transition-opacity"
                style={{
                  background: "var(--mkt-text-on-dark)",
                  opacity: index === activeIndex ? 1 : 0.35,
                }}
              />
            ))}
          </div>

          <button
            type="button"
            aria-label="Next proof card"
            onClick={() => goTo(activeIndex + 1)}
            className="flex size-9 items-center justify-center rounded-full"
            style={{ border: "1px solid rgba(255,255,255,0.3)", color: "var(--mkt-text-on-dark)" }}
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
