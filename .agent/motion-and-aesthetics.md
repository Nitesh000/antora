# Antora Motion & Aesthetics Architecture

## Core Philosophy
**Visuals**: Material 3 Expressive (Bold, opaque, vibrant, high-contrast, thick focus rings). *No frosted glass or transparency.*
**Motion**: Liquid Glass (Fluid, viscous, organic, snappy, zero jitter).

## 1. Performance & Bundle Size Strategy

To remain heavily optimized and maintain a minimal bundle size, we strictly divide motion responsibilities between **CSS** and **JS**.

### CSS-First Micro-interactions (Zero JS Bundle)
Hover states, focus rings, background color changes, and simple scaling (`active:scale-[0.98]`) must use CSS.
We will define a custom Tailwind easing curve that perfectly mimics the "liquid glass" spring:

*   **`ease-liquid`**: `cubic-bezier(0.2, 1, 0.3, 1)` (or similar highly calibrated curve).
*   **Usage**: `transition-all duration-300 ease-liquid`

### Framer Motion for Spatial Awareness (JS)
We only use `motion/react` when elements physically travel across the screen, morph their layout, or require unmount animations.
To minimize bundle size:
1. Import from `"motion/react"` (which is modern Framer Motion v12, heavily tree-shakeable).
2. For extremely complex pages, consumers can use `LazyMotion` (we will document this).

## 2. The "Liquid Glass" Physics Profiles

Centralized in `lib/motion.ts` (or similar utility file), we define standard physics profiles so every component moves identically across Radix, Aria, and Base UI.

### Profile A: `liquidLayout`
Used for traveling elements (Tabs indicator, moving focus states). Behaves like a bead of mercury.
```ts
export const liquidLayout = {
  type: "spring",
  stiffness: 400,
  damping: 30,
  mass: 0.8,
}
```

### Profile B: `liquidPop`
Used for elements entering the screen (Dialog, Checkbox, Radio, Tooltip). 
Expands organically without bouncing past 100% scale.
```ts
export const liquidPop = {
  type: "spring",
  stiffness: 350,
  damping: 25,
  mass: 0.9,
}
```

## 3. Implementation Across All Bases

Shadcn v4 uses three distinct UI primitives. We must ensure parity across all of them:

1. **`bases/radix`**: (Radix UI)
2. **`bases/aria`**: (React Aria Components)
3. **`bases/base`**: (Base UI)

**Action Plan per Component:**
*   **Tabs**: Inject `framer-motion` `liquidLayout` into all three base `tabs.tsx` files.
*   **Dialog/Popover/Tooltip**: Inject `liquidPop` spatial animations into all three bases.
*   **Button/Input**: Apply `ease-liquid` and `active:scale-[0.98]` purely via `style-expressive.css` to hit all bases automatically without altering JS.
*   **Checkbox/Radio/Switch**: Inject `liquidPop` scale animations into all three bases.
