import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "accent", "success", "warning", "error"],
    },
    size: {
      control: "select",
      options: ["sm", "md"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
    variant: "default",
  },
};

export const Accent: Story = {
  args: {
    children: "Accent",
    variant: "accent",
  },
};

export const Success: Story = {
  args: {
    children: "Success",
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    children: "Warning",
    variant: "warning",
  },
};

export const ErrorState: Story = {
  args: {
    children: "Error",
    variant: "error",
  },
};

export const SmallSize: Story = {
  args: {
    children: "Small",
    size: "sm",
  },
};

export const MediumSize: Story = {
  args: {
    children: "Medium",
    size: "md",
  },
};
