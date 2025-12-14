/**
 * Token resolution utilities
 * Convert token names to CSS variable references
 */

import type { SpacingToken, ColorToken, RadiusToken } from '@gouide/frontend-theme';

/**
 * Resolve a spacing token to a CSS variable reference
 */
export function resolveSpacing(token: SpacingToken | undefined): string | undefined {
  if (!token) return undefined;
  return `var(--spacing-${token})`;
}

/**
 * Resolve a color token to a CSS variable reference
 */
export function resolveColor(token: ColorToken | undefined): string | undefined {
  if (!token) return undefined;

  // Handle bg-* and fg-* tokens
  if (token.startsWith('bg-')) {
    return `var(--${token})`;
  }
  if (token.startsWith('fg-')) {
    return `var(--${token})`;
  }

  // Handle semantic tokens (border, accent, error, success, warning)
  return `var(--${token}-color)`;
}

/**
 * Resolve a radius token to a CSS variable reference
 */
export function resolveRadius(token: RadiusToken | undefined): string | undefined {
  if (!token) return undefined;
  return `var(--radius-${token})`;
}
