/**
 * StatusBarTemplate
 * Template for rendering daemon connection status in the status bar
 *
 * This template accepts daemon connection state and renders the status bar UI.
 * It uses the StatusBar organism internally.
 */

import type { ConnectionState, DaemonInfo } from "@gouide/frontend-hooks";
import { StatusBar as StatusBarOrganism } from "../organisms/StatusBar";

export interface StatusBarTemplateProps {
  /** Current connection state from useDaemonConnection */
  connectionState: ConnectionState;
  /** Daemon info from useDaemonConnection */
  daemonInfo: DaemonInfo | null;
  /** Retry callback from useDaemonConnection */
  onRetry: () => Promise<void>;
}

/**
 * StatusBarTemplate - daemon connection status display
 *
 * Renders the status bar with connection state, protocol version,
 * daemon ID, and retry functionality.
 *
 * @example
 * ```tsx
 * const daemon = useDaemonConnection();
 * <StatusBarTemplate
 *   connectionState={daemon.state}
 *   daemonInfo={daemon.daemonInfo}
 *   onRetry={daemon.retry}
 * />
 * ```
 */
export function StatusBarTemplate({
  connectionState,
  daemonInfo,
  onRetry,
}: StatusBarTemplateProps) {
  const message =
    connectionState.status === "connected" ? connectionState.welcome.protocol_version : undefined;
  const error = connectionState.status === "error" ? connectionState.error : undefined;
  const daemonId = daemonInfo?.daemon_id.slice(0, 8);

  return (
    <StatusBarOrganism
      status={connectionState.status}
      message={message}
      error={error}
      daemonId={daemonId}
      onRetry={onRetry}
    />
  );
}
