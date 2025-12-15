import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "../atoms/Box";
import { FileTreeItem } from "./FileTreeItem";

const meta: Meta<typeof FileTreeItem> = {
  title: "Molecules/FileTreeItem",
  component: FileTreeItem,
  tags: ["autodocs"],
  argTypes: {
    isDirectory: {
      control: "boolean",
    },
    isExpanded: {
      control: "boolean",
    },
    isSelected: {
      control: "boolean",
    },
    isLoading: {
      control: "boolean",
    },
    hasError: {
      control: "boolean",
    },
    depth: {
      control: "number",
    },
  },
};

export default meta;
type Story = StoryObj<typeof FileTreeItem>;

export const File: Story = {
  args: {
    name: "App.tsx",
    isDirectory: false,
    onSelect: () => console.log("File selected"),
  },
};

export const Directory: Story = {
  args: {
    name: "src",
    isDirectory: true,
    isExpanded: false,
    onToggle: () => console.log("Directory toggled"),
    onSelect: () => console.log("Directory selected"),
  },
};

export const DirectoryExpanded: Story = {
  args: {
    name: "components",
    isDirectory: true,
    isExpanded: true,
    onToggle: () => console.log("Directory toggled"),
    onSelect: () => console.log("Directory selected"),
  },
};

export const Selected: Story = {
  args: {
    name: "index.tsx",
    isDirectory: false,
    isSelected: true,
    onSelect: () => console.log("File selected"),
  },
};

export const Loading: Story = {
  args: {
    name: "node_modules",
    isDirectory: true,
    isExpanded: true,
    isLoading: true,
    onToggle: () => console.log("Directory toggled"),
  },
};

export const ErrorState: Story = {
  args: {
    name: "restricted",
    isDirectory: true,
    isExpanded: true,
    hasError: true,
    onToggle: () => console.log("Directory toggled"),
  },
};

export const NestedDepths: Story = {
  render: () => (
    <Box display="flex" flexDirection="column">
      <FileTreeItem
        name="root"
        isDirectory
        depth={0}
        onToggle={() => {
          /* noop */
        }}
      />
      <FileTreeItem
        name="src"
        isDirectory
        depth={1}
        onToggle={() => {
          /* noop */
        }}
      />
      <FileTreeItem
        name="components"
        isDirectory
        depth={2}
        onToggle={() => {
          /* noop */
        }}
      />
      <FileTreeItem
        name="Button.tsx"
        isDirectory={false}
        depth={3}
        onSelect={() => {
          /* noop */
        }}
      />
      <FileTreeItem
        name="Input.tsx"
        isDirectory={false}
        depth={3}
        onSelect={() => {
          /* noop */
        }}
      />
    </Box>
  ),
};
