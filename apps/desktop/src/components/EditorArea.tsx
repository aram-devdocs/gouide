import { useWorkspace } from "../hooks/useWorkspace";
import styles from "./EditorArea.module.css";
import { MonacoEditor } from "./MonacoEditor";

export function EditorArea() {
  const workspace = useWorkspace();

  const activeBuffer =
    workspace.activeBufferId && workspace.openBuffers.get(workspace.activeBufferId);

  return (
    <main className={styles.editorArea}>
      {activeBuffer ? (
        <MonacoEditor
          path={activeBuffer.path}
          value={activeBuffer.content}
          onSave={(content) => workspace.saveFile(activeBuffer.path, content)}
        />
      ) : (
        <div className={styles.placeholder}>
          <div className={styles.logo}>
            <span className={styles.logoText}>Gouide</span>
          </div>
          <p className={styles.message}>No file open</p>
          <p className={styles.hint}>Open a file from the explorer to start editing</p>
        </div>
      )}
    </main>
  );
}
