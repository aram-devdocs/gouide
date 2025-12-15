/**
 * GlassContainer - glassmorphism primitive with backdrop blur
 */

import type { CSSProperties, ReactNode } from "react";
import { Box } from "./Box";
import type { BoxProps } from "./types";

export type GlassBlur = "none" | "sm" | "md" | "lg" | "xl";
export type GlassOpacity = "transparent" | "light" | "medium" | "heavy" | "opaque";
export type GlassBorderOpacity = "none" | "subtle" | "visible" | "strong";

export interface GlassContainerProps extends Omit<BoxProps, "style"> {
  children: ReactNode;
  blur?: GlassBlur;
  opacity?: GlassOpacity;
  borderOpacity?: GlassBorderOpacity;
  glow?: boolean;
  className?: string;
  style?: CSSProperties;
}

const BLUR_VALUES: Record<GlassBlur, string> = {
  none: "0px",
  sm: "var(--glass-blur-sm)",
  md: "var(--glass-blur-md)",
  lg: "var(--glass-blur-lg)",
  xl: "var(--glass-blur-xl)",
};

const OPACITY_VALUES: Record<GlassOpacity, string> = {
  transparent: "var(--glass-opacity-transparent)",
  light: "var(--glass-opacity-light)",
  medium: "var(--glass-opacity-medium)",
  heavy: "var(--glass-opacity-heavy)",
  opaque: "var(--glass-opacity-opaque)",
};

const BORDER_OPACITY_VALUES: Record<GlassBorderOpacity, string> = {
  none: "var(--glass-border-opacity-none)",
  subtle: "var(--glass-border-opacity-subtle)",
  visible: "var(--glass-border-opacity-visible)",
  strong: "var(--glass-border-opacity-strong)",
};

/**
 * GlassContainer - glassmorphism primitive
 *
 * Provides backdrop blur, translucent background, and optional glow effect.
 * Uses CSS variables from theme for consistent glass aesthetic.
 *
 * @example
 * ```tsx
 * <GlassContainer
 *   blur="md"
 *   opacity="medium"
 *   borderOpacity="subtle"
 *   glow
 * >
 *   <Content />
 * </GlassContainer>
 * ```
 */
export function GlassContainer({
  children,
  blur = "md",
  opacity = "medium",
  borderOpacity = "subtle",
  glow = false,
  className,
  style,
  ...boxProps
}: GlassContainerProps) {
  const glassStyle: CSSProperties = {
    backdropFilter: `blur(${BLUR_VALUES[blur]})`,
    backgroundColor: `rgba(139, 92, 246, ${OPACITY_VALUES[opacity]})`,
    border: `1px solid rgba(167, 139, 250, ${BORDER_OPACITY_VALUES[borderOpacity]})`,
    ...(glow && {
      boxShadow: "var(--shadow-glass)",
    }),
    ...style,
  };

  const combinedBoxProps = {
    ...boxProps,
    ...(className !== undefined && { className }),
    style: glassStyle,
  };

  return <Box {...combinedBoxProps}>{children}</Box>;
}
