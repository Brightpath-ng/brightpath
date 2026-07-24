# Environments

Two fully isolated environments at MVP stage. No shared resources between them, ever — not the
database, not Clerk, not Paystack keys.

## Local development (default for all Claude Code work)

| Concern | Setup |
|---|---|
| Database | A local Supabase instance via the Supabase CLI (`supabase start`), or a Supabase **branch** database if using Supabase's branching feature — either way, physically separate from the production project, not a schema/prefix trick on the same DB |
| Auth | A separate **Clerk development instance** (Clerk gives you dev + prod instances by default — use the dev one's keys locally, never the prod publishable/secret key) |
| Payments | Paystack **test mode** keys and test cards only |
| Env file | `.env.local`, git-ignored, documented via a committed `.env.example` with placeholder values |
| Seed data | `packages/db/seed.ts` — deterministic fixture data (sample parents, tutors, lessons) so local dev and CI always start from a known state |
| Runs | `pnpm dev` starts `apps/marketing`, `apps/web`, and `apps/api` together via Turborepo, all pointed at the local DB |

This environment must run **fully end to end with no path to production** — that means literally:
production Clerk keys, production Supabase URL, and production Paystack live keys should not even
be present in a developer's local `.env.local`. If they're not on the machine, they can't be hit
by accident.

## CI / test environment

Same shape as local dev: an ephemeral Postgres instance (spun up in the CI runner or a disposable
Supabase branch), Clerk dev-instance test tokens, Paystack test keys. Torn down after each run.
This is what `testing.md`'s integration/E2E tests run against.

## Production

| Concern | Setup |
|---|---|
| Database | Separate Supabase **project** (not just a separate schema) |
| Auth | Clerk **production instance** |
| Payments | Paystack **live** keys |
| Env vars | Set in the hosting platform's secret store (Vercel project env vars for `marketing`/`web`, the API host's equivalent for `apps/api`) — never committed, never present in a local `.env` file |
| Deploy | Only via CI, only from `main`, after the full test gate in `testing.md` passes — no manual/local deploys to production |

## The rule that matters most

If Claude Code is ever about to run a command and isn't certain whether it points at local or
production resources — a migration, a seed script, a payment test, a bulk data operation — **stop
and confirm the target environment before running it.** A wrong guess here isn't a bug to fix
later, it's data loss or a real charge on a live Paystack account.
