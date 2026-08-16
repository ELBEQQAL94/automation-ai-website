@AGENTS.md

# Automatoro Website — Rules for Claude

## Domain
Production domain: `https://www.automatoro.com`

## Blog Publishing Schedule
New blog posts (`content/blog/*.mdx`) publish at most **2 per day**. A post's `date` frontmatter field controls when it goes live - `lib/blog.ts`'s `isPublished()` hides any post whose `date` is in the future, so you can create/write a post any time without it appearing early.

When adding a new post: find the latest `date` already used across all posts that has fewer than 2 posts on it, and either add to that day (if it only has 1) or roll forward to the next day (if it already has 2). Never assign a `date` that would put a third post on the same day.

## LLM Reference Files (llms.txt / llms-full.txt)
`public/llms.txt` and `public/llms-full.txt` are static files, not auto-generated - they go stale unless updated by hand. Update them whenever:

- **A new blog post is published**: add its full text (title as `# heading`, then `Category:`/`Date:`/`Author:`/`URL:` lines, then the summary, then the full body) to `public/llms-full.txt`, newest post first (right after the header section, before the previously-first post).
- **A new standalone page is added**: add it as a bullet under `## Key Resources` in `public/llms.txt` and `public/llms-full.txt`.

## Blog Cover Images
1. Raw jpg/jpeg/png cover images go in `public/blog/images/`, named `<post-slug>.jpeg` (or `.png`).
2. Set the post's frontmatter `coverImage` to `/blog/images/<post-slug>.webp` (note: `.webp`, even though the file on disk is still `.jpeg`/`.png` at this point).
3. Ask the engineer to run: `node scripts/convert-to-webp.mjs public/blog/images --replace`

## Running Commands
Always ask the engineer to run verification commands themselves - do not run `tsc`, `npm run dev`, `npm run lint`, `npm run build`, `npm install`/`npm i` (or any other package install command), or any other terminal commands automatically. Present the command and ask the engineer to run it and share the output.
