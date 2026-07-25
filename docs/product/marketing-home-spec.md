# Marketing Home Page — Build Spec (v2)

Scope: `apps/marketing` only. Do not import anything from `apps/web/src/features/*` or any
dashboard-only component. Import only `packages/ui` primitives (`Button`, `Badge`, `Input`,
`Label`) — everything else on this page is marketing-local, built in
`apps/marketing/src/components/`.

Reference: `docs/claude/design-system.md` §7 (marketing design language) and
`apps/marketing/styles/theme.css` for tokens. Use only `--mkt-*` and shared tokens — never a raw
hex value. Visual reference: ovoenergy.com homepage — see §7 for what specifically was borrowed
and why.

## Personality

Warm, credible, optimistic — carried by a **two-tone system** (bright brand green / near-black
"dark section" green) plus real photography and rounded, confident type, not a third accent
color. The brand is selling trust *and* proof of measurable improvement — both need to land above
the fold.

## Section order and content

Alternates light (cream) → dark (`--mkt-section-dark`) → light, matching the OVO reference's
pacing — don't let two dark or two cream sections sit back to back.

1. **Hero** *(bright green, full-bleed)*
   - Headline: "Helping Every Child Reach Their Full Potential"
   - Subhead: "We train exceptional tutors, monitor every lesson, and give parents complete
     visibility into their child's academic progress."
   - Dual CTA, both pill-shaped: primary "Find a Tutor" (dark near-black fill), secondary "Become
     a Tutor" (outline)
   - **Trust badge inline, directly under the CTA row** — not a separate section further down
     (e.g. "★★★★☆ Excellent — 95% parent satisfaction")
   - Component: `Hero`

2. **Quick links grid** *(cream)*
   - Isometric/3D icon-illustration cards, matching OVO's "Check my bill / Moving home / Switch /
     Submit reading" pattern, adapted: "Book an Assessment", "Track My Child's Progress", "Become
     a Tutor", "Find My Tutor's Report" — each a simple icon + heading + one line + arrow link
   - Component: `QuickLinksGrid`

3. **Proof carousel** *(dark section)*
   - Rotating cards — the before/after stat proof ("42% → 84%"), a tutor-check-in trust moment
     (Section 12 of the blueprint, shown as a real-photo card: tutor + student, headline about
     verified check-ins), and a track-specific card (e.g. self-directed content library)
   - Footnote markers (¹ ² ³) on any specific number, resolved in small print at page bottom
   - Component: `ProofCarousel`

4. **Testimonials + Trust stats** *(cream)*
   - Real testimonial quotes (parent-rated, per the blueprint's rating system) + the Trustpilot-
     style rating block
   - Component: `TestimonialsSection`

5. **The three tracks** *(cream, continues — this is BrightPath's version of OVO's "our most
   popular products and services" grid)*
   - Three cards: Tutor-led / Hybrid / Self-directed (blueprint §6), each with a short description
     and its own pill CTA ("Explore Tutor-led", "Explore Hybrid", "Explore Self-directed")
   - Component: `TracksGrid`

6. **Why parents choose us** *(white or cream)*
   - The 8 points from the blueprint, as icon + text triplets (not checkmark bullets) — mirrors
     OVO's "More reasons to switch" icon-triplet pattern
   - Component: `WhyChooseUs`

7. **Guides / resources teaser** *(dark section)*
   - Horizontal scroll of 2–3 cards pointing at parent-facing content (e.g. "How tutoring tracks
     work," "What to expect from your first assessment") — mirrors OVO Guides
   - Component: `GuidesTeaser`

8. **FAQ accordion** *(cream)*
   - 5–7 questions (pricing, safety/verification, delivery mode, refunds, becoming a tutor), plus
     sign, one item can be deep-linked/highlighted via an outline state
   - Component: `FaqAccordion`

9. **Tutor recruitment CTA** *(bright green, full-bleed — mirrors the hero treatment to signal
   "this is the other front door")*
   - "Become a Tutor" framing: earn, train, teach on your terms within a managed structure
   - Component: `TutorCTA`

10. **Final CTA + Footer** *(white)*
    - Simple "Have a question? Get help" band, then multi-column footer (Contact, About,
      Terms & policies, Tips & advice, Resources, For business), app store badges, social icons
    - Components: `FinalCTA`, `Footer`

## Signature visual motif

An ascending progress-line, rendered in `--mkt-progress-line` — used inside the proof carousel and
the tracks grid, not as a separate decorative section. Kept deliberately abstract, everything else
favors real photography (trust moments) or the isometric icon style (quick links) over generic
illustration.

## Legal/claims convention

Any specific number attached to an offer or stat (parent satisfaction %, price, savings claim)
gets a footnote marker and a resolved footnote in a small-print block near the page bottom, above
the footer — matches the OVO reference's ¹ ² ³ pattern and is the right habit to build now, before
real marketing claims exist.

## Build order (apply the SDLC loop from `docs/claude/sdlc.md` per component)

1. `Hero` (with inline trust badge) — ship and review independently first
2. `QuickLinksGrid` + `ProofCarousel`
3. `TestimonialsSection` + `TracksGrid`
4. `WhyChooseUs` + `GuidesTeaser` + `FaqAccordion`
5. `TutorCTA` + `FinalCTA` + `Footer`

Each component needs all four UI states where applicable. `TestimonialsSection` and
`ProofCarousel` should be built fetch-ready against a `packages/types`-shaped API response, even
if seeded with hardcoded content for launch — not hardcoded forever.
