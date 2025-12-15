import type { Meta, StoryObj } from "@storybook/react";
import { mockConnectionStates, mockDaemonInfo } from "../__mocks__/mockData";
import { StatusBarTemplate } from "./StatusBarTemplate";

const meta: Meta<typeof StatusBarTemplate> = {
  title: "Templates/StatusBarTemplate",
  component: StatusBarTemplate,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof StatusBarTemplate>;

/**
 * Disconnected state - no daemon connection
 */
export const Disconnected: Story = {
  args: {
    connectionState: mockConnectionStates.disconnected,
    daemonInfo: null,
    onRetry: async () => console.log("Retrying connection..."),
  },
};

/**
 * Connecting state - attempting to establish connection
 */
export const Connecting: Story = {
  args: {
    connectionState: mockConnectionStates.connecting,
    daemonInfo: null,
    onRetry: async () => console.log("Retrying connection..."),
  },
};

/**
 * Connected state - successfully connected to daemon
 */
export const Connected: Story = {
  args: {
    connectionState: mockConnectionStates.connected,
    daemonInfo: mockDaemonInfo,
    onRetry: async () => {
      /* noop */
    },
  },
};

/**
 * Error state - connection failed
 */
export const ErrorState: Story = {
  args: {
    connectionState: mockConnectionStates.error,
    daemonInfo: null,
    onRetry: async () => console.log("Retrying connection..."),
  },
};
