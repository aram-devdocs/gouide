import type { Meta, StoryObj } from "@storybook/react";
import { ThemeSelector } from "./ThemeSelector";

const meta = {
  title: "Organisms/ThemeSelector",
  component: ThemeSelector,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ThemeSelector>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    mode: "all",
    onThemeSelect: () => {
      /* no-op */
    },
  },
};

export const DarkMode: Story = {
  args: {
    mode: "dark",
    onThemeSelect: () => {
      /* no-op */
    },
  },
};

export const LightMode: Story = {
  args: {
    mode: "light",
    onThemeSelect: () => {
      /* no-op */
    },
  },
};
