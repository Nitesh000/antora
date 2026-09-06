# Antora Expressive UI - Full Framer Motion Pivot Tracker

This document tracks the migration of components to the **Fluid iOS Physics** architecture (deep Framer Motion integration for layout, squash-and-stretch, and neighbor momentum).

## Phase 1: Structural & Layout Components (High Priority)
*These components require `<motion.div layout>` to push neighbors natively.*
- [ ] Accordion
- [ ] Collapsible
- [ ] Navigation Menu
- [ ] Card (Expandable states)
- [ ] Tabs (Content area height morphing)

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
