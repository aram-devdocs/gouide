/**
 * Tailwind CSS preset generator
 * Generates a Tailwind preset from design tokens
 */

import { colors, radii, spacing, typography } from "./tokens";

/**
 * Generate a Tailwind CSS preset from tokens
 * Use this in tailwind.config.js: presets: [generateTailwindPreset()]
 */
export function generateTailwindPreset() {
  return {
    theme: {
      colors: {
        bg: Object.fromEntries(Object.entries(colors.bg).map(([k, v]) => [k, v])),
        fg: Object.fromEntries(Object.entries(colors.fg).map(([k, v]) => [k, v])),
        border: colors.border,
        accent: colors.accent,
        error: colors.error,
        success: colors.success,
        warning: colors.warning,
        // Keep some defaults for flexibility
        transparent: "transparent",
        current: "currentColor",
        white: "#ffffff",
        black: "#000000",
      },
      spacing: {
        ...Object.fromEntries(Object.entries(spacing).map(([k, v]) => [k, `${v}px`])),
        // Keep numeric scale for flexibility
        0: "0px",
        px: "1px",
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        5: "20px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
      },
      fontFamily: {
        sans: [typography.fontFamily.sans],
        mono: [typography.fontFamily.mono],
      },
      fontSize: Object.fromEntries(
        Object.entries(typography.fontSize).map(([k, v]) => [k, `${v}px`]),
      ),
      fontWeight: typography.fontWeight,
      lineHeight: Object.fromEntries(
        Object.entries(typography.lineHeight).map(([k, v]) => [k, String(v)]),
      ),
      borderRadius: {
        ...Object.fromEntries(
          Object.entries(radii).map(([k, v]) => [k, v === 9999 ? "9999px" : `${v}px`]),
        ),
        DEFAULT: `${radii.md}px`,
      },
    },
  };
}
