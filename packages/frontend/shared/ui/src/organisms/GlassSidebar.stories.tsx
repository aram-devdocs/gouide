/**
 * GlassSidebar stories
 */

import type { Meta } from "@storybook/react";
import { Box } from "../atoms/Box";
import { Text } from "../atoms/Text";
import { PanelHeader } from "../molecules/PanelHeader";
import { GlassSidebar } from "./GlassSidebar";

const meta = {
  title: "Organisms/GlassSidebar",
  component: GlassSidebar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof GlassSidebar>;

export default meta;

function SidebarContent({ title }: { title: string }) {
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <PanelHeader title={title} />
      <Box flex={1} padding="md" display="flex" flexDirection="column" gap="sm">
        <Text size="sm" color="fg-secondary">
          Sidebar content with glassmorphism effect
        </Text>
        <Text size="sm" color="fg-muted">
          Features backdrop blur and translucent purple background
        </Text>
      </Box>
    </Box>
  );
}

/**
 * Left sidebar
 */
export const LeftSidebar = {
  render: () => (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <GlassSidebar position="left" width={250}>
        <SidebarContent title="File Explorer" />
      </GlassSidebar>
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="bg-primary"
      >
        <Text size="lg" color="fg-primary">
          Main Content Area
        </Text>
      </Box>
    </div>
  ),
};

/**
 * Right sidebar
 */
export const RightSidebar = {
  render: () => (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="bg-primary"
      >
        <Text size="lg" color="fg-primary">
          Main Content Area
        </Text>
      </Box>
      <GlassSidebar position="right" width={400}>
        <SidebarContent title="Documentation" />
      </GlassSidebar>
    </div>
  ),
};

/**
 * Both sidebars
 */
export const BothSidebars = {
  render: () => (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        backgroundColor: "var(--bg-primary)",
      }}
    >
      <GlassSidebar position="left" width={250}>
        <SidebarContent title="File Explorer" />
      </GlassSidebar>
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        backgroundColor="bg-primary"
      >
        <Text size="lg" color="fg-primary">
          Main Content Area
        </Text>
      </Box>
      <GlassSidebar position="right" width={400}>
        <SidebarContent title="Documentation" />
      </GlassSidebar>
    </div>
  ),
};
