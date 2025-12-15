/**
 * Badge atom
 * Status badge component with color variants
 */

import type { ColorToken, SpacingToken } from "@gouide/frontend-theme";
import { Box, Text } from "@gouide/primitives-desktop";
import type { ReactNode } from "react";

export interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "error";
  size?: "sm" | "md";
}

const variantStyles: Record<BadgeProps["variant"] & string, { bg: ColorToken; text: ColorToken }> =
  {
    default: { bg: "bg-tertiary", text: "fg-primary" },
    accent: { bg: "accent", text: "fg-primary" },
    success: { bg: "success", text: "bg-primary" },
    warning: { bg: "warning", text: "bg-primary" },
    error: { bg: "error", text: "fg-primary" },
  };

const sizeStyles: Record<
  BadgeProps["size"] & string,
  { padding: SpacingToken; fontSize: "sm" | "base" }
> = {
  sm: { padding: "xs", fontSize: "sm" },
  md: { padding: "sm", fontSize: "base" },
};

/**
 * Badge - a status indicator component
 *
 * @example
 * <Badge variant="success" size="sm">
 *   Connected
 * </Badge>
 *
 * <Badge variant="error">
 *   Disconnected
 * </Badge>
 */
export function Badge({ children, variant = "default", size = "sm" }: BadgeProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <Box
      display="inline-flex"
      alignItems="center"
      backgroundColor={variantStyle.bg}
      paddingX={sizeStyle.padding}
      paddingY="xs"
      borderRadius="sm"
    >
      <Text size={sizeStyle.fontSize} color={variantStyle.text}>
        {children}
      </Text>
    </Box>
  );
}
