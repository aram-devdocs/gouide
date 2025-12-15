/**
 * Theme loader - loads and applies themes to CSS variables
 */

import type { ThemeSchema } from "./schema";
import { validateThemeObject } from "./validation";

/**
 * Applies a theme to CSS variables
 * @param theme The theme to apply
 */
export function applyTheme(theme: ThemeSchema): void {
  const root = document.documentElement;

  // Apply colors
  root.style.setProperty("--bg-primary", theme.colors.bg.primary);
  root.style.setProperty("--bg-secondary", theme.colors.bg.secondary);
  root.style.setProperty("--bg-tertiary", theme.colors.bg.tertiary);
  root.style.setProperty("--bg-hover", theme.colors.bg.hover);
  root.style.setProperty("--bg-active", theme.colors.bg.active);

  root.style.setProperty("--fg-primary", theme.colors.fg.primary);
  root.style.setProperty("--fg-secondary", theme.colors.fg.secondary);
  root.style.setProperty("--fg-muted", theme.colors.fg.muted);

  root.style.setProperty("--accent-color", theme.colors.accent);
  root.style.setProperty("--border-color", theme.colors.border);
  root.style.setProperty("--error-color", theme.colors.error);
  root.style.setProperty("--success-color", theme.colors.success);
  root.style.setProperty("--warning-color", theme.colors.warning);

  // Apply glass blur
  root.style.setProperty("--glass-blur-none", `${theme.glass.blur.none}px`);
  root.style.setProperty("--glass-blur-sm", `${theme.glass.blur.sm}px`);
  root.style.setProperty("--glass-blur-md", `${theme.glass.blur.md}px`);
  root.style.setProperty("--glass-blur-lg", `${theme.glass.blur.lg}px`);
  root.style.setProperty("--glass-blur-xl", `${theme.glass.blur.xl}px`);

  // Apply glass opacity
  root.style.setProperty("--glass-opacity-transparent", `${theme.glass.opacity.transparent}`);
  root.style.setProperty("--glass-opacity-light", `${theme.glass.opacity.light}`);
  root.style.setProperty("--glass-opacity-medium", `${theme.glass.opacity.medium}`);
  root.style.setProperty("--glass-opacity-heavy", `${theme.glass.opacity.heavy}`);
  root.style.setProperty("--glass-opacity-opaque", `${theme.glass.opacity.opaque}`);

  // Apply glass border opacity
  root.style.setProperty("--glass-border-opacity-none", `${theme.glass.borderOpacity.none}`);
  root.style.setProperty("--glass-border-opacity-subtle", `${theme.glass.borderOpacity.subtle}`);
  root.style.setProperty("--glass-border-opacity-visible", `${theme.glass.borderOpacity.visible}`);
  root.style.setProperty("--glass-border-opacity-strong", `${theme.glass.borderOpacity.strong}`);

  // Apply animation durations
  root.style.setProperty("--anim-duration-instant", `${theme.animation.duration.instant}ms`);
  root.style.setProperty("--anim-duration-fast", `${theme.animation.duration.fast}ms`);
  root.style.setProperty("--anim-duration-normal", `${theme.animation.duration.normal}ms`);
  root.style.setProperty("--anim-duration-slow", `${theme.animation.duration.slow}ms`);
  root.style.setProperty("--anim-duration-slower", `${theme.animation.duration.slower}ms`);

  // Apply animation easing
  root.style.setProperty("--anim-easing-linear", theme.animation.easing.linear);
  root.style.setProperty("--anim-easing-in", theme.animation.easing.easeIn);
  root.style.setProperty("--anim-easing-out", theme.animation.easing.easeOut);
  root.style.setProperty("--anim-easing-in-out", theme.animation.easing.easeInOut);
  root.style.setProperty("--anim-easing-spring", theme.animation.easing.spring);

  // Apply shadows
  root.style.setProperty("--shadow-none", theme.shadows.none);
  root.style.setProperty("--shadow-sm", theme.shadows.sm);
  root.style.setProperty("--shadow-md", theme.shadows.md);
  root.style.setProperty("--shadow-lg", theme.shadows.lg);
  root.style.setProperty("--shadow-xl", theme.shadows.xl);
  root.style.setProperty("--shadow-glass", theme.shadows.glass);
}

/**
 * Loads a theme from JSON and validates it
 * @param themeJson The theme JSON object
 * @returns The validated theme
 * @throws Error if validation fails
 */
export function loadTheme(themeJson: unknown): ThemeSchema {
  return validateThemeObject(themeJson);
}

/**
 * Loads and applies a theme from JSON
 * @param themeJson The theme JSON object
 */
export function loadAndApplyTheme(themeJson: unknown): void {
  const theme = loadTheme(themeJson);
  applyTheme(theme);
}

/**
 * Gets the currently active theme ID from local storage
 * @returns The theme ID or null if not set
 */
export function getCurrentThemeId(): string | null {
  try {
    return localStorage.getItem("gouide-theme-id");
  } catch {
    return null;
  }
}

/**
 * Sets the currently active theme ID in local storage
 * @param themeId The theme ID to set
 */
export function setCurrentThemeId(themeId: string): void {
  try {
    localStorage.setItem("gouide-theme-id", themeId);
  } catch {
    // Silently fail if localStorage is not available
  }
}
