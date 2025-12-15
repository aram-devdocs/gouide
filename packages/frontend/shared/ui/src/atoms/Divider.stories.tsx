import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./Box";
import { Divider } from "./Divider";
import { Text } from "./Text";

const meta: Meta<typeof Divider> = {
  title: "Atoms/Divider",
  component: Divider,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="md" padding="md">
      <Text>Content above</Text>
      <Divider orientation="horizontal" />
      <Text>Content below</Text>
    </Box>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Box display="flex" alignItems="center" gap="md" padding="md" style={{ height: "100px" }}>
      <Text>Left content</Text>
      <Divider orientation="vertical" />
      <Text>Right content</Text>
    </Box>
  ),
};
