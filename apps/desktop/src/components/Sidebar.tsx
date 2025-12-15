import { useWorkspace } from "../hooks/useWorkspace";
import { FileTree } from "./FileTree";
import styles from "./Sidebar.module.css";

export function Sidebar() {
  const workspace = useWorkspace();

  const getWorkspaceName = () => {
    if (!workspace.workspacePath) return null;
    const parts = workspace.workspacePath.split("/");
    return parts[parts.length - 1] || parts[parts.length - 2];
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>EXPLORER</span>
        {workspace.workspacePath && (
          <span className={styles.workspaceName}>{getWorkspaceName()}</span>
        )}
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.openButton} onClick={workspace.openWorkspace}>
          Open Folder
        </button>
      </div>
      <div className={styles.content}>
        {workspace.files.length > 0 ? (
          <FileTree files={workspace.files} onSelect={workspace.openFile} />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.icon}>📁</span>
            <p>No folder opened</p>
            <p className={styles.hint}>Click "Open Folder" to start working</p>
          </div>
        )}
      </div>
    </aside>
  );
}
