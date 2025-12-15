/**
 * GlassModal stories
 */

import type { Meta } from "@storybook/react";
import { Box } from "../atoms/Box";
import { Button } from "../atoms/Button";
import { GlassOverlay } from "../atoms/GlassOverlay";
import { Text } from "../atoms/Text";
import { GlassModal } from "./GlassModal";

const meta = {
  title: "Molecules/GlassModal",
  component: GlassModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassModal>;

export default meta;

function ModalContent() {
  return (
    <Box display="flex" flexDirection="column" gap="md">
      <Text size="lg" color="fg-primary" weight="semibold">
        Glass Modal Example
      </Text>
      <Text size="base" color="fg-secondary">
        This modal uses glassmorphism with backdrop blur, translucent background, and purple glow
        effect for a modern, sleek appearance.
      </Text>
      <Box display="flex" gap="sm" justifyContent="flex-end">
        <Button variant="secondary">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </Box>
    </Box>
  );
}

/**
 * Default glass modal with overlay
 */
export const Default = {
  render: () => (
    <GlassOverlay>
      <GlassModal>
        <ModalContent />
      </GlassModal>
    </GlassOverlay>
  ),
};

/**
 * Small modal
 */
export const Small = {
  render: () => (
    <GlassOverlay>
      <GlassModal width={400} padding="sm">
        <Box display="flex" flexDirection="column" gap="sm">
          <Text size="base" color="fg-primary" weight="semibold">
            Small Modal
          </Text>
          <Text size="sm" color="fg-secondary">
            Compact modal with smaller padding.
          </Text>
        </Box>
      </GlassModal>
    </GlassOverlay>
  ),
};

/**
 * Large modal
 */
export const Large = {
  render: () => (
    <GlassOverlay>
      <GlassModal width={800} padding="lg">
        <Box display="flex" flexDirection="column" gap="lg">
          <Text size="lg" color="fg-primary" weight="semibold">
            Large Modal
          </Text>
          <Text size="base" color="fg-secondary">
            Larger modal with more padding for complex content.
          </Text>
          <Box display="flex" flexDirection="column" gap="sm">
            <Text size="sm" color="fg-muted">
              Additional content sections can be added here. The modal will scroll if content
              exceeds the maximum height.
            </Text>
          </Box>
        </Box>
      </GlassModal>
    </GlassOverlay>
  ),
};
