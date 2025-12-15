import type { Buffer } from "@gouide/frontend-hooks";
import type { Meta, StoryObj } from "@storybook/react";
import { mockBuffer1, mockBuffer2, mockBuffer3, mockFileContent } from "../__mocks__/mockData";
import { EditorAreaTemplate } from "./EditorAreaTemplate";

const meta: Meta<typeof EditorAreaTemplate> = {
  title: "Templates/EditorAreaTemplate",
  component: EditorAreaTemplate,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof EditorAreaTemplate>;

/**
 * With a TypeScript file open in the editor
 */
export const WithTypescriptFile: Story = {
  render: () => (
    <div style={{ height: "600px" }}>
      <EditorAreaTemplate
        activeBuffer={mockBuffer1}
        onSave={async (path, content) =>
          console.log(`Saving ${path}:`, `${content.substring(0, 50)}...`)
        }
      />
    </div>
  ),
};

/**
 * With a Markdown file open
 */
export const WithMarkdownFile: Story = {
  render: () => (
    <div style={{ height: "600px" }}>
      <EditorAreaTemplate
        activeBuffer={mockBuffer2}
        onSave={async (path, content) =>
          console.log(`Saving ${path}:`, `${content.substring(0, 50)}...`)
        }
      />
    </div>
  ),
};

/**
 * With a dirty buffer (unsaved changes)
 */
export const WithDirtyBuffer: Story = {
  render: () => (
    <div style={{ height: "600px" }}>
      <EditorAreaTemplate
        activeBuffer={mockBuffer3}
        onSave={async (path, content) => console.log(`Saving ${path}:`, content)}
      />
    </div>
  ),
};

/**
 * Empty state - no file open
 */
export const Empty: Story = {
  render: () => (
    <div style={{ height: "600px" }}>
      <EditorAreaTemplate
        activeBuffer={null}
        onSave={async (path, content) => console.log(`Saving ${path}:`, content)}
      />
    </div>
  ),
};

/**
 * With a Rust file open
 */
export const WithRustFile: Story = {
  render: () => {
    const rustBuffer: Buffer = {
      path: "/project/src/main.rs",
      content: mockFileContent.rust,
      isDirty: false,
    };

    return (
      <div style={{ height: "600px" }}>
        <EditorAreaTemplate
          activeBuffer={rustBuffer}
          onSave={async (path, content) =>
            console.log(`Saving ${path}:`, `${content.substring(0, 50)}...`)
          }
        />
      </div>
    );
  },
};

/**
 * With a Python file open
 */
export const WithPythonFile: Story = {
  render: () => {
    const pythonBuffer: Buffer = {
      path: "/project/fibonacci.py",
      content: mockFileContent.python,
      isDirty: false,
    };

    return (
      <div style={{ height: "600px" }}>
        <EditorAreaTemplate
          activeBuffer={pythonBuffer}
          onSave={async (path, content) =>
            console.log(`Saving ${path}:`, `${content.substring(0, 50)}...`)
          }
        />
      </div>
    );
  },
};
