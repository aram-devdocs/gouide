import type { Meta, StoryObj } from "@storybook/react";
import { mockFileContent } from "../__mocks__/mockData";
import { MonacoEditorTemplate } from "./MonacoEditorTemplate";

const meta: Meta<typeof MonacoEditorTemplate> = {
  title: "Templates/MonacoEditorTemplate",
  component: MonacoEditorTemplate,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MonacoEditorTemplate>;

export const TypeScript: Story = {
  render: () => (
    <div style={{ height: "600px" }}>
      <MonacoEditorTemplate
        path="/project/src/App.tsx"
        value={mockFileContent.typescript}
        onSave={async (content) => {
          console.log("Saving TypeScript file:", `${content.substring(0, 50)}...`);
        }}
      />
    </div>
  ),
};

export const JavaScript: Story = {
  render: () => (
    <div style={{ height: "600px" }}>
      <MonacoEditorTemplate
        path="/project/src/utils.js"
        value={mockFileContent.javascript}
        onSave={async (content) => {
          console.log("Saving JavaScript file:", `${content.substring(0, 50)}...`);
        }}
      />
    </div>
  ),
};

export const Rust: Story = {
  render: () => (
    <div style={{ height: "600px" }}>
      <MonacoEditorTemplate
        path="/project/src/main.rs"
        value={mockFileContent.rust}
        onSave={async (content) => {
          console.log("Saving Rust file:", `${content.substring(0, 50)}...`);
        }}
      />
    </div>
  ),
};

export const Python: Story = {
  render: () => (
    <div style={{ height: "600px" }}>
      <MonacoEditorTemplate
        path="/project/scripts/fibonacci.py"
        value={mockFileContent.python}
        onSave={async (content) => {
          console.log("Saving Python file:", `${content.substring(0, 50)}...`);
        }}
      />
    </div>
  ),
};

export const JSONFile: Story = {
  render: () => (
    <div style={{ height: "600px" }}>
      <MonacoEditorTemplate
        path="/project/package.json"
        value={mockFileContent.json}
        onSave={async (content) => {
          console.log("Saving JSON file:", `${content.substring(0, 50)}...`);
        }}
      />
    </div>
  ),
};

export const Markdown: Story = {
  render: () => (
    <div style={{ height: "600px" }}>
      <MonacoEditorTemplate
        path="/project/README.md"
        value={mockFileContent.markdown}
        onSave={async (content) => {
          console.log("Saving Markdown file:", `${content.substring(0, 50)}...`);
        }}
      />
    </div>
  ),
};
