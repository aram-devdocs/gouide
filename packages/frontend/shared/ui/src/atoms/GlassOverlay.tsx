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
      backdropFilter: "blur(var(--glass-blur-lg))",
      backgroundColor: "rgba(0, 0, 0, 0.85)", // 85% dark - blocks content better
      transition: "opacity var(--anim-duration-normal) var(--anim-easing-out)",
      opacity: 1,
    },
  };

  return <Box {...boxProps}>{children}</Box>;
}
