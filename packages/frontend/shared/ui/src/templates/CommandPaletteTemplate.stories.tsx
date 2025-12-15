/**
 * CommandPaletteTemplate stories
 */

import type { Command } from "@gouide/frontend-state";
import type { Meta } from "@storybook/react";
import { useState } from "react";
import { Button } from "../atoms/Button";
import { CommandPaletteTemplate } from "./CommandPaletteTemplate";

const meta = {
  title: "Templates/CommandPaletteTemplate",
  component: CommandPaletteTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CommandPaletteTemplate>;

export default meta;

// Sample commands for demonstration
const sampleCommands: Command[] = [
  {
    id: "file.open",
    label: "Open File",
    category: "file",
    keywords: ["open", "file", "browse"],
    keybinding: "Cmd+O",
    execute: async () => console.log("Open file"),
  },
  {
    id: "file.save",
    label: "Save File",
    category: "file",
    keywords: ["save", "write"],
    keybinding: "Cmd+S",
    execute: async () => console.log("Save file"),
  },
  {
    id: "view.commandPalette",
    label: "Show Command Palette",
    category: "view",
    keywords: ["command", "palette", "search"],
    keybinding: "Cmd+K",
    execute: async () => console.log("Show palette"),
  },
  {
    id: "view.toggleFileTree",
    label: "Toggle File Explorer",
    category: "view",
    keywords: ["file", "tree", "explorer", "sidebar"],
    keybinding: "Cmd+B",
    execute: async () => console.log("Toggle file tree"),
  },
  {
    id: "view.toggleTerminal",
    label: "Toggle Terminal",
    category: "view",
    keywords: ["terminal", "console", "shell"],
    keybinding: "Cmd+J",
    execute: async () => console.log("Toggle terminal"),
  },
  {
    id: "view.zenMode",
    label: "Toggle Zen Mode",
    category: "view",
    keywords: ["zen", "focus", "distraction"],
    keybinding: "Cmd+Shift+Z",
    execute: async () => console.log("Toggle zen mode"),
  },
  {
    id: "edit.find",
    label: "Find in File",
    category: "edit",
    keywords: ["find", "search"],
    keybinding: "Cmd+F",
    execute: async () => console.log("Find in file"),
  },
  {
    id: "settings.theme",
    label: "Change Theme",
    category: "settings",
    keywords: ["theme", "color", "appearance"],
    execute: async () => console.log("Change theme"),
  },
];

/**
 * Interactive demo with command palette
 */
function CommandPaletteDemo() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filteredCommands = query.trim()
    ? sampleCommands.filter(
        (cmd) =>
          cmd.label.toLowerCase().includes(query.toLowerCase()) ||
          cmd.keywords?.some((kw) => kw.toLowerCase().includes(query.toLowerCase())),
      )
    : sampleCommands;

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setSelectedIndex(0);
  };

  const handleSelectNext = () => {
    setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
  };

  const handleSelectPrevious = () => {
    setSelectedIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleExecute = async () => {
    const command = filteredCommands[selectedIndex];
    if (command) {
      await command.execute();
      setIsOpen(false);
      setQuery("");
      setSelectedIndex(0);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <Button variant="primary" onPress={() => setIsOpen(true)}>
        Open Command Palette (Cmd+K)
      </Button>

      <CommandPaletteTemplate
        isOpen={isOpen}
        query={query}
        commands={filteredCommands}
        selectedIndex={selectedIndex}
        onQueryChange={handleQueryChange}
        onClose={() => {
          setIsOpen(false);
          setQuery("");
          setSelectedIndex(0);
        }}
        onSelectNext={handleSelectNext}
        onSelectPrevious={handleSelectPrevious}
        onExecute={handleExecute}
      />
    </div>
  );
}

export const Interactive = {
  render: () => <CommandPaletteDemo />,
};

export const WithCommands = {
  render: () => <CommandPaletteDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Click the button to open the command palette. Use arrow keys to navigate, Enter to execute, Escape to close. Try typing to filter commands with fuzzy search.",
      },
    },
  },
};
