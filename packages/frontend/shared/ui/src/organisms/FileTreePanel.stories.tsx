import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { mockFileTree, mockFileTreeEmpty } from "../__mocks__/mockData";
import { FileTreePanel } from "./FileTreePanel";

const meta: Meta<typeof FileTreePanel> = {
  title: "Organisms/FileTreePanel",
  component: FileTreePanel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FileTreePanel>;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(new Set(["/project/src"]));

    return (
      <div style={{ height: "500px", width: "300px" }}>
        <FileTreePanel
          files={mockFileTree}
          {...(selected ? { selectedPath: selected } : {})}
          expandedPaths={expanded}
          onFileSelect={(path) => {
            console.log("Selected:", path);
            setSelected(path);
          }}
          onToggle={(path, _node) => {
            console.log("Toggle:", path);
            setExpanded((prev) => {
              const next = new Set(prev);
              if (next.has(path)) {
                next.delete(path);
              } else {
                next.add(path);
              }
              return next;
            });
          }}
        />
      </div>
    );
  },
};

export const WithSearch: Story = {
  render: () => {
    const [selected, setSelected] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(new Set(["/project/src", "/project/src/components"]));

    return (
      <div style={{ height: "500px", width: "300px" }}>
        <FileTreePanel
          files={mockFileTree}
          {...(selected ? { selectedPath: selected } : {})}
          expandedPaths={expanded}
          onFileSelect={(path) => setSelected(path)}
          onToggle={(path, _node) => {
            setExpanded((prev) => {
              const next = new Set(prev);
              if (next.has(path)) {
                next.delete(path);
              } else {
                next.add(path);
              }
              return next;
            });
          }}
        />
      </div>
    );
  },
};

export const Empty: Story = {
  render: () => (
    <div style={{ height: "500px", width: "300px" }}>
      <FileTreePanel
        files={mockFileTreeEmpty}
        onFileSelect={(path) => console.log("Selected:", path)}
      />
    </div>
  ),
};

export const AllExpanded: Story = {
  render: () => {
    const [selected, setSelected] = useState("/project/src/App.tsx");
    const expanded = new Set([
      "/project/src",
      "/project/src/components",
      "/project/src/hooks",
      "/project/src/utils",
      "/project/public",
    ]);

    return (
      <div style={{ height: "500px", width: "300px" }}>
        <FileTreePanel
          files={mockFileTree}
          selectedPath={selected}
          expandedPaths={expanded}
          onFileSelect={(path) => setSelected(path)}
          onToggle={(path) => console.log("Toggle:", path)}
        />
      </div>
    );
  },
};
