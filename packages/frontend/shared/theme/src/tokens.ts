/**
 * Design tokens - single source of truth for all design values
 * Extracted from apps/desktop/src/styles.css
 */

// Color tokens (matching existing CSS variables)
export const colors = {
  bg: {
    primary: '#1e1e1e',
    secondary: '#252526',
    tertiary: '#2d2d2d',
    hover: '#3c3c3c',
    active: '#094771',
  },
  fg: {
    primary: '#cccccc',
    secondary: '#969696',
    muted: '#6e6e6e',
  },
  border: '#3c3c3c',
  accent: '#007acc',
  error: '#f14c4c',
  success: '#4ec9b0',
  warning: '#cca700',
} as const;

// Spacing scale (in pixels)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

// Typography
export const typography = {
  fontFamily: {
    sans: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
    mono: "'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace",
  },
  fontSize: {
    sm: 12,
    base: 13,
    lg: 14,
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Layout dimensions
export const layout = {
  sidebarWidth: 250,
  statusbarHeight: 22,
  titlebarHeight: 30,
} as const;

// Border radii
export const radii = {
  none: 0,
  sm: 2,
  md: 4,
  lg: 8,
  full: 9999,
} as const;

// Combined theme object
export const tokens = {
  colors,
  spacing,
  typography,
  layout,
  radii,
} as const;

export type Tokens = typeof tokens;

// Token type helpers for prop interfaces
export type SpacingToken = keyof typeof spacing;
export type FontSizeToken = keyof typeof typography.fontSize;
export type FontWeightToken = keyof typeof typography.fontWeight;
export type RadiusToken = keyof typeof radii;

// Color tokens - flattened for easy use in props
export type BgColorToken = `bg-${keyof typeof colors.bg}`;
export type FgColorToken = `fg-${keyof typeof colors.fg}`;
export type SemanticColorToken = 'border' | 'accent' | 'error' | 'success' | 'warning';
export type ColorToken = BgColorToken | FgColorToken | SemanticColorToken;
