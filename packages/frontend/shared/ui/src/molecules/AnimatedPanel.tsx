/**
 * AnimatedPanel - animated container for panels with slide/fade transitions
 * Uses spring physics for smooth, natural motion
 */

import { useSpring } from "@gouide/frontend-hooks";
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";
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
  /**
   * Spring preset for animation (default: "responsive")
   */
  springPreset?: "gentle" | "responsive" | "snappy" | "bouncy";
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
 *   springPreset="snappy"
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
  springPreset = "responsive",
}: AnimatedPanelProps) {
  // Spring animations for different properties
  const translateX = useSpring(0, springPreset);
  const translateY = useSpring(0, springPreset);
  const opacity = useSpring(0, springPreset);
  const scale = useSpring(1, springPreset);

  // Use refs to avoid dependency loop
  const translateXRef = useRef(translateX);
  const translateYRef = useRef(translateY);
  const opacityRef = useRef(opacity);
  const scaleRef = useRef(scale);

  // Update refs when spring objects change
  useEffect(() => {
    translateXRef.current = translateX;
    translateYRef.current = translateY;
    opacityRef.current = opacity;
    scaleRef.current = scale;
  });

  // Update spring targets based on visibility and position
  useEffect(() => {
    if (isVisible) {
      // Visible state
      translateXRef.current.setTarget(0);
      translateYRef.current.setTarget(0);
      opacityRef.current.setTarget(1);
      scaleRef.current.setTarget(1);
    } else {
      // Hidden state - set transforms based on position
      opacityRef.current.setTarget(0);

      if (animation === "slide") {
        switch (position) {
          case "left":
            translateXRef.current.setTarget(-100);
            translateYRef.current.setTarget(0);
            break;
          case "right":
            translateXRef.current.setTarget(100);
            translateYRef.current.setTarget(0);
            break;
          case "bottom":
            translateXRef.current.setTarget(0);
            translateYRef.current.setTarget(100);
            break;
          case "top":
            translateXRef.current.setTarget(0);
            translateYRef.current.setTarget(-100);
            break;
          case "center":
            translateXRef.current.setTarget(0);
            translateYRef.current.setTarget(0);
            break;
        }
      } else if (animation === "fade-scale" && position === "center") {
        scaleRef.current.setTarget(0.95);
        translateXRef.current.setTarget(0);
        translateYRef.current.setTarget(0);
      } else {
        // Pure fade
        translateXRef.current.setTarget(0);
        translateYRef.current.setTarget(0);
        scaleRef.current.setTarget(1);
      }
    }
  }, [isVisible, position, animation]); // Only primitive dependencies

  // Build transform string
  const transforms: string[] = [];
  if (translateX.value !== 0) {
    transforms.push(`translateX(${translateX.value}%)`);
  }
  if (translateY.value !== 0) {
    transforms.push(`translateY(${translateY.value}%)`);
  }
  if (scale.value !== 1) {
    transforms.push(`scale(${scale.value})`);
  }

  const panelStyle: CSSProperties = {
    transform: transforms.length > 0 ? transforms.join(" ") : "none",
    opacity: opacity.value,
    pointerEvents: isVisible ? "auto" : "none",
    willChange: "transform, opacity",
    backfaceVisibility: "hidden", // Force GPU acceleration
    ...style,
  };

  const boxProps = {
    ...(className !== undefined && { className }),
    style: panelStyle,
  };

  return <Box {...boxProps}>{children}</Box>;
}
