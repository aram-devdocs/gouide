import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./Box";
import { Text } from "./Text";

const meta: Meta<typeof Text> = {
  title: "Atoms/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "base", "lg"],
    },
    weight: {
      control: "select",
      options: ["normal", "medium", "semibold", "bold"],
    },
    color: {
      control: "select",
      options: ["fg-primary", "fg-secondary", "fg-muted", "accent", "success", "warning", "error"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Default: Story = {
  args: {
    children: "Default text",
  },
};

export const Sizes: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="sm" padding="md">
      <Text size="sm">Small Text</Text>
      <Text size="base">Base Text (Default)</Text>
      <Text size="lg">Large Text</Text>
    </Box>
  ),
};

export const Weights: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="sm" padding="md">
      <Text weight="normal">Normal Weight</Text>
      <Text weight="medium">Medium Weight</Text>
      <Text weight="semibold">Semibold Weight</Text>
      <Text weight="bold">Bold Weight</Text>
    </Box>
  ),
};

export const Colors: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="sm" padding="md">
      <Text color="fg-primary">Primary Color</Text>
      <Text color="fg-secondary">Secondary Color</Text>
      <Text color="fg-muted">Muted Color</Text>
      <Text color="success">Success Color</Text>
      <Text color="warning">Warning Color</Text>
      <Text color="error">Error Color</Text>
    </Box>
  ),
};

export const Combined: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="md" padding="md">
      <Text size="lg" weight="bold" color="fg-primary">
        Large Bold Primary Heading
      </Text>
      <Text size="base" weight="medium" color="fg-secondary">
        Medium weight secondary text
      </Text>
      <Text size="sm" color="fg-muted">
        Small muted detail text
      </Text>
    </Box>
  ),
};
