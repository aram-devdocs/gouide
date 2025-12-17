/**
 * ThemeCard - Visual preview card for theme selection
 * Shows color swatches and theme information
 * Simplified version - will be enhanced with Phase 5 icons
 */

import type { ThemeSchema } from "@gouide/frontend-theme";
import { Badge } from "../atoms/Badge";
import { Box } from "../atoms/Box";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";

export interface ThemeCardProps {
  theme: ThemeSchema;
  isActive: boolean;
  onSelect: (themeId: string) => void;
}

/**
 * ThemeCard component - displays a theme preview with color swatches
 */
export function ThemeCard({ theme, isActive, onSelect }: ThemeCardProps) {
  return (
    <Box
      style={{
        position: "relative",
        padding: "var(--spacing-md)",
        borderRadius: "var(--radius-md)",
        border: isActive ? "2px solid var(--accent-color)" : "1px solid var(--border-color)",
        backgroundColor: "var(--bg-secondary)",
        cursor: "pointer",
      }}
    >
      {/* Active indicator */}
      {isActive && (
        <Box
          style={{
            position: "absolute",
            top: "var(--spacing-sm)",
            right: "var(--spacing-sm)",
            width: 20,
            height: 20,
            borderRadius: "50%",
            backgroundColor: "var(--accent-color)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: 12,
          }}
        >
          ✓
        </Box>
      )}

      {/* Color swatches */}
      <Box
        style={{
          display: "flex",
          gap: "var(--spacing-xs)",
          marginBottom: "var(--spacing-md)",
        }}
      >
        <ColorSwatch color={theme.colors.bg.primary} label="Primary BG" />
        <ColorSwatch color={theme.colors.bg.secondary} label="Secondary BG" />
        <ColorSwatch color={theme.colors.accent} label="Accent" />
        <ColorSwatch color={theme.colors.glass.tint} label="Glass Tint" />
      </Box>

      {/* Theme info */}
      <Box style={{ marginBottom: "var(--spacing-xs)" }}>
        <Text weight="semibold" size="base" color="fg-primary">
          {theme.meta.name}
        </Text>
      </Box>

      {/* Theme mode badge */}
      <Box
        style={{
          display: "flex",
          gap: "var(--spacing-xs)",
          alignItems: "center",
          marginBottom: "var(--spacing-md)",
        }}
      >
        <Badge variant="default" size="sm">
          {theme.meta.mode || "dark"}
        </Badge>
        {theme.meta.author && (
          <Text size="sm" color="fg-secondary">
            {theme.meta.author}
          </Text>
        )}
      </Box>

      {/* Select button */}
      <Button
        variant={isActive ? "primary" : "secondary"}
        size="sm"
        onPress={() => onSelect(theme.meta.id)}
      >
        {isActive ? "Active" : "Select"}
      </Button>
    </Box>
  );
}

/**
 * ColorSwatch - small color preview square
 */
interface ColorSwatchProps {
  color: string;
  label: string;
}

function ColorSwatch({ color }: ColorSwatchProps) {
  return (
    <Box
      style={{
        width: 32,
        height: 32,
        borderRadius: "var(--radius-sm)",
        backgroundColor: color,
        border: "1px solid rgba(255, 255, 255, 0.1)",
        boxShadow: "inset 0 1px 2px rgba(0, 0, 0, 0.1)",
        flexShrink: 0,
      }}
    />
  );
}
