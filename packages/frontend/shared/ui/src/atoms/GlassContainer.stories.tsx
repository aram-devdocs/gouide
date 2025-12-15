/**
 * GlassContainer stories
 * This is a re-export wrapper for architectural compliance.
 * See GlassModal and GlassSidebar stories for usage examples.
 */

import type { Meta } from "@storybook/react";
import { Box } from "./Box";
import { GlassContainer } from "./GlassContainer";
import { Text } from "./Text";

const meta = {
  title: "Atoms/GlassContainer",
  component: GlassContainer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassContainer>;

export default meta;

/**
 * Basic glass container with default blur and opacity
 */
export const Default = {
  args: {
    children: (
      <Box padding="xl">
        <Text size="lg" color="fg-primary">
          Glassmorphism Container
        </Text>
      </Box>
    ),
  },
};

/**
 * Heavy glass with strong blur and high opacity
 */
export const Heavy = {
  args: {
    blur: "lg",
    opacity: "heavy",
    borderOpacity: "visible",
    glow: true,
    children: (
      <Box padding="xl">
        <Text size="lg" color="fg-primary">
          Heavy Glass Effect
        </Text>
      </Box>
    ),
  },
};

/**
 * Light glass with subtle blur and low opacity
 */
export const Light = {
  args: {
    blur: "sm",
    opacity: "light",
    borderOpacity: "subtle",
    children: (
      <Box padding="xl">
        <Text size="lg" color="fg-primary">
          Light Glass Effect
        </Text>
      </Box>
    ),
  },
};
