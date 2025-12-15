/**
 * Animation timing utilities and hooks
 */

import { useEffect, useRef, useState } from "react";

/**
 * Animation timing constants from theme
 */
export const ANIMATION_DURATION = {
  instant: 0,
  fast: 150,
  normal: 250,
  slow: 350,
  slower: 500,
} as const;

/**
 * Hook to delay visibility changes for smooth animations
 * Useful for components that need to animate out before unmounting
 *
 * @param isVisible - Whether the component should be visible
 * @param delay - Delay in milliseconds before hiding (default: 250ms)
 * @returns Object with shouldRender (for conditional rendering) and isVisible (for animation state)
 *
 * @example
 * ```tsx
 * function Modal({ isOpen, onClose }) {
 *   const { shouldRender, isVisible } = useDelayedVisibility(isOpen);
 *
 *   if (!shouldRender) return null;
 *
 *   return (
 *     <div style={{ opacity: isVisible ? 1 : 0 }}>
 *       Modal content
 *     </div>
 *   );
 * }
 * ```
 */
export function useDelayedVisibility(
  isVisible: boolean,
  delay: number = ANIMATION_DURATION.normal,
) {
  const [shouldRender, setShouldRender] = useState(isVisible);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (isVisible) {
      // Show immediately
      setShouldRender(true);
    } else {
      // Hide after delay (for exit animation)
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setShouldRender(false);
      }, delay);
    }

    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, delay]);

  return {
    shouldRender,
    isVisible,
  };
}

/**
 * Hook to trigger animations on mount
 * Returns true after a brief delay to allow CSS transitions to occur
 *
 * @param delay - Delay in milliseconds before triggering animation (default: 0)
 * @returns Boolean indicating if animation should be active
 *
 * @example
 * ```tsx
 * function AnimatedComponent() {
 *   const isAnimated = useAnimateOnMount(50);
 *
 *   return (
 *     <div style={{
 *       opacity: isAnimated ? 1 : 0,
 *       transform: isAnimated ? 'translateY(0)' : 'translateY(10px)'
 *     }}>
 *       Content
 *     </div>
 *   );
 * }
 * ```
 */
export function useAnimateOnMount(delay: number = 0) {
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setIsAnimated(true);
    }, delay);

    return () => clearTimeout(timeout);
  }, [delay]);

  return isAnimated;
}

/**
 * Hook to manage staggered animations for lists
 * Returns the delay for each item based on its index
 *
 * @param index - Index of the item in the list
 * @param baseDelay - Base delay in milliseconds (default: 50)
 * @param maxDelay - Maximum total delay in milliseconds (default: 500)
 * @returns Delay in milliseconds for this item
 *
 * @example
 * ```tsx
 * function ListItem({ index }) {
 *   const delay = useStaggeredDelay(index, 50);
 *   const isVisible = useAnimateOnMount(delay);
 *
 *   return (
 *     <div style={{ opacity: isVisible ? 1 : 0 }}>
 *       Item {index}
 *     </div>
 *   );
 * }
 * ```
 */
export function useStaggeredDelay(
  index: number,
  baseDelay: number = 50,
  maxDelay: number = 500,
): number {
  return Math.min(index * baseDelay, maxDelay);
}
