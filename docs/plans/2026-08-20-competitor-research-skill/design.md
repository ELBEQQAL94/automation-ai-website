# Competitor Research Skill — Design

## Purpose

A skill that researches competitors for a given niche/business: who else is doing
the same thing, what niche they target, what services they offer, what they're
currently working on, and how they position themselves. Generic and reusable
across Automatoro and future demo projects, not hardcoded to any one business.

## Location & trigger

- Global skill at `~/.claude/skills/competitor-research/` (same tier as
  `youtube-audit` — not project-scoped like `automatoro-seo`, since it needs to
  work for any niche/client, not just Automatoro).
- Manually triggered by explicit request ("research competitors for X",
  "who else is doing this", "competitor analysis on..."). Not an auto-fire
  skill — competitor research is a deliberate action, not something that
  should interrupt other work based on keyword matching.

## Inputs

| Input | Required | Notes |
|---|---|---|
| `niche` | No | The business/industry to find competitors for. If omitted and run inside a project Claude can read (e.g. this repo's `/services`, `/about` pages), infer it from there. If omitted and no project context exists, ask. |
| own business description | No | Auto-derived from the current project when available (used for the gaps/opportunities section). Skipped if unavailable — the skill still produces a competitor report without it. |
| `count` (N) | No | How many competitors to deep-dive. Default 5. |

## Flow

### Phase 1 — Discovery

- Run a handful of varied `WebSearch` queries against the niche (e.g.
  "[niche] agency", "[niche] services company", "best [niche] companies") to
  avoid any single query's blind spots.
- For each hit, capture only: name, URL, one-line blurb from the search
  snippet. No fetching yet — this phase stays cheap.
- Dedupe by domain. Filter out non-competitors (directories, listicles,
  marketplaces, the user's own site if it surfaces).
- Rank the rest by relevance to the niche, **preferring visible recent
  activity** (recent blog posts, news mentions, updated site content) over
  competitors that look dormant.
- Auto-select the top N — no confirmation pause before deep-dive.

### Phase 2 — Deep-dive (parallel agents)

- Spawn one research agent per selected competitor, all in parallel (`Agent`
  tool, read-only research: `WebSearch` + `WebFetch`, no code tools).
- Each agent receives: competitor name/URL, the niche, and instructions to
  fetch the competitor's site (services/about/pricing pages where
  discoverable) plus targeted searches for recent activity, then report back
  a structured block (not prose) covering:
  - **Niche & target market** — who they sell to (industries, company size,
    geography)
  - **Services & offerings** — concrete service lines/packages, tools or
    integrations they specialize in
  - **Current focus / recent activity** — recent posts, case studies,
    launches, LinkedIn/news signals of what they're pushing right now, plus
    an explicit **activity status**: active / slowing / dormant, based on how
    recent and frequent their public signals are
  - **Positioning & messaging** — stated value prop, differentiators, pricing
    model if public
- The skill waits for all N agents to return before synthesizing.

### Phase 3 — Synthesis

Merge all deep-dive results into one report:

- **Summary table** — one row per competitor: name, niche/target market, core
  services, headline positioning, activity status (flagging dormant ones
  clearly, e.g. "⚠ dormant — no public activity in 6+ months" or similar
  plain-text flag).
- **Per-competitor sections** — full four-point breakdown in readable
  bullets/prose.
- **Gaps & opportunities** — only when an own-business description is
  available: services competitors offer that we don't, niches they target
  that we don't, messaging angles we're not using. Reports observations, does
  not prescribe strategy.

### Output

1. Markdown file at `docs/competitor-research/<niche-slug>-<date>.md` in the
   current project (directory created if missing) — the durable record.
2. The same content published as an Artifact (loads `artifact-design` first,
   since report shape/length varies with N each run).

## File structure

```
~/.claude/skills/competitor-research/
  SKILL.md    # inputs, discovery strategy, deep-dive agent prompt template,
              # synthesis/report template, output steps
```

No reference files needed — unlike `youtube-audit`'s fixed benchmark data,
this is a search-and-synthesize task with no scoring rubric to load.

## Out of scope

- No paid data APIs (DataForSEO etc.) — `WebSearch`/`WebFetch` only.
- No interactive confirmation step between discovery and deep-dive.
- No strategy recommendations — reports what's out there, not what to do
  about it.
