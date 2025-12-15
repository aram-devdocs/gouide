/**
 * useFileSearch hook
 * Manages file tree search state and filtering logic
 */

import { useCallback, useState } from "react";
import type { FileTreeNode } from "./useWorkspace";

export interface UseFileSearchReturn {
  /** Current search query */
  searchQuery: string;
  /** Update search query */
  setSearchQuery: (query: string) => void;
  /** Clear search query */
  clearSearch: () => void;
  /** Filter file tree nodes based on search query */
  filterFiles: (nodes: FileTreeNode[]) => FileTreeNode[];
}

/**
 * Hook for managing file tree search functionality
 *
 * Provides search state and recursive filtering logic for file trees.
 * Matches file names case-insensitively and preserves parent nodes
 * if any children match the search query.
 *
 * @example
 * ```tsx
 * const { searchQuery, setSearchQuery, filterFiles } = useFileSearch();
 * const filteredTree = filterFiles(fileTree);
 * ```
 */
export function useFileSearch(): UseFileSearchReturn {
  const [searchQuery, setSearchQuery] = useState("");

  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  const filterFiles = useCallback(
    (nodes: FileTreeNode[]): FileTreeNode[] => {
      if (!searchQuery) return nodes;

      const lowerQuery = searchQuery.toLowerCase();

      const filterRecursive = (nodes: FileTreeNode[]): FileTreeNode[] => {
        return nodes.reduce<FileTreeNode[]>((acc, node) => {
          const matchesName = node.name.toLowerCase().includes(lowerQuery);
          const filteredChildren = node.children ? filterRecursive(node.children) : [];

          // Include node if its name matches OR it has matching children
          if (matchesName || filteredChildren.length > 0) {
            const newNode: FileTreeNode = {
              ...node,
            };
            // Preserve children structure
            if (filteredChildren.length > 0) {
              newNode.children = filteredChildren;
            } else if (node.children) {
              newNode.children = node.children;
            }
            acc.push(newNode);
          }

          return acc;
        }, []);
      };

      return filterRecursive(nodes);
    },
    [searchQuery],
  );

  return {
    searchQuery,
    setSearchQuery,
    clearSearch,
    filterFiles,
  };
}
