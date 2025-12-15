/**
 * Divider atom
 * Horizontal or vertical divider line
 */

import type { ColorToken } from "@gouide/frontend-theme";
import { Box } from "@gouide/primitives-desktop";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  color?: ColorToken;
}

/**
 * Divider - a visual separator
 *
 * @example
 * <Divider />
 * <Divider orientation="vertical" />
 */
export function Divider({ orientation = "horizontal", color = "border" }: DividerProps) {
  const isHorizontal = orientation === "horizontal";

  return (
    <Box
      backgroundColor={color}
      width={isHorizontal ? "100%" : 1}
      height={isHorizontal ? 1 : "100%"}
      style={{
        flexShrink: 0,
      }}
    />
  );
}
