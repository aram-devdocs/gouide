import type { Meta, StoryObj } from "@storybook/react";
import { Box } from "./Box";
import { Icon } from "./Icon";

const meta: Meta<typeof Icon> = {
  title: "Atoms/Icon",
  component: Icon,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    color: {
      control: "select",
      options: ["fg-primary", "fg-secondary", "fg-muted", "accent", "success", "warning", "error"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    children: "📁",
  },
};

export const Small: Story = {
  args: {
    children: "📄",
    size: "sm",
  },
};

export const Medium: Story = {
  args: {
    children: "📂",
    size: "md",
  },
};

export const Large: Story = {
  args: {
    children: "🚀",
    size: "lg",
  },
};

export const ColorVariants: Story = {
  render: () => (
    <Box display="flex" gap="md" padding="md">
      <Icon color="fg-primary">📁</Icon>
      <Icon color="fg-secondary">📄</Icon>
      <Icon color="fg-muted">📂</Icon>
      <Icon color="success">✓</Icon>
      <Icon color="warning">⚠</Icon>
      <Icon color="error">✗</Icon>
    </Box>
  ),
};

export const DifferentIcons: Story = {
  render: () => (
    <Box display="flex" gap="md" padding="md">
      <Icon>📁</Icon>
      <Icon>📄</Icon>
      <Icon>📂</Icon>
      <Icon>🔍</Icon>
      <Icon>⚙️</Icon>
      <Icon>🚀</Icon>
    </Box>
  ),
};
