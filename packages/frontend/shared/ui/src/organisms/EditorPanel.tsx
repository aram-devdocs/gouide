/**
 * EditorPanel organism
 * Editor container with header and action buttons
 */

import type { ReactNode } from "react";
import { Box } from "../atoms/Box";
import { Button } from "../atoms/Button";
import { Divider } from "../atoms/Divider";
import { Text } from "../atoms/Text";

export interface EditorPanelProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  onSave?: () => void;
  saveLabel?: string;
  actions?: ReactNode;
  isModified?: boolean;
}

/**
 * EditorPanel - a container for editor content with header
 *
 * @example
 * <EditorPanel
 *   title="App.tsx"
 *   subtitle="/src/components"
 *   onSave={handleSave}
 *   saveLabel="Save"
 *   isModified={true}
 * >
 *   <MonacoEditor />
 * </EditorPanel>
 */
export function EditorPanel({
  children,
  title,
  subtitle,
  onSave,
  saveLabel = "Save",
  actions,
  isModified = false,
}: EditorPanelProps) {
  return (
    <Box display="flex" flexDirection="column" height="100%" backgroundColor="bg-primary">
      {/* Header */}
      {(title || actions || onSave) && (
        <>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            padding="md"
            backgroundColor="bg-secondary"
          >
            {/* Title section */}
            <Box display="flex" flexDirection="column" gap="xs">
              {title && (
                <Box display="flex" alignItems="center" gap="xs">
                  <Text size="base" weight="semibold" color="fg-primary">
                    {title}
                  </Text>
                  {isModified && (
                    <Text size="sm" color="fg-secondary">
                      • Modified
                    </Text>
                  )}
                </Box>
              )}
              {subtitle && (
                <Text size="sm" color="fg-secondary">
                  {subtitle}
                </Text>
              )}
            </Box>

            {/* Actions section */}
            <Box display="flex" alignItems="center" gap="sm">
              {actions}
              {onSave && (
                <Button
                  variant="primary"
                  size="sm"
                  onPress={onSave}
                  disabled={!isModified}
                  ariaLabel={saveLabel}
                >
                  {saveLabel}
                </Button>
              )}
            </Box>
          </Box>
          <Divider />
        </>
      )}

      {/* Editor content area */}
      <Box flex={1} overflow="hidden" position="relative">
        {children}
      </Box>
    </Box>
  );
}
