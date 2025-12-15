/**
 * MonacoEditorTemplate
 * Template for rendering Monaco code editor with auto-save functionality
 *
 * This template uses useEditorAutoSave hook for state management:
 * - Dirty state (unsaved changes indicator)
 * - Auto-save with debouncing (1 second)
 * - Keyboard shortcuts (Cmd+S to save)
 * - Language detection from file extension
 * - Editor configuration
 */

import { useEditorAutoSave } from "@gouide/frontend-hooks";
import Editor from "@monaco-editor/react";
import { Badge } from "../atoms/Badge";
import { Box } from "../atoms/Box";
import { Text } from "../atoms/Text";
import { getFilename, getLanguageFromPath } from "../utils/fileUtils";

export interface MonacoEditorTemplateProps {
  /** File path for language detection and display */
  path: string;
  /** Current file content */
  value: string;
  /** Save callback (receives updated content) */
  onSave: (content: string) => Promise<void>;
}

/**
 * MonacoEditorTemplate - full-featured code editor
 *
 * Renders Monaco editor with auto-save, keyboard shortcuts, and
 * language detection. Uses useEditorAutoSave hook for state management.
 *
 * @example
 * ```tsx
 * <MonacoEditorTemplate
 *   path="/path/to/file.tsx"
 *   value={fileContent}
 *   onSave={async (content) => await saveFile(path, content)}
 * />
 * ```
 */
export function MonacoEditorTemplate({ path, value, onSave }: MonacoEditorTemplateProps) {
  // Use custom hook for editor state management
  const { isDirty, isSaving, handleEditorDidMount, handleEditorChange } = useEditorAutoSave({
    initialValue: value,
    onSave,
    autoSaveDelay: 1000,
  });

  const language = getLanguageFromPath(path);
  const filename = getFilename(path);

  return (
    <Box display="flex" flexDirection="column" height="100%" overflow="hidden">
      {/* Editor Header */}
      <Box
        paddingX="md"
        paddingY="sm"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        backgroundColor="bg-secondary"
        flexShrink={0}
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <Box display="flex" alignItems="center" gap="sm">
          {isDirty && (
            <Badge variant="warning" size="sm">
              <Text size="sm">●</Text>
            </Badge>
          )}
          <Text size="sm" weight="medium" color="fg-primary">
            {filename}
          </Text>
        </Box>
        {isSaving && (
          <Text size="sm" color="fg-secondary">
            Saving...
          </Text>
        )}
      </Box>

      {/* Monaco Editor */}
      <Box flex={1} overflow="hidden">
        <Editor
          height="100%"
          defaultLanguage={language}
          language={language}
          value={value}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            automaticLayout: true,
            minimap: { enabled: true },
            fontSize: 13,
            tabSize: 2,
            insertSpaces: true,
            lineNumbers: "on",
            folding: true,
            bracketPairColorization: { enabled: true },
            matchBrackets: "always",
            wordWrap: "off",
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            renderWhitespace: "selection",
            renderLineHighlight: "line",
          }}
        />
      </Box>
    </Box>
  );
}
