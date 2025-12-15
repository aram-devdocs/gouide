/**
 * GlassModal - glass-styled modal container molecule
 */

import type { ReactNode } from "react";
import { Box } from "../atoms/Box";
import { GlassContainer } from "../atoms/GlassContainer";

export interface GlassModalProps {
  children: ReactNode;
  width?: number | string;
  maxWidth?: string;
  maxHeight?: string;
  padding?: "sm" | "md" | "lg";
}

/**
 * GlassModal - modal content container with glassmorphism
 *
 * Use with GlassOverlay for complete modal experience.
 * Provides glass aesthetic with backdrop blur and translucency.
 *
 * @example
 * ```tsx
 * <GlassOverlay>
 *   <GlassModal width={600} padding="md">
 *     <ModalContent />
 *   </GlassModal>
 * </GlassOverlay>
 * ```
 */
export function GlassModal({
  children,
  width = 600,
  maxWidth = "90vw",
  maxHeight = "90vh",
  padding = "md",
}: GlassModalProps) {
  return (
    <GlassContainer
      blur="lg"
      opacity="heavy"
      borderOpacity="visible"
      glow
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        maxWidth,
        maxHeight,
        overflow: "auto",
      }}
    >
      <Box padding={padding}>{children}</Box>
    </GlassContainer>
  );
}
