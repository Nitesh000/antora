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
| Dialog | ⬜ | ⬜ | ✅ | ✅ |
| Sheet | ⬜ | ⬜ | ✅ | ⬜ |
| Popover | ⬜ | ⬜ | ✅ | ⬜ |
| Dropdown Menu | ⬜ | ⬜ | ✅ | ⬜ |
| Context Menu | ⬜ | ⬜ | ✅ | ⬜ |
| Hover Card | ⬜ | ⬜ | ✅ | ⬜ |
| Tooltip | ⬜ | ⬜ | ✅ | ⬜ |
| Command / Combobox | ⬜ | ⬜ | — | ⬜ |
| Sonner (Toast) | — | — | — | (delegated to library) |

## Phase 4: Data & Display
| Component | base | aria | radix | ny |
|---|---|---|---|---|
| Avatar | ⬜ | ⬜ | — | ⬜ |
| Breadcrumb | ⬜ | ⬜ | — | ⬜ |
| Calendar | ⬜ | ⬜ | — | ⬜ |
| Carousel | ⬜ | ⬜ | — | ⬜ |
| Pagination | ⬜ | ⬜ | — | ⬜ |
| Resizable | ⬜ | ⬜ | — | ⬜ |
| Scroll Area | ⬜ | ⬜ | — | ⬜ |
| Separator | ⬜ | ⬜ | — | ⬜ |
| Table | ⬜ | ⬜ | — | ⬜ |
| Skeleton | ⬜ | ⬜ | — | ⬜ |
| Progress | ⬜ | ⬜ | ✅ | ⬜ |
| Spinner | ⬜ | ⬜ | — | ⬜ |
| Alert / Alert Dialog | ⬜ | ⬜ | — | ⬜ |

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
