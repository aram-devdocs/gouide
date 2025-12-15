import {
  type CSSProperties,
  forwardRef,
  type KeyboardEvent,
  type MouseEvent,
  useCallback,
} from "react";
import type { PressableProps } from "./types";

type PressableElement = HTMLButtonElement;

/**
 * Pressable - clickable/tappable element
 * Handles press interactions with proper accessibility
 */
export const Pressable = forwardRef<PressableElement, PressableProps>(function Pressable(
  {
    children,
    className,
    style,
    testId,
    onPress,
    onPressIn,
    onPressOut,
    disabled,
    role = "button",
    ariaLabel,
    ariaPressed,
    ariaExpanded,
  },
  ref,
) {
  const handleClick = useCallback(
    (_e: MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onPress?.();
    },
    [disabled, onPress],
  );

  const handleMouseDown = useCallback(
    (_e: MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onPressIn?.();
    },
    [disabled, onPressIn],
  );

  const handleMouseUp = useCallback(
    (_e: MouseEvent<HTMLButtonElement>) => {
      if (disabled) return;
      onPressOut?.();
    },
    [disabled, onPressOut],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLButtonElement>) => {
      if (disabled) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onPress?.();
      }
    },
    [disabled, onPress],
  );

  const baseStyle: CSSProperties = {
    // Reset button styles
    background: "none",
    border: "none",
    padding: 0,
    margin: 0,
    font: "inherit",
    color: "inherit",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    // Allow contents to be styled
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    ...style,
  };

  return (
    <button
      ref={ref}
      type="button"
      className={className}
      style={baseStyle}
      data-testid={testId}
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onKeyDown={handleKeyDown}
      role={role}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      aria-expanded={ariaExpanded}
    >
      {children}
    </button>
  );
});
