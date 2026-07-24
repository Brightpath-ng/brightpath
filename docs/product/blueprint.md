# BrightPath — Product & Platform Blueprint

> Source of truth for the business model, data model, and roadmap. Generated from the
> canonical Word document (`BrightPath_Platform_Blueprint.docx`) — if the two ever diverge,
> treat that as a bug to fix, not a judgment call about which one is right.


## 1. Executive Summary

This document refines your original concept into a single, internally consistent operating model, backed by a system architecture designed to absorb growth without repeated rebuilds. The original brief contained a strong core idea but mixed two different business models together (an open marketplace and a managed, brand-owned service) and specified features and a database structure that would need significant rework once the business reached scale — for example, no support for multiple pricing plans, no ledger for refunds or disputes, no multi-tenant structure for schools, and no clear ownership of tutor pricing. This version resolves those ambiguities up front.

**The core decision this document makes:** BrightPath is a managed tutoring and learning brand, not an open marketplace. BrightPath — not individual tutors — sets prices, assigns tutors, and owns the parent relationship. This is closer to Varsity Tutors' original model than to Nigeria's existing market leader, Tuteria, which operates as an open marketplace where tutors set their own rates. That distinction is your differentiation, and it is also what makes 'measurable progress' a credible promise rather than a marketing line.


### What changed from the original brief, and why

| **Area** | **Original brief** | **Refined here** | **Why it matters** |
| --- | --- | --- | --- |
| Business model | Mixed marketplace + managed-brand language | Committed: BrightPath as a managed, brand-controlled service, phased toward an optional Marketplace tier in Year 2 | Prevents a costly re-architecture once tutors start expecting to set their own prices |
| Pricing | Single per-lesson fee, one commission example | Three pricing modes (package, subscription, pay-as-you-go) built into the data model from day one | The single biggest cause of 'late bolt-ons' in tutoring platforms is pricing logic hard-coded to one model |
| Payments | One payments table | Ledger/wallet architecture with holds, partial refunds, payouts, disputes | Nigerian parents are payment-trust-sensitive (see Section 2); disputes and part-refunds are routine, not edge cases |
| Database | Flat, single-tenant tables | Multi-tenant-ready schema (supports future school/corporate accounts without a rebuild) | B2B school contracts are the highest-margin channel long-term (see Varsity Tutors' district revenue) |
| Trust & safety | Screening mentioned, not specified | Formal verification tiers, guarantor/reference checks, in-app-only contact, incident/dispute workflow | Trust is the actual product being sold; this cannot be an afterthought |
| Notifications | Implied ('parents receive notifications') | Abstracted notification service (SMS, WhatsApp, email, push) from the MVP | Email-only notification in Nigeria has low open rates; WhatsApp/SMS cannot be bolted on later without touching every feature |
| Delivery mode | Unclear whether tutoring is online, in-person, or both | Explicit hybrid model (Section 5): every lesson records a delivery mode, and tutor profiles support both | Your direct competitor, Tuteria, runs both; going online-only would narrow your market, not simplify it |
| Product scope | Single offer: a struggling student is matched with a tutor | Three-track continuum — Tutor-led, Hybrid, Self-directed (Section 6) — on one platform, with assessment-driven routing between tracks | Solves the retention problem of a successful outcome ending the relationship, and decouples part of growth from tutor supply |
| Session verification | Not addressed — a lesson report is the only record | Automatic check-in/check-out, geofencing, and a reliability score separate from teaching rating (Section 12) | Turns 'trust us' into an objective, auditable record — for parents' peace of mind and as protection for tutors against false disputes |

> *Sources consulted for this audit include public business-model breakdowns of Varsity Tutors (US) and reporting on Tuteria, Gradely and AltSchool (Nigeria), summarised in Section 2.*


## 2. Market Audit: What Already Works, and Where the Gap Is

Before finalising the model, it is worth being explicit about who you are actually competing with. You are not entering an empty market — Nigeria already has an established, funded competitor operating a similar idea, and the developed-market platforms you referenced have each converged on lessons worth borrowing.


### 2.1 Direct competitor: Tuteria (Nigeria)

Tuteria is the closest existing competitor and the one you should study hardest. Founded in 2015, it now lists thousands of vetted tutors and has served tens of thousands of learners across academic and vocational subjects, in both online and in-person formats.

- Model: open marketplace — tutors set their own hourly rates per subject; Tuteria does not fix pricing.
- Take rate: tiered commission, historically cited between 3% and 30% depending on booking size and tutor rating/tenure — larger bookings pay a smaller percentage.
- Distribution challenge acknowledged publicly: many Nigerian parents were reluctant to trust an online-only booking flow, and a large share of early bookings had to be closed by phone rather than self-serve — a signal that pure self-service UX under-performs in this market without human-assisted onboarding.
- Recent pivot: introduced a 'budget optimisation' filter so parents can see only tutors within their price range, reflecting real affordability pressure in the market.
> *Public reporting: TechCabal/CBInsights company profile; Techpoint Africa interview with Tuteria's co-founder (2021); Disrupt Africa (2016); Wikipedia entry citing Tuteria's commission structure.*


### 2.2 Reference model: Varsity Tutors (US)

Varsity Tutors began in 2007 as a lean, quality-first managed marketplace — the company, not individual tutors, handled vetting, matching and billing, with tutors focused purely on teaching. That is structurally the same model your original brief described. It has since layered on a subscription 'Learning Membership', institutional (school-district) contracts, and a corporate-benefits channel, and now reports the large majority of its revenue coming from subscriptions rather than one-off session fees.

- Lesson: a managed model can scale to very large size, but the profitable expansion came from adding subscription and institutional revenue on top of the core service — not from the core tutoring fee alone.
- Lesson: matching quality (assigning the right tutor quickly) became a core, continuously-improved capability, not a one-time feature — worth designing your data model to support from day one (skills taxonomy, learning-style tags, past outcomes).
> *Public business-model and history summaries of Varsity Tutors (Vizologi; businessmodelcanvastemplate.com), 2025–2026.*


### 2.3 What this means for your model

1. Do not copy Tuteria's open-marketplace pricing — it is already occupied, and your original brief's emphasis on 'measurable progress' and brand-managed quality only works if BrightPath controls tutor assignment and pricing, not the tutor.
1. Assume a meaningful share of your early users will need human-assisted onboarding (phone/WhatsApp), not pure self-service — build your ops workflow (and admin tools) around that reality rather than assuming a frictionless web funnel.
1. Plan for a second revenue line beyond commission — subscriptions and, later, school partnerships — from the roadmap stage, even if you do not build it in Phase 1, so the data model does not need to be re-shaped to add it in Year 2.
1. Payment trust is a real, named barrier in this market. Support bank transfer and USSD alongside card from day one via Paystack/Flutterwave (both already support these rails), not card-only.

## 3. Audit of the Original Concept: Risks of Building It As-Written

The original brief is a good first draft — the flow diagram, the parent/tutor/admin split, and the emphasis on progress-tracking are all sound. The risks below are specifically the things that would force a rebuild ('late bolt-on') if left unresolved before development starts.


### 3.1 Structural risks

- Ambiguous ownership of pricing: the flow says 'Parent pays BrightPath' (BrightPath-controlled), but the tutor recruitment page implies tutors are independently recruited and rated as if setting their own terms — a marketplace pattern. Left unresolved, this becomes a legal and product conflict once real tutors start negotiating rates.
- Single flat payments table: the original schema has one Payments table with a fixed tutor/BrightPath split. It cannot represent partial refunds, disputed lessons, cancelled-but-partially-taught sessions, or multi-currency (relevant if you expand beyond Nigeria, which the original doc itself references for Tuteria).
- No multi-tenancy: Users/Students/Lessons tables assume every account is an individual parent. Adding a school or corporate account later (the highest-margin channel per the Varsity Tutors precedent) would require restructuring, not extending, the schema.
- No explicit dispute/incident workflow: 'View complaints' appears as an admin dashboard bullet with no underlying data model — complaints need a structured, auditable record tied to a lesson, a payment hold, and a resolution outcome, or they become a support-ticket black hole.
- Assessment system is described narratively but not modelled: 'before vs current score' needs a versioned assessment/question-bank structure now, or the AI features in Phase 3 (weak-topic detection, performance prediction) will have no historical data to train on.

### 3.2 Operational risks

- Tutor supply before parent demand: like most two-sided marketplaces, if you open parent acquisition before you have enough vetted tutors in-subject and in-location, your first cohort of parents gets a poor match experience and churns before word-of-mouth can build.
- Verification depth: 'carefully screened tutors' is a promise, not a process. Given tutors will be in family homes or 1:1 online with children, you need a defined, auditable verification tier (ID, guarantor/referee, in-person or video interview, ongoing rating-based re-review), not a one-time approval checkbox.
- Payment collection risk in a cash-leaning market: Tuteria's own experience shows many bookings needed phone-assisted closing. Assume the same and design admin tools that let staff record a phone-confirmed booking with the same data integrity as a self-service one.

### 3.3 What is already right and should be kept

- The BrightPath-owns-the-relationship flow (parent never pays tutors directly) — this is your core differentiation versus Tuteria and should be defended, not diluted.
- The progress dashboard concept (before/current score, attendance, homework) — this is the actual value proposition; keep it central and build the data model to support it properly (Section 8).
- The phased roadmap instinct — building tutor training, messaging and analytics in a later phase is correct; Section 10 refines the sequencing further.

## 4. The Finalised Business Model


### 4.1 Positioning

**Name (working):** BrightPath Learning Network — kept generic here; final naming/trademark search is a Phase 1 task, not a strategic one.

**Tagline:** "Trusted tutors. Measurable progress." (kept from the original — it is a genuinely strong line).

**Category:** A managed tutoring service with a technology platform — not a marketplace, not a pure content/app product. This is the single sentence to test every future feature against: does it strengthen BrightPath-controlled quality and measurable progress, or does it dilute that control (e.g. letting tutors set their own price) in exchange for short-term growth?


### 4.2 The relationship flow (confirmed)

Parent pays the BrightPath → BrightPath assigns a vetted, trained Tutor → Tutor teaches and files a lesson report → BrightPath reviews report quality → Parent sees the update on their dashboard → BrightPath pays the Tutor. The parent never pays or negotiates with the tutor directly, and the tutor never sets their own price. This single rule is what makes 'quality-controlled' a credible claim rather than a slogan, and it is the main structural difference from Tuteria.


### 4.3 Revenue streams (sequenced, not simultaneous)

| **Stream** | **Description** | **When to launch** |
| --- | --- | --- |
| Managed tutoring fee | Parent pays a fixed package/hourly rate set by the BrightPath; BrightPath retains a margin (suggested 25–35%, benchmarked against Tuteria's 15–30% and Varsity Tutors' 15–30%) after paying the tutor. | Phase 1 (MVP) — the core business |
| Subscription plans | Monthly plan bundling a fixed number of sessions plus dashboard/analytics access, priced below the pay-as-you-go equivalent to reward commitment and improve cash-flow predictability. | Phase 2 |
| Content subscription | Lower-cost monthly access to the self-directed study library (Section 6) for students who don't need — or have graduated from — 1:1 tutoring. Scales without additional tutor recruitment. | Phase 3 |
| Assessment / diagnostic fee | Paid entry assessment for new students not yet paired with a tutor — low-friction way to monetise top-of-funnel interest, generate the 'before' score for the progress dashboard, and route the student to the right track (Section 6.2). | Phase 1, optional add-on |
| School / corporate contracts (B2B) | Bulk tutoring or after-school programmes sold to private schools or employers as a benefit, billed per-student or per-programme. | Phase 3, once unit economics and quality data are provable |
| Tutor training certification | Paid, branded certification for tutors who complete your training modules — sellable even to tutors who don't end up teaching on the platform, and a credential that raises your own tutor quality bar. | Phase 2/3, optional |


### 4.4 Pricing architecture (this must be built into the data model on day one)

Do not hard-code a single price-per-lesson field. Build three coexisting pricing modes from the start, because retrofitting this later touches billing, reporting, tutor payout and the parent dashboard simultaneously:

  - Pay-as-you-go — priced per confirmed lesson, billed after delivery or pre-paid per session.
  - Package — a pre-paid block of N sessions at a discounted blended rate, decremented per lesson delivered.
  - Subscription — recurring monthly charge covering a defined session allowance, auto-renewing.
A worked example (kept from your original brief, generalised): if a package is priced at ₦60,000 for the month and the BrightPath margin is 25%, the tutor is paid ₦45,000 and the BrightPath retains ₦15,000, recorded per lesson delivered rather than as a single lump transaction — so a mid-month cancellation or refund only ever needs to unwind the specific lessons affected.


## 5. Delivery Mode: Hybrid by Design

Neither the original brief nor a purely online build reflects how tutoring actually works in this market. Tuteria — your closest competitor — runs both in-person and online lessons, and in-person delivery is where trust is easiest to build with parents of younger children, while online delivery is what lets BrightPath serve a student regardless of a tutor's commute radius. BrightPath is built hybrid from day one, not online-only with in-person bolted on later.


### 5.1 What hybrid changes, concretely

| **Area** | **Online-only would need** | **Hybrid (adopted) needs** |
| --- | --- | --- |
| Lesson record | A video-room link field only | A delivery_mode field (online / in-person) plus either a video-room reference or a lesson address |
| Tutor profile | Subjects and availability only | Adds a service radius / travel-willingness field so in-person requests can be matched by geography, not just subject |
| Matching engine | Subject + availability | Subject + availability + location proximity for in-person requests |
| Trust & safety | Standard verification is sufficient | Verification plus an in-home safety protocol — see Section 11.2 |
| Video infrastructure | Must be production-ready before any lesson can happen | Still built in Phase 1, but not the sole delivery path, so there's no rush to over-invest in video UX before there's volume |

Parents choose (or are recommended) a mode at booking time — online, in-person, or 'either, whichever tutor is the best match' — and can switch mode lesson-to-lesson if the assigned tutor supports both.


---


## 6. The Learning Continuum: Three Tracks, One Platform

This is the most important strategic addition to the original brief. As originally scoped, BrightPath only had one offer: a struggling student gets a tutor. That has a structural weakness — the moment a tutor succeeds (your own example: a student moving from 42% to 84%), the family has no reason to keep paying, and BrightPath has worked itself out of the relationship. It also means every parent who was never going to need a tutor — a strong, self-directed student who just wants structured materials — has no reason to sign up at all. Both problems are solved by the same idea: treat tutoring, guided study, and self-directed learning as three tracks on one platform, not three separate products.


### 6.1 The three tracks

| **Track** | **Who it's for** | **What they get** | **Delivery cost** |
| --- | --- | --- | --- |
| Tutor-led | Students who test as needing consistent 1:1 attention (the original core offer) | A matched, agency-assigned tutor, scheduled lessons (online or in-person), lesson reports, monthly re-assessment | High-touch, bottlenecked by verified tutor supply |
| Hybrid | Students who have improved and need less frequent 1:1 support, reinforced independently | Reduced tutor frequency plus access to the self-directed content library for reinforcement between lessons | Medium-touch — the natural landing zone as a Tutor-led student improves |
| Self-directed | Students who test as capable independent learners, or families who want study materials without a tutor | Full access to courses, practice sets, past-paper drills and self-assessments, with the same progress dashboard tracking their scores over time | Low-touch, high-margin, scales without additional tutor recruitment |


### 6.2 How students move between tracks

The baseline assessment — already part of the platform (Section 9) — is the routing engine, not just an onboarding formality. A student's track is stored as a field on their profile and can change every time they are re-assessed, in either direction:

1. A new student takes the baseline assessment; the result recommends a starting track (BrightPath can still let the parent choose the Tutor-led track directly, regardless of score, if that's what they want).
1. A Tutor-led student's monthly re-assessment shows sustained improvement → BrightPath recommends stepping down to Hybrid, keeping the relationship (and the recurring revenue) rather than losing it.
1. A Hybrid or Self-directed student's assessment shows they're falling behind → BrightPath recommends stepping up to more tutor time.
1. A parent can also override the recommendation in either direction at any time — the system recommends, it doesn't force.

### 6.3 Why this matters commercially

- It turns your biggest retention risk (a successful outcome ending the relationship) into a retention mechanism.
- It decouples part of your growth from tutor-recruitment speed — Section 13.1 already flagged verified-tutor supply as your main early bottleneck; the Self-directed track can acquire and monetise users without touching that bottleneck at all.
- It creates a natural low-cost, low-commitment entry point (Section 13.4) — a parent unsure about committing to tutoring can start on the content tier and convert later, rather than bouncing off a high-commitment first offer.
- It adds a fourth, high-margin revenue line (a content/study-materials subscription, priced below the tutoring packages) without requiring a different sales motion — it's the same assessment funnel, routed differently.

### 6.4 Build sequencing — deliberately not Phase 1

A course/content library is a genuinely different kind of product from a tutoring marketplace — it needs its own content catalogue, versioning, and eventually a lightweight self-paced learning experience (progress through modules, quizzes, completion tracking). Building it before the tutoring core is solid would be exactly the kind of premature scope expansion this whole document is trying to prevent. The recommendation is to:

1. Design the routing logic and the learning_track field into the data model now (Section 9) — this costs almost nothing and prevents a schema change later.
1. Launch Phase 1 with Tutor-led only, using the original brief's 'teaching resources' bullet as a placeholder — a small, curated set of static materials (PDFs, past papers) attached to a subject, not a full content platform.
1. Build the proper Content/Course module and self-serve subscription in Phase 2–3, once assessment data exists to show real demand for the Self-directed track and which subjects/formats parents actually want.

---


## 7. User Journeys

Bringing together the roles, the hybrid delivery model (Section 5), and the three-track continuum (Section 6) into a single walkthrough of how each actor actually moves through BrightPath.


### 7.1 Parent — account holder and payer

Owns the relationship end-to-end; BrightPath is who they trust, not any individual tutor.

1. Discovers BrightPath (referral, WhatsApp/social content, school partnership).
1. Registers and books a baseline assessment for their child (paid or low-cost entry point, Section 13.4).
1. Receives a track recommendation from the assessment result: Tutor-led, Hybrid, or Self-directed (Section 6.2).
1. Chooses delivery mode if Tutor-led/Hybrid — online, in-person, or open to either — and a pricing mode (PAYG, package, or subscription).
1. Gets matched with a tutor (self-service browse or BrightPath-assisted, Section 13.2) — or, if Self-directed, is routed straight to the content library instead.
1. Ongoing use: tracks attendance, homework, and lesson reports; sees monthly progress vs. baseline on the dashboard; messages the tutor in-platform only.
1. Retention moment: as the child improves, the parent isn't lost — they're offered a step down to Hybrid or the content tier rather than the relationship simply ending (Section 6.3).
1. Renews, or upgrades/downgrades track, monthly; may later refer other parents or become a testimonial (your own '42%→84%' example).

### 7.2 Student — three parallel tracks under one profile

The learner's journey forks right after the baseline assessment, but all three paths live on the same profile, not three separate products.

- Tutor-led: assigned a matched tutor, attends scheduled lessons (online or in-person), builds a topic-by-topic history via lesson reports, re-assessed monthly.
- Hybrid: reduced tutor frequency plus self-directed materials for reinforcement — the natural landing zone for a student who has improved out of intensive tutoring.
- Self-directed: never assigned a tutor; accesses courses, practice sets, and self-assessments directly, with the platform still tracking their scores over time.
All three sit on the same learning_track field (Section 9), so a student can move between tracks as their assessment results change — BrightPath's job is to keep re-routing them correctly, not to lock them into their entry point.


### 7.3 Tutor — the service provider, supply side of the managed model

1. Applies via the recruitment page (personal details, qualifications, subjects, video introduction).
1. Progresses through verification tiers — ID, reference, interview, certification (Section 11.1) — only Tier 3+ can be assigned to younger children.
1. Completes training modules (teaching method, child psychology, lesson planning, reporting standards, assessment technique) and is certified.
1. Gets assigned students by BrightPath — not self-selected or self-priced — and sees their schedule, student profiles, and learning goals.
1. Delivers lessons (online via the platform's video SDK, or in-person, logged with delivery mode plus location or link, Section 5) and files a lesson report after every session.
1. Is rated by both parents and BrightPath; ratings feed a rolling quality score.
1. Is paid automatically via the ledger after BrightPath reviews the report — never negotiates or collects payment from the parent directly.
1. Can be flagged for review automatically if their quality score drops below threshold, independent of whether a parent has complained (Section 11.2).

### 7.4 Admin — BrightPath's own team, the control layer that makes 'managed' mean something

1. Approves or rejects tutor applications and tracks them through verification tiers.
1. Assigns or reassigns students to tutors — and can execute phone/WhatsApp-assisted bookings on a parent's behalf with full data integrity (Section 13.2).
1. Reviews lesson reports for quality before they finalise into the parent-facing dashboard.
1. Manages the ledger — payments in, payouts out, refunds, disputes — and monitors margin realised against target.
1. Handles disputes and complaints through the structured workflow: raised → investigated → resolved → linked to any refund.
1. Manages content for the Hybrid/Self-directed tiers (curating materials, not authoring lessons).
1. Monitors analytics — tutor supply by subject/location, match times, retention, revenue mix across the three tracks — and adjusts pricing rules or tenant configuration (e.g. onboarding a school partner) as the business scales.

### 7.5 School / Corporate Partner — a tenant-level actor, Phase 3

1. Signs a bulk contract with BrightPath (per-student or per-programme pricing).
1. Its students flow through the same assessment → track → tutor/content journey as individual parents' children — just billed to the institution rather than a parent (Section 9's tenant structure).
1. A designated coordinator role (enabled by the RBAC design, not a new schema) gets aggregate progress reporting across their cohort — the analytics layer this document flags as BrightPath's long-term, highest-margin channel.

---


## 8. Product Architecture: Designed to Avoid Late Bolt-Ons

The original brief's structure (Homepage → Parent Portal → Tutor Portal → Admin Dashboard) is the right shape for a v1 site map, but underneath it needs to be built as a set of modular services rather than one monolithic 'features list', so that each capability can grow independently. The principle below should be a standing engineering rule, not a one-time decision.


### 8.1 Core design principles

1. API-first: the web app, parent/tutor mobile apps, and any future school-partner portal all consume the same backend API. Nothing is built as a web-only feature that later needs duplicating for mobile.
1. Role-based access control (RBAC), not hard-coded roles: Admin/Parent/Tutor are the first three roles, but the permissions system should be table-driven so a fourth role (e.g. School Coordinator, Franchise Manager) can be added by configuration, not by code change.
1. Ledger, not a payments table: every financial event (charge, hold, payout, refund, dispute adjustment) is an immutable ledger entry. Balances are always derived, never stored as a single mutable number — this is what allows disputes, part-refunds and multi-currency later without a rebuild.
1. Notification abstraction: one internal 'notify' service with pluggable channels (SMS, WhatsApp Business API, email, push). Every feature that needs to notify someone calls this service — no feature should ever call an SMS provider directly.
1. Assessment engine as its own module: a versioned bank of questions/rubrics per subject, so 'before vs current score' is a query over structured results, not a manually-entered number — this is also what your Phase 3 AI features will need as training data.
1. Multi-tenant-ready from day one: every core table carries an organisation/tenant reference, defaulting to a single 'BrightPath Direct' tenant for individual parents, so a future school-partner tenant is a new row, not a new schema.
1. Audit log on every state change to a lesson, payment, or tutor status — required for dispute resolution and, eventually, for any data-protection compliance obligations.

### 8.2 Site structure (refined from the original)

- Public site: Home, How it Works, Find a Tutor, Become a Tutor, Pricing, Success Stories, Trust & Safety, Blog/Resources.
- Parent Portal: Dashboard, My Students, Book/Request a Tutor, Progress & Reports, Messages, Payments & Plan, Support.
- Tutor Portal: Dashboard, My Schedule, My Students, Lesson Report Form, Training & Certification, Earnings & Payouts, Ratings, Support.
- Admin Console: Tutor Recruitment Pipeline, Parent & Student Management, Matching/Assignment, Lesson & Quality Review, Payments & Payouts Ledger, Disputes & Complaints, Content & Training Management, Analytics, Configuration (pricing rules, commission tiers, tenants).

---


## 9. Refined Data Model

This keeps every entity from your original brief but resolves the gaps identified in Section 3: pricing plans, a proper ledger, disputes, multi-tenancy, and a structured assessment system.

| **Entity** | **Key fields (illustrative, not exhaustive)** | **What's new vs. the original brief** |
| --- | --- | --- |
| Tenant | tenant_id, name, type (direct / school / corporate), billing_terms | New — enables B2B without a schema change |
| User | user_id, tenant_id, role_id, name, email, phone, password_hash, verification_status | role is now a foreign key to a Role table, not a fixed enum |
| Role / Permission | role_id, name, permissions[] | New — configurable RBAC |
| TutorProfile | user_id, subjects[], qualifications, availability, verification_tier, in_person_eligible, online_eligible, service_radius_km, rating, reliability_score, bio, video_intro_url | Verification is now a tier, not a single approve/reject flag; in-person and online eligibility are separate, independently-revocable flags (Section 11.2); reliability_score is tracked separately from teaching rating (Section 12.4) |
| StudentProfile | student_id, parent_id, school, class, learning_goals, learning_challenges, learning_track (tutor_led / hybrid / self_directed) | Adds learning_track — the field that drives routing across the three-track continuum (Section 6) |
| PricingPlan | plan_id, tenant_id, type (PAYG / package / subscription / content_subscription), rate, session_count, validity | New — this is the fix for the single-price-field problem; content_subscription supports the Self-directed track |
| Lesson | lesson_id, tutor_id, student_id, subject_id, plan_id, date, duration, status, delivery_mode (online / in_person), location_or_link | Now references a pricing plan, not a bare price, and records delivery mode per lesson (Section 5) |
| LessonExecution | lesson_id, scheduled_start, scheduled_end, actual_start, actual_end, check_in_geo, check_out_geo, delivered_duration, geofence_status | New — the objective, automatically-captured record of what actually happened, separate from the self-reported LessonReport (Section 12) |
| Content / Course | content_id, subject_id, type (video / pdf / quiz / practice_set), title, level, version | New — supports the Hybrid and Self-directed tracks (Section 6) without touching the tutoring core |
| ContentProgress | student_id, content_id, status, score, completed_at | New — tracks self-directed engagement the same way LessonReport tracks tutor-led progress |
| LessonReport | lesson_id, topics_covered, strengths, weaknesses, homework, participation, next_topic | Unchanged in spirit; now versionable/auditable |
| Assessment | assessment_id, student_id, subject_id, type (baseline/monthly), question_set_version, score, taken_at | New structure — replaces a narrative 'before vs current' with queryable, versioned records |
| LedgerEntry | entry_id, tenant_id, account_ref, type (charge/hold/payout/refund/adjustment), amount, currency, related_lesson_id, status | Replaces the flat Payments table — supports refunds, disputes, multi-currency |
| Dispute | dispute_id, raised_by, related_lesson_id, related_ledger_entry_id, status, resolution, resolved_by | New — gives 'view complaints' an actual data model |
| Notification | notification_id, user_id, channel, template, status, sent_at | New — supports the channel-abstraction principle in 5.1 |
| TrainingModule / TrainingProgress | module_id, tutor_id, quiz_score, completion_status, certified_at | Kept from the original, lightly normalised |
| AuditLog | log_id, entity, entity_id, action, actor_id, timestamp, diff | New — required for disputes and future compliance |


---


## 10. Technology Stack

The original recommendation was sound and is largely kept, with adjustments for Nigeria-specific reliability and the architecture principles in Section 8.

| **Layer** | **Recommendation** | **Note** |
| --- | --- | --- |
| Frontend (web) | Next.js (React) | Server-rendering improves performance on slower mobile connections, common on Nigerian mobile networks |
| Mobile | React Native (Phase 3) | Shares logic with the web frontend if both consume the same API |
| Backend | Node.js — NestJS | NestJS's modular structure maps directly onto the modular services described in Section 8 |
| Database | PostgreSQL | Kept — strong fit for relational, ledger-style data |
| Cache / queue | Redis | Added — needed for notification queues and matching/search performance as tutor volume grows |
| Auth | JWT + RBAC (table-driven roles) | Kept, refined per Section 8.1 |
| File storage | AWS S3 (or Cloudinary for media-specific transforms) | Kept |
| Payments | Paystack and Flutterwave | Both support card, bank transfer, and USSD — important given the trust barrier discussed in Section 2 |
| Notifications | Email + SMS + WhatsApp Business API | WhatsApp added explicitly — the dominant messaging channel for Nigerian parents |
| Video (for online lessons) | Third-party SDK (e.g. Agora, Twilio, or Google Meet embed) rather than building conferencing in-house | Added — the original brief didn't specify how 'online lessons' are actually delivered |
| Hosting | Vercel (frontend) + Railway/Render/AWS (backend) | Kept, as originally recommended |
| Analytics/BI | Metabase or a lightweight BI layer on Postgres | Added — admin analytics and future school-reporting will need this earlier than Phase 3 |


---


## 11. Trust & Safety Framework

Because tutors interact directly with children — in the home or one-to-one online — trust and safety is the actual product, not a supporting feature. This expands the original brief's single 'screened tutors' bullet into a defined process.


### 11.1 Tutor verification tiers

- Tier 1 — Basic: government ID verification, phone/email verification, application form and subject/qualification evidence.
- Tier 2 — Referenced: at least one guarantor or professional reference contacted and confirmed by BrightPath staff.
- Tier 3 — Interviewed: video or in-person interview assessing both subject competence and child-safety awareness.
- Tier 4 — Certified: completion of the training modules (kept from the original brief) with a passing quiz score, resulting in a visible certification badge on the tutor's profile.
Only Tier 3+ tutors should be eligible for assignment to students under a defined age threshold (e.g. under 13) — this is a configuration rule in the matching engine, not a manual check.


### 11.2 Ongoing safeguards

- All communication between parent and tutor happens inside the platform (kept from the original brief) — no personal phone numbers are exchanged, which also gives BrightPath an auditable record for any dispute.
- Every lesson report and rating feeds a rolling tutor quality score; a defined score threshold automatically flags a tutor for admin review rather than requiring a parent complaint to trigger review.
- A structured Dispute entity (Section 9) ensures every complaint has a lifecycle — raised, investigated, resolved, linked to any refund — rather than existing only as a support inbox item.
- In-home safety protocol for in-person lessons (Section 5): the first in-person lesson with a new student is logged as parent-present by default; a tutor's in-person eligibility is a distinct, separately-revocable flag from their online eligibility, so an incident in one mode does not require guessing at the other; and lesson location/duration is always recorded, giving BrightPath and the parent a verifiable record of exactly where and when a child was with a tutor.

---


## 12. Live Monitoring & Accountability System

A lesson report (Section 9) captures what was taught. It does not, on its own, prove a lesson happened at the right time, in the right place, for the full duration. This section adds that missing layer — an objective, automatically-captured record of the mechanics of every session, modelled on how ride-hailing platforms track and verify a trip rather than relying on a driver's word. It exists to make two promises credible at once: a parent can trust their child is where they should be, and a tutor is protected from being shorted on pay or falsely accused, because the record isn't self-declared by either party.


### 12.1 The core design decision: separate 'what was taught' from 'what actually happened'

A new entity, LessonExecution, sits alongside LessonReport for every lesson. Where the report is written by the tutor and reviewed by BrightPath, the execution record is captured automatically at the moment it happens and cannot be edited after the fact — this is what makes it trustworthy evidence rather than another form to fill in.

| **Field** | **Captured how** | **Purpose** |
| --- | --- | --- |
| scheduled_start / scheduled_end | Set at booking | The baseline every actual session is measured against |
| actual_start / actual_end | Tutor taps Check In / Check Out; not typed in manually | Objective start/end time, independent of the lesson report |
| check_in_geo / check_out_geo | Device GPS, for in-person lessons only | Confirms the lesson happened at the registered address |
| session_join_event / session_leave_event | Emitted by the video SDK, for online lessons | The online equivalent of a geo check-in/out |
| delivered_duration | Computed (actual_end − actual_start) | Basis for payout and any refund — not the scheduled slot |
| geofence_status | Computed against the student's registered address radius | Flags a check-in outside the expected location |


### 12.2 What this looks like for each actor

- Parent dashboard: a live "Tutor checked in at 4:02pm" notification when a scheduled lesson begins, and a per-lesson record afterwards showing scheduled vs. actual time and (for in-person) that check-in occurred at the registered address — this is the concrete mechanism behind "they can track everything."
- Tutor app: the same check-in/check-out flow, plus visibility into their own punctuality and reliability figures — so the record reads as proof of their own delivered time and protection against a false complaint, not one-directional surveillance.
- Admin console: a live view of in-progress sessions, automatic flags for late starts, early ends, or geofence mismatches, and the reliability score feeding tutor review (Section 12.4).

### 12.3 SOS and safety escalation

An SOS control is available in both the parent and tutor apps for the duration of an active, checked-in lesson. Triggering it creates a timestamped, geo-tagged incident tied to that specific LessonExecution record and alerts BrightPath admin immediately — this reuses the same check-in infrastructure rather than being a separate system, so there is no ambiguity about which lesson, tutor, and location an SOS relates to.


### 12.4 Reliability scoring — separate from teaching quality

Tutor quality today is rated on teaching (Section 8, ratings) — this adds a second, independently-tracked reliability score computed from objective session data: punctuality (variance between scheduled and actual start), completion (variance between scheduled and delivered duration), and location integrity (geofence match rate for in-person lessons). A tutor dropping below a defined threshold is automatically routed to admin review, the same pattern already used for the ratings-based quality flag in Section 11.2 — a parent should never have to be the one to notice and report a pattern of lateness or short sessions.


### 12.5 A deliberate limit, stated up front

Continuous or off-session tracking is not part of this design, and that is intentional. Location and session tracking are active only within a scheduled, checked-in lesson window. Gig-economy platforms that over-extend monitoring into continuous surveillance generate exactly the kind of tutor mistrust and regulatory attention Varsity Tutors itself flags as a cost risk in its own public disclosures (Section 2.2). Scoping this tightly to the lesson window is what keeps the system reading as accountability infrastructure that protects both sides, rather than surveillance of the tutor's life outside it.


### 12.6 Data model and roadmap implications

- New entities: LessonExecution (Section 9) and a reliability_score field on TutorProfile.
- New notification triggers: check-in confirmation to parent, late-start alert to admin, SOS alert to admin (routed through the existing notification abstraction, Section 8.1).
- Phase 1: build the check-in/check-out mechanic itself (it is simple — a timestamp and a GPS or session-join event) alongside core lesson scheduling; do not treat it as a later add-on, since retrofitting it means back-filling trust for every lesson delivered before it existed.
- Phase 2: build the reliability-scoring and automatic-flagging layer once there is enough real session data to set sensible thresholds — scoring on day-one data with no baseline would produce noisy, unfair flags.

## 13. Go-to-Market Strategy for Nigeria


### 13.1 Sequencing supply before demand

Given the two-sided nature of the business, recruit and verify an initial tutor pool in your launch city and priority subjects (core academic subjects: Mathematics, English, and the sciences, matching WASSCE/NECO/JAMB relevance) before spending on parent acquisition. A realistic target is enough Tier 2+ tutors per subject/area to guarantee a match within 48 hours of a parent request.


### 13.2 Assisted onboarding, not pure self-service

Section 2 showed that even an established competitor needed phone-assisted booking for a large share of early users. Budget for a small operations team handling WhatsApp/phone enquiries from day one, and make sure the admin console lets staff create a booking on a parent's behalf with full data integrity — this should not be a workaround outside the system.


### 13.3 Early acquisition channels

- School-adjacent channels: partnerships with a small number of private schools for after-school/exam-prep referrals — this also seeds your eventual B2B channel (Section 4.3).
- Referral incentive for parents once the first cohort has demonstrable score improvements (the 'before/after' dashboard is your best acquisition asset — use it in testimonials, as the original brief already anticipated).
- WhatsApp and Instagram community content aimed at parents (exam-prep tips, free assessments) rather than paid search as the first channel, given lower cost and higher trust in a market where personal recommendation carries weight.

### 13.4 Pricing entry point

Offer a low-commitment entry point — a single paid diagnostic assessment or a short trial package — before asking parents to commit to a monthly subscription. This mirrors the 'budget optimisation' lesson from Tuteria's own experience (Section 2.1): affordability filtering and low-friction entry points matter more in this market than in the US/UK reference models.


---


## 14. Phased Development Roadmap

The original three-phase structure was directionally right. It is refined below into four phases with the architectural principles from Section 8 built in from Phase 1, so nothing here requires a rebuild later — only additive work.


### Phase 1 — MVP (Target: ~3–4 months)

- Parent & tutor registration, role-based auth (RBAC from day one, even with only 3 roles active)
- Tutor recruitment pipeline through Tier 2 verification (ID + reference)
- Student profiles, baseline assessment (structured Assessment entity, not a free-text score)
- Manual-assisted + self-service tutor assignment, matching on subject, availability, and location for in-person requests (Section 5)
- learning_track field and baseline-assessment-driven track recommendation live from day one, even though only the Tutor-led track is fully built in Phase 1 (Section 6.4)
- Pricing engine supporting PAYG and Package modes (subscription and content_subscription can wait; the plan structure should already exist)
- Lesson scheduling with delivery mode (online/in-person) and the lesson report form
- Check-in / check-out mechanic and the LessonExecution record (Section 12.1) — built alongside scheduling, not added later
- Ledger-based payments via Paystack/Flutterwave (card, transfer, USSD), tutor payouts
- Parent dashboard: assigned tutor, upcoming lessons, attendance, homework, baseline vs. latest score
- Admin console: tutor approval, student assignment, ledger and payout view, basic dispute log
- Notification service live with at least SMS + email (WhatsApp can follow immediately after if API approval is pending)

### Phase 2 — Trust, Retention & Insight (Target: +2–3 months)

- Tier 3–4 tutor verification (interview + certification) and the full Tutor Training Portal (kept from the original brief)
- Subscription pricing mode activated; monthly assessment cadence and growth-percentage reporting
- In-app messaging (parent↔tutor, tutor↔admin, admin↔parent)
- WhatsApp notifications, automated monthly performance report generation
- Tutor rating system (parent-rated + BrightPath-rated, feeding the quality-score flagging described in Section 11.2)
- Reliability scoring and automatic punctuality/geofence flagging, built on Phase 1 LessonExecution data (Section 12.4)
- SOS escalation flow live in both parent and tutor apps (Section 12.3)
- Content/Course module (Section 6.4): curated study materials by subject, laying the foundation for the Hybrid and Self-directed tracks
- Admin analytics: revenue, tutor ratings, lesson completion, growth

### Phase 3 — Scale & Channels (Target: +3–4 months)

- Mobile apps (parent and tutor) on the same API as the web app
- Self-directed track fully launched: content_subscription pricing, self-paced progress tracking, and automatic track-recommendation on re-assessment (Section 6.2)
- Multi-tenant activation: first school/corporate pilot account
- Referral and affordability-tiered pricing tools for growth
- Automated invoicing and payout runs
- Structured dispute resolution workflow with SLA tracking

### Phase 4 — AI-Assisted Features (Target: ongoing, from Year 2)

- Weak-topic identification and automatic revision plans, built on the Assessment module's structured history — not retrofitted onto free-text scores
- AI-assisted lesson planning and parent report drafting (human-reviewed before sending, given accuracy and trust stakes)
- Tutor-performance benchmarking and matching-quality improvements
- Performance prediction, feeding into the B2B/school analytics offering (mirroring Varsity Tutors' district-analytics revenue line, Section 2.2)

---


## 15. Key Risks & Mitigations

| **Risk** | **Mitigation** |
| --- | --- |
| Payment trust / preference for cash or phone-based booking | USSD + bank transfer support from day one; admin-assisted booking flow with full data parity (Section 13.2) |
| Tutor supply-demand imbalance at launch | Recruit and verify tutor pool ahead of parent-facing marketing (Section 13.1) |
| Direct, established competitor (Tuteria) with marketplace pricing flexibility | Compete on managed-quality and measurable-progress positioning rather than price or catalogue breadth (Section 4.1) |
| Affordability pressure / macroeconomic volatility in Nigeria | Multiple pricing modes and an affordability-filtering entry point (Section 13.4); avoid single high-commitment pricing |
| Child-safety incidents | Tiered verification, in-platform-only communication, auditable dispute workflow (Section 11) |
| Feature creep forcing rebuilds | Architectural principles in Section 8.1 (ledger, RBAC, multi-tenancy, notification abstraction) adopted before Phase 1 development starts |
| Over-reliance on a single payment processor | Dual-integrate Paystack and Flutterwave from Phase 1 rather than single-vendor lock-in |


## 16. Key Metrics to Track from Day One

- Tutor-side: verified tutor supply by subject/location, time-to-first-assignment, tutor quality score distribution, tutor churn
- Parent-side: time-to-match, session completion rate, month-2 retention, average score improvement (baseline vs. latest assessment)
- Business: gross booking value, BrightPath margin realised vs. target, subscription mix vs. pay-as-you-go, dispute rate, refund rate
- Ops: share of bookings requiring phone/WhatsApp assistance (track this deliberately — a falling share over time is a sign of growing platform trust, per the Tuteria precedent in Section 2.1)
- Trust & accountability: average punctuality variance, geofence match rate, SOS incident count and resolution time, share of tutors flagged by reliability score vs. by parent complaint (a rising share caught by the score before a complaint is the intended outcome of Section 12)

## 17. Conclusion

Your original instinct — a business that owns the relationship, trains and pays tutors, and gives parents measurable, evidenced progress — is the right one, and BrightPath, built this way, is a genuine point of difference from Nigeria's existing marketplace-model competitor. The changes in this document do not alter that vision; they resolve the specific structural ambiguities (pricing, payments, multi-tenancy, disputes, assessments) that would otherwise force you to rebuild core systems six to twelve months after launch. Building the ledger, RBAC, pricing-plan, and assessment structures correctly in Phase 1 costs relatively little extra time now, and is the difference between a platform that can add subscriptions, school contracts, and AI features as clean extensions later, versus one that needs to be re-architected to fit them.

