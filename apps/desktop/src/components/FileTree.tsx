import { useCallback, useEffect, useState } from "react";
import type { FileTreeNode } from "../hooks/useWorkspace";
import styles from "./FileTree.module.css";

interface FileTreeProps {
  files: FileTreeNode[];
  onSelect: (path: string) => void;
}

interface FileTreeItemProps {
  node: FileTreeNode;
  level: number;
  onSelect: (path: string) => void;
  selectedPath: string | null;
  expandedPaths: Set<string>;
  toggleExpanded: (path: string) => void;
}

// File icon based on extension
function getFileIcon(name: string): string {
  const ext = name.split(".").pop()?.toLowerCase();

  switch (ext) {
    case "ts":
    case "tsx":
      return "📘";
    case "js":
    case "jsx":
      return "📜";
    case "rs":
      return "🦀";
    case "json":
      return "📋";
    case "md":
      return "📝";
    case "css":
    case "scss":
      return "🎨";
    case "html":
      return "🌐";
    case "toml":
    case "yaml":
    case "yml":
      return "⚙️";
    case "proto":
      return "📡";
    default:
      return "📄";
  }
}

function FileTreeItem({
  node,
  level,
  onSelect,
  selectedPath,
  expandedPaths,
  toggleExpanded,
}: FileTreeItemProps) {
  const isExpanded = expandedPaths.has(node.path);
  const isSelected = selectedPath === node.path;

  const handleClick = useCallback(() => {
    if (node.isDirectory) {
      toggleExpanded(node.path);
    } else {
      onSelect(node.path);
    }
  }, [node, onSelect, toggleExpanded]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  return (
    <div className={styles.treeItem}>
      <button
        type="button"
        className={`${styles.itemRow} ${isSelected ? styles.selected : ""}`}
        style={{ paddingLeft: `${level * 12}px` }}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        {node.isDirectory && <span className={styles.chevron}>{isExpanded ? "▼" : "▶"}</span>}
        <span className={styles.icon}>
          {node.isDirectory ? (isExpanded ? "📂" : "📁") : getFileIcon(node.name)}
        </span>
        <span className={styles.name}>{node.name}</span>
      </button>
      {node.isDirectory && isExpanded && node.children && (
        <div className={styles.children}>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
              expandedPaths={expandedPaths}
              toggleExpanded={toggleExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
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

export function FileTree({ files, onSelect }: FileTreeProps) {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  // Auto-expand ALL directories by default
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(() =>
    getAllDirectoryPaths(files),
  );

  // Update expanded paths when files change
  useEffect(() => {
    setExpandedPaths(getAllDirectoryPaths(files));
  }, [files]);

  const handleSelect = useCallback(
    (path: string) => {
      setSelectedPath(path);
      onSelect(path);
    },
    [onSelect],
  );

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

  if (files.length === 0) {
    return <div className={styles.empty}>No files</div>;
  }

  return (
    <div className={styles.fileTree}>
      {files.map((file) => (
        <FileTreeItem
          key={file.path}
          node={file}
          level={0}
          onSelect={handleSelect}
          selectedPath={selectedPath}
          expandedPaths={expandedPaths}
          toggleExpanded={toggleExpanded}
        />
      ))}
    </div>
  );
}
