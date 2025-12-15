/**
 * useEditorAutoSave hook
 * Manages editor state including auto-save, dirty tracking, and keyboard shortcuts
 */

import type { editor } from "monaco-editor";
import { useCallback, useEffect, useRef, useState } from "react";

export interface UseEditorAutoSaveOptions {
  /** Initial file content */
  initialValue: string;
  /** Save callback (receives updated content) */
  onSave: (content: string) => Promise<void>;
  /** Auto-save debounce delay in milliseconds (default: 1000ms) */
  autoSaveDelay?: number;
}

export interface UseEditorAutoSaveReturn {
  /** Whether file has unsaved changes */
  isDirty: boolean;
  /** Whether a save operation is in progress */
  isSaving: boolean;
  /** Editor instance ref */
  editorRef: React.MutableRefObject<editor.IStandaloneCodeEditor | null>;
  /** Editor mount handler - sets up keyboard shortcuts and focus */
  handleEditorDidMount: (
    editor: editor.IStandaloneCodeEditor,
    monaco: typeof import("monaco-editor"),
  ) => void;
  /** Editor change handler - marks dirty and triggers auto-save */
  handleEditorChange: (value: string | undefined) => void;
  /** Manually trigger save */
  saveNow: () => Promise<void>;
}

/**
 * Hook for managing Monaco editor state with auto-save functionality
 *
 * @example
 * ```tsx
 * const { isDirty, isSaving, handleEditorDidMount, handleEditorChange } = useEditorAutoSave({
 *   initialValue: fileContent,
 *   onSave: async (content) => await writeFile(path, content),
 *   autoSaveDelay: 1000,
 * });
 * ```
 */
export function useEditorAutoSave({
  initialValue,
  onSave,
  autoSaveDelay = 1000,
}: UseEditorAutoSaveOptions): UseEditorAutoSaveReturn {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<number | null>(null);
  const lastSavedValueRef = useRef(initialValue);

  // Save now (called by Cmd+S or auto-save)
  const saveNow = useCallback(async () => {
    if (!editorRef.current || isSaving) return;

    const currentValue = editorRef.current.getValue();
    if (currentValue === lastSavedValueRef.current) {
      setIsDirty(false);
      return;
    }

    setIsSaving(true);
    try {
      await onSave(currentValue);
      lastSavedValueRef.current = currentValue;
      setIsDirty(false);
    } catch (error) {
      console.error("Failed to save file:", error);
      // Keep dirty state if save failed
      throw error;
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, onSave]);

  // Handle editor mount
  const handleEditorDidMount = useCallback(
    (editor: editor.IStandaloneCodeEditor, monaco: typeof import("monaco-editor")) => {
      editorRef.current = editor;

      // Set up keyboard shortcuts (Cmd+S / Ctrl+S)
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        saveNow();
      });

      // Focus editor on mount
      editor.focus();
    },
    [saveNow],
  );

  // Handle content changes
  const handleEditorChange = useCallback(
    (newValue: string | undefined) => {
      if (newValue === undefined) return;

      // Mark as dirty if changed
      const changed = newValue !== lastSavedValueRef.current;
      setIsDirty(changed);

      // Clear existing auto-save timer
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      // Set up auto-save with debounce
      if (changed) {
        saveTimeoutRef.current = window.setTimeout(() => {
          saveNow();
        }, autoSaveDelay);
      }
    },
    [saveNow, autoSaveDelay],
  );

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  // Update last saved value when prop value changes (file switch)
  useEffect(() => {
    lastSavedValueRef.current = initialValue;
    setIsDirty(false);
  }, [initialValue]);

  return {
    isDirty,
    isSaving,
    editorRef,
    handleEditorDidMount,
    handleEditorChange,
    saveNow,
  };
}
