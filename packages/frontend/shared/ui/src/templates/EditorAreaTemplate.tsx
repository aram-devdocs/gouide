/**
 * EditorAreaTemplate
 * Template for rendering the main editor area
 *
 * This template accepts the active buffer from workspace state and renders
 * either the MonacoEditorTemplate or an EmptyState.
 */

import type { Buffer } from "@gouide/frontend-hooks";
import { EmptyState } from "./EmptyState";
import { MonacoEditorTemplate } from "./MonacoEditorTemplate";

export interface EditorAreaTemplateProps {
  /** Active buffer from workspace (null if no file open) */
  activeBuffer: Buffer | null;
  /** Callback to save file content */
  onSave: (path: string, content: string) => Promise<void>;
}

/**
 * EditorAreaTemplate - main editor display area
 *
 * Renders the Monaco editor when a file is open, or an empty state
 * when no file is selected.
 *
 * @example
 * ```tsx
 * const workspace = useWorkspace();
 * const activeBuffer = workspace.activeBufferId
 *   ? workspace.openBuffers.get(workspace.activeBufferId)
 *   : null;
 *
 * <EditorAreaTemplate
 *   activeBuffer={activeBuffer ?? null}
 *   onSave={workspace.saveFile}
 * />
 * ```
 */
export function EditorAreaTemplate({ activeBuffer, onSave }: EditorAreaTemplateProps) {
  return activeBuffer ? (
    <MonacoEditorTemplate
      path={activeBuffer.path}
      value={activeBuffer.content}
      onSave={(content) => onSave(activeBuffer.path, content)}
    />
  ) : (
    <EmptyState
      icon="📝"
      title="No file open"
      message="Open a file from the explorer to start editing"
    />
  );
}
