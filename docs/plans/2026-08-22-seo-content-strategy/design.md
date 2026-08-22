# SEO Content Strategy: Persona & Content Pillars

## Context

15 of 17 published blog posts already fall under the "Agency Ops" category, but the
niche and audience were never formally defined, posts were queued day-by-day without
a persona or pillar structure behind them. This document defines the target persona,
maps existing content against real pain points, and lays out a pillar/cluster
architecture to guide what gets queued next.

This is a content-planning layer on top of the existing site architecture. It does
not require any code changes (`lib/blog.ts`, `getRelatedPosts()`, categories, and the
SEO metadata pattern documented in the `automatoro-seo` skill are unaffected).

## Persona

**Primary: "Maya," Agency Owner/Founder**
- Runs a marketing agency, 20-50 employees, roughly $3M-$12M revenue
- Still involved in client work but increasingly buried in operations
- Stack: ClickUp for project/task management, Airtable as a secondary database
  (client records, campaign data), scattered point tools; no dedicated ops/RevOps
  hire yet
- Has tried native automations (ClickUp automations, Zapier) and hit their ceiling.
  Not anti-automation, anti-*fragile* automation
- Measures success in billable hours protected and client churn avoided, not
  "efficiency" as an abstract goal

**Secondary: "Deja," Ops/Delivery Manager**
- Reports to Maya (or a partner), owns the day-to-day pain most directly (missed
  handoffs, approval delays, onboarding chaos)
- Needs to build the business case upward with numbers (time lost, cost of errors),
  not just vision
- Often the one searching for a fix right after something breaks

**Shared trigger moment:** something just broke past a scaling threshold. A
client-facing deliverable slipped from a manual handoff, a new hire made an error a
system should have caught, or month-end reporting took two days of copy-pasting
again. They search for the specific broken thing, not "automation" as a category.

**Core belief the content reinforces:** the fix isn't "hire more people" and isn't
"hand it all to AI." It's fixing the process with a human still approving anything
client-facing, matching Automatoro's existing positioning in `public/llms.txt`.

## Pain-Point → Solution Map

| Pain point | Root cause | Automatoro's solution angle |
|---|---|---|
| Re-explaining the same client info to two systems | ClickUp and Airtable don't stay in sync | Tool integration / data sync |
| Something slipped through review and reached the client wrong | No trackable handoff between "ready for review" and "approved" | Human-in-the-loop approval automation |
| Onboarding a new client takes a full day of setup from scratch | No repeatable onboarding workflow | Custom workflow adapters |
| Month-end reporting is two days of copy-paste | Reporting built by hand each cycle, not from a system | Automated reporting workflows |
| Keep hiring to keep up, chaos doesn't go down | Headcount treated as the fix for a process problem | The "hiring trap" argument |
| Tried Zapier/native automations, they broke or didn't fit | Off-the-shelf automation doesn't match a custom process | Custom-built vs. templated automation |
| Don't trust AI to talk to clients directly | Fear of full automation on client-facing work | Human-in-the-loop as the explicit alternative to full autonomy |

## Content Pillars

Five pillars emerge from the existing 17 posts. One post per pillar is designated the
**pillar post** (most comprehensive, links out to the rest); other posts are cluster
posts linking back to it, using the site's existing inline-anchor internal-linking
convention (see `automatoro-seo` skill).

**Pillar 1 — Client Approval & Review Workflows** (4 posts)
- Pillar post: `why-client-approval-bottlenecks-cost-agencies-billable-hours`
- Cluster: `what-to-automate-first-client-approvals-in-clickup`,
  `cut-review-round-turnaround-without-losing-quality-control`,
  `why-agencies-shouldnt-fully-automate-client-facing-work`

**Pillar 2 — Tool Stack & Data Sync (ClickUp + Airtable)** (4 posts)
- Pillar post: `clickup-airtable-agency-stack-nobody-talks-about-replacing`
- Cluster: `airtable-as-client-database-where-agencies-hit-a-ceiling`,
  `how-much-time-lost-copy-pasting-clickup-airtable`,
  `what-tools-do-marketing-agencies-use-besides-clickup-airtable`

**Pillar 3 — Scaling Without Headcount** (3 posts)
- Pillar post: `the-hiring-trap-why-headcount-wont-fix-a-broken-process`
- Cluster: `what-breaks-first-marketing-agency-scales-past-10-clients`,
  `should-your-agency-build-automation-in-house-or-hire-it-out`

**Pillar 4 — Client Onboarding & Delivery Handoffs** (3 posts, thinnest)
- Pillar post: `onboarding-new-clients-without-the-spreadsheet-chaos`
- Cluster: `real-cost-of-manual-campaign-reporting-for-agencies`,
  `content-calendar-handoff-breaking-agency-delivery`

**Pillar 5 — Automation Philosophy** (3 posts, the belief system, not a pain point)
- Pillar post: `automating-the-boring-80-percent-agency-ops-framework`
- Cluster: `human-in-the-loop-automation-explained`,
  `clickup-automations-vs-custom-workflow-adapters`

Pillar 5 should get the most inter-pillar linking, every pillar 1-4 post should link
into it at least once, since it's the credibility layer underneath the pain-point
content and `getRelatedPosts()`'s category matching won't surface it automatically.

## Next Topics for the Queue

Next open publish date is `2026-09-05` (last scheduled date is `2026-09-04`). Priority
order, chosen to close the Pillar 4 gap first:

1. **Pillar 4** — "The client offboarding checklist agencies skip"
2. **Pillar 3** — "The ops hire agencies make too early (and what to fix first)"
3. **Pillar 4** — "Campaign reporting cadence: what to automate vs. what a client actually reads"
4. **Pillar 1** — "Multi-stakeholder approvals: when three people have to sign off before a client sees it"
5. **Pillar 2** — "Signs your ClickUp + Airtable sync is about to break"

This brings Pillar 4 from 3 to 5 posts and gives every pillar at least 4.

## Internal Linking Rules (extends existing convention)

- Every new post links to its pillar post using the descriptive-anchor convention
  already documented in the `automatoro-seo` skill
- Every pillar post gets a link into Pillar 5 (Automation Philosophy) somewhere in
  its body
- No new component or code change, hand-written-link discipline only

## Out of Scope

- No changes to `lib/blog.ts`, categories, or SEO metadata patterns
- No competitor/keyword research (separate future exercise if needed)
- No broadening beyond the marketing-agency niche (confirmed in scope discussion)
