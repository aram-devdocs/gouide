import type { Meta, StoryObj } from "@storybook/react";
import { SettingsPanelTemplate } from "./SettingsPanelTemplate";

const meta = {
  title: "Templates/SettingsPanelTemplate",
  component: SettingsPanelTemplate,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof SettingsPanelTemplate>;

export default meta;
type Story = StoryObj<typeof meta>;

const mockThemes = [
  {
    meta: {
      id: "deep-purple-cyan",
      name: "Deep Purple Cyan",
      author: "Gouide Team",
      version: "1.0.0",
      mode: "dark" as const,
    },
    colors: {
      bg: {
        primary: "#1a0b2e",
        secondary: "#2d1b4e",
        tertiary: "#3d2a5f",
        hover: "#4a3570",
        active: "#5a4580",
      },
      fg: {
        primary: "#ffffff",
        secondary: "#c8b6e2",
        muted: "#8b7ba8",
        inverse: "#1a0b2e",
      },
      accent: "#00d9ff",
      border: "#4a3570",
      error: "#ff4757",
      success: "#2ed573",
      warning: "#ffa502",
      info: "#3498db",
      glass: {
        tint: "#2d1b4e",
        highlight: "#5a4580",
        shadow: "#0a0515",
      },
    },
    glass: {
      blur: { none: 0, sm: 4, md: 8, lg: 16, xl: 24 },
      opacity: { transparent: 0, light: 0.3, medium: 0.5, heavy: 0.7, opaque: 0.95 },
      borderOpacity: { none: 0, subtle: 0.1, visible: 0.2, strong: 0.3 },
    },
    animation: {
      duration: { instant: 0, fast: 150, normal: 300, slow: 500, slower: 700 },
      easing: {
        linear: "linear",
        easeIn: "cubic-bezier(0.4, 0, 1, 1)",
        easeOut: "cubic-bezier(0, 0, 0.2, 1)",
        easeInOut: "cubic-bezier(0.4, 0, 0.2, 1)",
        spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
    },
    breakpoints: {
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536,
    },
    shadows: {
      none: "none",
      sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
      md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
      glass: "0 8px 32px 0 rgba(0, 217, 255, 0.1)",
    },
  },
];

export const Default: Story = {
  args: {
    availableThemes: mockThemes,
    currentThemeId: "deep-purple-cyan",
    onThemeChange: () => {
      /* no-op */
    },
    keybindings: [],
    onKeybindingChange: () => {
      /* no-op */
    },
    fontSize: 13,
    onFontSizeChange: () => {
      /* no-op */
    },
    reduceAnimations: false,
    onReduceAnimationsChange: () => {
      /* no-op */
    },
    onClose: () => {
      /* no-op */
    },
    onSave: undefined,
    onReset: undefined,
  },
};
