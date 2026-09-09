# Antora UI

**Antora** is a production-grade React UI library built on top of the [shadcn/ui](https://ui.shadcn.com) v4 architecture. It fuses **Material 3 Expressive** design principles with **Native Fluidity** — deep Framer Motion integration that gives every layout shift physical mass, realistic squash-and-stretch physics, and neighbor-aware momentum.

![hero](apps/v4/public/opengraph-image.png)

## Core Philosophy

| Principle | What it means |
|---|---|
| **Material 3 Expressive** | Bold color scales, high-contrast opaque surfaces — no frosted glass |
| **iOS-Level Physics** | Framer Motion FLIP engine so expanding components push neighbors with spring momentum |
| **Micro-Springs** | `whileTap` springs simulate realistic finger pressure on every interactive element |
| **Source Ownership** | shadcn-style: copy components into your project and own the code |
| **Accessibility First** | WCAG-compliant, full keyboard navigation, reduced-motion aware |

## Quick Start

```bash
npx antora@latest init
npx antora@latest add button
```

```tsx
import { Button } from "@/components/ui/button"

export default function App() {
  return <Button>Create project</Button>
}
```

## Documentation

Visit [https://antora.thecodintant.in](https://antora.thecodintant.in) for full documentation and the interactive component registry.

## Component Status

All 40+ components have been migrated to the Framer Motion physics engine:

- **Phase 1** ✅ Structural layout (Accordion, Collapsible, Navigation Menu, Card, Tabs)
- **Phase 2** ✅ Interactive micro-springs (Button, Badge, Checkbox, Radio, Switch, Slider, Toggle, Input)
- **Phase 3** ✅ Spatial overlays (Dialog, Sheet, Popover, Dropdown, Context Menu, Hover Card, Tooltip, Command)
- **Phase 4** ✅ Data & display (Avatar, Calendar, Carousel, Table, Skeleton, Progress, Alert)

## Tech Stack

- **React 19** + **TypeScript**
- **Tailwind CSS** for utility styling
- **Framer Motion** (`motion/react`) for physics-based animation
- **Radix UI** primitives for accessible behavior
- **shadcn/ui** v4 registry architecture
- **Next.js 15** for the documentation site
- **pnpm** + **Turborepo** monorepo

## Monorepo Structure

```
antora/
├── apps/
│   └── v4/            # Documentation & registry site (Next.js)
├── packages/
│   ├── shadcn/        # CLI package
│   ├── react/         # React utilities
│   └── helpers/       # Shared helpers
├── registry/          # Component registry definitions
└── scripts/           # Build tooling
```

## Local Development

```bash
pnpm install
pnpm --filter=v4 registry:build   # generate styles/ (required once)
pnpm v4:dev                        # start docs site on :4000
```

> **Note:** The `styles/` directory is pre-built and committed to git so Vercel deployments skip the heavy registry build step. After running `registry:build` locally, commit the updated `styles/` directory.

## Contributing

Please read the [contributing guide](./CONTRIBUTING.md).

## License

Licensed under the [MIT license](./LICENSE.md).
