/**
 * SidebarTemplate
 * Template for rendering the workspace sidebar with file explorer
 *
 * This template uses useFileTreeExpansion hook for state management and uses
 * FileTreePanel organism and EmptyState template for rendering.
 */

import type { FileTreeNode } from "@gouide/frontend-hooks";
import { useFileTreeExpansion } from "@gouide/frontend-hooks";
import { Box } from "../atoms/Box";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { FileTreePanel } from "../organisms/FileTreePanel";
import { getWorkspaceName } from "../utils/fileUtils";
import { EmptyState } from "./EmptyState";

export interface SidebarTemplateProps {
  /** Current workspace path (null if no workspace open) */
  workspacePath: string | null;
  /** File tree nodes from useWorkspace */
  files: FileTreeNode[];
  /** Callback to open workspace folder picker */
  onOpenWorkspace: () => Promise<void>;
  /** Callback when user selects a file to open */
  onFileSelect: (path: string) => Promise<void>;
  /** Callback to lazy load directory children */
  onLoadDirectory: (path: string) => Promise<void>;
}

/**
 * SidebarTemplate - workspace file explorer sidebar
 *
 * Renders the sidebar with workspace header, open folder button,
 * and file tree. Uses useFileTreeExpansion hook for state management.
 *
 * @example
 * ```tsx
 * const workspace = useWorkspace();
 * <SidebarTemplate
 *   workspacePath={workspace.workspacePath}
 *   files={workspace.files}
 *   onOpenWorkspace={workspace.openWorkspace}
 *   onFileSelect={workspace.openFile}
 *   onLoadDirectory={workspace.loadDirectory}
 * />
 * ```
 */
export function SidebarTemplate({
  workspacePath,
  files,
  onOpenWorkspace,
  onFileSelect,
  onLoadDirectory,
}: SidebarTemplateProps) {
  // Use custom hook for file tree expansion state
  const { expandedPaths, toggleExpanded } = useFileTreeExpansion({
    onLoadDirectory,
  });

  const workspaceName = getWorkspaceName(workspacePath);

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      {/* Header */}
      <Box
        paddingX="md"
        paddingY="sm"
        display="flex"
        flexDirection="column"
        gap="xs"
        backgroundColor="bg-secondary"
        flexShrink={0}
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <Text size="sm" weight="semibold" color="fg-secondary">
          EXPLORER
        </Text>
        {workspaceName && (
          <Text size="sm" color="fg-primary">
            {workspaceName}
          </Text>
        )}
      </Box>

      {/* Actions */}
      <Box paddingX="md" paddingY="sm" flexShrink={0}>
        <Button variant="primary" size="sm" onPress={onOpenWorkspace}>
          Open Folder
        </Button>
      </Box>

      {/* Content */}
      <Box flex={1} overflow="auto">
        {files.length > 0 ? (
          <FileTreePanel
            files={files}
            onFileSelect={onFileSelect}
            expandedPaths={expandedPaths}
            onToggle={toggleExpanded}
          />
        ) : (
          <EmptyState
            icon="📁"
            title="No folder opened"
            message="Click 'Open Folder' to start working"
          />
        )}
      </Box>
    </Box>
  );
}
