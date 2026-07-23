---
name: Zenith Enterprise System
colors:
  surface: '#f9f9ff'
  surface-dim: '#d8d9e3'
  surface-bright: '#f9f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3fd'
  surface-container: '#ecedf7'
  surface-container-high: '#e6e7f2'
  surface-container-highest: '#e1e2ec'
  on-surface: '#191b23'
  on-surface-variant: '#424754'
  inverse-surface: '#2e3038'
  inverse-on-surface: '#eff0fa'
  outline: '#727785'
  outline-variant: '#c2c6d6'
  surface-tint: '#005ac2'
  primary: '#0058be'
  on-primary: '#ffffff'
  primary-container: '#2170e4'
  on-primary-container: '#fefcff'
  inverse-primary: '#adc6ff'
  secondary: '#505f76'
  on-secondary: '#ffffff'
  secondary-container: '#d0e1fb'
  on-secondary-container: '#54647a'
  tertiary: '#924700'
  on-tertiary: '#ffffff'
  tertiary-container: '#b75b00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#d3e4fe'
  secondary-fixed-dim: '#b7c8e1'
  on-secondary-fixed: '#0b1c30'
  on-secondary-fixed-variant: '#38485d'
  tertiary-fixed: '#ffdcc6'
  tertiary-fixed-dim: '#ffb786'
  on-tertiary-fixed: '#311400'
  on-tertiary-fixed-variant: '#723600'
  background: '#f9f9ff'
  on-background: '#191b23'
  surface-variant: '#e1e2ec'
typography:
  display:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system is rooted in the philosophy of "Invisible Infrastructure"—a UI that recedes to prioritize user intent and data clarity. Inspired by high-performance developer tools, the aesthetic is minimalist, professional, and content-forward. It targets a B2B audience that values efficiency, precision, and a calm working environment.

The visual narrative is built on:
- **Functional Minimalism:** Every element must earn its place. Excess decoration is stripped away in favor of purposeful whitespace and structural alignment.
- **High-Fidelity Utility:** A focus on crisp borders, refined typography, and subtle micro-interactions that signal quality without "hype."
- **Institutional Trust:** A neutral, grounded palette that feels reliable and permanent.

## Colors

The color strategy uses a restricted palette to minimize cognitive load. 

- **Light Mode:** Uses a Zinc-based scale. Surfaces are primarily `#FFFFFF` with backgrounds at `#FAFAFA`. Borders use `#E4E4E7`.
- **Dark Mode:** Deep charcoal and near-black tones. Backgrounds are `#09090B`, with primary surfaces at `#18181B`. Borders use `#27272A`.
- **Accent:** A single Slate Blue/Indigo (`#4F46E5`) is reserved exclusively for the Primary CTA and critical active states. 
- **Feedback:** Success (Emerald), Warning (Amber), and Error (Rose) are used with low saturation to maintain the "calm" aesthetic.

## Typography

This design system utilizes **Geist** for its balance of technical precision and approachability. 

- **Hierarchy:** Contrast is achieved through weight and size rather than color. 
- **Monospace Integration:** **JetBrains Mono** is used for labels, metadata, and data points to reinforce the "pro-tool" feeling.
- **Readability:** Body text maintains a generous line height (1.5x) to ensure legibility in data-dense layouts.
- **Tracking:** Tighten tracking slightly on larger headlines to maintain a cohesive visual block.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model. Content is contained within a 1280px max-width grid on desktop but remains fluid within that container.

- **The 4px Scale:** All spacing (padding, margins, gaps) must be a multiple of 4px.
- **Sectioning:** Use generous vertical padding (`64px` to `96px`) between major content blocks to prevent visual clutter.
- **Responsive Behavior:** 
    - **Desktop (1024px+):** 12-column grid, 24px gutters.
    - **Tablet (768px - 1023px):** 8-column grid, 20px gutters.
    - **Mobile (<767px):** 4-column grid, 16px margins. Sidebars collapse into bottom sheets or full-screen overlays.

## Elevation & Depth

Depth is communicated through **1px borders** and **tonal layering** rather than shadows. 

- **Borders:** Use a subtle border (`1px solid`) in a shade slightly lighter (in dark mode) or darker (in light mode) than the background.
- **Surfaces:** Use a three-tier system:
    1. **Level 0 (Background):** The base canvas.
    2. **Level 1 (Card/Container):** Raised slightly via a subtle background color shift.
    3. **Level 2 (Popovers/Modals):** These are the only elements allowed a shadow. Use a very large, soft, 10% opacity black shadow to suggest a physical hover above the interface.
- **Glassmorphism:** Use `backdrop-filter: blur(12px)` sparingly for sticky headers and navigation bars to maintain context during scroll.

## Shapes

The shape language is a mix of geometric discipline and soft touchpoints.

- **Containers & Cards:** Use a standard **8px (rounded-md)** corner radius to feel structured yet modern.
- **Interactive Elements:** Buttons and Chips utilize a **Pill-shaped (rounded-full)** radius. This differentiates "actions" from "containers" and provides a friendlier tactile target.
- **Inputs:** Follow the container radius (8px) for a cohesive form-entry experience.

## Components

- **Buttons:** 
    - **Primary:** Pill-shaped, Accent background, White text. No shadow.
    - **Secondary:** Pill-shaped, 1px border, no background.
    - **Ghost:** Text only, subtle background shift on hover.
- **Inputs:** 1px border, 8px radius. On focus, the border color shifts to the accent color with a 2px outer glow (0% blur) for a "high-contrast focus ring."
- **Cards:** No shadows. Defined by a 1px border. Background should be slightly different from the page background to create a "container" effect.
- **Chips/Badges:** Pill-shaped, small (12px text), JetBrains Mono. Use subtle background tints (e.g., 10% opacity of the status color).
- **Lists:** Clean rows with 1px horizontal dividers. Increase padding-y to 16px to ensure each item feels distinct without needing a card container.
- **Data Tables:** Minimalist. No vertical lines. Header row in JetBrains Mono, uppercase, with 40% opacity.