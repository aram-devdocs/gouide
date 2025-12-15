/**
 * NavBar organism
 * Top navigation bar with title and action items
 */

import type { ReactNode } from "react";
import { Box } from "../atoms/Box";
import { Text } from "../atoms/Text";

export interface NavBarProps {
  title: string;
  subtitle?: string;
  logo?: ReactNode;
  actions?: ReactNode;
  leftActions?: ReactNode;
  height?: number;
}

/**
 * NavBar - a top navigation bar component
 *
 * @example
 * <NavBar
 *   title="Gouide"
 *   subtitle="v1.0.0"
 *   logo={<Icon>🚀</Icon>}
 *   leftActions={<Button>Menu</Button>}
 *   actions={
 *     <>
 *       <Button variant="ghost">Settings</Button>
 *       <Button variant="primary">New File</Button>
 *     </>
 *   }
 * />
 */
export function NavBar({ title, subtitle, logo, actions, leftActions, height = 56 }: NavBarProps) {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      height={height}
      paddingX="md"
      backgroundColor="bg-secondary"
      style={{ borderBottom: "1px solid var(--border)" }}
    >
      {/* Left section: logo + title + left actions */}
      <Box display="flex" alignItems="center" gap="md">
        {logo && (
          <Box display="flex" alignItems="center">
            {logo}
          </Box>
        )}

        <Box display="flex" flexDirection="column" gap="xs">
          <Text size="lg" weight="semibold" color="fg-primary">
            {title}
          </Text>
          {subtitle && (
            <Text size="sm" color="fg-secondary">
              {subtitle}
            </Text>
          )}
        </Box>

        {leftActions && (
          <Box display="flex" alignItems="center" gap="sm" marginLeft="md">
            {leftActions}
          </Box>
        )}
      </Box>

      {/* Right section: actions */}
      {actions && (
        <Box display="flex" alignItems="center" gap="sm">
          {actions}
        </Box>
      )}
    </Box>
  );
}
