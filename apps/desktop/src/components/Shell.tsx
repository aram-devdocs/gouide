import { EditorArea } from "./EditorArea";
import styles from "./Shell.module.css";
import { Sidebar } from "./Sidebar";
import { StatusBar } from "./StatusBar";

export function Shell() {
  return (
    <div className={styles.shell}>
      <div className={styles.main}>
        <Sidebar />
        <EditorArea />
      </div>
      <StatusBar />
    </div>
  );
}
