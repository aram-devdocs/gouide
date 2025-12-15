/**
 * Icon atom
 * Icon component with size variants
 */

import type { ColorToken } from "@gouide/frontend-theme";
import { Box } from "@gouide/primitives-desktop";
import type { ReactNode } from "react";

export interface IconProps {
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  color?: ColorToken;
  ariaLabel?: string;
}

const sizeStyles: Record<IconProps["size"] & string, { size: number }> = {
  sm: { size: 16 },
  md: { size: 20 },
  lg: { size: 24 },
};

/**
 * Icon - an icon wrapper component
 *
 * @example
 * <Icon size="md" color="fg-secondary">
 *   📁
 * </Icon>
 */
export function Icon({ children, size = "md", color = "fg-primary", ariaLabel }: IconProps) {
  const sizeStyle = sizeStyles[size];

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width={sizeStyle.size}
      height={sizeStyle.size}
      {...(ariaLabel && { "aria-label": ariaLabel })}
      style={{
        flexShrink: 0,
        color: `var(--${color})`,
      }}
    >
      {children}
    </Box>
  );
}
