import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "Templates/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoFolder: Story = {
  args: {
    icon: "📁",
    title: "No folder opened",
    message: "Click 'Open Folder' to start working",
  },
};

export const NoFile: Story = {
  args: {
    icon: "📄",
    title: "No file selected",
    message: "Select a file from the sidebar to begin editing",
  },
};

export const Custom: Story = {
  args: {
    icon: "🚀",
    title: "Ready to code",
    message: "Your workspace is ready. Open a file or create a new one to get started!",
  },
};

export const SearchNoResults: Story = {
  args: {
    icon: "🔍",
    title: "No results found",
    message: "Try adjusting your search query",
  },
};

export const ErrorState: Story = {
  args: {
    icon: "⚠️",
    title: "Something went wrong",
    message: "Unable to load the requested content. Please try again.",
  },
};
