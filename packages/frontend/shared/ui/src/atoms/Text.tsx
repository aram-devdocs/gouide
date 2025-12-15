/**
 * Text atom
 * Typography component with configurable size, weight, and color
 */

import type { ColorToken, FontSizeToken, FontWeightToken } from "@gouide/frontend-theme";
import { Text as PrimitiveText } from "@gouide/primitives-desktop";
import type { ReactNode } from "react";

export interface TextProps {
  children: ReactNode;
  size?: FontSizeToken;
  weight?: FontWeightToken;
  color?: ColorToken;
  as?: "span" | "p" | "label";
}

/**
 * Text - a typography component
 *
 * @example
 * <Text size="lg" weight="semibold" color="fg-primary">
 *   Heading text
 * </Text>
 *
 * <Text size="sm" color="fg-secondary">
 *   Secondary text
 * </Text>
 */
export function Text({
  children,
  size = "base",
  weight = "normal",
  color = "fg-primary",
  as = "span",
}: TextProps) {
  return (
    <PrimitiveText as={as} size={size} weight={weight} color={color}>
      {children}
    </PrimitiveText>
  );
}
