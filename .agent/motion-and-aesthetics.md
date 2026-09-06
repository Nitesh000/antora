# Antora Motion & Aesthetics Architecture

## Core Philosophy
**Visuals**: Material 3 Expressive (Bold, opaque, vibrant, high-contrast, thick focus rings). *No frosted glass or transparency.*
**Motion**: Native iOS Fluidity (Squash and stretch, heavy spring physics, neighbor-aware momentum).

## 1. The Framer Motion Pivot (Physics Engine)

CSS `transition` and `cubic-bezier` are fundamentally incapable of creating the "squash-and-stretch" and neighbor-pushing momentum the user requires. To achieve a truly native iOS-like fluid interface on the web, we are pivoting to a **Framer Motion (`motion/react`) deep-integration architecture**.

Every interactive structural component (Accordion, Cards, Lists) must be wrapped in `<motion.div layout>` to ensure that when it expands, its neighbors are pushed with a physical spring momentum rather than linearly sliding.

### Framer Motion for Everything Structural
1. Import from `"motion/react"`.
2. Use `<motion.div layout>` for containers that change size (Accordion items, Collapsibles).
3. Use `whileTap` and `whileHover` with spring physics for interactive elements instead of CSS `:active` states.

## 2. The "Fluid iOS" Physics Profiles

Centralized in our minds (and code), we use heavy spring physics that allow for bouncing, squashing, and momentum.

### Profile A: `fluidLayout`
Used for structural changes (Accordion expanding, items being pushed down). 
High stiffness and low damping allows the element to bounce slightly, creating a squash-and-stretch effect as the layout settles.
```ts
export const fluidLayout = {
  type: "spring",
  stiffness: 500,
  damping: 25,
  mass: 1,
}
```

### Profile B: `fluidPress`
Used for buttons, cards, and interactive elements.
```ts
export const fluidPress = {
  scale: 0.95,
  transition: {
    type: "spring",
    stiffness: 600,
    damping: 20,
    mass: 1
  }
}
```

### Profile C: `fluidPop`
Used for elements entering the screen (Dialog, Checkbox, Radio, Tooltip). 
```ts
export const fluidPop = {
  type: "spring",
  stiffness: 400,
  damping: 25,
  mass: 0.9,
}
```

## 3. Implementation Focus

**Action Plan:**
*   **Accordion / Collapsible**: Rewrite with `<motion.div layout>` and `<AnimatePresence>`. When an item expands, the surrounding items will be pushed with `fluidLayout` physics, causing them to visually accelerate and decelerate natively.
*   **Button/Cards**: Replace CSS scaling with Framer Motion `whileTap` strings.
*   **Tabs**: Enhance the indicator to ensure it squashes and stretches while traveling.
