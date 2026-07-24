# BrightPath — Engineering Memory (CLAUDE.md)

This file is read by Claude Code at the start of every session. It is the contract for how this
codebase gets built. If a request conflicts with this file, follow this file and say so.

Detailed docs are split out and imported below — read them, don't skip them because they're not
inline. Claude Code resolves `@` imports automatically.

@docs/claude/architecture.md
@docs/claude/sdlc.md
@docs/claude/design-system.md
@docs/claude/testing.md
@docs/claude/environments.md

---

## 1. What we're building

BrightPath is a managed tutoring and learning platform for Nigeria (see `/docs/product/` for the
full business/product blueprint). Four user roles — Admin, Parent, Tutor, Student — plus a public
marketing site. Three learning tracks (tutor-led, hybrid, self-directed). Hybrid delivery (online
+ in-person). A live monitoring/accountability layer (check-in/check-out, geofencing, reliability
scoring). Full detail lives in the product blueprint — read it before starting unfamiliar features.

## 2. Non-negotiables

These apply to every line of code Claude Code writes in this repo, no exceptions, no "just this
once":

1. **TypeScript strict mode everywhere.** No `any`. No `@ts-ignore` without a one-line comment
   explaining why and a linked follow-up.
2. **No feature is "done" without tests.** See `docs/claude/testing.md` for what "done" means per
   layer. A PR without tests is an incomplete PR, not a fast one.
3. **No hardcoded colors, spacing, or radii in application code.** Everything comes from the design
   tokens in `packages/ui`. See `docs/claude/design-system.md`.
4. **No direct database access from `apps/web`.** The Next.js app talks to `apps/api` (or to
   Prisma only inside server actions that belong to `packages/db`'s sanctioned access layer — see
   architecture doc). Never wire a client component straight to Supabase with the service key.
5. **No committing directly to `main`.** Every change is a branch + PR, even solo. See
   `docs/claude/sdlc.md`.
6. **Never touch production data, production Clerk instance, or production Paystack keys from a
   local or CI test run.** See `docs/claude/environments.md`. If you are ever unsure which
   environment a command will hit, stop and ask rather than run it.
7. **Every new feature starts with a short plan, not code.** See the workflow in
   `docs/claude/sdlc.md` — plan → schema/types → backend → frontend → tests → self-review → PR.

## 3. Tech stack (fixed for MVP — don't introduce alternatives without discussion)

| Layer | Choice |
|---|---|
| Monorepo tooling | Turborepo + pnpm workspaces |
| Frontend | Next.js (App Router), TypeScript, Tailwind v4 |
| Backend | Express, TypeScript |
| ORM | Prisma |
| Database | Supabase (Postgres) |
| Auth | Clerk |
| Payments | Paystack (primary), design the payment layer so a second provider can be added without touching callers |
| Validation | Zod, shared between frontend and backend via `packages/types` |
| Unit/integration tests | Vitest |
| Component tests | React Testing Library |
| API tests | Supertest |
| E2E tests | Playwright |
| Lint/format | ESLint + Prettier, shared config in `packages/config` |

## 4. How to work in this repo, in one sentence

Small, fully-tested, reviewed vertical slices — one feature end to end (schema → API → UI → tests)
before starting the next. Never a wide, half-wired feature spanning the whole app.

## 5. When you're not sure

Ask. A clarifying question costs one message. A wrong architectural assumption built on top of
for two weeks costs a rewrite — which is exactly the failure mode the product blueprint's "avoid
late bolt-ons" principle exists to prevent. Apply that principle to code, not just to the product
spec.
