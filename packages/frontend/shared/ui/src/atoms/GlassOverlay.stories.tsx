/**
 * GlassOverlay stories
 */

import type { Meta } from "@storybook/react";
import { Box } from "./Box";
import { GlassOverlay } from "./GlassOverlay";
import { Text } from "./Text";

const meta = {
  title: "Atoms/GlassOverlay",
  component: GlassOverlay,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassOverlay>;

export default meta;

/**
 * Full-screen glass overlay backdrop
 */
export const Default = {
  args: {
    children: (
      <Box
        padding="xl"
        backgroundColor="bg-secondary"
        borderRadius="lg"
        style={{
          boxShadow: "var(--shadow-glass)",
        }}
      >
        <Text size="lg" color="fg-primary">
          Content on top of glass overlay
        </Text>
      </Box>
    ),
  },
};

/**
 * Glass overlay with click handler
 */
export const WithClickHandler = {
  args: {
    onClick: () => alert("Overlay clicked"),
    children: (
      <Box
        padding="xl"
        backgroundColor="bg-secondary"
        borderRadius="lg"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        <Text size="lg" color="fg-primary">
          Click overlay to close (content won't trigger)
        </Text>
      </Box>
    ),
  },
};
