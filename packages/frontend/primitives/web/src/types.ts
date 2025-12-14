/**
 * Primitive component type definitions
 * These types define the interface that all platform implementations must satisfy
 */

import type { SpacingToken, ColorToken, FontSizeToken, FontWeightToken, RadiusToken } from '@gouide/frontend-theme';
import type { CSSProperties, ReactNode } from 'react';

/**
 * Base props shared by all primitives
 */
export interface PrimitiveBaseProps {
  className?: string;
  style?: CSSProperties;
  testId?: string;
}

/**
 * Box - the fundamental layout primitive
 */
export interface BoxProps extends PrimitiveBaseProps {
  children?: ReactNode;
  as?: 'div' | 'span' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'main' | 'nav';

  // Layout
  display?: 'flex' | 'block' | 'inline' | 'inline-flex' | 'grid' | 'none';
  flexDirection?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'stretch' | 'baseline';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  flex?: number | string;
  flexGrow?: number;
  flexShrink?: number;

  // Spacing (token-based)
  padding?: SpacingToken;
  paddingX?: SpacingToken;
  paddingY?: SpacingToken;
  paddingTop?: SpacingToken;
  paddingBottom?: SpacingToken;
  paddingLeft?: SpacingToken;
  paddingRight?: SpacingToken;
  margin?: SpacingToken;
  marginX?: SpacingToken;
  marginY?: SpacingToken;
  marginTop?: SpacingToken;
  marginBottom?: SpacingToken;
  marginLeft?: SpacingToken;
  marginRight?: SpacingToken;
  gap?: SpacingToken;

  // Sizing
  width?: string | number;
  height?: string | number;
  minWidth?: string | number;
  minHeight?: string | number;
  maxWidth?: string | number;
  maxHeight?: string | number;

  // Colors
  backgroundColor?: ColorToken;
  borderColor?: ColorToken;

  // Border
  borderWidth?: number;
  borderRadius?: RadiusToken;

  // Overflow
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';

  // Position
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string | number;
  right?: string | number;
  bottom?: string | number;
  left?: string | number;
  zIndex?: number;
}

/**
 * Stack - vertical or horizontal flex container with consistent spacing
 */
export interface StackProps extends Omit<BoxProps, 'display' | 'flexDirection' | 'gap'> {
  direction?: 'vertical' | 'horizontal';
  spacing?: SpacingToken;
  align?: 'start' | 'end' | 'center' | 'stretch';
  justify?: 'start' | 'end' | 'center' | 'between' | 'around';
}

/**
 * Text - text rendering primitive
 */
export interface TextProps extends PrimitiveBaseProps {
  children?: ReactNode;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'strong' | 'em';

  // Typography
  size?: FontSizeToken;
  weight?: FontWeightToken;
  color?: ColorToken;
  align?: 'left' | 'center' | 'right';

  // Decoration
  decoration?: 'none' | 'underline' | 'line-through';

  // Overflow
  truncate?: boolean;
  maxLines?: number;

  // Font family
  mono?: boolean;
}

/**
 * Pressable - clickable/tappable element
 */
export interface PressableProps extends PrimitiveBaseProps {
  children?: ReactNode;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;

  // Accessibility
  role?: 'button' | 'link' | 'menuitem' | 'tab';
  ariaLabel?: string;
  ariaPressed?: boolean;
  ariaExpanded?: boolean;
}
