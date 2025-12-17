/**
 * SettingsPanelTemplate - Complete settings panel template
 * Wraps SettingsPanel organism with header and actions
 * Simplified version - will be enhanced with Phase 5 icons
 */

import type { ThemeSchema } from "@gouide/frontend-theme";
import { Box } from "../atoms/Box";
import { Button } from "../atoms/Button";
import { GlassContainer } from "../atoms/GlassContainer";
import { GlassOverlay } from "../atoms/GlassOverlay";
import { Text } from "../atoms/Text";
import type { Keybinding } from "../molecules/KeybindingRow";
import { SettingsPanel } from "../organisms/SettingsPanel";

export interface SettingsPanelTemplateProps {
  // Theme settings
  availableThemes: ThemeSchema[];
  currentThemeId: string;
  onThemeChange: (themeId: string) => void;

  // Keybinding settings
  keybindings: Array<{
    commandId: string;
    commandLabel: string;
    commandCategory: string | undefined;
    currentKeybinding: Keybinding | undefined;
  }>;
  onKeybindingChange: (commandId: string, newKeybinding: Keybinding | null) => void;

  // Appearance settings
  fontSize: number;
  onFontSizeChange: ((size: number) => void) | undefined;
  reduceAnimations: boolean;
  onReduceAnimationsChange: ((reduce: boolean) => void) | undefined;

  // Panel actions
  onClose: (() => void) | undefined;
  onSave: (() => void) | undefined;
  onReset: (() => void) | undefined;
}

/**
 * SettingsPanelTemplate - complete settings panel with header and actions
 *
 * This is the template exported to apps for the settings panel.
 */
export function SettingsPanelTemplate({
  availableThemes,
  currentThemeId,
  onThemeChange,
  keybindings,
  onKeybindingChange,
  fontSize,
  onFontSizeChange,
  reduceAnimations,
  onReduceAnimationsChange,
  onClose,
  onSave,
  onReset,
}: SettingsPanelTemplateProps) {
  const overlayProps = onClose ? { onClick: onClose } : {};

  return (
    <GlassOverlay {...overlayProps}>
      <div
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.stopPropagation();
          }
        }}
        role="dialog"
        aria-modal="true"
        style={{ display: "contents" }}
      >
        <GlassContainer
          blur="xl"
          opacity="opaque"
          glow
          style={{
            width: "90vw",
            maxWidth: "1200px",
            height: "90vh",
            maxHeight: "800px",
            backgroundColor: "rgba(45, 39, 82, 0.98)",
            display: "flex",
            flexDirection: "column",
            borderRadius: "var(--radius-lg)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "var(--spacing-lg)",
              borderBottom: "1px solid var(--border-color)",
              backgroundColor: "var(--bg-secondary)",
            }}
          >
            <Box style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
              <Box style={{ fontSize: 20 }}>⚙️</Box>
              <Box>
                <Text size="lg" weight="semibold" color="fg-primary">
                  Settings
                </Text>
                <Text size="sm" color="fg-secondary">
                  Customize your IDE experience
                </Text>
              </Box>
            </Box>

            {onClose && (
              <Button variant="ghost" size="sm" onPress={onClose} ariaLabel="Close settings">
                ✕
              </Button>
            )}
          </Box>

          {/* Settings content */}
          <Box style={{ flex: 1, overflow: "hidden" }}>
            <SettingsPanel
              availableThemes={availableThemes}
              currentThemeId={currentThemeId}
              onThemeChange={onThemeChange}
              keybindings={keybindings}
              onKeybindingChange={onKeybindingChange}
              fontSize={fontSize}
              onFontSizeChange={onFontSizeChange}
              reduceAnimations={reduceAnimations}
              onReduceAnimationsChange={onReduceAnimationsChange}
            />
          </Box>

          {/* Footer actions */}
          {(onSave || onReset) && (
            <Box
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "var(--spacing-sm)",
                padding: "var(--spacing-lg)",
                borderTop: "1px solid var(--border-color)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              {onReset && (
                <Button variant="ghost" size="md" onPress={onReset}>
                  Reset to Defaults
                </Button>
              )}
              {onSave && (
                <Button variant="primary" size="md" onPress={onSave}>
                  Save Changes
                </Button>
              )}
            </Box>
          )}
        </GlassContainer>
      </div>
    </GlassOverlay>
  );
}
