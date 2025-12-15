/**
 * Global keyboard shortcut handler
 */

import { commandRegistry } from "@gouide/frontend-state";
import { useEffect } from "react";

export interface Keybinding {
  key: string;
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
}

export interface ShortcutHandler {
  binding: Keybinding;
  commandId: string;
  description: string;
}

/**
 * Parse keybinding string like "Cmd+K" or "Ctrl+Shift+P" into Keybinding object
 */
export function parseKeybinding(keybindingString: string): Keybinding {
  const parts = keybindingString.split("+").map((p) => p.trim().toLowerCase());
  const key = parts[parts.length - 1];

  return {
    key: key || "",
    ctrl: parts.includes("ctrl"),
    alt: parts.includes("alt"),
    shift: parts.includes("shift"),
    meta: parts.includes("cmd") || parts.includes("meta"),
  };
}

/**
 * Check if a keyboard event matches a keybinding
 */
export function matchesKeybinding(event: KeyboardEvent, binding: Keybinding): boolean {
  return (
    event.key.toLowerCase() === binding.key.toLowerCase() &&
    !!event.ctrlKey === !!binding.ctrl &&
    !!event.altKey === !!binding.alt &&
    !!event.shiftKey === !!binding.shift &&
    !!event.metaKey === !!binding.meta
  );
}

/**
 * Hook to register global keyboard shortcuts
 * Automatically executes commands from the command registry
 *
 * @param handlers Array of shortcut handlers to register
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts([
 *   {
 *     binding: { key: 'k', meta: true },
 *     commandId: 'view.commandPalette',
 *     description: 'Show command palette',
 *   },
 *   {
 *     binding: { key: 'b', meta: true },
 *     commandId: 'view.toggleFileTree',
 *     description: 'Toggle file tree',
 *   },
 * ]);
 * ```
 */
export function useKeyboardShortcuts(handlers: ShortcutHandler[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      for (const handler of handlers) {
        if (matchesKeybinding(e, handler.binding)) {
          e.preventDefault();
          e.stopPropagation();
          commandRegistry.execute(handler.commandId).catch((error) => {
            console.error(`Failed to execute command ${handler.commandId}:`, error);
          });
          return;
        }
      }
    };

    // Use capture phase to intercept events before Monaco or other editors
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [handlers]);
}
