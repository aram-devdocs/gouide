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

// Spacing scale (golden ratio: φ ≈ 1.618)
// Each step multiplies by φ for harmonious proportions
export const spacing = {
  xxs: 2, // Base
  xs: 4, // 2 × 2
  sm: 6, // ~4 × 1.5
  md: 10, // ~6 × 1.618
  lg: 16, // ~10 × 1.618
  xl: 26, // ~16 × 1.618
  xxl: 42, // ~26 × 1.618
} as const;

// Typography - Apple-inspired font system
export const typography = {
  fontFamily: {
    sans: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif",
    mono: "'SF Mono', 'Monaco', 'Cascadia Code', 'Roboto Mono', Consolas, monospace",
  },
  fontSize: {
    xs: 11, // Small labels
    sm: 12, // Secondary text
    base: 13, // Body text (Apple standard)
    md: 14, // Emphasized text
    lg: 16, // Headings
    xl: 18, // Large headings
    xxl: 24, // Display text
  },
  fontWeight: {
    light: 300,
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
  letterSpacing: {
    tight: "-0.015em", // Headings
    normal: "0",
    relaxed: "0.025em", // Small caps
  },
} as const;

// Layout dimensions (golden ratio proportions)
export const layout = {
  sidebar: {
    default: 260, // Default width
    min: 160, // Minimum width
    max: 420, // Maximum width (~260 × φ)
  },
  bottomPanel: {
    default: 260, // Default height
    min: 160, // Minimum height
    max: 420, // Maximum height
  },
  statusbarHeight: 22, // macOS standard
  titlebarHeight: 30,
} as const;

// Border radii (golden ratio progression)
export const radii = {
  none: 0,
  sm: 4,
  md: 6, // ~4 × 1.5
  lg: 10, // ~6 × 1.618
  xl: 16, // ~10 × 1.618
  full: 9999,
} as const;

// Glassmorphism tokens - advanced glass effects
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
  gradient: {
    // Gradient overlay settings
    enabled: true,
    angle: 135, // Default gradient angle (deg)
    opacity: 0.1, // Subtle overlay
  },
  noise: {
    // Texture noise for depth
    enabled: true,
    opacity: 0.02, // Very subtle grain
  },
  reflection: {
    // Highlight reflection on top edge
    enabled: true,
    position: "top",
    intensity: 0.15,
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
export type LetterSpacingToken = keyof typeof typography.letterSpacing;
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
