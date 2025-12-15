/**
 * EditorLayout template
 * Split panel layout for editor with resizable sidebar
 */

import type { ReactNode } from "react";
import { Box } from "../atoms/Box";
import { Divider } from "../atoms/Divider";

export interface EditorLayoutProps {
  /** Editor content (code editor, preview, etc.) */
  editor: ReactNode;
  /** Sidebar panel (outline, minimap, tools, etc.) */
  sidebar?: ReactNode;
  /** Initial sidebar width in pixels */
  sidebarWidth?: number;
}

/**
 * EditorLayout - horizontal split layout for editors
 *
 * Provides a flexible layout with an editor area and optional sidebar.
 * The sidebar has a fixed width while the editor fills remaining space.
 *
 * @example
 * <EditorLayout
 *   editor={<MonacoEditor />}
 *   sidebar={<OutlinePanel />}
 *   sidebarWidth={300}
 * />
 *
 * @example
 * // Without sidebar
 * <EditorLayout
 *   editor={<MonacoEditor />}
 * />
 */
export function EditorLayout({ editor, sidebar, sidebarWidth = 300 }: EditorLayoutProps) {
  return (
    <Box display="flex" width="100%" height="100%" overflow="hidden">
      {/* Editor content - fills remaining space */}
      <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
        {editor}
      </Box>

      {/* Optional sidebar panel */}
      {sidebar && (
        <Box
          width={sidebarWidth}
          backgroundColor="bg-secondary"
          display="flex"
          flexDirection="row"
          overflow="hidden"
          flexShrink={0}
        >
          <Divider orientation="vertical" />
          <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
            {sidebar}
          </Box>
        </Box>
      )}
    </Box>
  );
}
