import styles from "./EditorArea.module.css";

export function EditorArea() {
  return (
    <main className={styles.editorArea}>
      <div className={styles.placeholder}>
        <div className={styles.logo}>
          <span className={styles.logoText}>Gouide</span>
        </div>
        <p className={styles.message}>No file open</p>
        <p className={styles.hint}>Open a file from the explorer to start editing</p>
      </div>
    </main>
  );
}
