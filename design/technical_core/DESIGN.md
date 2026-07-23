---
name: Technical Core
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bbcabf'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#86948a'
  outline-variant: '#3c4a42'
  surface-tint: '#4edea3'
  primary: '#4edea3'
  on-primary: '#003824'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#006c49'
  secondary: '#95d3ba'
  on-secondary: '#003829'
  secondary-container: '#0b513d'
  on-secondary-container: '#83c2a9'
  tertiary: '#ffb3af'
  on-tertiary: '#650911'
  tertiary-container: '#fc7c78'
  on-tertiary-container: '#711419'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#b0f0d6'
  secondary-fixed-dim: '#95d3ba'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#0b513d'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#842225'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '500'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  grid-gutter: 24px
  container-max: 1280px
---

## Brand & Style
The design system for this variant embodies a "Technical Core" aesthetic, specifically tailored for high-end B2B AI automation consultancy. The brand personality is precise, authoritative, and engineering-led, aimed at CTOs and technical stakeholders who value performance and transparency.

The style is a fusion of **Dark Mode Minimalism** and **Modern Technical** aesthetics. It utilizes deep, near-black surfaces to create a sense of focused intensity, accented by a high-performance emerald green that signals growth and "system-go" status. Visual interest is driven by structural integrity—thin borders, subtle grid textures, and monospaced accents—rather than decorative flourishes. The UI should evoke an emotional response of absolute reliability and sophisticated technological power.

## Colors
The palette is rooted in a deep "Carbon" base to reduce eye strain and emphasize high-contrast data. 

- **Primary Emerald (#10b981):** Used exclusively for primary actions, success states, and critical data visualizations. It represents the "active" state of the AI.
- **Deep Emerald (#064e3b):** Reserved for subtle highlights, such as low-priority button backgrounds or selected states in navigation.
- **Neutral Stack:** The background is a true near-black (#0a0a0a). Surface containers use a slightly elevated zinc (#171717). 
- **Borders:** A consistent, low-opacity border (#262626) is used to define structure without adding visual bulk.

## Typography
The typography strategy leverages **Geist** for its systematic, Swiss-inspired clarity and **JetBrains Mono** for technical accents.

- **Headlines:** Use Geist with tight tracking and leading to create a dense, impactful architectural feel.
- **Body:** Geist at 16px provides a neutral, highly readable foundation for complex consultancy documentation.
- **Technical Accents:** JetBrains Mono is used for labels, metadata, "AI Thinking" indicators, and code snippets. This provides a clear visual distinction between human-readable content and system-generated data. All monospaced text should be set in Uppercase when used for UI labels.

## Layout & Spacing
This design system utilizes a **12-column fixed grid** for desktop and a **4-column fluid grid** for mobile. 

The layout philosophy is "The Blueprint." Use a subtle 24px background grid texture (1px dots or lines at 5% opacity) to reinforce the engineering theme. 
- **Margins:** Desktop uses a 48px safety margin; Mobile uses 16px.
- **Vertical Rhythm:** Components are spaced in multiples of 8px to maintain a strict, mathematical flow.
- **Alignment:** All elements must align strictly to the grid edges. Avoid centering content unless it is a landing page hero; consultancy dashboards should be left-aligned to maximize data density.

## Elevation & Depth
In this system, depth is achieved through **Tonal Layers** and **Thin Borders** rather than shadows. Shadows are largely avoided to maintain a "flat/technical" aesthetic.

- **Level 0 (Background):** #0a0a0a. The foundation.
- **Level 1 (Cards/Containers):** #171717. Used for the primary content blocks.
- **Level 2 (Modals/Popovers):** #262626. 
- **Borders:** Every container should have a 1px solid border (#262626). For active or hovered states, the border color shifts to #404040 or the primary emerald.
- **Interactivity:** On hover, elements do not lift; instead, they gain a "glow" through a subtle inner stroke or a change in border brightness.

## Shapes
Shapes are disciplined and "Soft-Square." A minimal radius of 4px (`roundedness: 1`) is applied to all UI elements, from buttons to large cards. This prevents the interface from feeling "sharp" or hostile while maintaining the precise, technical look of high-end hardware. 

Avoid circles (pill-shapes) unless used for status indicators (e.g., "System Online" dots).

## Components
- **Buttons:** Primary buttons are solid Emerald (#10b981) with black Geist-SemiBold text. Secondary buttons are ghost-style with a Zinc-800 border and White text.
- **Chips/Badges:** Small, monospaced text in JetBrains Mono. Success badges use a subtle Emerald-950 background with an Emerald-500 border.
- **Lists:** Data-heavy rows with thin 1px dividers. Use monospaced font for numerical data to ensure alignment.
- **Inputs:** Dark backgrounds (#0a0a0a) with a 1px border. Focus state is a 1px Emerald ring with no outer glow.
- **Cards:** No shadows. Define card boundaries using the #171717 surface color and a #262626 border.
- **Technical Additions:** "System Status" bars and "Process Logs" (monospaced scrolling text) should be used to visualize AI background tasks.