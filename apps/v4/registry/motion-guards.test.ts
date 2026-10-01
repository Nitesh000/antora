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
})
