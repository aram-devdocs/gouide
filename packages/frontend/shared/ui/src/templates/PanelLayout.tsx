/**
 * PanelLayout - multi-panel layout orchestrator with zen mode
 */

import type { ReactNode } from "react";
import { Box } from "../atoms/Box";
import { AnimatedPanel } from "../molecules/AnimatedPanel";

export interface PanelLayoutProps {
  /** Main editor content (always visible) */
  editor: ReactNode;

  /** Left panel (file tree, etc.) */
  leftPanel?: ReactNode;
  leftPanelWidth?: number;

  /** Right panel (docs, etc.) */
  rightPanel?: ReactNode;
  rightPanelWidth?: number;

  /** Bottom panel (terminal, etc.) */
  bottomPanel?: ReactNode;
  bottomPanelHeight?: number;

  /** Center modal overlay (command palette, etc.) */
  centerModal?: ReactNode;
}

/**
 * PanelLayout - flexible multi-panel layout
 *
 * Supports left, right, bottom, and center (modal) panels.
 * All panels can be shown/hidden independently.
 * Panels are hidden by default (minimalist design).
 *
 * @example
 * ```tsx
 * <PanelLayout
 *   editor={<EditorAreaTemplate />}
 *   leftPanel={<SidebarTemplate />}
 *   leftPanelWidth={250}
 *   bottomPanel={<TerminalPanel />}
 *   bottomPanelHeight={300}
 * />
 * ```
 */
export function PanelLayout({
  editor,
  leftPanel,
  leftPanelWidth = 250,
  rightPanel,
  rightPanelWidth = 400,
  bottomPanel,
  bottomPanelHeight = 300,
  centerModal,
}: PanelLayoutProps) {
  const showLeftPanel = leftPanel !== undefined;
  const showRightPanel = rightPanel !== undefined;
  const showBottomPanel = bottomPanel !== undefined;
  const showCenterModal = centerModal !== undefined;

  return (
    <Box
      display="flex"
      flexDirection="column"
      width="100vw"
      height="100vh"
      overflow="hidden"
      position="relative"
    >
      {/* Main horizontal layout (left + center + right) */}
      <Box display="flex" flexDirection="row" flex={1} overflow="hidden">
        {/* Left panel */}
        <AnimatedPanel
          isVisible={showLeftPanel}
          position="left"
          animation="slide"
          style={{ width: showLeftPanel ? `${leftPanelWidth}px` : "0" }}
        >
          {leftPanel}
        </AnimatedPanel>

        {/* Center area (editor + bottom panel) */}
        <Box
          display="flex"
          flexDirection="column"
          flex={1}
          overflow="hidden"
          style={{ minWidth: 0 }} // Prevent flex child overflow
        >
          {/* Editor */}
          <Box flex={1} overflow="hidden">
            {editor}
          </Box>

          {/* Bottom panel */}
          <AnimatedPanel
            isVisible={showBottomPanel}
            position="bottom"
            animation="slide"
            style={{ height: showBottomPanel ? `${bottomPanelHeight}px` : "0" }}
          >
            {bottomPanel}
          </AnimatedPanel>
        </Box>

        {/* Right panel */}
        <AnimatedPanel
          isVisible={showRightPanel}
          position="right"
          animation="slide"
          style={{ width: showRightPanel ? `${rightPanelWidth}px` : "0" }}
        >
          {rightPanel}
        </AnimatedPanel>
      </Box>

      {/* Center modal overlay (command palette, etc.) */}
      {showCenterModal && (
        <AnimatedPanel
          isVisible={showCenterModal}
          position="center"
          animation="fade"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: showCenterModal ? "auto" : "none",
          }}
        >
          {centerModal}
        </AnimatedPanel>
      )}
    </Box>
  );
}
