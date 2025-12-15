import { type CSSProperties, forwardRef } from "react";
import type { TextProps } from "./types";
import { resolveColor } from "./utils/tokens";

type TextElement = HTMLSpanElement;

/**
 * Text - text rendering primitive
 * Handles typography tokens and text-specific features
 */
export const Text = forwardRef<TextElement, TextProps>(function Text(
  {
    children,
    as: Component = "span",
    className,
    style,
    testId,
    size,
    weight,
    color,
    align,
    decoration,
    truncate,
    maxLines,
    mono,
  },
  ref,
) {
  const computedStyle: CSSProperties = {
    fontSize: size ? `var(--font-size-${size})` : undefined,
    fontWeight: weight,
    color: resolveColor(color),
    textAlign: align,
    textDecoration: decoration,
    fontFamily: mono ? "var(--font-mono)" : undefined,
    // Single-line truncation
    ...(truncate && {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    }),
    // Multi-line truncation (webkit-based)
    ...(maxLines &&
      !truncate && {
        display: "-webkit-box",
        WebkitLineClamp: maxLines,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }),
    ...style,
  };

  // Filter out undefined values
  const cleanStyle = Object.fromEntries(
    Object.entries(computedStyle).filter(([, v]) => v !== undefined),
  ) as CSSProperties;

  return (
    <Component
      ref={ref as React.Ref<HTMLSpanElement>}
      className={className}
      style={Object.keys(cleanStyle).length > 0 ? cleanStyle : undefined}
      data-testid={testId}
    >
      {children}
    </Component>
  );
});
