/**
 * CSS variable generator
 * Generates CSS custom properties from tokens
 */

import { colors, layout, radii, spacing, typography } from "./tokens";

/**
 * Generate CSS custom properties string for :root
 */
export function generateCSSVariables(): string {
  const lines: string[] = [":root {"];

  // Background colors
  for (const [name, value] of Object.entries(colors.bg)) {
    lines.push(`  --bg-${name}: ${value};`);
  }
  lines.push("");

  // Foreground colors
  for (const [name, value] of Object.entries(colors.fg)) {
    lines.push(`  --fg-${name}: ${value};`);
  }
  lines.push("");

  // Semantic colors
  lines.push(`  --border-color: ${colors.border};`);
  lines.push(`  --accent-color: ${colors.accent};`);
  lines.push(`  --error-color: ${colors.error};`);
  lines.push(`  --success-color: ${colors.success};`);
  lines.push(`  --warning-color: ${colors.warning};`);
  lines.push("");

  // Spacing
  for (const [name, value] of Object.entries(spacing)) {
    lines.push(`  --spacing-${name}: ${value}px;`);
  }
  lines.push("");

  // Typography - font families
  lines.push(`  --font-family: ${typography.fontFamily.sans};`);
  lines.push(`  --font-mono: ${typography.fontFamily.mono};`);

  // Typography - font sizes
  for (const [name, value] of Object.entries(typography.fontSize)) {
    lines.push(`  --font-size-${name}: ${value}px;`);
  }
  lines.push("");

  // Layout
  lines.push(`  --sidebar-width: ${layout.sidebar.default}px;`);
  lines.push(`  --sidebar-width-min: ${layout.sidebar.min}px;`);
  lines.push(`  --sidebar-width-max: ${layout.sidebar.max}px;`);
  lines.push(`  --bottom-panel-height: ${layout.bottomPanel.default}px;`);
  lines.push(`  --bottom-panel-height-min: ${layout.bottomPanel.min}px;`);
  lines.push(`  --bottom-panel-height-max: ${layout.bottomPanel.max}px;`);
  lines.push(`  --statusbar-height: ${layout.statusbarHeight}px;`);
  lines.push(`  --titlebar-height: ${layout.titlebarHeight}px;`);
  lines.push("");

  // Radii
  for (const [name, value] of Object.entries(radii)) {
    lines.push(`  --radius-${name}: ${value}px;`);
  }

  lines.push("}");
  return lines.join("\n");
}

/**
 * Get a CSS variable reference for a token
 */
export function cssVar(name: string): string {
  return `var(--${name})`;
}
