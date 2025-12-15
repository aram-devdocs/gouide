import { useDaemonConnection } from "../hooks/useDaemonConnection";
import styles from "./StatusBar.module.css";

export function StatusBar() {
  const { state, daemonInfo, retry } = useDaemonConnection();

  const renderStatus = () => {
    switch (state.status) {
      case "disconnected":
        return <span className={styles.disconnected}>Disconnected</span>;
      case "connecting":
        return <span className={styles.connecting}>Connecting...</span>;
      case "connected":
        return (
          <span className={styles.connected}>
            Connected to daemon (v{state.welcome.protocol_version})
          </span>
        );
      case "error":
        return (
          <span className={styles.error} title={state.error}>
            Error: {state.error}
            <button type="button" className={styles.retryButton} onClick={retry}>
              Retry
            </button>
          </span>
        );
    }
  };

  return (
    <footer className={styles.statusBar}>
      <div className={styles.left}>{renderStatus()}</div>
      <div className={styles.right}>
        {state.status === "connected" && daemonInfo && (
          <span className={styles.info}>daemon: {daemonInfo.daemon_id.slice(0, 8)}</span>
        )}
      </div>
    </footer>
  );
}
