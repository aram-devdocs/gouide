import styles from "./Sidebar.module.css";

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles.title}>EXPLORER</span>
      </div>
      <div className={styles.content}>
        <div className={styles.placeholder}>
          <span className={styles.icon}>📁</span>
          <p>No folder opened</p>
          <p className={styles.hint}>
            Open a folder to start working
          </p>
        </div>
      </div>
    </aside>
  );
}
