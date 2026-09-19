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
- [ ] Marketing sections with heavy physics interactions
- [ ] Docs layout fluid wiring

## Deferred: Point install commands at our own registry
Since we're sharing access to our own repo/deployment, the docs should tell people to install from **our** registry, not the upstream shadcn one.

**Finding:** every per-component doc page (`content/docs/components/{base,aria,radix}/*.mdx` — roughly 100+ files) hardcodes a literal `npx shadcn@latest add <component>` code block. This resolves against the default `https://ui.shadcn.com/r` registry (baked into the `shadcn` CLI's `REGISTRY_URL` constant in `packages/shadcn/src/registry/constants.ts`), not our components.

**Our registry already exists and is servable**: `scripts/build-registry.mts` outputs installable JSON to `public/r/styles/<style>/<component>.json` (e.g. `public/r/styles/base-nova/accordion.json`) as part of the normal build — no extra infra needed, it'll be live at `https://antora.thecodintant.in/r/styles/<style>/<component>.json` once deployed (confirmed `pnpm --filter=v4 build` runs the full registry build now).

**Plan when we pick this up:**
1. Decide the canonical style to recommend by default in docs (e.g. `base-nova` / `radix-nova` matching each page's base library).
2. Script a codemod/sed pass across `content/docs/components/**/*.mdx` replacing `npx shadcn@latest add <component>` with `npx shadcn@latest add ${siteConfig.url}/r/styles/<style>/<component>.json` (shadcn CLI supports installing directly from a URL, no custom CLI fork needed).
3. Double check `CodeBlockCommand`'s npm/yarn/bun variants still render correctly for URL-based `add` commands (component at `apps/v4/components/code-block-command.tsx`).
4. Verify `public/r/config.json` / `public/r/index.json` also reflect the right base URL for cross-referencing.

## Notes on approach per library
- **Radix**: `asChild` + `motion.element` wrapping the primitive, `forceMount` + `AnimatePresence` for content/indicators that need exit animation.
- **Base UI**: `render={<motion.element .../>}` prop (their asChild equivalent) merges DOM props automatically. Use `keepMounted` on Panel/Indicator components paired with our own React-level `{isOpen && ...}` gate for `AnimatePresence` exit control.
- **React Aria Components**: no element-swap API — wrap with an outer `motion.span`/`motion.div` (`display: inline-flex`) for press physics, and use `composeRenderProps` / exported `*StateContext` (e.g. `DisclosureStateContext`) to get boolean state for `AnimatePresence` gating.
- **new-york-v4**: same pattern as `radix` base since it also uses `radix-ui` under the hood, just with shadcn's own visual variant classes.
