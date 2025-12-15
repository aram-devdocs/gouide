/**
 * GlassSidebar - glass-styled sidebar organism
 */

import type { ReactNode } from "react";
import { GlassContainer } from "../atoms/GlassContainer";

export interface GlassSidebarProps {
  children: ReactNode;
  position: "left" | "right";
  width?: number;
}

/**
 * GlassSidebar - sidebar with glassmorphism styling
 *
 * Provides consistent glass aesthetic for left and right sidebars.
 * Uses backdrop blur, translucency, and subtle borders.
 *
 * @example
 * ```tsx
 * <GlassSidebar position="left" width={250}>
 *   <FileTreeContent />
 * </GlassSidebar>
 * ```
 */
export function GlassSidebar({ children, position, width = 250 }: GlassSidebarProps) {
  return (
    <GlassContainer
      blur="md"
      opacity="heavy"
      borderOpacity="subtle"
      style={{
        width: `${width}px`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        ...(position === "right" && {
          borderLeft: "1px solid rgba(167, 139, 250, var(--glass-border-opacity-subtle))",
        }),
        ...(position === "left" && {
          borderRight: "1px solid rgba(167, 139, 250, var(--glass-border-opacity-subtle))",
        }),
      }}
    >
      {children}
    </GlassContainer>
  );
}
