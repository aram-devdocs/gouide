/**
 * KeybindingRow - Single keybinding editor row
 * Shows command, current binding, and edit button
 * Simplified version - will be enhanced with Phase 5 icons
 */

import { useState } from "react";
import { Badge } from "../atoms/Badge";
import { Box } from "../atoms/Box";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";

export interface Keybinding {
  key: string; // e.g., "k"
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean; // Cmd/Meta
}

export interface KeybindingRowProps {
  commandId: string;
  commandLabel: string;
  commandCategory: string | undefined;
  currentKeybinding: Keybinding | undefined;
  onKeybindingChange: (commandId: string, newKeybinding: Keybinding | null) => void;
  hasConflict: boolean;
  conflictWith: string | undefined; // Command ID that conflicts
}

/**
 * Format keybinding for display (e.g., "Cmd+K", "Ctrl+Shift+P")
 */
function formatKeybinding(keybinding: Keybinding): string {
  const parts: string[] = [];

  if (keybinding.ctrl) parts.push("Ctrl");
  if (keybinding.alt) parts.push("Alt");
  if (keybinding.shift) parts.push("Shift");
  if (keybinding.meta) parts.push("Cmd");

  parts.push(keybinding.key.toUpperCase());

  return parts.join("+");
}

/**
 * KeybindingRow component - single row in keybinding editor
 */
export function KeybindingRow({
  commandId,
  commandLabel,
  commandCategory,
  currentKeybinding,
  onKeybindingChange,
  hasConflict = false,
  conflictWith,
}: KeybindingRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempKeybinding, setTempKeybinding] = useState<Keybinding | null>(null);

  const handleEdit = () => {
    setIsEditing(true);
    setTempKeybinding(currentKeybinding || null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempKeybinding(null);
  };

  const handleSave = () => {
    onKeybindingChange(commandId, tempKeybinding);
    setIsEditing(false);
    setTempKeybinding(null);
  };

  const handleClear = () => {
    onKeybindingChange(commandId, null);
    setIsEditing(false);
    setTempKeybinding(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isEditing) return;

    e.preventDefault();
    e.stopPropagation();

    // Escape to cancel
    if (e.key === "Escape") {
      handleCancel();
      return;
    }

    // Enter to save
    if (e.key === "Enter") {
      handleSave();
      return;
    }

    // Ignore modifier-only keys
    if (["Control", "Alt", "Shift", "Meta"].includes(e.key)) {
      return;
    }

    // Capture the key combination
    const newBinding: Keybinding = {
      key: e.key.toLowerCase(),
      ctrl: e.ctrlKey,
      alt: e.altKey,
      shift: e.shiftKey,
      meta: e.metaKey,
    };

    setTempKeybinding(newBinding);
  };

  return (
    <Box
      style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--spacing-md)",
        padding: "var(--spacing-md)",
        borderRadius: "var(--radius-sm)",
        backgroundColor: isEditing ? "var(--bg-tertiary)" : "transparent",
        border: hasConflict
          ? "1px solid var(--error-color)"
          : isEditing
            ? "1px solid var(--accent-color)"
            : "1px solid transparent",
      }}
    >
      {/* Command info */}
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Box
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--spacing-sm)",
            marginBottom: "var(--spacing-xs)",
          }}
        >
          <Text weight="medium" color="fg-primary">
            {commandLabel}
          </Text>
          {commandCategory && (
            <Badge variant="default" size="sm">
              {commandCategory}
            </Badge>
          )}
        </Box>
        <Text size="sm" color="fg-secondary">
          {commandId}
        </Text>
        {hasConflict && conflictWith && (
          <Box style={{ marginTop: "var(--spacing-xs)" }}>
            <Text size="sm" color="error">
              ⚠ Conflicts with: {conflictWith}
            </Text>
          </Box>
        )}
      </Box>

      {/* Keybinding display or editor */}
      {isEditing ? (
        <>
          <Box
            tabIndex={0}
            onKeyDown={handleKeyDown}
            style={{
              padding: "var(--spacing-sm) var(--spacing-md)",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--bg-secondary)",
              border: "2px solid var(--accent-color)",
              minWidth: 120,
              textAlign: "center",
              outline: "none",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--font-size-sm)",
              color: "var(--fg-primary)",
            }}
          >
            {tempKeybinding ? formatKeybinding(tempKeybinding) : "Press keys..."}
          </Box>
          <Box style={{ display: "flex", gap: "var(--spacing-xs)" }}>
            <Button variant="primary" size="sm" onPress={handleSave}>
              Save
            </Button>
            <Button variant="ghost" size="sm" onPress={handleCancel}>
              Cancel
            </Button>
            <Button variant="ghost" size="sm" onPress={handleClear}>
              Clear
            </Button>
          </Box>
        </>
      ) : (
        <>
          <Box
            style={{
              padding: "var(--spacing-sm) var(--spacing-md)",
              borderRadius: "var(--radius-sm)",
              backgroundColor: "var(--bg-tertiary)",
              minWidth: 120,
              textAlign: "center",
              fontFamily: "var(--font-mono)",
              fontSize: "var(--font-size-sm)",
              color: currentKeybinding ? "var(--fg-primary)" : "var(--fg-muted)",
            }}
          >
            {currentKeybinding ? formatKeybinding(currentKeybinding) : "Not set"}
          </Box>
          <Button variant="ghost" size="sm" onPress={handleEdit}>
            Edit
          </Button>
        </>
      )}
    </Box>
  );
}
