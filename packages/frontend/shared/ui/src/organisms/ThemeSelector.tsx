/**
 * ThemeSelector organism
 * Grid display of available themes with selection interface
 */

import { useTheme } from "@gouide/frontend-hooks";
import type { ReactElement } from "react";
import { Box, Text } from "../atoms";
import { ThemeCard } from "../molecules/ThemeCard";

export interface ThemeSelectorProps {
  /**
   * Filter themes by mode
   */
  mode: "all" | "light" | "dark" | undefined;

  /**
   * Callback when a theme is selected
   */
  onThemeSelect: ((themeId: string) => void) | undefined;
}

/**
 * Theme selector with grid layout
 */
export function ThemeSelector(props: ThemeSelectorProps): ReactElement {
  const { mode = "all", onThemeSelect } = props;
  const { allThemes, lightThemes, darkThemes, activeThemeId, setTheme } = useTheme();

  // Determine which themes to display based on mode filter
  const themes = mode === "light" ? lightThemes : mode === "dark" ? darkThemes : allThemes;

  const handleThemeSelect = (themeId: string): void => {
    setTheme(themeId);
    if (onThemeSelect) {
      onThemeSelect(themeId);
    }
  };

  if (themes.length === 0) {
    return (
      <Box
        style={{
          padding: "var(--spacing-lg)",
          textAlign: "center",
        }}
      >
        <Text color="fg-secondary">No themes available</Text>
      </Box>
    );
  }

  return (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "var(--spacing-md)",
        padding: "var(--spacing-md)",
      }}
    >
      {themes.map((theme) => (
        <ThemeCard
          key={theme.meta.id}
          theme={theme}
          isActive={theme.meta.id === activeThemeId}
          onSelect={handleThemeSelect}
        />
      ))}
    </Box>
  );
}
