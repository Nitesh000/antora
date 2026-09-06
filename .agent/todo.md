# Antora Expressive UI - Full Framer Motion Pivot Tracker

This document tracks the migration of components to the **Fluid iOS Physics** architecture (deep Framer Motion integration for layout, squash-and-stretch, and neighbor momentum).

## Phase 1: Structural & Layout Components (High Priority)
*These components require `<motion.div layout>` to push neighbors natively.*
- [x] Accordion
- [x] Collapsible
- [x] Navigation Menu
- [x] Card (Expandable states)
- [x] Tabs (Content area height morphing)

## Phase 2: Interactive Micro-Springs
*Replacing CSS scales with `whileTap` springs.*
- [ ] Button
- [ ] Badge
- [ ] Checkbox
- [ ] Radio Group
- [ ] Switch
- [ ] Slider
- [ ] Toggle / Toggle Group
- [ ] Input / Textarea (Focus rings with spring layout)

## Phase 3: Spatial Overlays (Pop & Travel)
*Using `AnimatePresence` with spring entrances.*
- [ ] Dialog
- [ ] Sheet
- [ ] Popover
- [ ] Dropdown Menu
- [ ] Context Menu
- [ ] Hover Card
- [ ] Tooltip
- [ ] Command / Combobox
- [ ] Sonner (Toast)

## Phase 4: Data & Display
- [ ] Avatar
- [ ] Breadcrumb
- [ ] Calendar (Date Picker)
- [ ] Carousel
- [ ] Pagination
- [ ] Resizable
- [ ] Scroll Area
- [ ] Separator
- [ ] Table
- [ ] Skeleton
- [ ] Progress
- [ ] Spinner
- [ ] Alert / Alert Dialog

## Phase 5: Site Build & Homepage UIs
*Once all components are physics-enabled, we will build the actual Antora documentation site and homepage using these components.*
- [ ] Design and implement homepage UIs.
- [ ] Build marketing sections with heavy physics interactions.
- [ ] Wire up documentation layout utilizing the new fluid components.
