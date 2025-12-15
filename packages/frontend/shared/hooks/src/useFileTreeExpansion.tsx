/**
 * useFileTreeExpansion hook
 * Manages file tree expansion state with lazy loading support
 */

import { useCallback, useState } from "react";
import type { FileTreeNode } from "./useWorkspace";

export interface UseFileTreeExpansionOptions {
  /** Callback to lazy load directory children */
  onLoadDirectory?: (path: string) => Promise<void>;
}

export interface UseFileTreeExpansionReturn {
  /** Set of expanded directory paths */
  expandedPaths: Set<string>;
  /** Toggle expansion state for a node (triggers lazy load if needed) */
  toggleExpanded: (path: string, node: FileTreeNode) => void;
  /** Expand a specific path */
  expand: (path: string) => void;
  /** Collapse a specific path */
  collapse: (path: string) => void;
  /** Collapse all nodes */
  collapseAll: () => void;
  /** Expand all nodes recursively */
  expandAll: (nodes: FileTreeNode[]) => void;
}

/**
 * Hook for managing file tree expansion state
 *
 * Handles toggling directory expansion and triggers lazy loading
 * of directory children when a directory is expanded for the first time.
 *
 * @example
 * ```tsx
 * const { expandedPaths, toggleExpanded } = useFileTreeExpansion({
 *   onLoadDirectory: async (path) => await loadDirectoryContents(path),
 * });
 * ```
 */
export function useFileTreeExpansion({
  onLoadDirectory,
}: UseFileTreeExpansionOptions = {}): UseFileTreeExpansionReturn {
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback(
    (path: string, node: FileTreeNode) => {
      setExpandedPaths((prev) => {
        const next = new Set(prev);
        if (next.has(path)) {
          // Collapse
          next.delete(path);
        } else {
          // Expand
          next.add(path);
          // Lazy load children if not loaded yet
          if (node.isDirectory && !node.childrenLoaded && onLoadDirectory) {
            onLoadDirectory(path);
          }
        }
        return next;
      });
    },
    [onLoadDirectory],
  );

  const expand = useCallback((path: string) => {
    setExpandedPaths((prev) => new Set(prev).add(path));
  }, []);

  const collapse = useCallback((path: string) => {
    setExpandedPaths((prev) => {
      const next = new Set(prev);
      next.delete(path);
      return next;
    });
  }, []);

  const collapseAll = useCallback(() => {
    setExpandedPaths(new Set());
  }, []);

  const expandAll = useCallback((nodes: FileTreeNode[]) => {
    const getAllPaths = (nodes: FileTreeNode[]): string[] => {
      const paths: string[] = [];
      for (const node of nodes) {
        if (node.isDirectory) {
          paths.push(node.path);
          if (node.children) {
            paths.push(...getAllPaths(node.children));
          }
        }
      }
      return paths;
    };
    setExpandedPaths(new Set(getAllPaths(nodes)));
  }, []);

  return {
    expandedPaths,
    toggleExpanded,
    expand,
    collapse,
    collapseAll,
    expandAll,
  };
}
