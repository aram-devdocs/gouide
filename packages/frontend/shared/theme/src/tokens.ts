/**
 * Design tokens - single source of truth for all design values
 * Extracted from apps/desktop/src/styles.css
 */

// Color tokens (matching existing CSS variables)
export const colors = {
  bg: {
    primary: "#1e1e1e",
    secondary: "#252526",
    tertiary: "#2d2d2d",
    hover: "#3c3c3c",
    active: "#094771",
  },
  fg: {
    primary: "#cccccc",
    secondary: "#969696",
    muted: "#6e6e6e",
  },
  border: "#3c3c3c",
  accent: "#007acc",
  error: "#f14c4c",
  success: "#4ec9b0",
  warning: "#cca700",
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

// Glassmorphism tokens
export const glass = {
  blur: {
    none: 0,
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
  opacity: {
    transparent: 0,
    light: 0.3,
    medium: 0.5,
    heavy: 0.7,
    opaque: 0.95,
  },
  borderOpacity: {
    none: 0,
    subtle: 0.1,
    visible: 0.2,
    strong: 0.3,
  },
} as const;

// Animation tokens
export const animation = {
  duration: {
    instant: 0,
    fast: 150,
    normal: 250,
    slow: 350,
    slower: 500,
  },
  easing: {
    linear: "linear",
    easeIn: "cubic-bezier(0.4, 0, 1, 1)",
    easeOut: "cubic-bezier(0, 0, 0.2, 1)",
    easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
    spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
} as const;

// Shadow tokens
export const shadows = {
  none: "none",
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.3)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.5)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.6)",
  glass: "0 8px 32px 0 rgba(139, 92, 246, 0.15)",
} as const;

// Combined theme object
export const tokens = {
  colors,
  spacing,
  typography,
  layout,
  radii,
  glass,
  animation,
  shadows,
} as const;

export type Tokens = typeof tokens;

// Token type helpers for prop interfaces
export type SpacingToken = keyof typeof spacing;
export type FontSizeToken = keyof typeof typography.fontSize;
export type FontWeightToken = keyof typeof typography.fontWeight;
export type RadiusToken = keyof typeof radii;
export type GlassBlurToken = keyof typeof glass.blur;
export type GlassOpacityToken = keyof typeof glass.opacity;
export type GlassBorderOpacityToken = keyof typeof glass.borderOpacity;
export type AnimationDurationToken = keyof typeof animation.duration;
export type AnimationEasingToken = keyof typeof animation.easing;
export type ShadowToken = keyof typeof shadows;

// Color tokens - flattened for easy use in props
export type BgColorToken = `bg-${keyof typeof colors.bg}`;
export type FgColorToken = `fg-${keyof typeof colors.fg}`;
export type SemanticColorToken = "border" | "accent" | "error" | "success" | "warning";
export type ColorToken = BgColorToken | FgColorToken | SemanticColorToken;
