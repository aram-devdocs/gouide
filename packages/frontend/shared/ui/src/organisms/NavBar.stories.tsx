import type { Meta, StoryObj } from "@storybook/react";
import { NavBar } from "./NavBar";

const meta: Meta<typeof NavBar> = {
  title: "Organisms/NavBar",
  component: NavBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof NavBar>;

export const Default: Story = {
  args: {
    title: "Gouide",
  },
};

export const WithSubtitle: Story = {
  args: {
    title: "Gouide",
    subtitle: "my-project",
  },
};

export const WithLongSubtitle: Story = {
  args: {
    title: "Gouide",
    subtitle: "very-long-workspace-name-that-might-overflow",
  },
};
