@AGENTS.md

# Automatoro Website — Rules for Claude

## Domain
Production domain: `https://www.automatoro.com`

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
