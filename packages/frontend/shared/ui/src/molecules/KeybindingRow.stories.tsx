import type { Meta, StoryObj } from "@storybook/react";
import { KeybindingRow } from "./KeybindingRow";

const meta = {
  title: "Molecules/KeybindingRow",
  component: KeybindingRow,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof KeybindingRow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    commandId: "view.toggleSidebar",
    commandLabel: "Toggle Sidebar",
    commandCategory: "View",
    currentKeybinding: {
      key: "b",
      meta: true,
    },
    hasConflict: false,
    conflictWith: undefined,
    onKeybindingChange: () => {
      /* no-op */
    },
  },
};

export const WithConflict: Story = {
  args: {
    commandId: "view.toggleSidebar",
    commandLabel: "Toggle Sidebar",
    commandCategory: "View",
    currentKeybinding: {
      key: "b",
      meta: true,
    },
    hasConflict: true,
    conflictWith: "workspace.openFile",
    onKeybindingChange: () => {
      /* no-op */
    },
  },
};

export const NoBinding: Story = {
  args: {
    commandId: "view.toggleSidebar",
    commandLabel: "Toggle Sidebar",
    commandCategory: "View",
    currentKeybinding: undefined,
    hasConflict: false,
    conflictWith: undefined,
    onKeybindingChange: () => {
      /* no-op */
    },
  },
};
