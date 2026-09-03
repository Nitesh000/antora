/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "../../packages/components/**/*.{ts,tsx}",
    "../../apps/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-on-primary)",
          container: "var(--color-primary-container)",
          "container-foreground": "var(--color-on-primary-container)"
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-on-secondary)",
          container: "var(--color-secondary-container)",
          "container-foreground": "var(--color-on-secondary-container)"
        },
        surface: {
          DEFAULT: "var(--color-surface)",
          foreground: "var(--color-on-surface)",
          container: "var(--color-surface-container)",
          "container-high": "var(--color-surface-container-high)"
        },
        outline: "var(--color-outline)",
        error: {
          DEFAULT: "var(--color-error)",
          foreground: "var(--color-on-error)"
        }
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        full: "var(--radius-full)"
      },
      transitionDuration: {
        fast: "var(--motion-fast)",
        medium: "var(--motion-medium)",
        slow: "var(--motion-slow)"
      },
      transitionTimingFunction: {
        standard: "var(--easing-standard)",
        emphasized: "var(--easing-emphasized)",
        decelerate: "var(--easing-decelerate)",
        accelerate: "var(--easing-accelerate)"
      }
    }
  },
  plugins: [require("tailwindcss-animate")]
}
