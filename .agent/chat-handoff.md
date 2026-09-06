# Antora UI - Current State & Next Steps

## The Goal
Build **Antora**, a production-grade React UI library built on top of the official shadcn v4 architecture. It combines **Material 3 Expressive** design principles (bold, opaque, high-contrast, no frosted glass) with highly realistic, physics-based **Native Fluidity** (squash-and-stretch, heavy spring physics, neighbor-aware momentum similar to iOS).

## The Architectural Pivot (Decisions Made)
We realized that relying on CSS `transition` and `cubic-bezier` is fundamentally insufficient to achieve the "squash-and-stretch" and neighbor-pushing momentum required for true fluidity. CSS lacks physical mass and cannot animate structural layout shifts smoothly.

**The New Approach:**
1. **Deep Framer Motion Integration**: We are pivoting to use Framer Motion (`motion/react`) for all interactive components and layout shifts.
2. **FLIP Physics Engine**: We will use Framer Motion's `layout` prop to harness FLIP (First, Last, Invert, Play) animations. This allows the browser to calculate layout shifts on the GPU, so when an element expands, it physically pushes neighboring elements with momentum and a slight squash-and-stretch bounce.
3. **Interactive Micro-Springs**: We are abandoning CSS `:active` scales in favor of Framer Motion `whileTap` configurations to simulate realistic finger pressure.

## Physics Profiles Defined
We will use standardized spring physics across the library (conceptually defined as):
- **`fluidLayout`**: `{ type: "spring", stiffness: 500, damping: 25, mass: 1 }` (For neighbor-aware layout shifts like Accordions expanding).
- **`fluidPress`**: `{ type: "spring", stiffness: 600, damping: 20, mass: 1 }` (For interactive button/card presses).
- **`fluidPop`**: `{ type: "spring", stiffness: 400, damping: 25, mass: 0.9 }` (For elements entering the screen like Dialogs).

## Current Status
- We have successfully rebuilt the **Accordion** to prove out the physics-first architecture. 
- We have established a new two-step master plan:
  1. **Component Overhaul:** First, go through all UI components (Phases 1-4) and strip static CSS in favor of Framer Motion FLIP physics and `whileTap` micro-springs.
  2. **Site Construction:** Second, build the actual Antora documentation site and homepage UIs using these newly supercharged components.

## Immediate Next Step
Continue executing Phase 1 of the component overhaul.
- Next component up: **Collapsible**.
- Ensure to strip out static CSS transitions in `style-nova.css`.
- Wrap the core elements in `<motion.div layout>` and `<AnimatePresence>` for physics-driven neighbor-pushing momentum.
- Remember to run `pnpm registry:build` inside `apps/v4` after component edits so the Next.js dev server updates.
