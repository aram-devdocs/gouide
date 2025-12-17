/**
 * Icon atom
 * Icon component with size variants - supports SVG icons and legacy emoji/unicode
 */

import type { ColorToken } from "@gouide/frontend-theme";
import { Box } from "@gouide/primitives-desktop";
import type { ReactNode } from "react";
import { ICONS, type IconName } from "./icons";

export interface IconProps {
  /**
   * Icon name from SVG icon library (preferred)
   */
  name?: IconName;
  /**
   * Children for legacy emoji/unicode support
   */
  children?: ReactNode;
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
 * // Using SVG icon (preferred)
 * <Icon name="folder" size="md" color="fg-secondary" />
 *
 * // Using emoji (legacy)
 * <Icon size="md" color="fg-secondary">
 *   📁
 * </Icon>
 */
export function Icon({ name, children, size = "md", color = "fg-primary", ariaLabel }: IconProps) {
  const sizeStyle = sizeStyles[size];

  // Render SVG icon if name is provided
  let content: ReactNode;
  if (name !== undefined) {
    const IconComponent = ICONS[name];
    content = (
      <IconComponent width={sizeStyle.size} height={sizeStyle.size} aria-label={ariaLabel} />
    );
  } else {
    content = children;
  }

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      width={sizeStyle.size}
      height={sizeStyle.size}
      {...(ariaLabel && !name && { "aria-label": ariaLabel })}
      style={{
        flexShrink: 0,
        color: `var(--${color})`,
      }}
    >
      {content}
    </Box>
  );
}
