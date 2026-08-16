---
name: automatoro-seo
description: Automatoro's actual implemented SEO strategy and conventions on www.automatoro.com - metadata pattern, JSON-LD types in use, sitemap/robots setup, llms.txt/llms-full.txt maintenance, blog internal-linking convention, and the cover-image pipeline. Use when adding a new page, publishing a blog post, or auditing this specific site's SEO - not a generic Next.js SEO tutorial (see nextjs-seo / llm-seo for that).
---

# Automatoro SEO Strategy

This documents how SEO is actually implemented in this codebase, so new pages and posts stay consistent with what's already here instead of reinventing a pattern. For general Next.js/LLM SEO best practice (not specific to this site), use the `nextjs-seo` and `llm-seo` skills instead.

## Metadata pattern

Every route builds its `Metadata` through `lib/seo.ts`'s `buildPageMetadata({ title, description, path, ogTitle?, ogDescription? })` rather than declaring `openGraph`/`twitter` inline. This exists because Next.js does not deep-merge `openGraph`/`twitter` across route segments - a page declaring its own `openGraph` object entirely replaces the root layout's (including the image from `app/opengraph-image.tsx`), silently leaving the page with no share image if you skip the helper. `SITE_URL`, `DEFAULT_OG_IMAGE`, and `LINKEDIN_URL` also live in `lib/seo.ts` - don't hardcode the domain, a one-off OG image, or the LinkedIn URL elsewhere.

Blog posts (`app/blog/[slug]/page.tsx`) build metadata directly (not through the helper) since they need `type: "article"`, `publishedTime`, and `authors` - keep that page's `generateMetadata` as the reference for article-type pages.

The two placeholder legal pages (`app/privacy-policy/page.tsx`, `app/terms/page.tsx`) spread `buildPageMetadata(...)` and then override with `robots: { index: false, follow: false }` - keep that override until the pages have real, reviewed content.

## JSON-LD in use

- **`app/layout.tsx`** (site-wide): `Organization` (includes `sameAs: [LINKEDIN_URL]`), `WebSite`
- **`app/services/page.tsx`**: `ProfessionalService` with a nested `OfferCatalog` of `Offer`/`Service` entries
- **Blog posts (`app/blog/[slug]/page.tsx`)**: `Article`
- **Any page using `<FaqSection>`** (currently blog posts and the services page): `FAQPage`, generated automatically by `components/shared/FaqSection.tsx` from its `faqs` prop - don't hand-write a separate FAQPage block if you're already using that component

When adding a new page, match it to the closest existing type above rather than inventing a new JSON-LD shape. If a page has an FAQ section, use `<FaqSection>` - it's the only place FAQPage schema is generated, so skipping it means silently losing that markup.

## Sitemap & robots

`app/sitemap.ts` combines a hardcoded `staticRoutes` array (`"", "/services", "/about", "/contact", "/blog"`) with dynamically-generated blog routes from `getAllPosts()`. **New non-blog pages must be added to `staticRoutes` by hand** - blog posts are automatic. Pages set to `noindex` (like `/privacy-policy` and `/terms`) should stay out of `staticRoutes` - listing a noindex page in the sitemap is contradictory.

`app/robots.ts` allows all crawlers and points to the sitemap; there's no per-bot rule differentiation currently.

## llms.txt / llms-full.txt

Both are static files under `public/`, not auto-generated - see the "LLM Reference Files" section in `CLAUDE.md` for the exact update procedure. In short: every new blog post's full text gets appended to `public/llms-full.txt` (newest first), and every new standalone page gets a bullet in `public/llms.txt`'s `## Key Resources`. Both files are also linked from the footer's Resources column. This is the single most likely thing to go stale - check it whenever blog content ships or a new page is added.

## Blog internal-linking convention

Existing posts cross-link to related posts and the services page inline, mid-sentence, using descriptive anchor text tied to the linked page's topic - not bare "click here" or trailing "read more" links. For example: `[the "hiring trap"](/blog/the-hiring-trap-why-headcount-wont-fix-a-broken-process)` and `[tool integrations and workflow design](/services)`. Every post should link to at least one other post or the services page this way; it's what feeds `getRelatedPosts()`'s category-based matching in `lib/blog.ts` and keeps topic clusters connected for both crawlers and readers.

## Cover images

Raw jpg/jpeg/png cover images get converted via `node scripts/convert-to-webp.mjs public/blog/images --replace` (run by the engineer, not automatically - this workspace's rule is code-only, no shell execution). `--replace` deletes the source file once the `.webp` exists. Frontmatter's `coverImage` path always points at the `.webp`, even mid-conversion when only the raw file exists on disk yet. See the `blog-cover-image` skill for the full step-by-step.

## Footer & nav link architecture

The footer (`components/layout/Footer.tsx`) doubles as an internal-linking surface for SEO: a **Product** column (Services, Blog, Demo), a **Resources** column (About, Contact, llms.txt, llms-full.txt), a **Blog** column (4 most recent posts + All Posts, sourced from `getAllPosts()`), and a **Legal** column (Privacy Policy, Terms). When adding a new standalone page, consider whether it belongs in one of these footer columns, not just the sitemap - internal links from every page (via the footer) carry more link equity than a sitemap-only entry.
