---
name: blog cover image
description: Use when raw cover-image files have been dropped into public/blog/images/ and need to be linked to their blog post's frontmatter - matches each image to its post by slug, swaps out the shared placeholder.svg for the real path, and leaves the actual webp conversion to the engineer (same pipeline as the money-flow-web project's scripts/convert-to-webp.mjs).
---

# Blog Cover Image

## Overview

Every post in `content/blog/*.mdx` has a `coverImage` frontmatter field. New posts start out pointing at the shared placeholder, `/blog/placeholder.svg`. The engineer drops raw cover photos directly into `public/blog/images/` themselves (no need to hand them to Claude) - this skill's job is purely to **link** each of those raw images to its matching post's frontmatter. Conversion to `.webp` is run by the engineer afterward, following the same raw-in/webp-out pipeline as the sibling `money-flow-web` project (same `scripts/convert-to-webp.mjs`, same sharp-based conversion, same frontmatter convention - see `CLAUDE.md`'s "Blog Cover Images" section).

## When to use

- The engineer says they've added image(s) to `public/blog/images/` and wants them linked to the right post(s).
- `public/blog/images/` contains a raw `.jpg`/`.jpeg`/`.png` file that isn't yet referenced by any post's `coverImage`.

## Steps

1. **List `public/blog/images/`** to see what raw image files are currently there.
2. **Match each raw image to its post by filename.** The convention is `<post-slug>.jpeg` (or `.png`/`.jpg`) where `<post-slug>` exactly matches a file in `content/blog/<post-slug>.mdx`. If a filename doesn't cleanly match any existing post slug, ask which post it belongs to rather than guessing.
3. **Update that post's frontmatter** in `content/blog/<slug>.mdx`:
   - `coverImage: "/blog/images/<slug>.webp"` - the extension is `.webp` even though the file on disk is still the raw format at this point. That's expected; the conversion step is what makes it real, and the engineer runs that themselves.
   - Update `coverImageAlt` too if it was still generic/placeholder text.
4. **Don't touch the raw image file and don't run the conversion.** The engineer runs it themselves:
   ```
   node scripts/convert-to-webp.mjs public/blog/images --replace
   ```
   `--replace` deletes the original jpg/png after a successful conversion, so `public/blog/images/` ends up with just the `.webp` file the frontmatter already points to.
5. **Verify** once the engineer confirms it ran - read the resulting `.webp` file to confirm it exists and looks right before calling the task done.

## Notes

- Do this one post at a time so the frontmatter you write always matches the file that's about to get converted.
- If several raw images appear at once, link all of them in the same pass - each is an independent slug match.
- If `public/llms-full.txt` already has an entry for a post, no changes are needed there for a cover image swap - that file tracks post text, not images.
