/**
 * CommandPalette organism - interactive command palette UI
 */

import type { Command } from "@gouide/frontend-state";
import { useEffect } from "react";
import { Box } from "../atoms/Box";
import { Input } from "../atoms/Input";
import { Text } from "../atoms/Text";

export interface CommandPaletteProps {
  query: string;
  commands: Command[];
  selectedIndex: number;
  onQueryChange: (query: string) => void;
  onClose: () => void;
  onSelectNext: () => void;
  onSelectPrevious: () => void;
  onExecute: () => void;
}

/**
 * CommandPalette - keyboard-driven command interface
 *
 * @example
 * ```tsx
 * <CommandPalette
 *   query={query}
 *   commands={filteredCommands}
 *   selectedIndex={selectedIndex}
 *   onQueryChange={setQuery}
 *   onClose={close}
 *   onSelectNext={selectNext}
 *   onSelectPrevious={selectPrevious}
 *   onExecute={executeSelected}
 * />
 * ```
 */
export function CommandPalette({
  query,
  commands,
  selectedIndex,
  onQueryChange,
  onClose,
  onSelectNext,
  onSelectPrevious,
  onExecute,
}: CommandPaletteProps) {
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        case "ArrowDown":
          e.preventDefault();
          onSelectNext();
          break;
        case "ArrowUp":
          e.preventDefault();
          onSelectPrevious();
          break;
        case "Enter":
          e.preventDefault();
          onExecute();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onSelectNext, onSelectPrevious, onExecute]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      width={600}
      maxWidth="90vw"
      backgroundColor="bg-secondary"
      borderRadius="lg"
      overflow="hidden"
      style={{
        boxShadow: "var(--shadow-glass)",
        border: "1px solid var(--border-color)",
      }}
    >
      {/* Search input */}
      <Box padding="md">
        <Input
          value={query}
          onChange={onQueryChange}
          placeholder="Type a command or search..."
          variant="filled"
          size="md"
          autoFocus
        />
      </Box>

      {/* Command list */}
      <Box maxHeight={400} overflow="auto" paddingX="sm" paddingBottom="sm">
        {commands.length === 0 ? (
          <Box padding="lg" display="flex" justifyContent="center">
            <Text size="base" color="fg-muted">
              No commands found
            </Text>
          </Box>
        ) : (
          commands.map((command, index) => (
            <CommandItem
              key={command.id}
              command={command}
              isSelected={index === selectedIndex}
              onClick={() => {
                onExecute();
              }}
            />
          ))
        )}
      </Box>
    </Box>
  );
}

interface CommandItemProps {
  command: Command;
  isSelected: boolean;
  onClick: () => void;
}

function CommandItem({ command, isSelected, onClick }: CommandItemProps) {
  const boxProps = {
    padding: "sm" as const,
    marginY: "xs" as const,
    borderRadius: "sm" as const,
    ...(isSelected && { backgroundColor: "bg-active" as const }),
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "space-between" as const,
    onClick,
    onMouseEnter: (e: React.MouseEvent<Element>) => {
      if (!isSelected && e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.backgroundColor = "var(--bg-hover)";
      }
    },
    onMouseLeave: (e: React.MouseEvent<Element>) => {
      if (!isSelected && e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.backgroundColor = "transparent";
      }
    },
    style: {
      cursor: "pointer",
      transition: "background-color var(--anim-duration-fast) var(--anim-easing-out)",
    },
  };

  return (
    <Box {...boxProps}>
      <Box display="flex" alignItems="center" gap="md">
        {/* Category badge */}
        <Box
          paddingX="sm"
          paddingY="xs"
          borderRadius="sm"
          backgroundColor="bg-tertiary"
          style={{
            minWidth: "60px",
            textAlign: "center",
          }}
        >
          <Text size="sm" color="fg-secondary">
            {command.category}
          </Text>
        </Box>

        {/* Command label */}
        <Text size="base" color="fg-primary">
          {command.label}
        </Text>
      </Box>

      {/* Keybinding */}
      {command.keybinding && (
        <Box
          paddingX="sm"
          paddingY="xs"
          borderRadius="sm"
          style={{
            border: "1px solid var(--border-color)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <Text size="sm" color="fg-secondary">
            {command.keybinding}
          </Text>
        </Box>
      )}
    </Box>
  );
}
