/**
 * GlassOverlay - translucent backdrop for modals with glass effect
 */

import type { ReactNode } from "react";
import { Box } from "./Box";

export interface GlassOverlayProps {
  children: ReactNode;
  onClick?: () => void;
}

/**
 * GlassOverlay - full-screen glass backdrop for modals
 *
 * @example
 * ```tsx
 * <GlassOverlay onClick={onClose}>
 *   <ModalContent />
 * </GlassOverlay>
 * ```
 */
export function GlassOverlay({ children, onClick }: GlassOverlayProps) {
  const boxProps = {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    zIndex: 1000,
    ...(onClick !== undefined && { onClick }),
    style: {
      backdropFilter: "blur(var(--glass-blur-md))",
      backgroundColor: "rgba(26, 15, 46, var(--glass-opacity-heavy))",
      animation: "fadeIn var(--anim-duration-normal) var(--anim-easing-out)",
    },
  };

  return <Box {...boxProps}>{children}</Box>;
}
