/**
 * SidebarTemplate
 * Template for rendering the workspace sidebar with file explorer
 *
 * This template manages file tree expansion state internally and uses
 * FileTreePanel organism and EmptyState template for rendering.
 */

import type { FileTreeNode } from "@gouide/frontend-hooks";
import { useCallback, useEffect, useState } from "react";
import { Box } from "../atoms/Box";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";
import { FileTreePanel } from "../organisms/FileTreePanel";
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
}

// Recursively collect all directory paths for auto-expansion
function getAllDirectoryPaths(nodes: FileTreeNode[]): Set<string> {
  const paths = new Set<string>();

  function traverse(node: FileTreeNode) {
    if (node.isDirectory) {
      paths.add(node.path);
      if (node.children) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    }
  }

  for (const node of nodes) {
    traverse(node);
  }

  return paths;
}

// Extract workspace name from path
function getWorkspaceName(workspacePath: string | null): string | null {
  if (!workspacePath) return null;
  const parts = workspacePath.split("/");
  return parts[parts.length - 1] || parts[parts.length - 2] || null;
}

/**
 * SidebarTemplate - workspace file explorer sidebar
 *
 * Renders the sidebar with workspace header, open folder button,
 * and file tree. Manages expansion state internally.
 *
 * @example
 * ```tsx
 * const workspace = useWorkspace();
 * <SidebarTemplate
 *   workspacePath={workspace.workspacePath}
 *   files={workspace.files}
 *   onOpenWorkspace={workspace.openWorkspace}
 *   onFileSelect={workspace.openFile}
 * />
 * ```
 */
export function SidebarTemplate({
  workspacePath,
  files,
  onOpenWorkspace,
  onFileSelect,
}: SidebarTemplateProps) {
  // Manage file tree expansion state internally
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() =>
    getAllDirectoryPaths(files),
  );

  // Update expanded paths when files change
  useEffect(() => {
    setExpandedPaths(getAllDirectoryPaths(files));
  }, [files]);

  const toggleExpanded = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }, []);

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
