# Build “Expressive UI” — A Material 3 Expressive-Inspired React Web UI System

the name of the libaray would be `Antora`.

Create a production-grade React UI library for the web inspired by **Material 3 Expressive**, but designed from the ground up for modern web applications.

The library should combine:

**Material 3 Expressive design principles + expressive motion + spatial/neighbor-aware interactions + modern React architecture + shadcn-style source ownership.**

It should be capable of standing alongside libraries such as MUI, shadcn/ui, and Radix-based systems.

This is not a component-demo project. Treat it as the foundation of a serious, extensible design system.

The highest priorities are:

1. Architecture and maintainability
2. Developer experience
3. Expressive and spatial motion
4. Accessibility
5. Visual quality
6. TypeScript ergonomics
7. Documentation
8. Runtime performance
9. Extensibility
10. Consistency

---

## Start With Architecture, Not Components

Before writing a large amount of implementation code, first reason through the architecture.

Identify weaknesses or inconsistencies in the proposed structure and improve them where appropriate.

Establish:

- package boundaries
- component conventions
- naming conventions
- design-token conventions
- motion conventions
- accessibility conventions
- CLI/registry architecture
- component API philosophy
- testing strategy
- documentation structure

Only after those foundations are established should component implementation proceed.

Do not sacrifice architectural quality simply to produce more components quickly.

---

# Technology Direction

Use a modern React + TypeScript stack.

The preferred technologies are:

- React
- TypeScript
- Tailwind CSS where it genuinely helps
- CSS custom properties for the token/theme layer
- Radix UI primitives when they provide useful accessible behavior
- Motion / Framer Motion, or a stronger modern alternative if appropriate
- Lucide or another high-quality icon system
- Vite for package development/building
- pnpm
- Turborepo when the monorepo architecture benefits from it
- MDX for documentation
- Next.js for the documentation site when appropriate

Avoid dependency bloat.

Every external package should have a concrete reason to exist.

If a dependency introduces more complexity than value, prefer a small internal abstraction instead.

---

# Product Philosophy

The library should have a clear identity rather than looking like another Tailwind component collection.

The intended design language is:

> Material 3 Expressive thinking, adapted for the web, with modern spatial interaction and polished motion.

The interface should feel:

- responsive
- tactile
- alive
- deliberate
- polished
- modern

Motion should never exist merely because animation looks impressive. It should help communicate relationships, state, hierarchy, and user intent.

Avoid turning every hover state into a dramatic animation.

---

# Repository Design

Use a clean monorepo structure.

A reasonable starting point is:

```text
expressive-ui/
├── apps/
│   ├── docs/
│   └── playground/
│
├── packages/
│   ├── cli/
│   ├── components/
│   ├── primitives/
│   ├── motion/
│   ├── theme/
│   ├── icons/
│   ├── utilities/
│   └── config/
│
├── registry/
│   ├── components/
│   ├── hooks/
│   ├── utilities/
│   └── styles/
│
├── scripts/
│
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── README.md
```

This structure is a starting point, not a requirement. If a different organization produces clearer package boundaries or better long-term maintainability, use it.

Keep the following concerns clearly separated.

### Primitives

Low-level accessible behavior such as:

```text
DialogPrimitive
PopoverPrimitive
TooltipPrimitive
MenuPrimitive
TabsPrimitive
```

### Components

The public UI layer:

```text
Button
Card
Dialog
Popover
Tooltip
Tabs
Navigation
```

### Motion

The reusable animation infrastructure:

```text
Motion
Presence
AnimatedLayout
Spring
Stagger
SharedTransition
NeighborGroup
```

### Theme

Design tokens, semantic colors, typography, shape, density, and theming.

### Utilities

Small reusable React/TypeScript helpers.

### CLI and Registry

The machinery responsible for shadcn-style component installation, dependency resolution, configuration, and source generation.

---

# Two Ways to Consume the Library

Support both a traditional package workflow and a source-owned workflow.

Traditional installation:

```bash
npm install expressive-ui
```

Usage:

```tsx
import { Button } from "expressive-ui";
```

The second workflow should resemble shadcn:

```bash
npx expressive-ui@latest init
npx expressive-ui@latest add button
npx expressive-ui@latest add dialog
npx expressive-ui@latest add navigation-menu
```

Also support the equivalent pnpm workflow:

```bash
pnpm dlx expressive-ui@latest add button
```

The exact CLI implementation can evolve, but the resulting developer experience should be this simple.

---

# Source-Owned Components

When a developer installs a component through the registry, the implementation should be copied into their application.

For example:

```text
src/
└── components/
    └── ui/
        └── button.tsx
```

The developer should then be free to change that source.

The architecture should make this ownership model feel natural rather than fighting against the underlying library.

The registry and the package-based components should still be powered by the same fundamental component architecture where practical.

---

# CLI and Registry

Create a registry system modeled conceptually after shadcn.

Each registry entry should describe its files and dependencies.

For example:

```json
{
  "name": "button",
  "type": "registry:ui",
  "dependencies": [],
  "files": ["components/ui/button.tsx"]
}
```

The CLI must resolve dependencies intelligently.

For example:

```text
dialog
 ├── dialog.tsx
 ├── dialog-motion.tsx
 └── required primitives/utilities
```

Installing a component should bring in what it actually requires without unnecessarily duplicating unrelated code.

The registry should eventually support:

- components
- hooks
- utilities
- styles
- motion primitives
- component dependencies

---

# Component API Philosophy

The TypeScript API should be deliberately designed rather than copied from MUI.

Favor APIs that are:

- predictable
- composable
- discoverable
- strongly typed
- consistent
- reasonably small

For straightforward components, a simple API is preferable:

```tsx
<Button variant="primary" size="md">
  Create
</Button>
```

Variants should use consistent terminology across the system.

Do not let every component invent a completely different vocabulary.

At the same time, avoid turning every component into a giant prop-driven configuration object.

For complex interfaces, use composition.

For example:

```tsx
<Button>
  <Button.Icon>
    <Plus />
  </Button.Icon>

  <Button.Label>Create project</Button.Label>
</Button>
```

But only introduce compound composition when it genuinely improves flexibility or readability.

---

# TypeScript Standards

TypeScript should be treated as a core part of the product.

Use strict TypeScript and avoid `any` unless there is a compelling reason.

Prioritize:

- accurate ref forwarding
- excellent inference
- useful IntelliSense
- variant typing
- accessible prop types
- correctly typed events
- polymorphic components where they provide real value
- exported public types

The API should feel natural inside VS Code rather than requiring users to fight complicated generic types.

Prefer understandable type definitions over clever ones.

---

# Design Token Architecture

Build a proper semantic token system using CSS variables.

For example:

```css
--color-primary
--color-on-primary
--color-surface
--color-surface-container
--color-outline
--color-error

--radius-sm
--radius-md
--radius-lg
--radius-xl

--motion-fast
--motion-medium
--motion-slow

--easing-standard
--easing-emphasized
```

Tokens should generally describe design meaning rather than individual components.

The system should support:

- light mode
- dark mode
- custom themes
- high contrast
- reduced motion
- configurable density
- custom typography

Avoid scattering arbitrary values throughout component implementations.

---

# Material 3 Expressive Adaptation

Use Material 3 Expressive as conceptual inspiration rather than treating it as a specification to copy literally.

Pay particular attention to:

### Shape

Shapes should establish relationships between elements and can become more expressive depending on context.

### Color

Use semantic roles instead of hard-coded component colors.

### Typography

Establish a coherent typographic hierarchy.

### Elevation

Use elevation selectively rather than covering everything in heavy shadows.

### States

Interactive controls should communicate:

- hover
- focus
- pressed
- selected
- disabled
- loading
- dragged
- expanded

---

# Build a Real Motion System

Motion is a defining part of this library.

Do not implement animation by simply adding:

```css
transition: all 200ms;
```

to components.

Instead, create a centralized motion architecture.

A possible organization:

```text
motion/
├── primitives/
│   ├── fade.tsx
│   ├── scale.tsx
│   ├── slide.tsx
│   ├── spring.ts
│   └── presence.tsx
│
├── layout/
│   ├── layout-group.tsx
│   └── shared-layout.tsx
│
├── neighbors/
│   ├── neighbor-group.tsx
│   ├── neighbor-item.tsx
│   └── neighbor-context.tsx
│
├── gestures/
│   ├── hover.ts
│   ├── press.ts
│   └── drag.ts
│
└── presets/
    ├── expressive.ts
    ├── subtle.ts
    └── reduced.ts
```

Improve this structure if implementation reveals a better abstraction.

Components should consume these motion primitives instead of each component inventing its own animation system.

---

# Expressive Motion Modes

Provide a global and/or component-level way to control motion intensity.

For example:

```tsx
<ExpressiveProvider
  motion={{
    intensity: "expressive",
    reducedMotion: "system",
  }}
>
```

Components could support an equivalent concept such as:

```tsx
motion = "expressive";
motion = "subtle";
motion = "none";
```

The exact API can be refined during implementation.

Support spring-based motion where appropriate and centralize timing/easing values.

---

# Neighbor-Aware Animation

This should be one of the library's signature capabilities.

When one element changes state, surrounding elements should have the ability to respond to that change.

For example, in navigation:

- the active item can animate
- the selection indicator can move spatially
- neighboring items can subtly react
- spacing can transition naturally

For tabs:

- the indicator should travel between tabs
- surrounding tabs can participate in the transition
- layout changes should remain fluid

For lists:

- inserting/removing an item should cause nearby elements to reposition naturally

For cards:

- focusing one card can subtly influence adjacent cards

Create reusable primitives such as:

```tsx
<NeighborGroup>
  <NeighborItem>...</NeighborItem>

  <NeighborItem>...</NeighborItem>

  <NeighborItem>...</NeighborItem>
</NeighborGroup>
```

Potential configuration:

```tsx
<NeighborGroup
  influence="subtle"
  radius={2}
>
```

The API can change if a better model is discovered.

Neighbor effects should be opt-in rather than forced on every component.

---

# Spatial and Shared Transitions

Support transitions where an element appears to physically move between states instead of disappearing and reappearing.

Useful cases include:

- tabs
- segmented controls
- navigation indicators
- menus
- cards
- dialogs
- expanding containers
- selected states

Provide reusable layout primitives such as:

```tsx
<MotionLayout>...</MotionLayout>
```

Use layout animation carefully and avoid introducing unnecessary layout work or visual jank.

---

# Accessibility Is Non-Negotiable

Follow WCAG principles and established WAI-ARIA interaction patterns.

Components need to handle:

- keyboard navigation
- focus management
- screen-reader semantics
- correct ARIA behavior
- disabled states
- focus-visible states
- reduced motion

Respect:

```css
prefers-reduced-motion
```

When reduced motion is enabled, remove unnecessary movement while preserving understandable state changes.

Visual polish must never come at the expense of accessibility.

---

# Initial Component Roadmap

Do not attempt to implement the complete component catalog immediately.

Start with a high-quality foundation.

### Core UI

```text
Button
IconButton
Link
Typography
Box / Stack
Divider
Avatar
Badge
Chip
Card
Surface
```

### Forms

```text
Input
Textarea
Label
Checkbox
Radio
Switch
Select
Slider
Date Picker
Field
Form
```

### Feedback

```text
Alert
Toast
Snackbar
Progress
Spinner
Skeleton
```

### Navigation

```text
Tabs
Breadcrumb
Pagination
Navigation Bar
Navigation Rail
Sidebar
Menu
Dropdown Menu
```

### Overlays

```text
Dialog
Drawer
Popover
Tooltip
Hover Card
Context Menu
```

### Layout

```text
Container
Grid
Stack
Aspect Ratio
Scroll Area
Resizable Panels
```

### Advanced

```text
Command
Combobox
Data Table
Calendar
Carousel
Accordion
Collapsible
Tree
Stepper
```

The first release should favor a smaller number of excellent components over dozens of mediocre ones.

---

# Documentation Is a First-Class Product

Create a polished documentation website that feels like a real developer platform.

Use a structure along these lines:

```text
Introduction
Installation
CLI
Theming
Motion
Accessibility
Customization
Components
    Button
    Card
    Dialog
    ...
Examples
Patterns
Playground
Changelog
```

Every component page should cover:

1. What the component does
2. When to use it
3. When not to use it
4. Installation
5. Basic usage
6. Variants
7. Interactive examples
8. Motion behavior
9. Accessibility
10. Customization
11. API
12. Source code

For example:

```text
Button

Buttons communicate actions and should use visual emphasis
appropriate to the importance of that action.

[Interactive Preview]

Installation

npx expressive-ui@latest add button

Usage

<ExpressiveButton>
  Create project
</ExpressiveButton>

Variants

[Interactive previews]

Motion

[Motion playground]

API
```

Documentation should explain design reasoning rather than simply listing props.

---

# Interactive Documentation

Do not make the docs a collection of static screenshots.

Interactive examples should allow developers to experiment with the system.

Expose controls such as:

```text
Theme
├── Light
└── Dark

Motion
├── None
├── Subtle
├── Expressive
└── Dramatic

Radius
├── Small
├── Medium
├── Large
└── Extra Large

Density
├── Compact
├── Comfortable
└── Spacious
```

Changing these controls should immediately affect the examples.

For motion-related documentation, allow users to experiment with relevant animation parameters.

---

# Build a Playground

Create a dedicated playground for experimenting with the design system.

Developers should be able to adjust:

- theme
- color
- radius
- density
- motion intensity
- animation speed
- component variants
- light/dark mode

The result should update live.

This playground can eventually become one of the main ways users learn the system.

---

# Example Component Experience

A developer should be able to write something as straightforward as:

```tsx
<Navigation>
  <Navigation.Item active>Home</Navigation.Item>

  <Navigation.Item>Projects</Navigation.Item>

  <Navigation.Item>Settings</Navigation.Item>
</Navigation>
```

and automatically receive:

- an expressive active indicator
- polished hover behavior
- neighbor-aware interaction
- keyboard navigation
- accessible semantics
- smooth layout transitions

The developer should not need to understand the internal animation implementation to benefit from it.

---

# Performance Requirements

Treat performance as part of the component architecture.

The library should aim for:

- tree-shakable packages
- minimal runtime overhead
- minimal unnecessary rendering
- lazy loading of expensive animation capabilities where useful
- GPU-friendly animation
- avoidance of layout thrashing
- careful observer usage
- transforms/opacity for animation whenever appropriate

Animations should remain smooth and target 60fps where practical.

Do not introduce expensive abstractions simply because they make an animation easier to implement.

---

# Testing Strategy

Build real tests rather than relying only on manual inspection.

Cover:

- component behavior
- keyboard interaction
- accessibility
- focus management
- animation behavior
- reduced-motion behavior
- light/dark themes
- responsive behavior
- composition
- visual regressions where appropriate

Use appropriate tooling for unit, component, accessibility, interaction, and visual testing.

---

# Codebase Standards

The source should look like a codebase that experienced engineers would be comfortable maintaining.

Avoid:

- unnecessary abstractions
- duplicated logic
- enormous files
- unexplained utilities
- magic numbers
- arbitrary animation values
- inconsistent naming
- component-specific tokens when semantic tokens would work
- unrelated concerns crossing package boundaries

Centralize design tokens and motion tokens.

Keep exports deliberate.

Favor readable code over clever code.

Every abstraction should justify its existence.

---

# Developer Journey

The ideal first-time experience should look approximately like this:

```bash
npx expressive-ui@latest init
```

Then:

```bash
npx expressive-ui@latest add button
```

Then:

```tsx
<Button>Create project</Button>
```

A developer should be able to reach a polished result within minutes without needing to understand the internals.

---

# Implementation Plan

Work incrementally.

### Stage 1 — Pivot to Official Shadcn Architecture

Instead of reinventing the CLI, documentation, and registry logic, we have adopted the `shadcn-ui/ui` monorepo base. 

Establish:
- Clone Shadcn monorepo
- Verify the exact V4 doc framework operates correctly
- Inject custom design tokens (Material 3 Expressive colors, typography, shapes)
- Inject Framer Motion capabilities

The goal is to prove the architecture.

### Stage 2 — The Liquid Expressive Overhaul (Cross-Base)

**Goal**: Implement the "Liquid Glass" motion effect and M3 Expressive bold visuals across **all** Shadcn primitive bases (Radix, React Aria, Base UI) while maintaining strict performance and minimal bundle size.

*   Read `.agent/motion-and-aesthetics.md` for exact physics profiles and CSS vs JS routing.
*   Update `style-expressive.css` to remove all translucent/frosted glass and use bold, opaque M3 colors.
*   Add custom Tailwind `ease-liquid` for zero-JS CSS micro-interactions.
*   Rewrite `Tabs`, `Dialog`, `Checkbox`, `Radio`, and `Switch` across `bases/radix`, `bases/aria`, and `bases/base` to use the `liquidLayout` and `liquidPop` profiles.

### Stage 3 — Forms & Layout

Implement:

- Select
- Checkbox
- Radio
- Switch
- Slider
- Form

Maintain strong accessibility and consistent state behavior.

### Stage 4 — Advanced Navigation & Components

Add:

- Navigation Menu
- Sidebar
- Breadcrumb
- Pagination
- Command
- Combobox
- Data Table

Only build these once the underlying primitives are mature.

---

# Final Quality Bar

Do not judge success by the number of components.

Judge it by whether the resulting project could realistically become a major open-source UI framework.

The architecture should be strong enough to support many years of additional components and features.

The motion system should feel like an intentional part of the design language rather than decoration.

The registry should make source ownership effortless.

The CLI should feel natural.

The documentation should teach both usage and design reasoning.

The components should be accessible, type-safe, performant, customizable, and visually coherent.

Most importantly, avoid producing something that is merely:

> “Tailwind components with Material-looking colors and some Framer Motion animations.”

Build an actual design system with a distinct interaction model, strong engineering foundations, and a coherent visual language.
