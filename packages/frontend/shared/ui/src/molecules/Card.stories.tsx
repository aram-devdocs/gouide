import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "../atoms/Box";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Molecules/Card",
  component: Card,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <Text>This is a basic card with default styling</Text>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Card
      header={
        <Box padding="md">
          <Text weight="semibold">Card Header</Text>
        </Box>
      }
    >
      <Box padding="md">
        <Text>Card content goes here</Text>
      </Box>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card
      footer={
        <Box padding="md" display="flex" justifyContent="flex-end" gap="sm">
          <Button variant="ghost" size="sm" onPress={() => console.log("Cancel")}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onPress={() => console.log("Save")}>
            Save
          </Button>
        </Box>
      }
    >
      <Box padding="md">
        <Text>Card with action buttons in footer</Text>
      </Box>
    </Card>
  ),
};

export const Complete: Story = {
  render: () => (
    <Card
      header={
        <Box padding="md">
          <Text weight="semibold" size="lg">
            User Profile
          </Text>
        </Box>
      }
      footer={
        <Box padding="md" display="flex" justifyContent="space-between">
          <Text size="sm" color="fg-muted">
            Last updated: 2 hours ago
          </Text>
          <Box display="flex" gap="sm">
            <Button variant="ghost" size="sm" onPress={() => console.log("Cancel")}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" onPress={() => console.log("Save")}>
              Save Changes
            </Button>
          </Box>
        </Box>
      }
    >
      <Box padding="md" display="flex" flexDirection="column" gap="md">
        <Text>Name: John Doe</Text>
        <Text>Email: john@example.com</Text>
        <Text>Role: Developer</Text>
      </Box>
    </Card>
  ),
};
