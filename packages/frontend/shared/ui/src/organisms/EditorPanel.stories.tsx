import type { Meta, StoryObj } from "@storybook/react";
import { EditorPanel } from "./EditorPanel";

const meta: Meta<typeof EditorPanel> = {
  title: "Organisms/EditorPanel",
  component: EditorPanel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EditorPanel>;

export const Default: Story = {
  render: () => (
    <div style={{ height: "400px", backgroundColor: "var(--bg-secondary)" }}>
      <EditorPanel>
        <div style={{ padding: "1rem", color: "var(--fg-primary)" }}>Editor content goes here</div>
      </EditorPanel>
    </div>
  ),
};

export const WithContent: Story = {
  render: () => (
    <div style={{ height: "400px", backgroundColor: "var(--bg-secondary)" }}>
      <EditorPanel>
        <div style={{ padding: "2rem", color: "var(--fg-primary)" }}>
          <h2>Monaco Editor would render here</h2>
          <p style={{ color: "var(--fg-secondary)", marginTop: "1rem" }}>
            This panel provides the container for the code editor.
          </p>
        </div>
      </EditorPanel>
    </div>
  ),
};
