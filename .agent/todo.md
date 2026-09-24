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
- **ToggleGroup (aria) same shape bug as ButtonGroup**: connecting-border logic relied on `first:border-l` on the inner toggle item, which trivially matches for every item since each is wrapped in its own private `motion.span` (breaking real first-child detection). Swapped to a `-ml-px`/`-mt-px` border-overlap technique applied to the *wrapper*, keyed off `:not(:first-child)` at the correct (wrapper) level. Swept the rest of `aria` for the same `first:`/`last:`/sibling-combinator + `motion.span` combination — nothing else matched.
- **`.cn-rtl-flip` had zero CSS definition anywhere in the repo** despite 31 usages across Calendar/DropdownMenu/ContextMenu chevrons — RTL icon flipping silently did nothing. Added `.cn-rtl-flip { @apply rtl:-scale-x-100; }` to all 9 `registry/styles/style-*.css` files (the files that actually ship in the published registry payload, unlike `app/globals.css` which is docs-site-only and wouldn't reach a consumer's installed components).
- Verified with `build-registry.mts` + full `next build` (741/741 pages, clean) and spot-checked the generated `styles/*` output for both the Button position-split and the Accordion height fix.
- Systematic sweep of every `aria` component using the `motion.span` wrapper pattern for the 3 known bug classes (position-vs-transform conflict, sibling-selector breakage, `transition-all` conflict) — Badge, Input, Switch, RadioGroup, Checkbox, Tabs, InputOTP all checked clean. Finished the `SidebarMenuAction`/`SidebarGroupAction` motion treatment for `radix` and `base` (deliberately left incomplete earlier), removing their own `transition-transform` conflicts in the process. Attempted the same for `aria`'s `SidebarMenuAction`, but reverted it: `.cn-sidebar-menu-action` positions itself via `peer-data-[size=x]/menu-button:top-*`, a true CSS sibling selector against `SidebarMenuButton` — wrapping it in the `motion.span` RAC requires would nest it one level deeper, breaking the sibling relationship the CSS depends on. `SidebarGroupAction` (aria) was safe to convert since it was already a plain `<button>` (no RAC wrapper needed).

## Bug fix pass 3: Menubar animated + a systemic `data-open` vs `data-state` bug found across shared classes
- **Menubar had zero animation across all bases** (never tracked in any phase, same oversight class as Sidebar). Animated via the native `data-[state=]` CSS approach (learned from the DropdownMenu bug — no custom AnimatePresence).
- **While fixing it, found `.cn-menubar-content`/`.cn-menubar-sub-content` already had *some* animation classes, but used the wrong attribute entirely**: `data-open:`/`data-closed:` (Tailwind's literal-boolean-attribute variant) instead of `data-[state=open]:`/`data-[state=closed]:` (attribute-value variant). Confirmed via Radix's own source (`@radix-ui/react-menubar`: `"data-state": open ? "open" : "closed"`) that Radix never sets a literal `data-open` attribute — so this animation never fired for `radix/menubar.tsx`. My first attempt at fixing this *replaced* `data-open:` with `data-[state=open]:`, which broke it for `base/menubar.tsx` instead: confirmed via Base UI's own source (`@base-ui/react/utils/popupStateMapping.mjs`: `CommonPopupDataAttributes.open = "data-open"`) that Base UI *does* use the literal attribute. Corrected by adding both variants side by side rather than replacing.
- **Same investigation revealed the identical bug pre-existing (not something I introduced) across 9 more shared classes actually consumed by `radix/*.tsx`**, meaning their hover/active/entrance/exit states never worked for Radix specifically: `cn-context-menu-sub-trigger`, `cn-context-menu-sub-content`, `cn-dropdown-menu-sub-trigger`, `cn-dropdown-menu-sub-content`, `cn-menubar-sub-trigger`, `cn-navigation-menu-trigger`, `cn-navigation-menu-content`, `cn-navigation-menu-viewport`, `cn-select-content`, `cn-sidebar-menu-button` (verified each via Radix's `@radix-ui/react-navigation-menu` source too: Trigger/Content/Viewport all confirmed `data-state`-based). Fixed by adding `data-[state=open]:`/`data-[state=closed]:` variants alongside the existing `data-open:`/`data-closed:` ones in all 9 style files — additive, not destructive, so Base UI consumers of the same shared classes keep working. `cn-combobox-content` was correctly left untouched: despite living in the `radix` folder, it's genuinely built on `@base-ui/react`'s Combobox primitive, so `data-open:` was already correct there.
- Verified with `build-registry.mts` + full `next build` (741/741 pages, clean) after every step, including after correcting my own menubar mistake.

## Bug fix pass 4: Checkbox/RadioGroup double-controlled-state risk
Applied the same "stop re-deriving and feeding back a duplicate controlled value" fix used for the overlay family to `Checkbox`, `RadioGroup`, and `Tabs` across radix/base/ny (aria doesn't have this pattern). `Tabs` was a higher-risk case since `TabsContent`'s entire panel (not just a decorative indicator) is gated by `AnimatePresence`+`forceMount`, structurally closer to the confirmed-broken DropdownMenu shape. These weren't confirmed-broken like DropdownMenu — their *interactive* element (the actual checkbox/radio button) is always rendered normally; only the decorative indicator icon is gated by `AnimatePresence`, which is a meaningfully safer shape than DropdownMenu's entire content being gated. But they carried the exact same double-controlled-state risk (`checked`/`value` re-derived by us and fed back into the primitive's own `useControllableState`), so fixed proactively: the primitive's Root now receives the consumer's original `checked`/`value`/`defaultChecked`/`defaultValue` untouched (Radix/Base UI remains sole source of truth), while a separate local mirror — updated only via the `onCheckedChange`/`onValueChange` side-channel, never fed back — drives the `AnimatePresence` gate.

## Bug fix pass 5: `new-york-v4` had the exact same "doesn't open" bug as radix, never fixed
Critical gap: the earlier revert-to-native-CSS fix for the overlay family was applied to **radix only**. `new-york-v4` uses the identical `radix-ui` package underneath (same architecture, same risk), and its DropdownMenu/ContextMenu/Popover/HoverCard/Tooltip/Sheet/Dialog/AlertDialog had all been ported from the exact same broken custom-`AnimatePresence`-wrapper pattern — confirmed by diffing `new-york-v4/dropdown-menu.tsx` against the pre-fix radix version (byte-for-byte identical shape). Since `new-york-v4` is the **default/flagship style**, this was a high-priority gap. Reverted all 8 to the same native `data-[state=]`-driven CSS approach used for radix. Also applied the lighter "stop feeding derived state back to Root" hardening to `base`'s remaining overlay Roots (Popover, HoverCard, Tooltip, Sheet, AlertDialog, Dialog, DropdownMenu) via a bulk script, since Base UI's architecture wasn't specifically implicated but the pattern was still worth de-risking; `context-menu.tsx` (base) already used a simpler uncontrolled-only pattern. `aria` confirmed clean (no double-controlled-state pattern anywhere in its overlay family).

Caught and fixed one real regression from my own edit: a duplicate `import { XIcon } from "lucide-react"` in `new-york-v4/dialog.tsx` that broke the Turbopack build (`the name XIcon is defined multiple times`) — caught immediately by the full `next build` verification.

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
