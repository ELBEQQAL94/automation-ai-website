@AGENTS.md

# Automatoro Website — Rules for Claude

## Domain
Production domain: `https://www.automatoro.com`

## Content Persona / Target Audience
Blog content targets marketing agencies, 20-50 employees, running on ClickUp +
Airtable with no dedicated ops/RevOps hire yet. Primary reader is the agency
owner/founder ("Maya"), secondary is the ops/delivery manager ("Deja") who needs
numbers to justify a fix upward. Readers arrive after something just broke past a
scaling threshold (a slipped approval, a hiring-doesn't-fix-it moment, a two-day
manual reporting cycle), not while browsing "automation" as a category. Content
should reinforce Automatoro's core belief: the fix is neither "hire more people" nor
"hand it to AI fully autonomously," it's fixing the process with a human still
approving anything client-facing.

New blog topics should map to one of five content pillars (full detail, pain-point
map, and per-pillar post lists in `docs/plans/2026-08-22-seo-content-strategy/design.md`):
1. Client Approval & Review Workflows
2. Tool Stack & Data Sync (ClickUp + Airtable)
3. Scaling Without Headcount
4. Client Onboarding & Delivery Handoffs (currently thinnest, prioritize here)
5. Automation Philosophy (the belief-system hub; every pillar 1-4 post should link
   into it at least once, this doesn't happen automatically via `getRelatedPosts()`)

## Blog Publishing Schedule
New blog posts (`content/blog/*.mdx`) publish at most **1 per day**. A post's `date` frontmatter field controls when it goes live - `lib/blog.ts`'s `isPublished()` hides any post whose `date` is in the future, so you can create/write a post any time without it appearing early.

When adding a new post: find the latest `date` already used across all posts, and assign the next day after it. Never assign a `date` that already has a post on it.

## LLM Reference Files (llms.txt / llms-full.txt)
`public/llms.txt` and `public/llms-full.txt` are static files, not auto-generated - they go stale unless updated by hand. Update them whenever:

- **A new blog post is published**: add its full text (title as `# heading`, then `Category:`/`Date:`/`Author:`/`URL:` lines, then the summary, then the full body) to `public/llms-full.txt`, newest post first (right after the header section, before the previously-first post).
- **A new standalone page is added**: add it as a bullet under `## Key Resources` in `public/llms.txt` and `public/llms-full.txt`.

## Blog Cover Images
The engineer drops raw cover images into `public/blog/images/` directly - don't ask them to hand you the file.

1. Raw jpg/jpeg/png cover images go in `public/blog/images/`, named `<post-slug>.jpeg` (or `.png`) - `<post-slug>` must exactly match the post's filename in `content/blog/<post-slug>.mdx`.
2. When a raw image appears there, link it: check `public/blog/images/` for files not yet referenced by any post's `coverImage`, match each to its post by filename/slug, and set that post's frontmatter `coverImage` to `/blog/images/<post-slug>.webp` (note: `.webp`, even though the file on disk is still `.jpeg`/`.png` at this point). Update `coverImageAlt` too if it's still generic/placeholder text. If a filename doesn't cleanly match any post slug, ask which post it belongs to rather than guessing.
3. Don't touch the raw file or run the conversion yourself - ask the engineer to run: `node scripts/convert-to-webp.mjs public/blog/images --replace` (`--replace` deletes the raw file once the `.webp` exists).

## Running Commands
Always ask the engineer to run verification commands themselves - do not run `tsc`, `npm run dev`, `npm run lint`, `npm run build`, `npm install`/`npm i` (or any other package install command), or any other terminal commands automatically. Present the command and ask the engineer to run it and share the output.
