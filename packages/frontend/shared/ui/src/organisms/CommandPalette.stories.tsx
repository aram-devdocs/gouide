/**
 * CommandPalette stories
 * Note: For full command palette experience, see CommandPaletteTemplate
 */

import type { Command } from "@gouide/frontend-state";
import type { Meta } from "@storybook/react";
import { CommandPalette } from "./CommandPalette";

const meta = {
  title: "Organisms/CommandPalette",
  component: CommandPalette,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof CommandPalette>;

export default meta;

const sampleCommands: Command[] = [
  {
    id: "file.open",
    label: "Open File",
    category: "file",
    keybinding: "Cmd+O",
    execute: async () => {
      // Storybook demo - no-op
    },
  },
  {
    id: "file.save",
    label: "Save File",
    category: "file",
    keybinding: "Cmd+S",
    execute: async () => {
      // Storybook demo - no-op
    },
  },
  {
    id: "view.palette",
    label: "Show Command Palette",
    category: "view",
    keybinding: "Cmd+K",
    execute: async () => {
      // Storybook demo - no-op
    },
  },
];

/**
 * Command palette with sample commands
 */
export const Default = {
  args: {
    query: "",
    commands: sampleCommands,
    selectedIndex: 0,
    onQueryChange: () => {
      // Storybook demo - no-op
    },
    onClose: () => {
      // Storybook demo - no-op
    },
    onSelectNext: () => {
      // Storybook demo - no-op
    },
    onSelectPrevious: () => {
      // Storybook demo - no-op
    },
    onExecute: () => {
      // Storybook demo - no-op
    },
  },
};

/**
 * Command palette with search query
 */
export const WithQuery = {
  args: {
    query: "save",
    commands: sampleCommands.filter((c) => c.label.toLowerCase().includes("save")),
    selectedIndex: 0,
    onQueryChange: () => {
      // Storybook demo - no-op
    },
    onClose: () => {
      // Storybook demo - no-op
    },
    onSelectNext: () => {
      // Storybook demo - no-op
    },
    onSelectPrevious: () => {
      // Storybook demo - no-op
    },
    onExecute: () => {
      // Storybook demo - no-op
    },
  },
};

/**
 * Empty state when no commands match
 */
export const Empty = {
  args: {
    query: "xyz",
    commands: [],
    selectedIndex: 0,
    onQueryChange: () => {
      // Storybook demo - no-op
    },
    onClose: () => {
      // Storybook demo - no-op
    },
    onSelectNext: () => {
      // Storybook demo - no-op
    },
    onSelectPrevious: () => {
      // Storybook demo - no-op
    },
    onExecute: () => {
      // Storybook demo - no-op
    },
  },
};
