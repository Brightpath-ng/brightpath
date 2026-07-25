# SDLC — How We Build Every Feature

This is the loop Claude Code follows for every feature, bug fix, or change of non-trivial size.
Skipping steps is how "half-baked with errors everywhere" happens — the thing we're explicitly
building against.

## The loop

### 1. Plan before code
Write a short plan (5–15 lines, in the PR description or a scratch file) covering: what entities/
endpoints/components are touched, what's explicitly out of scope, and which existing tests might
break. For anything touching the data model, check it against `docs/product/` first — the product
blueprint already resolved most of the "will this need a rebuild later" questions; use it rather
than re-deriving decisions.

### 2. Schema and types first
If the feature touches the database: update `packages/db/schema.prisma`, generate a migration,
update/add the Zod schemas in `packages/types`. Get this reviewed (even self-reviewed) before
writing business logic against it — a schema change is the most expensive thing to walk back.

### 3. Backend: service → repository → controller → routes, in that order
Write `service.ts` against an interface, with unit tests, before wiring it to Prisma. This keeps
business logic testable without a live database and catches design problems before they're
tangled up with HTTP and DB concerns.

### 4. Frontend: component → hook/data-layer → page, in that order
Build the component against mock/fixture data and a component test first. Wire it to the real API
client last. This keeps UI work parallelizable with backend work and catches visual/UX problems
early instead of after integration.

### 5. Integration
Wire frontend to backend against the **local dev environment** (never staging/prod — see
`environments.md`). Add an integration or E2E test for the critical path if one doesn't already
cover it.

### 6. Self-review checklist (run before opening a PR)
- [ ] Tests written and passing at every layer touched (see `testing.md` for what's required per
      layer)
- [ ] No hardcoded design values — checked against `design-system.md`
- [ ] No `any`, no unexplained `@ts-ignore`
- [ ] Loading, empty, and error states all handled in every new UI surface — not just the happy
      path (see §"No half-baked UI" below)
- [ ] No secrets, no environment-specific values, no direct production access committed
- [ ] Lint and typecheck pass locally (`pnpm lint`, `pnpm typecheck`)

### 7. PR
One feature or fix per PR, small enough to review in one sitting. Conventional commit messages
(`feat:`, `fix:`, `chore:`, `test:`, `docs:`). PR description restates the plan from step 1 and
notes what was tested and how.

No AI-attribution footer or trailer anywhere in the PR: no "Generated with Claude Code" line in
the PR description, no `Co-Authored-By: Claude` trailer in any commit message on the branch.

## Branching

Trunk-based: `main` is always deployable. Feature branches named `feature/<short-name>`,
`fix/<short-name>`. No direct commits to `main`, even for "trivial" changes — trivial changes are
exactly the ones that skip review and cause the errors we're trying to avoid.

## No half-baked UI — this is a hard requirement, not a nice-to-have

Every screen Claude Code ships must explicitly handle:
- **Loading** — a real skeleton/spinner state, not a blank screen
- **Empty** — what a parent sees before they have any lessons booked, what a tutor sees before
  their first assignment, etc. — designed, not an accidental blank list
- **Error** — a real error state with a way to recover (retry, contact support), not a crash or a
  silent failure
- **Populated** — the normal case

If a component is built without all four, it is not complete, regardless of whether the happy
path works in a demo.

## Definition of Done

A feature is done when: it matches the plan (or deviations are explained), it has tests at every
layer per `testing.md`, it handles all four UI states above where applicable, it passes CI, and it
has been exercised in the local dev environment end to end — not just unit-tested in isolation.
"The API test passes" is not the same as "done" if nobody has clicked through the actual flow.
