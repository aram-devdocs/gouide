import { forwardRef, type CSSProperties, type ElementType, type ComponentPropsWithRef } from 'react';
import type { BoxProps } from './types';
import { resolveSpacing, resolveColor, resolveRadius } from './utils/tokens';

type BoxElement = HTMLDivElement;

/**
 * Box - the fundamental layout primitive
 * All other layout components build on Box
 */
export const Box = forwardRef<BoxElement, BoxProps>(function Box(
  {
    children,
    as: Component = 'div',
    className,
    style,
    testId,
    // Layout
    display,
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
    flex,
    flexGrow,
    flexShrink,
    // Spacing
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    margin,
    marginX,
    marginY,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    gap,
    // Sizing
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    // Colors
    backgroundColor,
    borderColor,
    // Border
    borderWidth,
    borderRadius,
    // Overflow
    overflow,
    overflowX,
    overflowY,
    // Position
    position,
    top,
    right,
    bottom,
    left,
    zIndex,
  },
  ref
) {
  const computedStyle: CSSProperties = {
    display,
    flexDirection,
    alignItems,
    justifyContent,
    flexWrap,
    flex,
    flexGrow,
    flexShrink,
    // Spacing - resolve tokens, with X/Y overrides for individual sides
    padding: resolveSpacing(padding),
    paddingTop: resolveSpacing(paddingTop) ?? resolveSpacing(paddingY),
    paddingBottom: resolveSpacing(paddingBottom) ?? resolveSpacing(paddingY),
    paddingLeft: resolveSpacing(paddingLeft) ?? resolveSpacing(paddingX),
    paddingRight: resolveSpacing(paddingRight) ?? resolveSpacing(paddingX),
    margin: resolveSpacing(margin),
    marginTop: resolveSpacing(marginTop) ?? resolveSpacing(marginY),
    marginBottom: resolveSpacing(marginBottom) ?? resolveSpacing(marginY),
    marginLeft: resolveSpacing(marginLeft) ?? resolveSpacing(marginX),
    marginRight: resolveSpacing(marginRight) ?? resolveSpacing(marginX),
    gap: resolveSpacing(gap),
    // Sizing
    width,
    height,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    // Colors
    backgroundColor: resolveColor(backgroundColor),
    borderColor: resolveColor(borderColor),
    borderWidth: borderWidth !== undefined ? `${borderWidth}px` : undefined,
    borderStyle: borderWidth !== undefined ? 'solid' : undefined,
    borderRadius: resolveRadius(borderRadius),
    // Overflow
    overflow,
    overflowX,
    overflowY,
    // Position
    position,
    top,
    right,
    bottom,
    left,
    zIndex,
    // Merge with passed style (passed style wins)
    ...style,
  };

  // Filter out undefined values for cleaner DOM
  const cleanStyle = Object.fromEntries(
    Object.entries(computedStyle).filter(([, v]) => v !== undefined)
  ) as CSSProperties;

  return (
    <Component
      ref={ref}
      className={className}
      style={Object.keys(cleanStyle).length > 0 ? cleanStyle : undefined}
      data-testid={testId}
    >
      {children}
    </Component>
  );
});
