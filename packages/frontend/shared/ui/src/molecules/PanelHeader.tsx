/**
 * PanelHeader - resizable panel header molecule
 */

import type { ReactNode } from "react";
import { Box } from "../atoms/Box";
import { Text } from "../atoms/Text";

export interface PanelHeaderProps {
  /** Panel title */
  title: string;

  /** Optional icon (SVG or component) */
  icon?: ReactNode;

  /** Optional actions (buttons, etc.) */
  actions?: ReactNode;

  /** Resize handle position */
  resizeHandle?: "top" | "right" | "bottom" | "left" | "none";

  /** Resize callback */
  onResize?: (delta: number) => void;
}

/**
 * PanelHeader - header for resizable panels
 *
 * Displays title, optional icon, and actions.
 * Can include resize handle for draggable resizing.
 *
 * @example
 * ```tsx
 * <PanelHeader
 *   title="File Explorer"
 *   icon={<FolderIcon />}
 *   resizeHandle="right"
 *   onResize={(delta) => setWidth(w => w + delta)}
 * />
 * ```
 */
export function PanelHeader({
  title,
  icon,
  actions,
  resizeHandle = "none",
  onResize,
}: PanelHeaderProps) {
  const showResizeHandle = resizeHandle !== "none" && onResize !== undefined;

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      paddingX="md"
      paddingY="sm"
      backgroundColor="bg-secondary"
      style={{
        borderBottom: "1px solid var(--border-color)",
        minHeight: "40px",
      }}
    >
      {/* Title and icon */}
      <Box display="flex" alignItems="center" gap="sm">
        {icon !== undefined && (
          <Box display="flex" alignItems="center">
            {icon}
          </Box>
        )}
        <Text size="sm" color="fg-primary" weight="semibold">
          {title}
        </Text>
      </Box>

      {/* Actions */}
      {actions !== undefined && (
        <Box display="flex" alignItems="center" gap="xs">
          {actions}
        </Box>
      )}

      {/* Resize handle (future enhancement) */}
      {showResizeHandle && (
        <Box
          style={{
            position: "absolute",
            ...(resizeHandle === "right" && {
              right: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              cursor: "ew-resize",
            }),
            ...(resizeHandle === "left" && {
              left: 0,
              top: 0,
              bottom: 0,
              width: "4px",
              cursor: "ew-resize",
            }),
            ...(resizeHandle === "bottom" && {
              bottom: 0,
              left: 0,
              right: 0,
              height: "4px",
              cursor: "ns-resize",
            }),
            ...(resizeHandle === "top" && {
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              cursor: "ns-resize",
            }),
            backgroundColor: "transparent",
            transition: "background-color var(--anim-duration-fast) var(--anim-easing-out)",
          }}
          onMouseEnter={(e) => {
            if (e.currentTarget instanceof HTMLElement) {
              e.currentTarget.style.backgroundColor = "var(--accent)";
            }
          }}
          onMouseLeave={(e) => {
            if (e.currentTarget instanceof HTMLElement) {
              e.currentTarget.style.backgroundColor = "transparent";
            }
          }}
        />
      )}
    </Box>
  );
}
