import type { Meta, StoryObj } from "@storybook/react";
import { StatusBar } from "./StatusBar";

const meta: Meta<typeof StatusBar> = {
  title: "Organisms/StatusBar",
  component: StatusBar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatusBar>;

/**
 * Disconnected state
 */
export const Disconnected: Story = {
  args: {
    status: "disconnected",
    onRetry: async () => console.log("Retrying..."),
  },
};

/**
 * Connecting state
 */
export const Connecting: Story = {
  args: {
    status: "connecting",
    message: "Establishing connection...",
    onRetry: async () => console.log("Retrying..."),
  },
};

/**
 * Connected state with protocol version
 */
export const Connected: Story = {
  args: {
    status: "connected",
    message: "1.0.0",
    daemonId: "daemon-12",
    onRetry: async () => {
      /* noop */
    },
  },
};

/**
 * Error state with error message
 */
export const ErrorState: Story = {
  args: {
    status: "error",
    error: "Connection refused",
    onRetry: async () => console.log("Retrying..."),
  },
};

/**
 * Connected with full daemon ID
 */
export const ConnectedWithFullId: Story = {
  args: {
    status: "connected",
    message: "1.0.0",
    daemonId: "daemon-12345678",
    onRetry: async () => {
      /* noop */
    },
  },
};
