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
- [x] Button
- [x] Badge
- [x] Checkbox
- [x] Radio Group
- [x] Switch
- [x] Slider
- [x] Toggle / Toggle Group
- [x] Input / Textarea (Focus rings with spring layout)

## Phase 3: Spatial Overlays (Pop & Travel)
*Using `AnimatePresence` with spring entrances.*
- [x] Dialog
- [x] Sheet
- [x] Popover
- [x] Dropdown Menu
- [x] Context Menu
- [x] Hover Card
- [x] Tooltip
- [x] Command / Combobox (Covered by Dialog/Popover)
- [x] Sonner (Toast) (Delegated to Sonner's internal physics engine)

## Phase 4: Data & Display
- [x] Avatar
- [x] Breadcrumb
- [x] Calendar (Date Picker)
- [x] Carousel
- [x] Pagination
- [x] Resizable
- [x] Scroll Area
- [x] Separator
- [x] Table
- [x] Skeleton
- [x] Progress
- [x] Spinner
- [x] Alert / Alert Dialog

## Phase 5: Site Build & Homepage UIs
*Once all components are physics-enabled, we will build the actual Antora documentation site and homepage using these components.*
- [ ] Design and implement homepage UIs.
- [ ] Build marketing sections with heavy physics interactions.
- [ ] Wire up documentation layout utilizing the new fluid components.
