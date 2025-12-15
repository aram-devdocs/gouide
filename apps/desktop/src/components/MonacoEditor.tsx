import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./MonacoEditor.module.css";

interface MonacoEditorProps {
  path: string;
  value: string;
  onSave: (content: string) => Promise<void>;
}

// Detect language from file extension
function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();

  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    md: "markdown",
    html: "html",
    css: "css",
    scss: "scss",
    rs: "rust",
    toml: "toml",
    yaml: "yaml",
    yml: "yaml",
    xml: "xml",
    sh: "shell",
    bash: "shell",
    proto: "proto",
    py: "python",
    rb: "ruby",
    go: "go",
    java: "java",
    c: "c",
    cpp: "cpp",
    h: "c",
    hpp: "cpp",
  };

  return languageMap[ext || ""] || "plaintext";
}

// Get filename from path
function getFilename(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1] || "Untitled";
}

export function MonacoEditor({ path, value, onSave }: MonacoEditorProps) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<number | null>(null);
  const lastSavedValueRef = useRef(value);

  const language = getLanguageFromPath(path);
  const filename = getFilename(path);

  // Save now (called by Cmd+S or auto-save)
  const handleSaveNow = useCallback(async () => {
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
      // Could show error notification here
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, onSave]);

  // Handle editor mount
  const handleEditorDidMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;

      // Set up keyboard shortcuts
      editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
        handleSaveNow();
      });

      // Focus editor
      editor.focus();
    },
    [handleSaveNow],
  );

  // Handle content changes
  const handleEditorChange = useCallback(
    (newValue: string | undefined) => {
      if (newValue === undefined) return;

      // Mark as dirty
      const changed = newValue !== lastSavedValueRef.current;
      setIsDirty(changed);

      // Clear existing auto-save timer
      if (saveTimeoutRef.current) {
        window.clearTimeout(saveTimeoutRef.current);
      }

      // Set up auto-save (1 second debounce)
      if (changed) {
        saveTimeoutRef.current = window.setTimeout(() => {
          handleSaveNow();
        }, 1000);
      }
    },
    [handleSaveNow],
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
    lastSavedValueRef.current = value;
    setIsDirty(false);
  }, [value]);

  return (
    <div className={styles.editorContainer}>
      <div className={styles.editorHeader}>
        <span className={styles.filename}>
          {isDirty && <span className={styles.dirtyIndicator}>●</span>}
          {filename}
        </span>
        {isSaving && <span className={styles.savingIndicator}>Saving...</span>}
      </div>
      <div className={styles.editorWrapper}>
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
      </div>
    </div>
  );
}
