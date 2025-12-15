/**
 * Button atom
 * Example of how atoms consume primitives
 */

import type { ColorToken, SpacingToken } from "@gouide/frontend-theme";
import { Box, Pressable, Text } from "@gouide/primitives-desktop";
import type { ReactNode } from "react";

export interface ButtonProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  onPress?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}

const variantStyles: Record<
  ButtonProps["variant"] & string,
  { bg?: ColorToken; text: ColorToken }
> = {
  primary: { bg: "accent", text: "fg-primary" },
  secondary: { bg: "bg-tertiary", text: "fg-primary" },
  ghost: { text: "fg-secondary" },
};

const sizeStyles: Record<
  ButtonProps["size"] & string,
  { padding: SpacingToken; paddingX: SpacingToken; fontSize: "sm" | "base" | "lg" }
> = {
  sm: { padding: "xs", paddingX: "sm", fontSize: "sm" },
  md: { padding: "sm", paddingX: "md", fontSize: "base" },
  lg: { padding: "md", paddingX: "lg", fontSize: "lg" },
};

/**
 * Button - a clickable button component
 *
 * @example
 * <Button variant="primary" onPress={() => console.log('clicked')}>
 *   Click me
 * </Button>
 */
export function Button({
  children,
  variant = "primary",
  size = "md",
  onPress,
  disabled,
  ariaLabel,
}: ButtonProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  return (
    <Pressable
      {...(onPress && { onPress })}
      {...(disabled && { disabled })}
      {...(ariaLabel && { ariaLabel })}
    >
      <Box
        {...(variantStyle.bg && { backgroundColor: variantStyle.bg })}
        paddingY={sizeStyle.padding}
        paddingX={sizeStyle.paddingX}
        borderRadius="sm"
      >
        <Text size={sizeStyle.fontSize} color={variantStyle.text}>
          {children}
        </Text>
      </Box>
    </Pressable>
  );
}
