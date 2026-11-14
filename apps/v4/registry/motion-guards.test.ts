import { readdirSync, readFileSync } from "node:fs"
import path from "node:path"
import { describe, expect, it } from "vitest"

// Static guards for the UI bug classes that kept regressing in the overlay /
// motion pass. They read the registry sources directly, so they run without a
// browser and fail with the offending file name.

const registryRoot = __dirname
const uiDirs = [
  "bases/base/ui",
  "bases/radix/ui",
  "bases/aria/ui",
  "new-york-v4/ui",
]

const sources = uiDirs.flatMap((dir) =>
  readdirSync(path.join(registryRoot, dir))
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => ({
      id: `${dir}/${file}`,
      code: readFileSync(path.join(registryRoot, dir, file), "utf8"),
    }))
)

const styleCss = readdirSync(path.join(registryRoot, "styles"))
  .filter((file) => file.endsWith(".css"))
  .map((file) => ({
    id: `styles/${file}`,
    code: readFileSync(path.join(registryRoot, "styles", file), "utf8"),
  }))

describe("overlay motion guards", () => {
  it("never centers a popup with Motion x/y AND a Tailwind -translate-* class", () => {
    // Motion writes `transform: translateX(-50%) ...` while Tailwind v4's
    // -translate-x-1/2 writes the independent `translate` property, so the two
    // stack and the popup lands half its size off-center.
    const offenders = sources.filter(
      ({ code }) =>
        /(?:x|y):\s*"-50%"/.test(code) && /-translate-[xy]-1\/2/.test(code)
    )
    expect(offenders.map((o) => o.id)).toEqual([])
  })

  it("does not use an overshooting (elastic) easing on overlays", () => {
    // cubic-bezier(0.34, 1.56, 0.64, 1) overshoots its end value, which reads
    // as a jittery bounce on small popups (menus, tooltips, popovers).
    const offenders = [...sources, ...styleCss].filter(({ code }) =>
      /cubic-bezier\(\s*0\.34\s*,\s*1\.56\s*,\s*0\.64\s*,\s*1\s*\)/.test(code)
    )
    expect(offenders.map((o) => o.id)).toEqual([])
  })

  it("does not gate Base UI popups behind AnimatePresence", () => {
    // Base UI owns the mount/unmount lifecycle (data-starting-style /
    // data-ending-style / data-open / data-closed). Re-gating it in React
    // fights the primitive and double-applies transforms.
    const overlayFiles = [
      "dialog",
      "alert-dialog",
      "sheet",
      "popover",
      "dropdown-menu",
      "context-menu",
      "hover-card",
      "tooltip",
      "combobox",
    ]
    const offenders = sources.filter(
      ({ id, code }) =>
        /^bases\/(base|radix)\/ui\//.test(id) &&
        overlayFiles.some((name) => id.endsWith(`/${name}.tsx`)) &&
        code.includes("AnimatePresence")
    )
    expect(offenders.map((o) => o.id)).toEqual([])
  })

  it("never transitions `transform` for classes that set the `translate` property", () => {
    // Tailwind v4 translate-* utilities write `translate`, which
    // `transition-[transform,...]` does not cover, so the slide would snap.
    const offenders = sources.filter(
      ({ code }) =>
        /transition-\[transform[,\]]/.test(code) && /translate-[xy]-/.test(code)
    )
    expect(offenders.map((o) => o.id)).toEqual([])
  })

  it("keeps consumer children when a Radix primitive renders a Motion element via asChild", () => {
    // `<Primitive asChild {...props}><motion.x /></Primitive>` drops
    // `props.children`; the Motion element must render `{children}` itself.
    const selfClosingMotionChild =
      /<(?:[A-Z]\w*)\.(?:Root|Fallback|Link)\s+asChild\b[^>]*\{\.\.\.props\}[^>]*>\s*<motion\.\w+(?:[^<>]|=>|\{[^}]*\})*?\/>/
    const offenders = sources.filter(
      ({ id, code }) =>
        /^(bases\/radix|new-york-v4)\//.test(id) &&
        selfClosingMotionChild.test(code)
    )
    expect(offenders.map((o) => o.id)).toEqual([])
  })
  it("keeps Motion press wrappers out of the tab order in the aria base", () => {
    // Motion's whileTap makes a non-focusable element tabbable (tabindex=0)
    // unless a tabindex is already present. The aria wrappers sit around a
    // React Aria control that is itself focusable, so they would add a second
    // tab stop (and a square focus outline) per control.
    const offenders = sources.filter(({ id, code }) => {
      if (!id.startsWith("bases/aria/")) return false
      for (const match of code.matchAll(/<motion\.(?:span|div)\b/g)) {
        let depth = 0
        let end = match.index! + match[0].length
        for (; end < code.length; end++) {
          const char = code[end]
          if (char === "{") depth++
          else if (char === "}") depth--
          else if (char === ">" && depth === 0 && code[end - 1] !== "=") break
        }
        const tag = code.slice(match.index!, end)
        if (tag.includes("whileTap") && !tag.includes("tabIndex")) return true
      }
      return false
    })
    expect(offenders.map((o) => o.id)).toEqual([])
  })

  it("scales pressed Motion elements about the pointer (no lost edge clicks)", () => {
    // A centered whileTap scale shrinks the hit area under the pointer, so a
    // press within ~2px of the left/right edge ended on the parent and the
    // click was dropped. setPressOrigin pins transform-origin to the press.
    const offenders = sources.filter(({ id, code }) => {
      if (id.endsWith("/slider.tsx")) return false
      for (const match of code.matchAll(/<motion\.\w+/g)) {
        let depth = 0
        let end = match.index! + match[0].length
        for (; end < code.length; end++) {
          const char = code[end]
          if (char === "{") depth++
          else if (char === "}") depth--
          else if (char === ">" && depth === 0 && code[end - 1] !== "=") break
        }
        const tag = code.slice(match.index!, end)
        if (tag.includes("whileTap") && !tag.includes("setPressOrigin")) {
          return true
        }
      }
      return false
    })
    expect(offenders.map((o) => o.id)).toEqual([])
  })

  it("scopes the Tabs sliding indicator to its instance and keeps panels in flow", () => {
    // A constant layoutId is shared by every Tabs on the page (the indicator
    // flies between lists), and AnimatePresence popLayout + a blur filter pulls
    // the leaving panel out of flow so everything below it jumps.
    const tabs = sources.filter(({ id }) => id.endsWith("/tabs.tsx"))
    const offenders = tabs.filter(
      ({ code }) =>
        /layoutId="[^"]+"/.test(code) ||
        code.includes(`mode="popLayout"`) ||
        code.includes("blur(")
    )
    expect(offenders.map((o) => o.id)).toEqual([])
  })

  it("layers the Tabs indicator under the labels in every base", () => {
    // A z-10 trigger with a z-[-1] indicator let the sliding pill paint over
    // the neighbouring trigger's label mid-flight, and the line variant still
    // rendered a pill. Every base must draw a variant-aware indicator below a
    // z-10 label wrapper instead.
    const tabs = sources.filter(({ id }) => id.endsWith("/tabs.tsx"))
    const offenders = tabs.filter(
      ({ code }) =>
        !code.includes(`data-slot="tabs-indicator"`) ||
        !/group-data-\[variant=line\]\/tabs-list:/.test(code) ||
        code.includes("z-[-1]")
    )
    expect(tabs.length).toBe(4)
    expect(offenders.map((o) => o.id)).toEqual([])
  })

  it("keeps every spring near critical damping (no wobble past the target)", () => {
    // damping / (2 * sqrt(stiffness * mass)) below ~0.75 rings visibly: the
    // 500/25 spring threw a switch thumb 12% past its end and swung the
    // accordion chevron ~20 degrees past 180 before settling.
    const offenders: string[] = []
    for (const { id, code } of sources) {
      for (const m of code.matchAll(/\{\s*type:\s*"spring",([^}]*)\}/g)) {
        const read = (key: string) =>
          Number(new RegExp(`${key}:\\s*([0-9.]+)`).exec(m[1])?.[1] ?? NaN)
        const stiffness = read("stiffness")
        const damping = read("damping")
        const mass = Number.isNaN(read("mass")) ? 1 : read("mass")
        if (Number.isNaN(stiffness) || Number.isNaN(damping)) continue
        const ratio = damping / (2 * Math.sqrt(stiffness * mass))
        if (ratio < 0.75) offenders.push(`${id} (${ratio.toFixed(2)})`)
      }
    }
    expect(offenders).toEqual([])
  })

  it("keeps React Aria overlays visually identical to the shared style", () => {
    // The aria overlays use only their `-aria` class, so any visual drift from
    // the shared rule (radius, padding, shadow, scrim) shows up as a different-
    // looking hover card / tooltip / dialog in the aria base alone.
    const overlays = [
      "alert-dialog-content",
      "alert-dialog-overlay",
      "combobox-content",
      "context-menu-content",
      "context-menu-sub-content",
      "dialog-content",
      "dialog-overlay",
      "dropdown-menu-content",
      "dropdown-menu-sub-content",
      "hover-card-content",
      "popover-content",
      "select-content",
      "tooltip-content",
    ]
    const motion =
      /animate|fade-|zoom-|slide-|duration|ease|origin|data-entering|data-exiting|placement|data-\[side|data-side|data-open|data-closed|data-\[state|starting|ending|motion-/
    const offenders: string[] = []
    for (const { id, code } of styleCss) {
      const rules = new Map<string, Set<string>>()
      for (const m of code.matchAll(/\.([\w-]+)\s*\{\s*@apply\s+([^;]*);/g)) {
        rules.set(
          m[1],
          new Set(m[2].split(/\s+/).filter((t) => t && !motion.test(t)))
        )
      }
      for (const name of overlays) {
        const shared = rules.get(`cn-${name}`)
        const aria = rules.get(`cn-${name}-aria`)
        if (!shared || !aria) continue
        const same =
          shared.size === aria.size && [...shared].every((t) => aria.has(t))
        if (!same) offenders.push(`${id} cn-${name}-aria`)
      }
    }
    expect(offenders).toEqual([])
  })

  it("never references a cn-* marker class inside a style utility", () => {
    // The registry build strips every `cn-[a-z-]+` word from class strings, so
    // `[&>[data-slot]:not(.cn-button)]` shipped as `:not(.)`: invalid CSS that
    // made the docs site's globals.css fail to compile.
    const offenders: string[] = []
    for (const { id, code } of styleCss) {
      for (const m of code.matchAll(/@apply\s+([^;}]*)/g)) {
        for (const token of m[1].split(/\s+/)) {
          if (/cn-[a-z-]+/.test(token)) offenders.push(`${id}: ${token}`)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it("declares the motion dependency for every component that imports it", () => {
    // Without it, `shadcn add button` installs a file importing motion/react
    // into a project that doesn't have it, and the project fails to typecheck.
    const offenders: string[] = []
    for (const dir of uiDirs) {
      const registry = readFileSync(
        path.join(registryRoot, dir, "_registry.ts"),
        "utf8"
      )
      for (const { id, code } of sources) {
        if (!id.startsWith(`${dir}/`) || !code.includes("motion/react")) {
          continue
        }
        const name = id.slice(dir.length + 1, -".tsx".length)
        const entry = new RegExp(
          `\\n    name: "${name}",([\\s\\S]*?)\\n  \\},`
        ).exec(registry)
        if (!entry || !/\n    dependencies: \[[^\]]*"motion"/.test(entry[1])) {
          offenders.push(id)
        }
      }
    }
    expect(offenders).toEqual([])
  })

  it("does not put Motion layout projection on static Card containers", () => {
    const offenders = sources.filter(
      ({ id, code }) => id.endsWith("/card.tsx") && /\blayout\b/.test(code)
    )
    expect(offenders.map((o) => o.id)).toEqual([])
  })

  it("does not replay the enter animation of already-checked controls on mount", () => {
    // AnimatePresence defaults to initial={true}, so a pre-checked checkbox or
    // radio popped in (opacity 0 -> 1) on every page load / hydration.
    const offenders = sources.filter(
      ({ id, code }) =>
        /\/(checkbox|radio-group)\.tsx$/.test(id) &&
        /<AnimatePresence>/.test(code)
    )
    expect(offenders.map((o) => o.id)).toEqual([])
  })
})
