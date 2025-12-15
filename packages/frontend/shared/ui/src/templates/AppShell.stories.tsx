import type { Meta, StoryObj } from "@storybook/react";
import {
  mockBuffer3,
  mockDaemonDataConnected,
  mockDaemonDataConnecting,
  mockDaemonDataDisconnected,
  mockDaemonDataError,
  mockOpenBuffers,
  mockWorkspaceData,
  mockWorkspaceDataEmpty,
} from "../__mocks__/mockData";
import { AppShell } from "./AppShell";

const meta: Meta<typeof AppShell> = {
  title: "Templates/AppShell",
  component: AppShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof AppShell>;

/**
 * Default state - disconnected from daemon with workspace loaded
 */
export const Default: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <AppShell workspace={mockWorkspaceData} daemon={mockDaemonDataDisconnected} />
    </div>
  ),
};

/**
 * No workspace loaded - user needs to open a folder
 */
export const NoWorkspace: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <AppShell workspace={mockWorkspaceDataEmpty} daemon={mockDaemonDataDisconnected} />
    </div>
  ),
};

/**
 * With an open file in the editor
 */
export const WithOpenFile: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <AppShell
        workspace={{
          ...mockWorkspaceData,
          activeBufferId: "/project/src/App.tsx",
        }}
        daemon={mockDaemonDataConnected}
      />
    </div>
  ),
};

/**
 * Connecting to daemon
 */
export const Connecting: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <AppShell workspace={mockWorkspaceData} daemon={mockDaemonDataConnecting} />
    </div>
  ),
};

/**
 * Connection error
 */
export const ConnectionError: Story = {
  render: () => (
    <div style={{ height: "100vh" }}>
      <AppShell workspace={mockWorkspaceData} daemon={mockDaemonDataError} />
    </div>
  ),
};

/**
 * Comprehensive end-to-end story showing full application state:
 * - Workspace loaded with files
 * - Multiple buffers open
 * - One dirty buffer
 * - Connected to daemon
 * - Active file being edited
 */
export const FullEndToEnd: Story = {
  render: () => {
    // Create a map with an additional dirty buffer
    const buffersWithDirty = new Map(mockOpenBuffers);
    buffersWithDirty.set(mockBuffer3.path, mockBuffer3);

    return (
      <div style={{ height: "100vh" }}>
        <AppShell
          workspace={{
            ...mockWorkspaceData,
            openBuffers: buffersWithDirty,
            activeBufferId: mockBuffer3.path,
            isDirty: new Set([mockBuffer3.path]),
          }}
          daemon={mockDaemonDataConnected}
        />
      </div>
    );
  },
};
