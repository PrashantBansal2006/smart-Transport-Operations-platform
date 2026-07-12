---
name: Industrial Precision
colors:
  surface: '#10131a'
  surface-dim: '#10131a'
  surface-bright: '#363940'
  surface-container-lowest: '#0b0e14'
  surface-container-low: '#191c22'
  surface-container: '#1d2026'
  surface-container-high: '#272a31'
  surface-container-highest: '#32353c'
  on-surface: '#e1e2eb'
  on-surface-variant: '#d8c3b0'
  inverse-surface: '#e1e2eb'
  inverse-on-surface: '#2e3037'
  outline: '#a08d7c'
  outline-variant: '#534436'
  surface-tint: '#ffb86b'
  primary: '#ffb86b'
  on-primary: '#492900'
  primary-container: '#e8952e'
  on-primary-container: '#5a3400'
  inverse-primary: '#895100'
  secondary: '#c2c6d5'
  on-secondary: '#2b303c'
  secondary-container: '#444955'
  on-secondary-container: '#b4b8c7'
  tertiary: '#70d2ff'
  on-tertiary: '#003547'
  tertiary-container: '#2ab4e7'
  on-tertiary-container: '#004258'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdcbc'
  primary-fixed-dim: '#ffb86b'
  on-primary-fixed: '#2c1700'
  on-primary-fixed-variant: '#683d00'
  secondary-fixed: '#dee2f1'
  secondary-fixed-dim: '#c2c6d5'
  on-secondary-fixed: '#171c26'
  on-secondary-fixed-variant: '#424753'
  tertiary-fixed: '#c0e8ff'
  tertiary-fixed-dim: '#70d2ff'
  on-tertiary-fixed: '#001e2b'
  on-tertiary-fixed-variant: '#004d66'
  background: '#10131a'
  on-background: '#e1e2eb'
  surface-variant: '#32353c'
  bg-surface: '#141821'
  border-subtle: '#2A303C'
  text-secondary: '#8A93A3'
  status-success: '#3ECF6E'
  status-info: '#3B9CE8'
  status-danger: '#E8544E'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-max: 1440px
  gutter: 1rem
  margin-desktop: 1.5rem
  margin-mobile: 1rem
  component-gap: 0.75rem
---

## Brand & Style

This design system is built for **TransitOps**, a high-stakes logistics platform where operational efficiency and data density are paramount. The design style is **Industrial Modern**, characterized by a deep, technical color palette, high-contrast semantic indicators, and a rigid information hierarchy that minimizes cognitive load for dispatchers and managers.

The aesthetic leans into a "command center" feel:
- **Clean and Functional:** Avoiding unnecessary decoration to prioritize actionable data.
- **High-Density:** Optimized for dashboarding and complex table views.
- **Utilitarian:** Using cold neutrals with warm industrial orange to guide the eye toward primary actions.
- **Professional & Technical:** Reflecting the heavy-machinery nature of fleet management through precise alignment and structured containers.

## Colors

The palette is anchored in a **Dark Mode** environment to reduce eye strain during long operational shifts. 

### Key Color Logic
- **Primary (Brand Orange):** Reserved strictly for primary call-to-actions, critical status warnings (In Shop), and branding. 
- **Surface Tiers:** `bg-primary` serves as the canvas, while `bg-surface` creates depth for cards, sidebars, and active UI modules.
- **Semantic Status:** 
    - **Green (#3ECF6E):** Positive flow (Available, Completed).
    - **Blue (#3B9CE8):** Active movement (On Trip, Dispatched).
    - **Amber (#E8952E):** Transitional/Warning (In Shop, Pending).
    - **Red (#E8544E):** Hard stops (Retired, Suspended, Cancelled).

Use alpha-blending (15% opacity) for status backgrounds to ensure legibility while maintaining the dark aesthetic.

## Typography

**Inter** is the exclusive typeface, selected for its exceptional legibility in data-heavy interfaces.

- **Weight Usage:** Use `600 (SemiBold)` for headers and primary labels to create a clear visual anchor. Use `400 (Regular)` for body text and `500 (Medium)` for tabular data.
- **Case Styling:** Table headers and small labels should use **All Caps** with `0.05em` letter spacing to distinguish them from dynamic data.
- **Scale:** The type scale is compact to accommodate dense information without sacrificing readability.

## Layout & Spacing

This design system utilizes a **Fixed Grid** model for large screens to ensure consistent dashboard layouts, transitioning to a **Fluid Grid** for tablet and mobile.

### Grid & Layout Rules
- **Desktop (1280px+):** 12-column grid. Standard sidebar width of 240px. Use `1.5rem` margins for the main content area.
- **Tablet (768px - 1279px):** 8-column grid. Sidebar collapses to icons or a drawer.
- **Mobile (< 767px):** 4-column grid. Vertical stacking for data cards.
- **Rhythm:** A 4px/8px base unit system ensures vertical rhythm. Tables use a tight `12px` vertical padding for rows to maximize data visibility.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Low-Contrast Outlines** rather than heavy shadows, maintaining the "industrial" flat aesthetic.

- **Level 0 (Base):** `#0B0E14` (Page Background).
- **Level 1 (Surface):** `#141821` (Cards, Sidebar, Navbar).
- **Level 2 (Interaction):** `#1B202B` (Hover states, input fields).
- **Outlines:** Use a `1px` solid border of `#2A303C` for all surface containers and table rows to define boundaries without adding visual weight.
- **Shadows:** Only used for floating elements (modals, dropdowns). Use a sharp, low-spread shadow: `0 4px 12px rgba(0, 0, 0, 0.5)`.

## Shapes

The shape language is structured and professional.

- **Containers & Cards:** Use a `10px` (custom) radius to balance the harshness of the dark palette with a modern touch.
- **Inputs & Buttons:** Follow a `0.5rem (8px)` standard roundedness.
- **Status Badges:** Use **Pill-shaped** (`999px`) styling to immediately differentiate status indicators from buttons or other interactive elements.
- **Icons:** Use geometric, line-based icons with a consistent 2px stroke weight to match the "Inter" font weight.

## Components

### Buttons
- **Primary:** `bg-brand`, `text-white`. High contrast.
- **Secondary:** `bg-bg-surface-alt`, `border-border-subtle`, `text-text-primary`.
- **States:** Hover should brighten the background color by 10%. Disabled states should drop to 40% opacity.

### Status Badges
Every badge must use a 15% opacity background of its semantic color with 100% opacity text.
- *Example:* `bg-status-available/15 text-status-available`.

### Data Tables
- **Header:** `text-text-secondary`, `uppercase`, `text-xs`, `tracking-wide`.
- **Borders:** Bottom-only `1px` border using `border-border-subtle`.
- **Alignment:** Numbers (Odometer, Capacity) are right-aligned; text/status are left-aligned.

### Input Fields
- **Surface:** `bg-bg-surface-alt`.
- **Border:** `border-border-subtle`.
- **Focus:** `border-brand` with no outer glow.
- **Error:** `border-status-danger`, `bg-status-danger/10`.

### Cards (KPIs)
- Cards should have a `10px` radius and `1.25rem` padding. 
- Large numeric values should use `headline-lg` in `text-primary`.
- Small trend indicators or descriptions in `text-secondary`.