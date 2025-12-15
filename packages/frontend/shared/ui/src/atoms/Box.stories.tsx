import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./Box";
import { Text } from "./Text";

const meta: Meta<typeof Box> = {
  title: "Atoms/Box",
  component: Box,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Box>;

export const Default: Story = {
  render: () => (
    <Box padding="md" backgroundColor="bg-secondary">
      <Text>Default Box</Text>
    </Box>
  ),
};

export const WithPadding: Story = {
  render: () => (
    <Box padding="lg" backgroundColor="bg-secondary">
      <Text>Box with large padding</Text>
    </Box>
  ),
};

export const WithGap: Story = {
  render: () => (
    <Box display="flex" gap="md" padding="md" backgroundColor="bg-secondary">
      <Box padding="sm" backgroundColor="bg-primary">
        <Text size="sm">Item 1</Text>
      </Box>
      <Box padding="sm" backgroundColor="bg-primary">
        <Text size="sm">Item 2</Text>
      </Box>
      <Box padding="sm" backgroundColor="bg-primary">
        <Text size="sm">Item 3</Text>
      </Box>
    </Box>
  ),
};

export const FlexLayout: Story = {
  render: () => (
    <Box display="flex" flexDirection="column" gap="sm" padding="md" backgroundColor="bg-secondary">
      <Box padding="md" backgroundColor="bg-primary">
        <Text>Flex Item 1</Text>
      </Box>
      <Box padding="md" backgroundColor="bg-primary">
        <Text>Flex Item 2</Text>
      </Box>
      <Box padding="md" backgroundColor="bg-primary">
        <Text>Flex Item 3</Text>
      </Box>
    </Box>
  ),
};

export const GridLayout: Story = {
  render: () => (
    <Box
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "var(--spacing-md)",
        padding: "var(--spacing-md)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <Box padding="md" backgroundColor="bg-primary">
        <Text>Grid 1</Text>
      </Box>
      <Box padding="md" backgroundColor="bg-primary">
        <Text>Grid 2</Text>
      </Box>
      <Box padding="md" backgroundColor="bg-primary">
        <Text>Grid 3</Text>
      </Box>
    </Box>
  ),
};
