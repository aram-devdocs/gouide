import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
    onPress: () => console.log("Primary clicked"),
  },
};

export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
    onPress: () => console.log("Secondary clicked"),
  },
};

export const Ghost: Story = {
  args: {
    children: "Ghost Button",
    variant: "ghost",
    onPress: () => console.log("Ghost clicked"),
  },
};

export const Small: Story = {
  args: {
    children: "Small",
    size: "sm",
    onPress: () => console.log("Small clicked"),
  },
};

export const Medium: Story = {
  args: {
    children: "Medium",
    size: "md",
    onPress: () => console.log("Medium clicked"),
  },
};

export const Large: Story = {
  args: {
    children: "Large",
    size: "lg",
    onPress: () => console.log("Large clicked"),
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
    onPress: () => console.log("This should not fire"),
  },
};
