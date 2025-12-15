/**
 * PanelLayout stories
 */

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { Box } from "../atoms/Box";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { PanelHeader } from "../molecules/PanelHeader";
import { PanelLayout } from "./PanelLayout";

const meta = {
  title: "Templates/PanelLayout",
  component: PanelLayout,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PanelLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

// Mock panel content
function MockPanel({ title, color }: { title: string; color: string }) {
  return (
    <Box display="flex" flexDirection="column" height="100%" backgroundColor="bg-secondary">
      <PanelHeader title={title} />
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        style={{ backgroundColor: color }}
      >
        <Text size="lg" color="fg-primary">
          {title}
        </Text>
      </Box>
    </Box>
  );
}

function MockEditor() {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      height="100%"
      backgroundColor="bg-primary"
      style={{ border: "1px solid var(--border-color)" }}
    >
      <Text size="lg" color="fg-primary">
        Editor Area
      </Text>
    </Box>
  );
}

/**
 * Minimalist default - just the editor, no panels
 */
export const MinimalistDefault: Story = {
  args: {
    editor: <MockEditor />,
  },
};

/**
 * Full layout with all panels visible
 */
export const AllPanels: Story = {
  args: {
    editor: <MockEditor />,
    leftPanel: <MockPanel title="File Explorer" color="rgba(139, 92, 246, 0.1)" />,
    leftPanelWidth: 250,
    rightPanel: <MockPanel title="Documentation" color="rgba(6, 182, 212, 0.1)" />,
    rightPanelWidth: 400,
    bottomPanel: <MockPanel title="Terminal" color="rgba(251, 191, 36, 0.1)" />,
    bottomPanelHeight: 300,
  },
};

/**
 * Left panel only
 */
export const LeftPanelOnly: Story = {
  args: {
    editor: <MockEditor />,
    leftPanel: <MockPanel title="File Explorer" color="rgba(139, 92, 246, 0.1)" />,
    leftPanelWidth: 250,
  },
};

/**
 * Right panel only
 */
export const RightPanelOnly: Story = {
  args: {
    editor: <MockEditor />,
    rightPanel: <MockPanel title="Documentation" color="rgba(6, 182, 212, 0.1)" />,
    rightPanelWidth: 400,
  },
};

/**
 * Bottom panel only
 */
export const BottomPanelOnly: Story = {
  args: {
    editor: <MockEditor />,
    bottomPanel: <MockPanel title="Terminal" color="rgba(251, 191, 36, 0.1)" />,
    bottomPanelHeight: 300,
  },
};

/**
 * Interactive demo with toggleable panels
 */
function InteractivePanelDemo() {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(false);
  const [showBottom, setShowBottom] = useState(false);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PanelLayout
        editor={
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100%"
            backgroundColor="bg-primary"
            gap="md"
          >
            <Text size="lg" color="fg-primary">
              Editor Area
            </Text>
            <Box display="flex" gap="sm" flexWrap="wrap" style={{ padding: "16px" }}>
              <Button
                variant={showLeft ? "primary" : "secondary"}
                onPress={() => setShowLeft(!showLeft)}
              >
                Left Panel
              </Button>
              <Button
                variant={showRight ? "primary" : "secondary"}
                onPress={() => setShowRight(!showRight)}
              >
                Right Panel
              </Button>
              <Button
                variant={showBottom ? "primary" : "secondary"}
                onPress={() => setShowBottom(!showBottom)}
              >
                Bottom Panel
              </Button>
            </Box>
          </Box>
        }
        leftPanel={
          showLeft ? <MockPanel title="File Explorer" color="rgba(139, 92, 246, 0.1)" /> : undefined
        }
        leftPanelWidth={250}
        rightPanel={
          showRight ? <MockPanel title="Documentation" color="rgba(6, 182, 212, 0.1)" /> : undefined
        }
        rightPanelWidth={400}
        bottomPanel={
          showBottom ? <MockPanel title="Terminal" color="rgba(251, 191, 36, 0.1)" /> : undefined
        }
        bottomPanelHeight={300}
      />
    </div>
  );
}

export const Interactive = {
  render: () => <InteractivePanelDemo />,
  parameters: {
    docs: {
      description: {
        story:
          "Toggle panels on/off to see smooth slide animations. Panels are hidden by default (minimalist design). Click buttons to show/hide panels independently.",
      },
    },
  },
};
