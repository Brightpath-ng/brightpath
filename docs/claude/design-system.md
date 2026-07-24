# Design System

## 1. Source of truth

`packages/ui` owns the design system: tokens (`packages/ui/styles/tokens.css`) and primitives
(`Button`, `Card`, `Input`, `Label`, `Badge`, `Modal`, `Sheet`, `Toast`/`useToast`,
`DropdownMenu`, and anything added later). `apps/web` imports from `packages/ui` — it does not
redefine tokens or rebuild primitives locally. If a screen needs a component that doesn't exist
yet, add it to `packages/ui` first, don't inline a one-off version in the feature folder.

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

The full updated token file is at `packages/ui/styles/tokens.css` (see that file for the complete
set — this doc calls out only what changed and why).

## 4. Rules for Claude Code when styling anything

1. Never write a raw hex value, `rgba(...)`, `px` spacing, or shadow in feature/page code. Use the
   CSS variables (`var(--accent)`, `var(--radius-md)`, etc.) or Tailwind utilities that map to
   them.
2. Never introduce a new color without adding it to `tokens.css` first and stating which semantic
   purpose it serves (brand, success, warning, destructive, or a new category) — colors added
   ad hoc in component files are exactly the kind of drift that makes a product stop looking like
   one product.
3. When a new primitive is needed, check `packages/ui` for something close before building new —
   extend `Badge`'s variant union, `Button`'s variant union, etc., rather than creating a
   parallel one-off component.
4. Dark mode is not in scope for MVP. Don't build it speculatively; don't block on it either — the
   token structure (CSS variables) already makes it a later addition rather than a rebuild if it's
   ever needed.
