# Design System

## 1. Source of truth

`packages/ui` owns the design system: raw tokens (`packages/ui/styles/core.css` — see §5 for the
full two-tier token architecture) and cross-surface primitives (`Button`, `Card`, `Input`, `Label`,
`Badge`, `Modal`, `Sheet`, `Toast`/`useToast`, `DropdownMenu`, and anything added later — see §6
for which primitives actually belong here vs. living app-local). `apps/web` and `apps/marketing`
each layer their own semantic `theme.css` on top of `core.css` — neither app redefines raw brand
values or rebuilds cross-surface primitives locally. If a screen needs a primitive that doesn't
exist yet and genuinely needs to work identically on both surfaces, add it to `packages/ui` first,
don't inline a one-off version in the feature folder.

Look and feel target for the authenticated product (`apps/web`): **Notion / Linear** — quiet
surfaces, restrained color, generous whitespace, fast and unshowy motion, content doing the work
instead of decoration.

## 2. The marketing site is intentionally a separate design language

`apps/marketing` is allowed — expected — to look and feel different: bolder type, illustration,
color used more expressively, more motion. It's a public-facing conversion surface, not a
productivity tool, and shouldn't be visually constrained by the dashboard's restraint.

What it still inherits from `packages/ui`, so the brand doesn't fracture: the color tokens
(`--accent` and the neutral scale), the radius scale, and the `Button` primitive (styled marketing
CTAs should still resolve to the same `--accent` and hover behavior as the product, even if
surrounding layout/typography is bolder). Everything else — hero sections, marketing-specific
cards, illustrations, layout — is free to have its own components and its own visual voice.

## 3. Color: the accent change

The wallpaper you liked (`chrome-green.png`) samples to a muted sage/forest green family, not
Google's flat brand green — sampled values across the image cluster around `#3F8A6B`–`#82BC92`.
The token below (`#1F7A5C`) is a deepened, WCAG-AA-safe version of that family, chosen deliberately
**distinct from the existing semantic `--green` (`#059669`)** used for success states — if the
brand accent and the "success" signal are the same hue, a user can't tell "this is the primary
button" from "this action succeeded" at a glance. Keeping them as two different greens (one
forest/teal-leaning for brand, one emerald for semantic success) preserves that distinction the
same way Linear uses a distinct purple for brand vs. a separate green for success states.

`#1F7A5C` on white gives a contrast ratio of ~5.25:1 — passes WCAG AA for normal text and UI
components.

The raw value lives in `packages/ui/styles/core.css` as `--brand-green-500` (see §5 for how that
maps to `--accent` in each surface's `theme.css` — this doc calls out only what changed and why).

## 4. Rules for Claude Code when styling anything

1. Never write a raw hex value, `rgba(...)`, `px` spacing, or shadow in feature/page code. Use the
   CSS variables (`var(--accent)`, `var(--radius-md)`, etc.) or Tailwind utilities that map to
   them.
2. Never introduce a new color without adding it to `core.css` first and stating which semantic
   purpose it serves (brand, success, warning, destructive, or a new category) — colors added
   ad hoc in component files are exactly the kind of drift that makes a product stop looking like
   one product.
3. When a new primitive is needed, check `packages/ui` for something close before building new —
   extend `Badge`'s variant union, `Button`'s variant union, etc., rather than creating a
   parallel one-off component.
4. Dark mode is not in scope for MVP. Don't build it speculatively; don't block on it either — the
   token structure (CSS variables) already makes it a later addition rather than a rebuild if it's
   ever needed.

## 5. Two-tier token architecture

Raw brand values live in exactly one place: `packages/ui/styles/core.css`. No component, in
either app, ever writes a hex value — everything goes through an app-level semantic token.

```
packages/ui/styles/core.css        → raw primitives (brand scale, neutral scale, radius, shadow)
apps/web/styles/theme.css          → dashboard semantic layer (restrained: --bg-*, --text-*,
                                       --accent used sparingly — buttons, focus rings only)
apps/marketing/styles/theme.css    → marketing semantic layer (bold: full-bleed --accent
                                       sections, gradients, --mkt-* prefixed tokens)
```

Rule: anything prefixed `--mkt-` is marketing-only and must never appear in `packages/ui` or
`apps/web`. If a marketing-only token starts appearing in a shared component during review, that's
a signal the token needs to be promoted to `core.css` and given a proper cross-surface name — not
quietly imported across the app boundary.

## 6. Component split — apply this test to every new component

1. **Does it need to exist in both experiences?** No → build it locally in that app's own
   components folder. Don't pre-share something only one surface currently uses.
2. **Is the difference just props (variant/size), or a different composition entirely?** A button
   themed big-and-bold in a hero vs. small-and-quiet in a toolbar is one component. A marketing
   stat card with an animated counter and a dashboard data-table row are not the same component in
   different clothes — don't force a shared abstraction onto them.
3. **Same behavior, just re-themed?** → belongs in `packages/ui`, built theme-agnostic (pure
   CSS-variable driven), so it re-skins automatically under each app's `theme.css`.

Expected outcome at this stage: `Button`, `Badge`, `Input`, `Label` live in `packages/ui` — both
surfaces need identical underlying form/action behavior. `Modal`, `Sheet`, `Toast`,
`DropdownMenu` stay `apps/web`-local — the marketing site has no product-style overlay/panel
needs, and sharing them "for consistency" only adds unused surface area.

```
packages/ui/                                ← cross-surface, theme-agnostic primitives only
apps/web/src/features/*/components/          ← dashboard-only composed components
apps/marketing/src/components/               ← marketing-only composed components
```

Nothing in `apps/marketing/components` is imported by `apps/web`, or vice versa. If the same
visual idea is genuinely needed in both later, that's the trigger to deliberately promote it into
`packages/ui` — not to reach across the app boundary as a shortcut.

## 7. Marketing design language

See `docs/product/marketing-home-spec.md` for the concrete homepage build spec. Reference:
ovoenergy.com's homepage — chosen deliberately, and specific elements were adopted, not the
"energy company" surface content:

- **Two-tone system, not a third accent color.** Bright brand green for hero/CTA sections,
  `--mkt-section-dark` (a near-black-green) for alternating secondary sections. Warmth comes from
  real photography and rounded, confident type — not from a decorative warm hue. (An earlier
  draft of this doc proposed a warm gold accent; that's now demoted to
  `--mkt-optional-warm-accent` — defined but unused — pending a deliberate decision rather than
  silently carrying it forward.)
- **Cream base (`--mkt-bg-cream`, `#f9f5f0`), not white**, for light sections. Pure white is
  reserved for the nav bar and footer only.
- **Buttons use the same normal radius as the dashboard** — pill buttons were tried (via a
  `--radius-button` token override in `apps/marketing/styles/theme.css`, matching the OVO
  reference) and then deliberately reverted; the token stays in `packages/ui/styles/core.css` for
  a future surface-specific need, just unused today. Warmth on this surface comes from
  photography, color, and type, not from button shape.
- **Decorative pills stay pill-shaped** — the hero trust-signal stat, category tags
  (`ProofCarousel`, `GuidesTeaser`), and the footer app-store badges are a separate visual
  category from buttons and keep using `--radius-full` directly; only clickable CTAs (`Button`
  and the handful of `<a>` elements styled to match it) changed.
- **Alternating section rhythm** — light → dark → light → dark, never two of the same tone
  back to back. See the section order in `marketing-home-spec.md`.
- **Trust signal inline, immediately under the hero CTA** — not buried in a later section.
- **Three deliberate visual registers, each used for a specific job**: real photography for human
  trust moments (a tutor with a student), isometric/3D icon illustration for quick-link cards, and
  one abstract motif — an ascending progress line — for proof/stats. Not one style trying to do
  everything.
- **Footnoted claims** (¹ ² ³) on any specific number or offer, resolved in small print near the
  footer — establish this convention now, before real pricing/stat claims exist, so it's a habit
  rather than a retrofit.

Bigger type contrast than the dashboard throughout: large, confident headlines over calm,
readable body copy — the dashboard is quiet, this surface is not.

