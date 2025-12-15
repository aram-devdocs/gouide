/**
 * AnimatedPanel - animated container for panels with slide/fade transitions
 * Uses CSS variables for timing and easing
 */

import type { CSSProperties, ReactNode } from "react";
import { Box } from "../atoms/Box";

export type PanelPosition = "left" | "right" | "bottom" | "top" | "center";
export type PanelAnimation = "slide" | "fade" | "fade-scale";

export interface AnimatedPanelProps {
  children: ReactNode;
  isVisible: boolean;
  position: PanelPosition;
  animation?: PanelAnimation;
  className?: string;
  style?: CSSProperties;
}

/**
 * Get transform for panel based on position and visibility
 */
function getTransform(
  position: PanelPosition,
  isVisible: boolean,
  animation: PanelAnimation,
): string {
  if (isVisible) {
    // Visible state - no transform (except scale for center)
    return position === "center" && animation === "fade-scale" ? "scale(1)" : "none";
  }

  // Hidden state - transform based on position
  switch (position) {
    case "left":
      return animation === "slide" ? "translateX(-100%)" : "none";
    case "right":
      return animation === "slide" ? "translateX(100%)" : "none";
    case "bottom":
      return animation === "slide" ? "translateY(100%)" : "none";
    case "top":
      return animation === "slide" ? "translateY(-100%)" : "none";
    case "center":
      return animation === "fade-scale" ? "scale(0.95)" : "none";
    default:
      return "none";
  }
}

/**
 * AnimatedPanel - provides smooth enter/exit animations for panels
 *
 * @example
 * ```tsx
 * <AnimatedPanel
 *   isVisible={isPanelOpen}
 *   position="left"
 *   animation="slide"
 * >
 *   <SidebarContent />
 * </AnimatedPanel>
 * ```
 */
export function AnimatedPanel({
  children,
  isVisible,
  position,
  animation = "slide",
  className,
  style,
}: AnimatedPanelProps) {
  const panelStyle: CSSProperties = {
    transform: getTransform(position, isVisible, animation),
    opacity: isVisible ? 1 : 0,
    transition: `
      transform var(--anim-duration-normal) var(--anim-easing-spring),
      opacity var(--anim-duration-normal) var(--anim-easing-out)
    `,
    pointerEvents: isVisible ? "auto" : "none",
    willChange: "transform, opacity",
    ...style,
  };

  const boxProps = {
    ...(className !== undefined && { className }),
    style: panelStyle,
  };

  return <Box {...boxProps}>{children}</Box>;
}
