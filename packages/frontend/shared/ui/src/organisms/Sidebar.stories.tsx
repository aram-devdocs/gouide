import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";

const meta: Meta<typeof Sidebar> = {
  title: "Organisms/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  render: () => (
    <div style={{ height: "600px", width: "250px" }}>
      <Sidebar>
        <div style={{ padding: "1rem", color: "var(--fg-primary)" }}>
          Sidebar content (file tree, etc.)
        </div>
      </Sidebar>
    </div>
  ),
};

export const WithFileTree: Story = {
  render: () => (
    <div style={{ height: "600px", width: "250px" }}>
      <Sidebar>
        <div
          style={{ padding: "0.5rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <div style={{ padding: "0.5rem", color: "var(--fg-primary)", cursor: "pointer" }}>
            📁 src
          </div>
          <div
            style={{
              padding: "0.5rem",
              paddingLeft: "1.5rem",
              color: "var(--fg-secondary)",
              cursor: "pointer",
            }}
          >
            📄 App.tsx
          </div>
          <div
            style={{
              padding: "0.5rem",
              paddingLeft: "1.5rem",
              color: "var(--fg-secondary)",
              cursor: "pointer",
            }}
          >
            📄 index.tsx
          </div>
          <div style={{ padding: "0.5rem", color: "var(--fg-primary)", cursor: "pointer" }}>
            📄 package.json
          </div>
        </div>
      </Sidebar>
    </div>
  ),
};
