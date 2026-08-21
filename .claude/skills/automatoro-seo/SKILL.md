---
name: automatoro-seo
description: Automatoro's actual implemented SEO strategy and conventions on www.automatoro.com - metadata pattern, title-template collision guard, meta-description hygiene, JSON-LD types in use, sitemap/robots setup, llms.txt/llms-full.txt maintenance, blog internal-linking and outbound-citation conventions, and the cover-image pipeline. Use when adding a new page, publishing a blog post, or auditing this specific site's SEO - not a generic Next.js SEO tutorial (see nextjs-seo / llm-seo for that).
---

# Automatoro SEO Strategy

This documents how SEO is actually implemented in this codebase, so new pages and posts stay consistent with what's already here instead of reinventing a pattern. For general Next.js/LLM SEO best practice (not specific to this site), use the `nextjs-seo` and `llm-seo` skills instead.

## Metadata pattern

Every route builds its `Metadata` through `lib/seo.ts`'s `buildPageMetadata({ title, description, path, ogTitle?, ogDescription? })` rather than declaring `openGraph`/`twitter` inline. This exists because Next.js does not deep-merge `openGraph`/`twitter` across route segments - a page declaring its own `openGraph` object entirely replaces the root layout's (including the image from `app/opengraph-image.tsx`), silently leaving the page with no share image if you skip the helper. `SITE_URL`, `DEFAULT_OG_IMAGE`, and `LINKEDIN_URL` also live in `lib/seo.ts` - don't hardcode the domain, a one-off OG image, or the LinkedIn URL elsewhere.

Blog posts (`app/blog/[slug]/page.tsx`) build metadata directly (not through the helper) since they need `type: "article"`, `publishedTime`, and `authors` - keep that page's `generateMetadata` as the reference for article-type pages.

The two placeholder legal pages (`app/privacy-policy/page.tsx`, `app/terms/page.tsx`) spread `buildPageMetadata(...)` and then override with `robots: { index: false, follow: false }` - keep that override until the pages have real, reviewed content.

## Title-template collision guard

`app/layout.tsx`'s root metadata sets `title: { template: "%s | Automatoro" }`, which Next.js appends to every descendant page's `title` string automatically - including the homepage and any page that already spells out "Automatoro" in its own title. Left unguarded, that produces a doubled brand name in the actual rendered `<title>` tag, e.g. `"About Automatoro | Automatoro"` or `"Automatoro | Eliminate Manual Busywork | Automatoro"`.

`lib/seo.ts` exports `resolveTitle(title: string)`, which returns `{ absolute: title }` (bypassing the template) when the title already contains "automatoro" case-insensitively, and returns the plain string otherwise (letting the template apply normally). `buildPageMetadata` already calls this internally, so any page using the helper is covered automatically. The one place that builds metadata outside the helper - the blog post route's `generateMetadata` in `app/blog/[slug]/page.tsx` - also wraps its `title: post.title` in `resolveTitle()` explicitly for the same reason. If a future page ever sets `title` directly on a `Metadata` object without going through `buildPageMetadata`, wrap it in `resolveTitle()` too rather than assuming the template is harmless.

## Meta-description hygiene

Every page's `description` (both `buildPageMetadata` calls and blog post frontmatter) should be checked periodically, ideally with a small extraction script rather than eyeballing each file, against:

- **Missing**: no description present.
- **Length**: under ~70 characters (too thin to be useful in a search snippet) or over ~160 characters (Google truncates past that). `noindex` pages (`/privacy-policy`, `/terms`) are a lower priority for this since they're excluded from search results anyway.
- **Exact duplicates**: the same description string reused verbatim across two or more pages/posts - confuses search engines about which page should rank for it.

Note that `description` is meta-only here (unlike `title`, it isn't rendered as visible page content), so trimming an over-length description is a safe, low-risk edit - it doesn't touch an H1 or any on-page copy the way a title rewrite would.

`title` length is a separate, higher-risk concern: blog post `title` is used as both the `<title>` tag and the on-page H1 (`app/blog/[slug]/page.tsx` renders `{post.title}` directly in an `<h1>`), so a title that runs long once the `" | Automatoro"` template suffix (14 chars) is added should be reported, not silently rewritten - shortening it changes a visible, published headline, not just an invisible meta tag.

## JSON-LD in use

- **`app/layout.tsx`** (site-wide): `Organization` (includes `sameAs: [LINKEDIN_URL]`), `WebSite`
- **`app/services/page.tsx`**: `ProfessionalService` with a nested `OfferCatalog` of `Offer`/`Service` entries
- **Blog posts (`app/blog/[slug]/page.tsx`)**: `Article` (with `image` as a full `ImageObject`, `dateModified`, `articleSection` from the post's `category`, and `isPartOf` pointing at the site's `WebSite`) plus a separate `BreadcrumbList` (Home → Blog → post title) matching the visible breadcrumb nav rendered above the title
- **Any page using `<FaqSection>`** (currently the homepage and the services page, each with their own distinct question set - don't reuse the same `faqs` array on both, that's duplicate FAQPage content across two indexed pages): `FAQPage`, generated automatically by `components/shared/FaqSection.tsx` from its `faqs` prop - don't hand-write a separate FAQPage block if you're already using that component. It's also wired into blog `mdxComponents`, so an individual post can drop in `<FaqSection faqs={[...]} />` directly in its MDX body for post-specific questions, though no post does yet.

When adding a new page, match it to the closest existing type above rather than inventing a new JSON-LD shape. If a page has an FAQ section, use `<FaqSection>` - it's the only place FAQPage schema is generated, so skipping it means silently losing that markup. A page doesn't need its own `dangerouslySetInnerHTML` script tag per JSON-LD object - render one `<script type="application/ld+json">` per schema object (see the blog post page for the two-script pattern: `Article` and `BreadcrumbList` side by side).

Blog post `generateMetadata`'s `openGraph` also sets `modifiedTime` (currently mirrors `post.date` since there's no separate "updated" frontmatter field yet) and `section: post.category` - keep these in sync with the JSON-LD's `dateModified`/`articleSection` if a real last-updated date is ever added to frontmatter.

## Date-gated publishing needs dynamic rendering, not just the date filter

`lib/blog.ts`'s `isPublished()` (`date <= today`) is necessary but not sufficient for the "posts go live on their `date`, no redeploy needed" promise in `CLAUDE.md`. Next.js App Router statically prerenders any route that doesn't use a dynamic API, caching that render until the next build/deploy - so a route calling `getAllPosts()`/`getAllSlugs()` with no dynamic API present will keep serving whatever was published as of the last build, silently hiding posts whose `date` has since arrived.

`app/blog/page.tsx`, `app/blog/[slug]/page.tsx`, `app/sitemap.ts`, and `app/page.tsx` (which features the 3 latest posts via `getAllPosts().slice(0, 3)`) all read post data gated by `isPublished()`, so all four carry `export const dynamic = "force-dynamic";` to force per-request rendering. Any new route that lists or looks up posts (or otherwise depends on "today's date" to decide what's visible) needs the same export - don't rely on the date filter alone.

Note `app/blog/[slug]/page.tsx` would partially work even without this: `generateStaticParams` only bakes in slugs published as of build time, but `dynamicParams` defaults to `true`, so a direct request for a slug published later still renders on demand. The listing page and sitemap have no such fallback - without `force-dynamic` they just serve the stale build.

## Sitemap & robots

`app/sitemap.ts` combines a hardcoded `staticRoutes` array (`"", "/services", "/about", "/contact", "/blog"`) with dynamically-generated blog routes from `getAllPosts()`. **New non-blog pages must be added to `staticRoutes` by hand** - blog posts are automatic. Pages set to `noindex` (like `/privacy-policy` and `/terms`) should stay out of `staticRoutes` - listing a noindex page in the sitemap is contradictory.

`app/robots.ts` allows all crawlers and points to the sitemap; there's no per-bot rule differentiation currently.

## llms.txt / llms-full.txt

Both are static files under `public/`, not auto-generated - see the "LLM Reference Files" section in `CLAUDE.md` for the exact update procedure. In short: every new blog post's full text gets appended to `public/llms-full.txt` (newest first), and every new standalone page gets a bullet in `public/llms.txt`'s `## Key Resources`. Both files are also linked from the footer's Resources column. This is the single most likely thing to go stale - check it whenever blog content ships or a new page is added.

Both files share an identical header block (`## Summary`, `## Problems We Solve`, `## Key Resources`, `## Citation Guide`, `## Bio / Details`) before `llms-full.txt` diverges into its blog archive - keep the two headers in sync when editing either. `## Problems We Solve` is the specific pain-point list (manual busywork, cracks in the system, the hiring trap, client approval bottlenecks, onboarding/reporting overhead) mirrored from the homepage's Problem/Benefits sections in `app/page.tsx` - update it if those sections' framing changes, so an LLM citing Automatoro states the actual problem being solved, not just the product category.

## Blog internal-linking convention

Existing posts cross-link to related posts and the services page inline, mid-sentence, using descriptive anchor text tied to the linked page's topic - not bare "click here" or trailing "read more" links. For example: `[the "hiring trap"](/blog/the-hiring-trap-why-headcount-wont-fix-a-broken-process)` and `[tool integrations and workflow design](/services)`. Every post should link to at least one other post or the services page this way; it's what feeds `getRelatedPosts()`'s category-based matching in `lib/blog.ts` and keeps topic clusters connected for both crawlers and readers.

Beyond the hand-written inline links, `lib/blog.ts`'s `getRelatedPosts(slug, count = 3)` (same-category posts first, backfilled with the newest others if the category doesn't have enough) is wired into `app/blog/[slug]/page.tsx` via `components/blog/RelatedArticles.tsx`, rendered at the bottom of every post automatically - no per-post edit needed to get this backlink block. `app/page.tsx` also surfaces the 3 newest posts (`getAllPosts().slice(0, 3)`, reusing `components/blog/BlogList.tsx`) in a "From The Blog" section, so a freshly published post gets a link from the homepage too, not just `/blog` and the footer.

Every post also ends with `components/blog/ArticleCTA.tsx` - a fixed "Contact us now for more details about your problem" block linking to `/contact`, rendered once in the `[slug]/page.tsx` template rather than per-post MDX, so it can't be forgotten on new posts.

## Outbound trust-authority citations

Where a post makes a factual or statistical claim that a reader might reasonably question (a stat, a named study, a claim about how a tool or regulation works), link the specific phrase mid-sentence to a real, current, authoritative external source - the same descriptive-anchor-text style as internal links, just pointing off-site. Only add a citation where a real claim in the text supports one; don't insert a source-less sentence just to create a link. Use `WebSearch` to find the actual current URL rather than guessing one from memory - documentation, pricing, and news URLs change.

External links get `target="_blank" rel="noopener noreferrer"` automatically - the `a` component in `app/blog/[slug]/page.tsx`'s `mdxComponents` detects any `href` that starts with `http`/`https` and doesn't contain `automatoro.com`, and adds those attributes only to that subset (internal links keep their current same-tab behavior). Leave these as dofollow (no `rel="nofollow"`): genuine editorial citations to authoritative sources are standard practice as dofollow and are what actually signals trustworthiness to search engines - `nofollow` is meant for paid/sponsored links, not this.

Every inline citation is also surfaced as a visible **References** list at the bottom of the post automatically - `lib/blog.ts`'s `getReferences(content)` regex-extracts every markdown link in the post body pointing off-`automatoro.com` (deduped by URL), and `components/blog/References.tsx` renders them as a numbered source list. This means the reference list is never hand-maintained and can never drift from the actual inline citations - don't add a second, separately-authored "Sources" list; if a post needs a reference, cite it inline per the convention above and it appears in the list for free. A post with zero external citations renders no References section (the component returns `null`).

## Cover images

Raw jpg/jpeg/png cover images get converted via `node scripts/convert-to-webp.mjs public/blog/images --replace` (run by the engineer, not automatically - this workspace's rule is code-only, no shell execution). `--replace` deletes the source file once the `.webp` exists. Frontmatter's `coverImage` path always points at the `.webp`, even mid-conversion when only the raw file exists on disk yet. See the `blog-cover-image` skill for the full step-by-step.

## Footer & nav link architecture

The footer (`components/layout/Footer.tsx`) doubles as an internal-linking surface for SEO: a **Product** column (Services, Blog, Demo), a **Resources** column (About, Contact, llms.txt, llms-full.txt), a **Blog** column (4 most recent posts + All Posts, sourced from `getAllPosts()`), and a **Legal** column (Privacy Policy, Terms). When adding a new standalone page, consider whether it belongs in one of these footer columns, not just the sitemap - internal links from every page (via the footer) carry more link equity than a sitemap-only entry.
