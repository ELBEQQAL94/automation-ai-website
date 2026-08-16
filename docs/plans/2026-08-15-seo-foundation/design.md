# Automatoro SEO Foundation + Content Engine

Design doc from a brainstorming session on 2026-08-15. Goal: bring
automation-ai-website (currently a single-page brochure site) up to the
same SEO maturity as the MoneyFlow web app - technical foundation first,
then a blog content engine, built together in one pass.

## Context

- Current state: one route (`app/page.tsx`) with anchor-link sections
  (Hero, Problem, Solution `#solution`, Benefits `#benefits`, Demo
  `#demo`, Contact `#contact`), a `ContactForm`, and a footer. No
  metadata helper, no sitemap, no robots.txt, no JSON-LD, no blog.
  `public/` still has the default Next.js placeholder SVGs; `design/`
  has unused candidate logo/graphic assets not wired into the site.
- Business type: Automatoro is a solo/early-stage automation
  **service/consultancy** (not a downloadable app or SaaS product), no
  LLC formed yet. This rules out `SoftwareApplication` JSON-LD (what
  MoneyFlow uses) in favor of `Organization` + `ProfessionalService`.
- Domain: `https://www.automatoro.com`
- Reference implementation: `money-flow-web`'s SEO setup (see its
  `moneyflow-seo` skill) - this design ports that pattern, adjusted for
  a services site instead of an app.

## 1. Route structure

Split the one-pager into real indexable routes:

- `/` - trimmed hero, problem, and benefits sections
- `/services` - expands the current `#solution` "Our Framework" content
  (Tool Connectivity, Human-in-the-Loop, Seamless Fit) into a full page
- `/about` - new content; Automatoro framed honestly as a solo/early-stage
  service (no "founded in", no team-size or LLC claims)
- `/contact` - the current `#contact` section (ContactForm) as its own
  page

The demo CTA (`DEMO_LINK` → task-router-pi.vercel.app) and footer stay
as-is, just re-pointed at the new routes instead of anchors where
relevant.

## 2. Metadata foundation

Add `lib/seo.ts` mirroring MoneyFlow's:

```ts
export const SITE_URL = "https://www.automatoro.com";

export function buildPageMetadata({ title, description, path, ogTitle?, ogDescription? }): Metadata
```

Every route builds its `Metadata` through this helper instead of
declaring `openGraph`/`twitter` inline, for the same reason MoneyFlow
does it: Next.js does not deep-merge `openGraph`/`twitter` across route
segments, so a page-level `openGraph` object silently drops the root
layout's OG image otherwise.

## 3. OG image

No final logo is picked yet. Rather than block on that, add a dynamic
`app/opengraph-image.tsx` using Next's `ImageResponse` (same pattern as
MoneyFlow's `app/opengraph-image.tsx`): the existing `BotIcon` mark +
"Automatoro" wordmark + tagline, on the site's existing `primary`/
`surface` design tokens. Swappable for a real logo later without
touching any page's metadata.

## 4. Sitemap & robots

- `app/sitemap.ts`: static routes (`/`, `/services`, `/about`,
  `/contact`) merged with dynamic blog routes from `getAllPosts()` -
  same merge pattern as MoneyFlow's, blog routes generated automatically.
- `app/robots.ts`: allow all crawlers, point at the sitemap.

## 5. JSON-LD strategy

- **Site-wide** (`app/layout.tsx`): `Organization` (+ `WebSite`) -
  once, inherited everywhere, same as MoneyFlow's layout-level
  Organization/WebSite/Person block.
- **`/services`**: `ProfessionalService` with an `Offer` /
  `hasOfferCatalog` listing the automation offerings (tool integrations,
  human-in-the-loop workflows, custom adapters).
- **`/contact`**: no extra schema - inherits the site-wide `Organization`.
- **Blog posts**: `Article` schema per post, identical to MoneyFlow's
  `app/blog/[slug]/page.tsx` pattern.
- **FAQs** (if/when any page gets one): port MoneyFlow's
  `components/shared/FaqSection.tsx` so `FAQPage` schema is generated
  from one component rather than hand-written per page.

## 6. Blog architecture

Same MDX pipeline as MoneyFlow:

- `content/blog/*.mdx` with frontmatter: `title`, `description`, `date`,
  `coverImage`, `coverImageAlt`, `summary`, `category`, `author`.
- `lib/blog.ts` with `getAllPosts()` and `isPublished()` - the latter
  hides any post whose `date` is in the future, so posts can be written
  ahead of schedule without appearing early.
- `app/blog/page.tsx` (index) and `app/blog/[slug]/page.tsx` (article,
  builds its own `generateMetadata` with `type: "article"`,
  `publishedTime`, `authors` - not through `buildPageMetadata`, same
  exception MoneyFlow's blog post page carries).
- Cover images: copy over `scripts/convert-to-webp.mjs`. Same raw
  jpg/png → `.webp` pipeline, engineer runs the conversion command
  manually per this project's "ask before running commands" rule.

**Publishing cadence**: max 2 posts/day, controlled by each post's
`date` frontmatter + `isPublished()`. Encoded as a standing rule in this
project's `CLAUDE.md` (see below) so future posts respect it
automatically: find the latest date already used with fewer than 2
posts, add to it if it only has 1, otherwise roll forward to the next
day.

**SEO-friendly post layout**: single H1 (post title), one JSON-LD
`Article` block, category/date/author byline, MDX body rendered with
proper heading hierarchy (H2/H3), internal links to `/services`,
`/about`, `/contact`, and other posts using descriptive inline anchor
text (not "click here") - same internal-linking convention as
MoneyFlow's blog.

## 7. llms.txt / llms-full.txt

- `public/llms.txt`: Summary, Key Resources (home, services, about,
  contact, blog, RSS feed if added), Citation Guide, Bio/Details. Skips
  MoneyFlow's "Disambiguation" section - no known name collision for
  "Automatoro".
- `public/llms-full.txt`: same curated overview, plus full text of every
  published post appended newest-first.
- Maintenance rule added to `CLAUDE.md`: update both files whenever a
  new post publishes or a new standalone page is added - same procedure
  documented in MoneyFlow's `CLAUDE.md`.

## 8. New CLAUDE.md rules for this project

Add (this project currently only has `@AGENTS.md`):

- Domain: `https://www.automatoro.com`
- Blog publishing schedule: max 2 posts/day, `isPublished()` gate
- llms.txt / llms-full.txt maintenance procedure
- "Ask the engineer to run verification commands (`tsc`, `npm run dev`,
  `npm run lint`, installs, etc.) rather than running them
  automatically" - same workflow habit carried over from money-flow-web

## Open items for implementation

- Actual `/about` copy (solo/early-stage framing, no LLC) - draft during
  implementation, user reviews/edits.
- First blog posts' topics/content - not decided yet, pick during
  implementation or a separate content-planning pass.
- Whether to add an RSS feed (`feed.xml`) like MoneyFlow - not decided,
  default to yes for parity unless told otherwise.
