/**
 * FileTreeItem molecule
 * File tree node with icon, text, and expand button
 * Uses CSS-only hover effects (no state management)
 */

import { Box } from "../atoms/Box";
import { Icon } from "../atoms/Icon";
import { Text } from "../atoms/Text";

export interface FileTreeItemProps {
  name: string;
  isDirectory: boolean;
  isExpanded?: boolean;
  isSelected?: boolean;
  isLoading?: boolean;
  hasError?: boolean;
  depth?: number;
  onToggle?: () => void;
  onSelect?: () => void;
}

/**
 * FileTreeItem - a single item in a file tree
 *
 * @example
 * <FileTreeItem
 *   name="src"
 *   path="/src"
 *   isDirectory
 *   isExpanded={true}
 *   depth={0}
 *   onToggle={() => toggle('/src')}
 *   onSelect={() => select('/src')}
 * />
 */
export function FileTreeItem({
  name,
  isDirectory,
  isExpanded = false,
  isSelected = false,
  isLoading = false,
  hasError = false,
  depth = 0,
  onToggle,
  onSelect,
}: FileTreeItemProps) {
  const icon = isDirectory ? (isExpanded ? "📂" : "📁") : "📄";
  const expandIcon = isLoading ? "⟳" : isExpanded ? "▼" : "▶";

  const handleClick = () => {
    onSelect?.();
  };

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle?.();
  };

  // Generate unique ID for CSS scoping
  const itemId = `file-tree-item-${depth}-${name.replace(/[^a-z0-9]/gi, "-")}`;

  return (
    <>
      <style>
        {`
          [data-tree-item-id="${itemId}"]:not([data-selected="true"]):hover {
            background-color: var(--bg-hover) !important;
          }
        `}
      </style>
      <Box
        data-tree-item-id={itemId}
        data-selected={isSelected}
        display="flex"
        alignItems="center"
        gap="xs"
        padding="xs"
        style={{
          paddingLeft: `${depth * 16}px`,
          backgroundColor: isSelected ? "var(--bg-active)" : undefined,
          cursor: "pointer",
        }}
        onClick={handleClick}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        {isDirectory && (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            style={{
              width: "16px",
              cursor: "pointer",
            }}
            onClick={handleToggleClick}
            onKeyDown={(e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                // biome-ignore lint/suspicious/noExplicitAny: KeyboardEvent to MouseEvent conversion for handler
                handleToggleClick(e as any);
              }
            }}
            role="button"
            tabIndex={0}
          >
            <Icon size="sm" color={hasError ? "error" : "fg-secondary"}>
              {expandIcon}
            </Icon>
          </Box>
        )}
        {!isDirectory && <Box width={16} />}
        <Icon size="sm" color={hasError ? "error" : "fg-secondary"}>
          {icon}
        </Icon>
        <Text size="sm" color={isSelected ? "fg-primary" : "fg-secondary"}>
          {name}
        </Text>
      </Box>
    </>
  );
}
