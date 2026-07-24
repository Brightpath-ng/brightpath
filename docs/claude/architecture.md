# Architecture

## Why Turborepo + pnpm, one monorepo

One repo, one design system, one set of shared types between frontend and backend, one CI
pipeline. Turborepo caches builds/tests per-package so it stays fast as the repo grows. This is
the same approach Linear and Vercel's own products use at this scale, and it's the right fit
given you already have a shared design system and multiple apps that need to stay visually and
behaviorally consistent.

## Why one `web` app with role-based routing, not four separate apps

It's tempting to split admin/parent/tutor/student into four apps. Don't — for the same reason the
product blueprint argues against building things you'll need to bolt on later:

- They share the same auth session (Clerk), the same design system, and a lot of the same
  primitives (progress dashboards, messaging, assessment views).
- Splitting into four apps means four deploys, four places a shared component can drift, and
  duplicated data-fetching logic.
- Next.js route groups + middleware give you clean role separation without repo separation.

Only the **marketing site** gets its own app — it has a genuinely different design language, a
different (public, SEO-driven, mostly static) rendering profile, and no auth, so splitting it out
is a real architectural boundary, not a premature one.

## Top-level layout

```
brightpath/
├── apps/
│   ├── marketing/            # Next.js — public site. Own design language (see design-system.md §2)
│   ├── web/                  # Next.js — the authenticated product (admin/parent/tutor/student)
│   └── api/                  # Express — all business logic, all DB access
├── packages/
│   ├── ui/                   # Design system: tokens, primitives (Button, Card, Modal, Toast...)
│   ├── config/                # Shared eslint, tsconfig, tailwind, prettier config
│   ├── db/                    # Prisma schema, migrations, generated client, seed scripts
│   ├── types/                  # Zod schemas + inferred TS types shared by web and api
│   └── utils/                   # cn(), date/currency formatting, other pure helpers
├── docs/
│   ├── product/                # The business/product blueprint (source of truth for what to build)
│   └── claude/                  # This folder — engineering process docs
├── .github/workflows/
├── turbo.json
├── pnpm-workspace.yaml
└── CLAUDE.md
```

## `apps/web` role separation

```
apps/web/src/
├── app/
│   ├── (marketing-none)/            # n/a — marketing lives in apps/marketing
│   ├── (auth)/sign-in, sign-up      # Clerk-hosted or custom, minimal
│   ├── (admin)/...                  # gated by middleware: role === 'admin'
│   ├── (parent)/...                 # gated by middleware: role === 'parent'
│   ├── (tutor)/...                  # gated by middleware: role === 'tutor'
│   └── (student)/...                # gated by middleware: role === 'student'
├── middleware.ts                    # Clerk auth + role-based route protection
└── features/                        # see "Feature-based structure" below
```

Role is resolved from Clerk's `publicMetadata` (set by the API on user creation/approval), checked
in `middleware.ts` before a request ever reaches a route group. A parent hitting an `/admin/*`
route gets redirected, not shown a broken page.

## Feature-based (vertical slice) structure — both frontend and backend

Don't organize by technical layer (`/components`, `/hooks`, `/services` as top-level folders).
Organize by feature/domain, so everything needed to understand or change one capability lives in
one place.

**`apps/web/src/features/<feature>/`**
```
features/lessons/
├── components/          # LessonCard, LessonScheduler, LessonReportForm...
├── hooks/                # useLessons, useLessonExecution...
├── api/                   # typed client functions calling apps/api, using packages/types
├── types.ts                # feature-local types not shared with backend
└── __tests__/
```

**`apps/api/src/features/<feature>/`**
```
features/lessons/
├── routes.ts             # Express router, thin — validates input, calls controller
├── controller.ts          # HTTP concerns only (status codes, request/response shape)
├── service.ts               # Business logic — this is where rules live, framework-agnostic
├── repository.ts              # Prisma calls, isolated so service.ts is testable without a DB
├── schema.ts                    # Zod input/output schemas (re-exported to packages/types if shared)
└── __tests__/
```

Initial feature set, matching the product blueprint's domain model: `auth`, `tutors`,
`students`, `parents`, `lessons` (incl. `LessonExecution` — Section 12 of the blueprint),
`assessments`, `content` (Section 6's Hybrid/Self-directed track), `payments`, `disputes`,
`notifications`, `admin`.

## Cross-cutting rule: `packages/types` is the contract

Every API request/response shape is a Zod schema in `packages/types`, imported by both
`apps/api` (to validate) and `apps/web` (to type the client and validate forms). This is what
prevents frontend/backend drift — if you change a shape, TypeScript breaks both sides at compile
time instead of failing silently at runtime.

## Database

Single Prisma schema in `packages/db/schema.prisma`, organized into clearly commented sections
mirroring the feature list above (not split into multiple schema files at MVP size — Prisma's
multi-file schema support can be adopted later if the schema gets unwieldy, but don't reach for it
prematurely). Model names and relations should map directly onto the entities defined in the
product blueprint's data model section (`TutorProfile`, `StudentProfile`, `Lesson`,
`LessonExecution`, `PricingPlan`, `LedgerEntry`, `Dispute`, `Content`, `ContentProgress`,
`AuditLog`, etc.) — that document is the source of truth for what the schema should contain; this
doc is the source of truth for how the code around it is organized.
