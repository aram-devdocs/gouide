import { Sidebar } from "./Sidebar";
import { EditorArea } from "./EditorArea";
import { StatusBar } from "./StatusBar";
import styles from "./Shell.module.css";

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
