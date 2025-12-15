/**
 * EmptyState template
 * Template for displaying empty states with icon, message, and optional action
 */

import type { ReactNode } from "react";
import { Box } from "../atoms/Box";
import type { ButtonProps } from "../atoms/Button";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { Text } from "../atoms/Text";

export interface EmptyStateProps {
  /** Icon to display (emoji or icon component) */
  icon?: ReactNode;
  /** Primary heading text */
  title: string;
  /** Descriptive message */
  message: string;
  /** Optional action button */
  action?: {
    label: string;
    onPress: () => void;
    variant?: ButtonProps["variant"];
  };
}

/**
 * EmptyState - centered empty state display
 *
 * Displays a centered message with optional icon and action button.
 * Used for empty file lists, no search results, error states, etc.
 *
 * @example
 * <EmptyState
 *   icon="📁"
 *   title="No Files"
 *   message="This folder is empty. Start by creating a new file."
 *   action={{
 *     label: "Create File",
 *     onPress: handleCreateFile,
 *     variant: "primary"
 *   }}
 * />
 *
 * @example
 * // Without action
 * <EmptyState
 *   icon="🔍"
 *   title="No Results"
 *   message="No files match your search criteria."
 * />
 */
export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      padding="xl"
      gap="lg"
      height="100%"
      width="100%"
    >
      {/* Icon */}
      {icon && (
        <Icon size="lg" color="fg-secondary">
          {icon}
        </Icon>
      )}

      {/* Text content */}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap="sm"
        maxWidth={400}
        style={{ textAlign: "center" }}
      >
        <Text size="lg" weight="semibold" color="fg-primary">
          {title}
        </Text>
        <Text size="base" color="fg-secondary">
          {message}
        </Text>
      </Box>

      {/* Optional action button */}
      {action && (
        <Box marginTop="md">
          <Button variant={action.variant ?? "primary"} onPress={action.onPress}>
            {action.label}
          </Button>
        </Box>
      )}
    </Box>
  );
}
