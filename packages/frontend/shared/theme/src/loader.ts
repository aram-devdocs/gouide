/**
 * Theme loader - loads and applies themes to CSS variables
 */

import { themeRegistry } from "@gouide/frontend-state";
import type { ThemeSchema } from "./schema";
import arcticSilver from "./themes/arctic-silver.json";

// Import all theme JSON files
import deepPurpleCyan from "./themes/deep-purple-cyan.json";
import indigoPurplePink from "./themes/indigo-purple-pink.json";
import midnightPurple from "./themes/midnight-purple.json";
import royalPurpleGold from "./themes/royal-purple-gold.json";
import spaceGrayMetal from "./themes/space-gray-metal.json";
import starlightGold from "./themes/starlight-gold.json";
import { validateThemeObject } from "./validation";

/**
 * Applies a theme to CSS variables
 * Batches all updates into a single DOM operation for better performance
 * @param theme The theme to apply
 */
export function applyTheme(theme: ThemeSchema): void {
  const root = document.documentElement;

  // Batch all CSS variables into a single style string
  const cssVars: string[] = [];

  // Colors
  cssVars.push(`--bg-primary: ${theme.colors.bg.primary}`);
  cssVars.push(`--bg-secondary: ${theme.colors.bg.secondary}`);
  cssVars.push(`--bg-tertiary: ${theme.colors.bg.tertiary}`);
  cssVars.push(`--bg-hover: ${theme.colors.bg.hover}`);
  cssVars.push(`--bg-active: ${theme.colors.bg.active}`);

  cssVars.push(`--fg-primary: ${theme.colors.fg.primary}`);
  cssVars.push(`--fg-secondary: ${theme.colors.fg.secondary}`);
  cssVars.push(`--fg-muted: ${theme.colors.fg.muted}`);

  cssVars.push(`--accent-color: ${theme.colors.accent}`);
  cssVars.push(`--border-color: ${theme.colors.border}`);
  cssVars.push(`--error-color: ${theme.colors.error}`);
  cssVars.push(`--success-color: ${theme.colors.success}`);
  cssVars.push(`--warning-color: ${theme.colors.warning}`);

  // Glass blur
  cssVars.push(`--glass-blur-none: ${theme.glass.blur.none}px`);
  cssVars.push(`--glass-blur-sm: ${theme.glass.blur.sm}px`);
  cssVars.push(`--glass-blur-md: ${theme.glass.blur.md}px`);
  cssVars.push(`--glass-blur-lg: ${theme.glass.blur.lg}px`);
  cssVars.push(`--glass-blur-xl: ${theme.glass.blur.xl}px`);

  // Glass opacity
  cssVars.push(`--glass-opacity-transparent: ${theme.glass.opacity.transparent}`);
  cssVars.push(`--glass-opacity-light: ${theme.glass.opacity.light}`);
  cssVars.push(`--glass-opacity-medium: ${theme.glass.opacity.medium}`);
  cssVars.push(`--glass-opacity-heavy: ${theme.glass.opacity.heavy}`);
  cssVars.push(`--glass-opacity-opaque: ${theme.glass.opacity.opaque}`);

  // Glass border opacity
  cssVars.push(`--glass-border-opacity-none: ${theme.glass.borderOpacity.none}`);
  cssVars.push(`--glass-border-opacity-subtle: ${theme.glass.borderOpacity.subtle}`);
  cssVars.push(`--glass-border-opacity-visible: ${theme.glass.borderOpacity.visible}`);
  cssVars.push(`--glass-border-opacity-strong: ${theme.glass.borderOpacity.strong}`);

  // Animation durations
  cssVars.push(`--anim-duration-instant: ${theme.animation.duration.instant}ms`);
  cssVars.push(`--anim-duration-fast: ${theme.animation.duration.fast}ms`);
  cssVars.push(`--anim-duration-normal: ${theme.animation.duration.normal}ms`);
  cssVars.push(`--anim-duration-slow: ${theme.animation.duration.slow}ms`);
  cssVars.push(`--anim-duration-slower: ${theme.animation.duration.slower}ms`);

  // Animation easing
  cssVars.push(`--anim-easing-linear: ${theme.animation.easing.linear}`);
  cssVars.push(`--anim-easing-in: ${theme.animation.easing.easeIn}`);
  cssVars.push(`--anim-easing-out: ${theme.animation.easing.easeOut}`);
  cssVars.push(`--anim-easing-in-out: ${theme.animation.easing.easeInOut}`);
  cssVars.push(`--anim-easing-spring: ${theme.animation.easing.spring}`);

  // Shadows
  cssVars.push(`--shadow-none: ${theme.shadows.none}`);
  cssVars.push(`--shadow-sm: ${theme.shadows.sm}`);
  cssVars.push(`--shadow-md: ${theme.shadows.md}`);
  cssVars.push(`--shadow-lg: ${theme.shadows.lg}`);
  cssVars.push(`--shadow-xl: ${theme.shadows.xl}`);
  cssVars.push(`--shadow-glass: ${theme.shadows.glass}`);

  // Apply all variables at once - single DOM update
  const existingStyles = root.style.cssText;
  root.style.cssText = `${existingStyles}; ${cssVars.join("; ")}`;
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

/**
 * Loads all bundled themes and registers them with the theme registry
 */
export function loadAllThemes(): void {
  const allThemes = [
    deepPurpleCyan,
    indigoPurplePink,
    royalPurpleGold,
    spaceGrayMetal,
    arcticSilver,
    midnightPurple,
    starlightGold,
  ];

  for (const themeJson of allThemes) {
    try {
      const theme = loadTheme(themeJson);
      themeRegistry.registerTheme(theme);
    } catch (error) {
      console.error(`Failed to load theme:`, error);
    }
  }
}

/**
 * Initializes the theme system by loading all themes and applying the saved or default theme
 * @param defaultThemeId The theme ID to use if no saved theme is found (defaults to first registered theme)
 */
export function initializeThemes(defaultThemeId: string | undefined = undefined): void {
  // Load all themes into the registry
  loadAllThemes();

  // Get saved theme ID from localStorage
  const savedThemeId = getCurrentThemeId();

  // Determine which theme to apply
  let themeToApply = savedThemeId
    ? themeRegistry.getTheme(savedThemeId)
    : defaultThemeId
      ? themeRegistry.getTheme(defaultThemeId)
      : themeRegistry.getActiveTheme();

  // Fallback to first registered theme if nothing found
  if (!themeToApply) {
    const allThemes = themeRegistry.getAllThemes();
    if (allThemes.length > 0) {
      themeToApply = allThemes[0] ?? null;
    }
  }

  // Apply the theme
  if (themeToApply) {
    themeRegistry.setActiveTheme(themeToApply.meta.id);
    applyTheme(themeToApply);
    setCurrentThemeId(themeToApply.meta.id);
  }
}
