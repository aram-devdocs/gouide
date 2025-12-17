/**
 * Theme registry - centralized theme management
 * Singleton pattern for registering and retrieving themes
 */

import type { ThemeSchema } from "@gouide/frontend-theme";

/**
 * Theme registry interface
 */
export interface ThemeRegistry {
  /**
   * Register a theme in the registry
   */
  registerTheme(theme: ThemeSchema): void;

  /**
   * Get a theme by ID
   */
  getTheme(id: string): ThemeSchema | null;

  /**
   * Get all registered themes
   */
  getAllThemes(): ThemeSchema[];

  /**
   * Get themes filtered by mode (light/dark)
   */
  getThemesByMode(mode: "light" | "dark"): ThemeSchema[];

  /**
   * Set the active theme ID
   */
  setActiveTheme(id: string): void;

  /**
   * Get the currently active theme
   */
  getActiveTheme(): ThemeSchema | null;

  /**
   * Get the active theme ID
   */
  getActiveThemeId(): string | null;
}

/**
 * Theme registry implementation
 */
class ThemeRegistryImpl implements ThemeRegistry {
  private themes: Map<string, ThemeSchema> = new Map();
  private activeThemeId: string | null = null;

  registerTheme(theme: ThemeSchema): void {
    this.themes.set(theme.meta.id, theme);

    // Set as active if it's the first theme or if no active theme is set
    if (!this.activeThemeId || this.themes.size === 1) {
      this.activeThemeId = theme.meta.id;
    }
  }

  getTheme(id: string): ThemeSchema | null {
    return this.themes.get(id) || null;
  }

  getAllThemes(): ThemeSchema[] {
    return Array.from(this.themes.values());
  }

  getThemesByMode(mode: "light" | "dark"): ThemeSchema[] {
    return Array.from(this.themes.values()).filter((theme) => theme.meta.mode === mode);
  }

  setActiveTheme(id: string): void {
    if (this.themes.has(id)) {
      this.activeThemeId = id;
    } else {
      console.warn(`Theme with ID "${id}" not found in registry`);
    }
  }

  getActiveTheme(): ThemeSchema | null {
    if (!this.activeThemeId) return null;
    return this.themes.get(this.activeThemeId) || null;
  }

  getActiveThemeId(): string | null {
    return this.activeThemeId;
  }
}

/**
 * Singleton theme registry instance
 */
export const themeRegistry: ThemeRegistry = new ThemeRegistryImpl();
