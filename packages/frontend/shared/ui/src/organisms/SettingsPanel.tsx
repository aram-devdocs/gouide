/**
 * SettingsPanel - Main settings UI organism
 * Provides sections for theme selection, keybindings, and appearance
 * Simplified version - will be enhanced as phases progress
 */

import type { ThemeSchema } from "@gouide/frontend-theme";
import { useState } from "react";
import { Box } from "../atoms/Box";
import { Button } from "../atoms/Button";
import { Divider } from "../atoms/Divider";
import { Input } from "../atoms/Input";
import { Text } from "../atoms/Text";
import type { Keybinding } from "../molecules/KeybindingRow";
import { KeybindingRow } from "../molecules/KeybindingRow";
import { ThemeCard } from "../molecules/ThemeCard";

export interface SettingsPanelProps {
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
}

/**
 * SettingsPanel component - comprehensive settings interface
 */
export function SettingsPanel({
  availableThemes,
  currentThemeId,
  onThemeChange,
  keybindings,
  onKeybindingChange,
  fontSize = 13,
  onFontSizeChange,
  reduceAnimations = false,
  onReduceAnimationsChange,
}: SettingsPanelProps) {
  const [activeSection, setActiveSection] = useState<"themes" | "keybindings" | "appearance">(
    "themes",
  );
  const [keybindingSearch, setKeybindingSearch] = useState("");
  const [themeFilter, setThemeFilter] = useState<"all" | "light" | "dark">("all");

  // Filter themes by mode
  const filteredThemes = availableThemes.filter((theme) => {
    if (themeFilter === "all") return true;
    return theme.meta.mode === themeFilter;
  });

  // Filter keybindings by search
  const filteredKeybindings = keybindings.filter((kb) => {
    if (!keybindingSearch) return true;
    const search = keybindingSearch.toLowerCase();
    return (
      kb.commandLabel.toLowerCase().includes(search) ||
      kb.commandId.toLowerCase().includes(search) ||
      kb.commandCategory?.toLowerCase().includes(search)
    );
  });

  // Detect keybinding conflicts
  const keybindingConflicts = new Map<string, string[]>();
  keybindings.forEach((kb1) => {
    const kb1Binding = kb1.currentKeybinding;
    if (!kb1Binding) return;

    const conflicts = keybindings
      .filter((kb2) => {
        if (kb2.commandId === kb1.commandId || !kb2.currentKeybinding) return false;
        return keybindingsEqual(kb1Binding, kb2.currentKeybinding);
      })
      .map((kb) => kb.commandId);

    if (conflicts.length > 0) {
      keybindingConflicts.set(kb1.commandId, conflicts);
    }
  });

  return (
    <Box
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Section tabs */}
      <Box
        style={{
          display: "flex",
          gap: "var(--spacing-xs)",
          padding: "var(--spacing-md)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <SectionTab
          label="Themes"
          isActive={activeSection === "themes"}
          onPress={() => setActiveSection("themes")}
        />
        <SectionTab
          label="Keybindings"
          isActive={activeSection === "keybindings"}
          onPress={() => setActiveSection("keybindings")}
        />
        <SectionTab
          label="Appearance"
          isActive={activeSection === "appearance"}
          onPress={() => setActiveSection("appearance")}
        />
      </Box>

      {/* Content area */}
      <Box
        style={{
          flex: 1,
          overflow: "auto",
          padding: "var(--spacing-lg)",
        }}
      >
        {/* Themes section */}
        {activeSection === "themes" && (
          <Box>
            <Box style={{ marginBottom: "var(--spacing-lg)" }}>
              <Text size="lg" weight="semibold" color="fg-primary">
                Choose Your Theme
              </Text>
              <Box style={{ marginTop: "var(--spacing-xs)" }}>
                <Text size="sm" color="fg-secondary">
                  Select from our curated collection of Apple-inspired themes
                </Text>
              </Box>
            </Box>

            {/* Theme filter */}
            <Box
              style={{
                display: "flex",
                gap: "var(--spacing-xs)",
                marginBottom: "var(--spacing-lg)",
              }}
            >
              <Button
                variant={themeFilter === "all" ? "primary" : "secondary"}
                size="sm"
                onPress={() => setThemeFilter("all")}
              >
                All Themes
              </Button>
              <Button
                variant={themeFilter === "light" ? "primary" : "secondary"}
                size="sm"
                onPress={() => setThemeFilter("light")}
              >
                Light
              </Button>
              <Button
                variant={themeFilter === "dark" ? "primary" : "secondary"}
                size="sm"
                onPress={() => setThemeFilter("dark")}
              >
                Dark
              </Button>
            </Box>

            {/* Theme grid */}
            <Box
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                gap: "var(--spacing-md)",
              }}
            >
              {filteredThemes.map((theme) => (
                <ThemeCard
                  key={theme.meta.id}
                  theme={theme}
                  isActive={theme.meta.id === currentThemeId}
                  onSelect={onThemeChange}
                />
              ))}
            </Box>
          </Box>
        )}

        {/* Keybindings section */}
        {activeSection === "keybindings" && (
          <Box>
            <Box style={{ marginBottom: "var(--spacing-lg)" }}>
              <Text size="lg" weight="semibold" color="fg-primary">
                Keyboard Shortcuts
              </Text>
              <Box style={{ marginTop: "var(--spacing-xs)" }}>
                <Text size="sm" color="fg-secondary">
                  Customize keybindings for all commands
                </Text>
              </Box>
            </Box>

            {/* Search */}
            <Box style={{ marginBottom: "var(--spacing-lg)" }}>
              <Input
                type="text"
                placeholder="Search commands..."
                value={keybindingSearch}
                onChange={setKeybindingSearch}
              />
            </Box>

            {/* Keybindings list */}
            <Box style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-sm)" }}>
              {filteredKeybindings.length === 0 ? (
                <Box style={{ textAlign: "center", padding: "var(--spacing-xl)" }}>
                  <Text color="fg-muted">
                    No commands found matching &quot;{keybindingSearch}&quot;
                  </Text>
                </Box>
              ) : (
                filteredKeybindings.map((kb) => {
                  const conflicts = keybindingConflicts.get(kb.commandId);
                  return (
                    <KeybindingRow
                      key={kb.commandId}
                      commandId={kb.commandId}
                      commandLabel={kb.commandLabel}
                      commandCategory={kb.commandCategory}
                      currentKeybinding={kb.currentKeybinding}
                      onKeybindingChange={onKeybindingChange}
                      hasConflict={!!conflicts}
                      conflictWith={conflicts?.[0]}
                    />
                  );
                })
              )}
            </Box>
          </Box>
        )}

        {/* Appearance section */}
        {activeSection === "appearance" && (
          <Box>
            <Box style={{ marginBottom: "var(--spacing-lg)" }}>
              <Text size="lg" weight="semibold" color="fg-primary">
                Appearance Settings
              </Text>
              <Box style={{ marginTop: "var(--spacing-xs)" }}>
                <Text size="sm" color="fg-secondary">
                  Adjust visual preferences and accessibility
                </Text>
              </Box>
            </Box>

            {/* Font size */}
            {onFontSizeChange && (
              <>
                <Box style={{ marginBottom: "var(--spacing-md)" }}>
                  <Box style={{ marginBottom: "var(--spacing-sm)" }}>
                    <Text weight="medium" color="fg-primary">
                      Font Size
                    </Text>
                  </Box>
                  <Box style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
                    <Button
                      size="sm"
                      variant="secondary"
                      onPress={() => onFontSizeChange(Math.max(10, fontSize - 1))}
                    >
                      -
                    </Button>
                    <Box style={{ minWidth: 60, textAlign: "center" }}>
                      <Text color="fg-primary">{fontSize}px</Text>
                    </Box>
                    <Button
                      size="sm"
                      variant="secondary"
                      onPress={() => onFontSizeChange(Math.min(20, fontSize + 1))}
                    >
                      +
                    </Button>
                    <Button size="sm" variant="ghost" onPress={() => onFontSizeChange(13)}>
                      Reset
                    </Button>
                  </Box>
                </Box>
                <Divider />
              </>
            )}

            {/* Reduce animations */}
            {onReduceAnimationsChange && (
              <Box style={{ marginTop: "var(--spacing-md)" }}>
                <Box
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Box>
                    <Text weight="medium" color="fg-primary">
                      Reduce Animations
                    </Text>
                    <Box style={{ marginTop: "var(--spacing-xs)" }}>
                      <Text size="sm" color="fg-secondary">
                        Minimize motion for better performance or accessibility
                      </Text>
                    </Box>
                  </Box>
                  <Button
                    variant={reduceAnimations ? "primary" : "secondary"}
                    size="sm"
                    onPress={() => onReduceAnimationsChange(!reduceAnimations)}
                  >
                    {reduceAnimations ? "Enabled" : "Disabled"}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}

/**
 * SectionTab - Tab button for switching sections
 */
interface SectionTabProps {
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function SectionTab({ label, isActive, onPress }: SectionTabProps) {
  return (
    <Button variant={isActive ? "primary" : "ghost"} size="sm" onPress={onPress}>
      {label}
    </Button>
  );
}

/**
 * Check if two keybindings are equal
 */
function keybindingsEqual(a: Keybinding, b: Keybinding): boolean {
  return (
    a.key === b.key &&
    !!a.ctrl === !!b.ctrl &&
    !!a.alt === !!b.alt &&
    !!a.shift === !!b.shift &&
    !!a.meta === !!b.meta
  );
}
