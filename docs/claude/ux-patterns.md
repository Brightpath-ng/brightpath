# UX Patterns

This doc governs how every CRUD-shaped feature in `apps/web` is built: lists, creating a record,
viewing one, editing one, and moving between them. `design-system.md` governs what things look
like (tokens, color, radius). This governs how a feature is *structured* and *navigated*. Follow
it the same way — if a request conflicts with this file, follow this file and say so.

## Why this exists

Before this doc, the two CRUD-ish features that existed had already drifted: tutor applications
decide status via inline row buttons with no confirmation step; students create via a form inside
a slide-over panel. Neither has a way to view a full record or edit one — there's no dynamic
route anywhere in `apps/web`, no `PATCH`/`PUT` endpoint anywhere in `apps/api`, and the `Modal`
component (built specifically for confirmations) has zero consumers. That was fine at one list and
one create-flow. It stops being fine once Lessons, Disputes, the Ledger, and Tutor Matching land
(`docs/product/blueprint.md` §8.2/§9) — each would otherwise invent its own shape, and a parent or
admin would have to relearn the UI for every new section instead of recognizing the pattern.

The fix isn't a component library — `packages/ui` and `apps/web/src/components/ui` already have
what's needed (`Button`, `Card`, `Sheet`, `Modal`, `Toast`). The fix is a small set of decisions
about which piece to reach for and where things live in the URL, applied the same way every time.

## Resourceful routing — one shape for every entity

Same mental model GitHub and Rails use, chosen specifically because it's boring and predictable —
a future contributor (or Claude Code, next session) should be able to guess the URL for "edit a
lesson" before ever reading the router:

```
/<role>/<entities>              List    — read, the entry point
/<role>/<entities>/new          Create  — full-page form
/<role>/<entities>/[id]         Detail  — read-only, the full record
/<role>/<entities>/[id]/edit    Edit    — full-page form, prefilled
```

**One form component per entity**, used for both `new` and `edit` — parametrized with an optional
`initialValues`/`studentId`-shaped prop, not two forms that drift apart over time. `new`'s page
renders it with nothing pre-filled and a create submit path; `edit`'s page renders the same
component with the record's current values and an update submit path.

On successful create, redirect to the new record's **detail page**, not back to the list — that's
where "did this work?" gets answered with the actual saved data, and it's the same instinct GitHub
follows after filing an issue. On successful edit, redirect back to the detail page.

## Create and Edit: a full page, not an overlay

**Record creation and editing always get their own route now — not a `Sheet`, not a `Modal`.**
This was a direct, deliberate call after shipping the students slice with a Sheet-based "Add
child" flow and finding it the wrong shape live: the primary reason a page exists (adding a
child, filing an issue) deserves the full main content area, the same way GitHub's
`/issues/new` is a whole page, not a slide-over triggered from the issue list.

This doesn't retire `Sheet` or `Modal` — it scopes them correctly:

- **`Sheet`** (`apps/web/src/components/ui/sheet.tsx`) — lightweight, secondary actions that
  don't deserve a permanent URL: a filter panel, a quick auxiliary setting. Not primary-entity
  creation or editing.
- **`Modal`** (`apps/web/src/components/ui/modal.tsx`) — confirmations and short single-field
  prompts. Its `sm`/`md` centered-dialog shape is built for a moment of interruption, not a form
  with five fields.
- **Full page** — anything that is the reason the URL was clicked: creating, editing, viewing.

If a future feature seems to want a form in a `Sheet` again, that's a sign to re-read this section
before reaching for it, not a sign the rule doesn't apply this time.

## Lists — three shapes, picked by what the entity *is*

**Row-list (divided rows)** — the default for records that aren't people: a hairline divider
between rows (`divide-y`), not a bordered card per item.

```
[avatar/icon]  Primary text (bold)         [Badge]
               Muted meta line (optional)
```

`TutorApplicationsList` is the reference. Use this for any entity whose most important info is "a
name plus a few attributes" and that reads as a record, not a person — an application, a dispute,
a notification.

**Person-card grid** — for entities that represent people the user directly manages (a parent's
children today; possibly tutors-you-work-with later): bordered card, circular avatar (a generic
person-silhouette placeholder until photo upload exists, then the real photo) centered up top,
name + a couple of secondary details below, learning-track-style `Badge` if relevant. Grid layout,
not a list. Include a dashed "add new" tile as the grid's last item (Netflix/Google Family Link's
"Add Profile" convention) alongside — not instead of — the page header's create button.
`StudentsList` is the reference. The tell for reaching for this instead of a row-list: does this
record represent a human being the user has a relationship with, not just data about one? A
`StudentProfile` does. A `TutorApplication` (a pending decision *about* a person) doesn't — it's a
queue item, not a profile.

**Table** — columnar/tabular data: Ledger entries, audit log rows, anything with many aligned
numeric/date fields that don't reduce to "avatar + name + badge." Real `<table>`, column headers,
right-aligned numeric columns with `font-variant-numeric: tabular-nums`. Nothing needs this yet, so
there's no `Table` component to build today — build one when the Ledger module starts, don't
stretch the row-list or card-grid pattern to fit data neither was shaped for.

Whichever shape: once a `[id]` detail route exists for that entity, **rows/cards become links to
it** — add a hover state so the affordance is obvious before the click, not a surprise after.

**Row-level inline actions** (buttons directly in a row, no navigation) stay appropriate for quick,
low-friction, non-destructive decisions on records that don't need a detail page — approve is the
current example. **Any destructive or hard-to-reverse row action must open a `Modal` confirm step
first.** This is a real, currently-open gap: `TutorApplicationsList`'s Reject button fires
immediately with no confirmation. Fixing that isn't in the students retrofit this doc ships
alongside (out of scope — students is the reference module, tutors isn't touched), but it's the
next obvious cleanup and the rule applies starting now for anything new.

## Empty states get a next step

`"No children added yet."` alone is a dead end. If the page has a create action available, the
empty state includes it — a line of text plus a link/button to `new`, not just a description. This
matches how GitHub, Linear, and Notion all treat an empty list: as an invitation, not a report.

## Detail pages

- Full record, not just what fit in the list row — this is where dropped-from-the-row detail
  (goals, challenges, whatever didn't fit a compact line) belongs.
- Always has a way back: extend `PageHeader` with an optional `backHref`/`backLabel` rather than
  inventing a separate breadcrumb component — `← My Students` above the title, linking to the list.
- Primary action in the header slot is `Edit`, linking to `[id]/edit`.

## Data-fetching page shape

Already proven twice (`admin/tutors/page.tsx`, `parent/students/page.tsx`) — formalized here so
it's deliberate, not incidental:

```tsx
export default async function SomePage() {
  try {
    const data = await fetchThing();
    return <PageContent data={data} />;
  } catch {
    return (
      <>
        <PageHeader title="..." description="We couldn't load this." />
        <div className="p-8">
          <a href="/same/route">Try again</a>
        </div>
      </>
    );
  }
}
```
Recovery is a full page reload via a plain link back to the same route — not client-side retry
logic. Every list and detail page follows this shape; don't build a bespoke error boundary per
feature.

## Confirmation rule, restated plainly

If undoing the action requires contacting support or re-entering data, it needs a `Modal` confirm
step before it fires. If undoing it is just clicking the opposite button, it doesn't.

## Loading states

`loading.tsx` at every route that fetches data renders the same shared `PageLoading`
(`apps/web/src/components/PageLoading.tsx`) — a single centered spinner filling the content area,
not a skeleton shaped after that page's specific layout. This was a deliberate reversal: an earlier
version pixel-matched the loading state to each page's content, and it went stale silently the
first time that content's layout changed (a list becoming a card grid, say). One generic spinner
never drifts, because it doesn't represent anything to drift from. Don't build a bespoke skeleton
for a new page — import `PageLoading`.

## Worked example

`apps/web/src/features/students/` is the reference implementation — `/parent/students` (person-card
grid, empty-state "add first child" tile, clickable cards), `/parent/students/new` (full-page
create), `/parent/students/[id]` (detail, back-link, Edit action), `/parent/students/[id]/edit`
(full-page edit, same form component as create). Read that module before building the next one;
don't re-derive these decisions from scratch.
