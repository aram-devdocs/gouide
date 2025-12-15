/**
 * PanelHeader stories
 */

import type { Meta } from "@storybook/react";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { PanelHeader } from "./PanelHeader";

const meta = {
  title: "Molecules/PanelHeader",
  component: PanelHeader,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof PanelHeader>;

export default meta;

/**
 * Basic panel header with just a title
 */
export const Default = {
  args: {
    title: "File Explorer",
  },
};

/**
 * Panel header with icon
 */
export const WithIcon = {
  args: {
    title: "File Explorer",
    icon: <Icon size="sm">📁</Icon>,
  },
};

/**
 * Panel header with actions
 */
export const WithActions = {
  args: {
    title: "File Explorer",
    icon: <Icon size="sm">📁</Icon>,
    actions: (
      <>
        <Button variant="ghost" size="sm">
          <Icon size="sm">🔄</Icon>
        </Button>
        <Button variant="ghost" size="sm">
          <Icon size="sm">⚙️</Icon>
        </Button>
      </>
    ),
  },
};

/**
 * Panel header with resize handle
 */
export const WithResizeHandle = {
  args: {
    title: "File Explorer",
    icon: <Icon size="sm">📁</Icon>,
    resizeHandle: "right",
    onResize: (delta: number) => console.log("Resize delta:", delta),
  },
};
