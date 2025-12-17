/**
 * Theme management hook
 * Provides interface to the theme registry and theme application
 */

import { themeRegistry } from "@gouide/frontend-state";
import { applyTheme, setCurrentThemeId, type ThemeSchema } from "@gouide/frontend-theme";
import { useCallback, useEffect, useState } from "react";

export interface UseThemeReturn {
  /**
   * All registered themes
   */
  allThemes: ThemeSchema[];

  /**
   * Currently active theme
   */
  activeTheme: ThemeSchema | null;

  /**
   * Active theme ID
   */
  activeThemeId: string | null;

  /**
   * Light themes only
   */
  lightThemes: ThemeSchema[];

  /**
   * Dark themes only
   */
  darkThemes: ThemeSchema[];

  /**
   * Set and apply a theme by ID
   */
  setTheme: (themeId: string) => void;

  /**
   * Toggle between light and dark mode (switches to a theme of the opposite mode)
   */
  toggleMode: () => void;

  /**
   * Whether the current theme is dark mode
   */
  isDarkMode: boolean;
}

/**
 * Theme management hook
 * @returns Theme state and controls
 */
export function useTheme(): UseThemeReturn {
  const [, forceUpdate] = useState({});

  // Force re-render when themes change
  const refresh = useCallback(() => {
    forceUpdate({});
  }, []);

  // Subscribe to theme changes (if we implement an event emitter later)
  useEffect(() => {
    // For now, we don't have theme change events
    // This is a placeholder for future enhancement
  }, []);

  const allThemes = themeRegistry.getAllThemes();
  const activeTheme = themeRegistry.getActiveTheme();
  const activeThemeId = themeRegistry.getActiveThemeId();
  const lightThemes = themeRegistry.getThemesByMode("light");
  const darkThemes = themeRegistry.getThemesByMode("dark");
  const isDarkMode = activeTheme?.meta.mode === "dark";

  const setTheme = useCallback(
    (themeId: string) => {
      const theme = themeRegistry.getTheme(themeId);
      if (theme) {
        themeRegistry.setActiveTheme(themeId);
        applyTheme(theme);
        setCurrentThemeId(themeId);
        refresh();
      }
    },
    [refresh],
  );

  const toggleMode = useCallback(() => {
    if (!activeTheme) return;

    const currentMode = activeTheme.meta.mode ?? "light";
    const targetMode = currentMode === "light" ? "dark" : "light";
    const themesInTargetMode = themeRegistry.getThemesByMode(targetMode);

    // Switch to first theme in the opposite mode
    if (themesInTargetMode.length > 0) {
      const targetTheme = themesInTargetMode[0];
      if (targetTheme) {
        setTheme(targetTheme.meta.id);
      }
    }
  }, [activeTheme, setTheme]);

  return {
    allThemes,
    activeTheme,
    activeThemeId,
    lightThemes,
    darkThemes,
    setTheme,
    toggleMode,
    isDarkMode,
  };
}
