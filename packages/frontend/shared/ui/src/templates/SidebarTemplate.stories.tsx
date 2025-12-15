import type { Meta, StoryObj } from "@storybook/react";
import { mockFileTree, mockFileTreeEmpty } from "../__mocks__/mockData";
import { SidebarTemplate } from "./SidebarTemplate";

const meta: Meta<typeof SidebarTemplate> = {
  title: "Templates/SidebarTemplate",
  component: SidebarTemplate,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SidebarTemplate>;

export const NoWorkspace: Story = {
  render: () => (
    <div style={{ height: "600px", width: "300px" }}>
      <SidebarTemplate
        workspacePath={null}
        files={mockFileTreeEmpty}
        onOpenWorkspace={async () => console.log("Open workspace")}
        onFileSelect={async (path) => console.log("File selected:", path)}
        onLoadDirectory={async (path) => console.log("Load directory:", path)}
      />
    </div>
  ),
};

export const WithFiles: Story = {
  render: () => (
    <div style={{ height: "600px", width: "300px" }}>
      <SidebarTemplate
        workspacePath="/Users/username/dev/my-project"
        files={mockFileTree}
        onOpenWorkspace={async () => console.log("Open workspace")}
        onFileSelect={async (path) => console.log("File selected:", path)}
        onLoadDirectory={async (path) => console.log("Load directory:", path)}
      />
    </div>
  ),
};

export const WithExpandedFolders: Story = {
  render: () => (
    <div style={{ height: "600px", width: "300px" }}>
      <SidebarTemplate
        workspacePath="/Users/username/dev/my-project"
        files={mockFileTree}
        onOpenWorkspace={async () => console.log("Open workspace")}
        onFileSelect={async (path) => console.log("File selected:", path)}
        onLoadDirectory={async (path) => console.log("Load directory:", path)}
      />
    </div>
  ),
};

export const LongWorkspacePath: Story = {
  render: () => (
    <div style={{ height: "600px", width: "300px" }}>
      <SidebarTemplate
        workspacePath="/Users/username/Documents/Development/Projects/very-long-project-name"
        files={mockFileTree}
        onOpenWorkspace={async () => console.log("Open workspace")}
        onFileSelect={async (path) => console.log("File selected:", path)}
        onLoadDirectory={async (path) => console.log("Load directory:", path)}
      />
    </div>
  ),
};
