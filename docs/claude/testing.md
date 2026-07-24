# Testing Standards

Testing is not optional and not a separate phase bolted on at the end — it's part of step 3/4 in
the SDLC loop, written alongside the code it covers.

## What's required, per layer

| Layer | Tool | Required for |
|---|---|---|
| Pure functions / utils | Vitest | Every exported function in `packages/utils`, `service.ts` business logic |
| Backend service layer | Vitest | Every `service.ts` — mock the repository layer, test business rules and edge cases (not just the happy path: invalid input, not-found, permission-denied, race conditions where relevant) |
| API routes | Supertest + Vitest | Every route: success case, validation failure (400), auth failure (401/403), not-found (404) |
| React components | React Testing Library | Every component in `packages/ui` and every feature component with non-trivial logic (conditional rendering, form validation, state transitions) — not required for pure presentational wrappers with no logic |
| Critical user flows | Playwright | See list below — these run against the local dev environment in CI, end to end |

## Critical flows that must have E2E coverage before MVP ships

These map directly to the product blueprint's core promise — if these silently break, the product
is broken regardless of what unit tests say:

1. Parent sign-up → baseline assessment → track recommendation
2. Parent books a tutor-led lesson (both delivery modes: online and in-person)
3. Tutor accepts assignment → checks in → checks out → submits lesson report (Section 12 of the
   blueprint — this is the trust mechanism, it must actually work)
4. Payment flow: parent pays via Paystack test mode → ledger entry created → tutor payout recorded
5. Admin reviews and approves a lesson report → parent dashboard updates
6. Dispute raised → admin resolves → linked refund reflected in the ledger

Add to this list as new critical flows ship; don't let it go stale.

## Coverage expectations

Not chasing a coverage percentage for its own sake — chasing "every business rule and every error
path has a test that would fail if the rule were removed or the error path were broken." A useful
gut check: if you deleted a line of business logic, would a test go red? If not, something's
missing.

## Test environment rules

- Unit and component tests never touch a real database or real network — mock at the boundary
  (repository layer for backend, API client for frontend).
- Integration/API tests run against the **local Postgres/Supabase instance** defined in
  `environments.md`, reset between runs via a seed script, never against staging or production.
- E2E tests run against the local dev environment stack (web + api + local DB) started in CI, using
  Clerk's test-mode auth and Paystack's test keys — never live credentials.

## CI gate

Every PR runs: typecheck → lint → unit/component tests → API/integration tests → build. Playwright
E2E runs on PRs touching flows in the critical-flows list, and on every merge to `main`. A red CI
run blocks merge — no merging with a known-failing test "to fix later."
