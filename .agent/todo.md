# Antora Expressive UI - Full Framer Motion Pivot Tracker

This document tracks the migration of components to the **Fluid iOS Physics** architecture, **per base library** (`base` = Base UI, `aria` = React Aria, `radix` = Radix UI, `ny` = new-york-v4 / shadcn default). The original tracker only checked components once (usually just the Radix variant was done), which was misleading — this version tracks all 4 independently.

Legend: ✅ done this pass · ⬜ still CSS-only, needs motion · — not applicable (component doesn't exist for that base)

## Phase 1: Structural & Layout
| Component | base | aria | radix | ny |
|---|---|---|---|---|
| Accordion | ✅ | ✅ | ✅ | ✅ |
| Collapsible | ✅ | ✅ | ✅ | ✅ |
| Navigation Menu | ✅ (trigger/link press physics only; popup positioner left as Base UI's own CSS-driven system — too risky to convert) | — | ✅ | ✅ |
| Card (expandable) | ✅ | ✅ | ✅ | ✅ |
| Tabs | ✅ | ✅ | ✅ | ✅ |

## Phase 2: Interactive Micro-Springs
| Component | base | aria | radix | ny |
|---|---|---|---|---|
| Button | ✅ | ✅ | ✅ | ✅ |
| Checkbox | ✅ | ✅ | ✅ | ✅ |
| Radio Group | ✅ | ✅ | ✅ | ✅ |
| Switch | ✅ | ✅ | ✅ | ✅ |
| Toggle / Toggle Group | ✅ | ✅ | ✅ | ✅ |
| Badge | ✅ | ✅ | ✅ | ✅ |
| Slider | ✅ | ✅ (CSS-only thumb scale; RAC has no asChild/render) | ✅ | ✅ |
| Input / Textarea | ✅ | ✅ (focus tracked manually via onFocus/onBlur since RAC has no asChild/render, whileFocus can't bubble through a wrapper) | ✅ | ✅ |

## Phase 3: Spatial Overlays (Pop & Travel)
| Component | base | aria | radix | ny |
|---|---|---|---|---|
| Dialog | ✅ | ✅ (CSS spring-easing; RAC's Modal owns its own exit-detection lifecycle, forcing AnimatePresence would break focus-trap teardown) | ✅ | ✅ |
| Sheet | ✅ | ✅ (CSS spring-easing, same rationale as Dialog) | ✅ | ✅ |
| Popover | ✅ | ✅ (CSS spring-easing) | ✅ | ✅ |
| Dropdown Menu | ✅ (SubContent kept CSS-only — it reused the animated Content internally, which broke since Submenu's own open state isn't in the top-level context; unrolled into a standalone impl) | ✅ (CSS spring-easing; also added missing entrance/exit animation to SubContent, which previously had no animate-in/out at all) | ✅ | ✅ (SubContent left CSS-only, matches radix precedent) |
| Context Menu | ✅ (same SubContent fix as Dropdown Menu) | ✅ (CSS spring-easing + SubContent entrance/exit added) | ✅ | ✅ (SubContent left CSS-only, matches radix precedent) |
| Hover Card | ✅ | ✅ (CSS spring-easing) | ✅ | ✅ |
| Tooltip | ✅ | ✅ (CSS spring-easing; also added missing duration, previously had animate-in/out but no timing) | ✅ | ✅ |
| Command / Combobox | ✅ (CommandDialog inherits Dialog springs for free; Combobox popup wrapped in its own AnimatePresence + fluidPop) | ✅ (CommandDialog inherits Dialog CSS springs for free; Combobox popup gets CSS spring-easing) | ✅ (uses Base UI Combobox primitive under the hood — same treatment as `base`) | ✅ (Combobox popup wrapped in AnimatePresence + fluidPop; CommandDialog inherits Dialog springs) |
| Sonner (Toast) | — | — | — | (delegated to library) |

**Phase 3 complete across all 4 bases.**

## Bug fix pass 2: concrete UI issues found by manual testing
- **Button (all 4 bases) "not animated"**: `buttonVariants` included `transition-all`, which fights Framer Motion's own JS-driven `whileTap` scale on the same `transform` property (CSS transitions apply to any style mutation matching their `transition-property`, including Motion-driven inline style changes), suppressing/distorting the spring. Narrowed to `transition-[color,background-color,border-color,box-shadow]` across radix/base/aria/ny — leaves `transform` entirely to Motion.
- **Accordion/Collapsible "springs to a height then moves down"**: the shared `fluidLayout` spring (`stiffness:500, damping:25`) is underdamped (critical damping ≈ 44.7), so animating `height: 0 → "auto"` with it genuinely overshoots the measured pixel height before settling back — visually reads as "grows too tall, then shrinks to fit." Added a separate `fluidHeight` spring (`damping:45`, no overshoot) used only for the height transition; kept the bouncier `fluidLayout` for the chevron rotation/layout shifts elsewhere, across all 8 files (accordion + collapsible × 4 bases).
- **Aria Dialog close button moves on hover/tap, Carousel arrows drift on hover**: `Button`/`LinkButton` (aria) wrap the real interactive element in an outer `motion.span` (needed since RAC has no `asChild`/`render`). Any `absolute`/`inset`/`translate` positioning classes passed via `className` landed on the *inner* element, while the *outer* wrapper (which Motion actually transforms) stayed an unpositioned, near-zero-size box — so scaling that wrapper visually shifted the absolutely-positioned child relative to where its own position classes said it should be. Fixed generically in `button.tsx`: positioning/transform utility classes are now auto-detected and moved to the wrapper, everything else stays on the inner element. Also fixed the wrapper always being `display:inline-flex` (broke `w-full` buttons in Cards) by switching to `display:flex; width:100%` when a `w-full`/`flex-1`/`grow` class is detected. Simplified the Dialog/Sheet close button JSX back to plain `className` usage now that the split happens automatically; Carousel prev/next needed no source change.
- **Base UI Dialog close button misaligned**: flattened a 3-level nested render-prop chain (`DialogPrimitive.Close` → `Button` → `ButtonPrimitive` → `motion.button`) down to one level (`Close` → `motion.button` directly, styled via `buttonVariants()` applied straight to `Close`) to remove the compounding-merge risk entirely rather than keep tracing it blind.
- **Alert Dialog (radix) "not proper"**: was missing `isolate` on the overlay (present on Dialog's, inconsistently dropped here) — added for consistency. (The bulk of the alert-dialog issue was the native-`data-state` revert from the previous bug-fix pass.)
- **Button Group (aria) "not shaped properly"**: the connecting-border-radius logic used a CSS *sibling* combinator (`[data-slot]~[data-slot]`) to detect "not the first button in the group," but since every aria `Button` wraps itself in its own `motion.span`, the actual `[data-slot=button]` elements are never true siblings (each has a different, unique wrapper parent) — so the selector could never match, and every button kept full corner rounding instead of merging into a connected pill. Fixed the selector to key off the *wrapper* spans (the true direct children) via `[&>*:not(:first-child)_[data-slot]]`, correctly reaching through the extra nesting. radix/base/ny don't wrap in an extra span, so their existing selectors were already structurally correct.
- Verified with `build-registry.mts` + full `next build` (741/741 pages, clean) and spot-checked the generated `styles/*` output for both the Button position-split and the Accordion height fix.

## Bug fix pass: radix overlay family didn't actually open
User reported dropdown menus (and the Popover-based date picker) simply didn't open. Root cause: a prior pass (not this session's radix work originally, but I had also copied the same pattern into `alert-dialog.tsx` myself) wrapped Radix's `Content`/`Overlay` in a **custom React-controlled `open` state + `AnimatePresence` + `asChild forceMount`**, fully bypassing Radix's own battle-tested `data-state="open"/"closed"` mount lifecycle. Static analysis (types, build) couldn't surface the runtime failure, and rather than keep guessing blindly at the exact failure point inside that custom wrapper, I removed the entire risk category by reverting to Radix's **native** `data-state`-driven CSS animation (matching upstream shadcn exactly — guaranteed correct), with spring-like `cubic-bezier` easing curves layered on top instead of Motion. Fixed: `dropdown-menu.tsx`, `context-menu.tsx`, `popover.tsx` (backs the date picker), `dialog.tsx`, `sheet.tsx`, `alert-dialog.tsx`, `hover-card.tsx`, `tooltip.tsx` (all radix). `select.tsx`/`menubar.tsx` (radix) never had this pattern. `combobox.tsx` (radix) uses Base UI's primitive under the hood via `render`/`keepMounted`, a different and not-implicated mechanism — left alone. Verified via full `next build` (741/741 pages) and confirmed the generated `styles/radix-nova/ui/*.tsx` output no longer references `AnimatePresence` at all.

## Phase 4: Data & Display
| Component | base | aria | radix | ny |
|---|---|---|---|---|
| Avatar | ✅ (Image/Fallback via `render` + fade-scale pop) | ✅ (hand-rolled img/div, animated directly via load-state) | ✅ (Image/Fallback via `asChild` + fade-scale pop) | ✅ |
| Breadcrumb | skipped — pure static links, no interactive state; forcing `"use client"` for zero real motion isn't worth losing RSC compatibility | | | |
| Calendar | ✅ (nav + day cells reuse animated Button) | ✅ (nav reuses Button; day cells got `active:scale-90` CSS since RAC CalendarCell can't be `motion`-wrapped without breaking date semantics) | ✅ (reuses Button) | ✅ (reuses Button) |
| Carousel | ✅ (nav buttons reuse animated Button; track itself intentionally left to Embla — fighting its own transform engine with Motion would break drag) | ✅ | ✅ | ✅ |
| Pagination | ✅ (reuses Button via asChild) | ✅ (LinkButton already had press physics) | ✅ (reuses Button via asChild) | ✅ (was rendering a static `buttonVariants()` class string on a raw `<a>` — upgraded to real `Button asChild`, matching radix) |
| Resizable | ✅ (CSS-only hover/active grip scale — the drag itself must stay 1:1 with the pointer, so no spring physics on the actual resize, matching the library's own guidance to use plain hover/active styles) | ✅ | ✅ | ✅ |
| Scroll Area | ✅ (thumb tracks the pointer 1:1 during drag — no spring; added a subtle hover/active color-deepen instead) | ✅ | ✅ | ✅ |
| Separator | skipped — purely decorative, no interactive state to animate |
| Table | skipped — rows already use appropriate CSS `hover:` transitions; no discrete state change that would benefit from spring physics |
| Skeleton | skipped — needs a continuous ambient CSS pulse, not physics triggered by a state change; CSS is the correct tool here |
| Progress | ✅ (CSS spring-easing on width — Base UI's Indicator computes+re-applies its own inline `width` style every render, which would fight a Motion-controlled width; safer to keep CSS here) | ✅ (indicator is our own plain `<span>`, no library-owned style merge, so real spring motion applies safely) | ✅ | ✅ |
| Spinner | skipped — CSS rotation is the correct tool for a continuous loading indicator, not spring physics |
| Alert / Alert Dialog | ✅ | ✅ (CSS spring-easing, same rationale as Dialog) | ✅ | ✅ |

## Phase 5: Site Build & Homepage UIs
- [x] Homepage hero: staggered entrance (header, badge, heading, description, CTAs, cards) with spring physics
- [x] SiteHeader slide-down entrance
- [x] MainNav staggered items
- [x] CardsDemo staggered columns
- [x] SiteFooter scroll-triggered fade-in
- [x] ModeSwitcher / GitHubLink spring press via shared `SpringWrap`
- [x] Marketing sections with heavy physics interactions — N/A, the homepage has no additional marketing content beyond Hero + CardsDemo (both already animated); not inventing new sections that don't exist
- [x] Docs layout fluid wiring — found `Sidebar` had never been tracked in any phase and was still using flat `ease-linear` CSS transitions for desktop collapse/expand across all 4 bases (mobile sidebar already inherited spring physics for free via the animated `Sheet`). Fixed:
  - Desktop collapse/expand (`sidebar-gap`/`sidebar-container`) upgraded from `duration-200 ease-linear` to `duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]` (iOS-style momentum, no overshoot — a persistent structural chrome element shouldn't bounce on every toggle) across radix/base/aria (inline) and the shared `.cn-sidebar-gap` CSS class (9 style files)
  - `SidebarRail` hover transition upgraded from `ease-linear` to `duration-200 ease-out`
  - `SidebarMenuButton` (the actual clicked nav item) given real `whileTap` press physics across all 4 bases — radix/ny via conditional `motion.button`/`Slot.Root` split (matches the established Button precedent: `asChild` opts out of motion since Slot can't reliably host it), base via `render` fallback to `motion.button` when no custom render is supplied, aria via an outer `motion.div` wrapper (`display:flex; width:100%` since this is a block-level `w-full` item, not a compact pill like `LinkButton`)
  - `SidebarMenuAction`/`SidebarGroupAction` (secondary "..." buttons) given the same treatment for `new-york-v4` only — stopped there given diminishing returns on a lower-traffic surface; radix/base/aria's secondary actions still use the old `Slot`/`button` split without motion

## Done: Point install commands at our own registry
All 187 `npx shadcn@latest add <component>` commands across 184 `content/docs/components/{aria,base,radix}/*.mdx` pages now point to `https://antora.thecodintant.in/r/styles/<radix|aria|base>-nova/<component>.json` (verified every target JSON file exists before the codemod ran). `CodeBlockCommand`'s pnpm/yarn/bun variants derive correctly since the shiki transformer just does string substitution on the `npx` prefix. Added a "Installing with the shadcn CLI" section to `content/docs/components/index.mdx` explaining both the zero-config full-URL install and the optional `@antora` registries shorthand (confirmed via `packages/shadcn/src/registry/constants.ts` that only `@shadcn` is a CLI builtin — the shorthand requires the consumer to opt in via their own `components.json`).

## Notes on approach per library
- **Radix**: `asChild` + `motion.element` wrapping the primitive, `forceMount` + `AnimatePresence` for content/indicators that need exit animation.
- **Base UI**: `render={<motion.element .../>}` prop (their asChild equivalent) merges DOM props automatically. Use `keepMounted` on Panel/Indicator components paired with our own React-level `{isOpen && ...}` gate for `AnimatePresence` exit control.
- **React Aria Components**: no element-swap API — wrap with an outer `motion.span`/`motion.div` (`display: inline-flex`) for press physics, and use `composeRenderProps` / exported `*StateContext` (e.g. `DisclosureStateContext`) to get boolean state for `AnimatePresence` gating.
- **new-york-v4**: same pattern as `radix` base since it also uses `radix-ui` under the hood, just with shadcn's own visual variant classes.
