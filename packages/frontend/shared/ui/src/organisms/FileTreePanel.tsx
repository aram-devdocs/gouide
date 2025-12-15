/**
 * FileTreePanel organism
 * File tree with search and expansion capabilities
 */

import { useState } from "react";
import { Box } from "../atoms/Box";
import { FileTreeItem } from "../molecules/FileTreeItem";
import { SearchBar } from "../molecules/SearchBar";

export interface FileTreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  isSymlink?: boolean;
  children?: FileTreeNode[];
  childrenLoaded?: boolean;
  loadError?: string;
}

export interface FileTreePanelProps {
  files: FileTreeNode[];
  selectedPath?: string;
  expandedPaths?: Set<string>;
  onFileSelect?: (path: string) => void;
  onToggle?: (path: string, node: FileTreeNode) => void;
}

/**
 * FileTreePanel - a file tree with search functionality
 *
 * @example
 * <FileTreePanel
 *   files={fileTree}
 *   selectedPath="/src/App.tsx"
 *   expandedPaths={new Set(['/src', '/src/components'])}
 *   onFileSelect={(path) => console.log('Selected:', path)}
 *   onToggle={(path) => toggleExpanded(path)}
 * />
 */
export function FileTreePanel({
  files,
  selectedPath,
  expandedPaths = new Set(),
  onFileSelect,
  onToggle,
}: FileTreePanelProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter files based on search query
  const filterFiles = (nodes: FileTreeNode[], query: string): FileTreeNode[] => {
    if (!query) return nodes;

    const lowerQuery = query.toLowerCase();
    return nodes.reduce<FileTreeNode[]>((acc, node) => {
      const matchesName = node.name.toLowerCase().includes(lowerQuery);
      const filteredChildren = node.children ? filterFiles(node.children, query) : [];

      if (matchesName || filteredChildren.length > 0) {
        const newNode: FileTreeNode = {
          ...node,
        };
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

  // Render file tree recursively
  const renderFileTree = (nodes: FileTreeNode[], depth = 0): React.ReactElement[] => {
    return nodes.map((node) => {
      const isExpanded = expandedPaths.has(node.path);
      const isSelected = selectedPath === node.path;
      const isLoading = node.isDirectory && isExpanded && !node.childrenLoaded;

      return (
        <Box key={node.path}>
          <FileTreeItem
            name={node.name}
            isDirectory={node.isDirectory}
            isExpanded={isExpanded}
            isSelected={isSelected}
            isLoading={isLoading}
            hasError={!!node.loadError}
            depth={depth}
            onToggle={() => onToggle?.(node.path, node)}
            onSelect={() => onFileSelect?.(node.path)}
          />
          {node.isDirectory && isExpanded && (
            <Box>
              {node.childrenLoaded ? (
                node.children && node.children.length > 0 ? (
                  renderFileTree(node.children, depth + 1)
                ) : (
                  <Box
                    paddingY="xs"
                    style={{
                      paddingLeft: `${(depth + 1) * 16}px`,
                      color: "var(--fg-tertiary)",
                      fontSize: "12px",
                    }}
                  >
                    {node.loadError || "Empty directory"}
                  </Box>
                )
              ) : (
                <Box
                  paddingY="xs"
                  style={{
                    paddingLeft: `${(depth + 1) * 16}px`,
                    color: "var(--fg-tertiary)",
                    fontSize: "12px",
                  }}
                >
                  Loading...
                </Box>
              )}
            </Box>
          )}
        </Box>
      );
    });
  };

  const filteredFiles = filterFiles(files, searchQuery);

  return (
    <Box display="flex" flexDirection="column" height="100%" backgroundColor="bg-primary">
      <Box padding="sm" style={{ borderBottom: "1px solid var(--border)" }}>
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search files..."
          onClear={() => setSearchQuery("")}
        />
      </Box>
      <Box flex={1} overflow="auto" paddingY="xs">
        {filteredFiles.length > 0 ? (
          renderFileTree(filteredFiles)
        ) : (
          <Box padding="md" style={{ textAlign: "center" }}>
            <Box style={{ color: "var(--fg-secondary)" }}>No files found</Box>
          </Box>
        )}
      </Box>
    </Box>
  );
}
