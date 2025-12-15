/**
 * Sidebar organism
 * Collapsible sidebar container for navigation or tools
 */

import type { ReactNode } from "react";
import { Box } from "../atoms/Box";
import { Button } from "../atoms/Button";

export interface SidebarProps {
  children: ReactNode;
  isCollapsed?: boolean;
  onToggle?: () => void;
  width?: number;
  collapsedWidth?: number;
  position?: "left" | "right";
  showToggleButton?: boolean;
}

/**
 * Sidebar - a collapsible sidebar container
 *
 * @example
 * <Sidebar
 *   isCollapsed={false}
 *   onToggle={() => setCollapsed(!collapsed)}
 *   width={300}
 *   collapsedWidth={48}
 *   position="left"
 * >
 *   <FileTreePanel files={files} />
 * </Sidebar>
 */
export function Sidebar({
  children,
  isCollapsed = false,
  onToggle,
  width = 280,
  collapsedWidth = 48,
  position = "left",
  showToggleButton = true,
}: SidebarProps) {
  const currentWidth = isCollapsed ? collapsedWidth : width;
  const toggleIcon = isCollapsed
    ? position === "left"
      ? "▶"
      : "◀"
    : position === "left"
      ? "◀"
      : "▶";

  return (
    <Box
      display="flex"
      flexDirection="column"
      width={currentWidth}
      height="100%"
      backgroundColor="bg-secondary"
      position="relative"
      style={{
        borderRight: position === "left" ? "1px solid var(--border)" : undefined,
        borderLeft: position === "right" ? "1px solid var(--border)" : undefined,
        transition: "width 0.2s ease",
      }}
    >
      {/* Toggle button */}
      {showToggleButton && onToggle && (
        <Box
          position="absolute"
          top="50%"
          {...(position === "left" ? { right: -12 } : { left: -12 })}
          zIndex={10}
        >
          <Button
            variant="secondary"
            size="sm"
            onPress={onToggle}
            ariaLabel={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {toggleIcon}
          </Button>
        </Box>
      )}

      {/* Content area */}
      <Box
        flex={1}
        overflow="hidden"
        display="flex"
        flexDirection="column"
        style={{
          opacity: isCollapsed ? 0 : 1,
          transition: "opacity 0.2s ease",
        }}
      >
        {!isCollapsed && children}
      </Box>

      {/* Collapsed state placeholder */}
      {isCollapsed && (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="100%"
          style={{ opacity: 1 }}
        >
          <Box display="flex" flexDirection="column" alignItems="center" gap="md">
            {/* You can add icons or minimal indicators here */}
          </Box>
        </Box>
      )}
    </Box>
  );
}
