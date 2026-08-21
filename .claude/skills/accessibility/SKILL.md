---
name: accessibility
description: Web accessibility (a11y) implementation and auditing for Next.js/React + Tailwind apps. Use when adding or reviewing UI for semantic HTML, ARIA usage, keyboard navigation, focus management, color contrast, form labeling, image alt text, or when asked to "make this accessible", "check accessibility", "WCAG compliance", or "screen reader support". Not a generic accessibility law/legal reference - focused on implementation patterns for this stack.
---

# Accessibility (a11y)

Practical accessibility guidance for Next.js App Router + Tailwind projects. Target WCAG 2.1 AA unless told otherwise - it's the level most legal/contractual requirements (ADA, EN 301 549) reference, and AAA is often impractical for arbitrary content-heavy pages.

## Quick audit checklist

Run through this before shipping any new page or component:

1. **Headings**: one `<h1>` per page, no skipped levels (`h2` straight to `h4`), headings describe the section that follows.
2. **Images**: every `<img>`/`next/image` has meaningful `alt` text, or `alt=""` if purely decorative - never omit the attribute.
3. **Links vs buttons**: `<Link>`/`<a>` for navigation (changes URL), `<button>` for actions (submits, toggles, opens). Never a `<div onClick>` for either.
4. **Forms**: every input has a `<label htmlFor>` (or visible text wrapped around it) - not just a `placeholder`, which disappears on input and isn't reliably read by screen readers.
5. **Focus visible**: never `outline: none` / `focus:outline-none` without a replacement `focus-visible:ring-*` or similar - keyboard users need to see where they are.
6. **Color contrast**: body text ≥ 4.5:1 against its background, large text (18px+/bold 14px+) ≥ 3:1. Check with the browser DevTools contrast checker, not by eye.
7. **Keyboard-only pass**: tab through the page. Everything interactive should be reachable, in a logical order, with no trap (a modal you can't tab out of, a menu that swallows Escape).
8. **Alt-only icon buttons**: an icon-only `<button>` (close, hamburger, social icon) needs `aria-label="Close"` etc. - an icon alone conveys nothing to a screen reader.

## Semantic HTML first, ARIA second

Prefer native elements over ARIA-patched divs - a `<button>` gets keyboard handling, focus, and role for free; a `<div role="button">` requires you to hand-wire `tabIndex`, `onKeyDown` for Enter/Space, and the role yourself, and it's easy to miss one. The first rule of ARIA is "don't use ARIA if a native element already does the job."

Where ARIA is genuinely needed:
- `aria-label` / `aria-labelledby`: name an element with no visible text (icon buttons, a `<nav>` when there are multiple on the page).
- `aria-expanded` / `aria-controls`: on a toggle button that shows/hides content (accordions, dropdowns, mobile nav).
- `aria-current="page"`: on the active nav link, not a generic `active` class alone - screen readers don't see CSS classes.
- `aria-live="polite"`: on a region that updates without a page navigation (form validation errors, a toast/status message) so screen readers announce the change.
- `role="alert"`: for urgent, time-sensitive messages only (a failed submission) - overusing it causes every update to interrupt the user.

Don't add `role` attributes that just restate the element's native role (`<button role="button">`) - redundant and a maintenance trap if the element type ever changes.

## Focus management

- **Route changes**: Next.js App Router does not automatically move focus or announce the new page to screen reader users on client-side navigation. If a page has no natural focus target (no autofocus input, no obvious first heading link), consider moving focus to the `<h1>` on mount for SPA-like flows; for standard multi-page navigation via `<Link>` this is usually acceptable as-is since it's a full route transition.
- **Modals/dialogs**: trap focus inside while open, restore focus to the triggering element on close, close on `Escape`. Prefer the native `<dialog>` element or a tested primitive (Radix, Headless UI) over hand-rolling focus trapping - it's easy to get subtly wrong.
- **Skip link**: a page with a large header/nav should offer a "Skip to main content" link, visually hidden until focused (`sr-only focus:not-sr-only`), as the first focusable element in the DOM.

## Forms

- Label every input. `<label htmlFor="email">Email</label><input id="email" />` - the `htmlFor`/`id` pair is what makes clicking the label focus the input and what screen readers announce.
- Group related fields (e.g. a set of radio buttons) in `<fieldset>` with a `<legend>` describing the group - a `<label>` on each radio alone doesn't say what they're choosing between.
- Associate error messages with their field via `aria-describedby` pointing at the error's `id`, and mark the field `aria-invalid="true"` while the error is showing.
- Never rely on color alone to indicate an error or required field - pair a red border with text (an asterisk plus "required" in the label, or an inline error message).

## Images and next/image

`next/image`'s `alt` prop is required by TypeScript when using the typed component correctly, but it's still worth reviewing at content-authoring time (frontmatter-driven `alt` text especially, e.g. blog `coverImageAlt`):
- Describe what the image conveys, not what it is - `"Kanban board with three approval steps highlighted"`, not `"Screenshot"` or `"image1.png"`.
- Purely decorative images (background textures, spacer graphics) get `alt=""` so screen readers skip them - not a generic filler string.
- Don't repeat text that's already adjacent to the image (a hero image next to an `<h1>` that says the same thing) in the `alt` - that's redundant, not helpful.

## Automated tooling

Automated checks catch roughly a third of WCAG issues - useful as a floor, not a substitute for a keyboard/screen-reader pass:
- **`eslint-plugin-jsx-a11y`**: catches missing `alt`, invalid ARIA attributes, non-interactive elements with click handlers, etc. at write time. Check if the project's ESLint config already extends `plugin:jsx-a11y/recommended` before assuming coverage.
- **axe DevTools** (browser extension) or `@axe-core/react` (dev-only runtime check): flags contrast, ARIA, and structural issues on the rendered page.
- **Lighthouse accessibility score** (Chrome DevTools): quick regression signal, but a 100 score does not mean the page is actually usable with a screen reader - don't treat it as the finish line.

## What automated tools miss (manual pass required)

- Whether the reading/tab order actually matches the visual order (CSS `order`/`grid` can visually reorder content in a way the DOM order doesn't reflect).
- Whether alt text is *meaningful*, not just present - a tool can't judge if `alt="chart"` should really say what the chart shows.
- Whether a screen reader user can actually complete a multi-step flow (form wizard, checkout) without getting lost - requires an actual pass with VoiceOver (Mac, `Cmd+F5`) or NVDA (Windows, free).
- Whether motion/animation respects `prefers-reduced-motion` - a tool won't flag a decorative parallax effect as a vestibular-disorder trigger; wrap non-essential motion in `@media (prefers-reduced-motion: reduce)`.
