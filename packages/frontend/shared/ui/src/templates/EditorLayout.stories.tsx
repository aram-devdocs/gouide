import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "../atoms/Box";
import { Text } from "../atoms/Text";
import { EditorLayout } from "./EditorLayout";

const meta: Meta<typeof EditorLayout> = {
  title: "Templates/EditorLayout",
  component: EditorLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof EditorLayout>;

export const Default: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <EditorLayout
        editor={
          <Box padding="lg" display="flex" alignItems="center" justifyContent="center">
            <Text size="lg">Editor content would render here</Text>
          </Box>
        }
      />
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <EditorLayout
        editor={
          <Box padding="md" display="flex" flexDirection="column" gap="md">
            <Text size="lg" weight="bold">
              Welcome to Gouide
            </Text>
            <Text color="fg-secondary">Open a file from the sidebar to start editing</Text>
          </Box>
        }
      />
    </div>
  ),
};
