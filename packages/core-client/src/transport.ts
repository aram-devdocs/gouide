/**
 * Transport interface for daemon communication.
 *
 * This abstraction allows different transport implementations
 * (Tauri, WebSocket, etc.) to be used with the same client API.
 */

import type { DaemonInfo, WelcomeInfo, PingResult } from "./types.js";

/**
 * Transport interface for communicating with the daemon.
 *
 * Implementations handle the actual IPC mechanism (Tauri commands,
 * WebSocket, etc.) while the GouideClient handles higher-level logic.
 */
export interface CoreTransport {
  /**
   * Discover a running daemon instance.
   * @returns Daemon info if found, null if no daemon is running.
   */
  discover(): Promise<DaemonInfo | null>;

  /**
   * Connect to the daemon.
   * @param clientId - Unique identifier for this client
   * @param clientName - Human-readable name for this client
   * @returns Welcome info on success
   * @throws Error if connection fails
   */
  connect(clientId: string, clientName: string): Promise<WelcomeInfo>;

  /**
   * Disconnect from the daemon.
   */
  disconnect(): Promise<void>;

  /**
   * Ping the daemon to check connection health.
   * @returns Ping result with timing info
   * @throws Error if not connected
   */
  ping(): Promise<PingResult>;

  /**
   * Check if currently connected to daemon.
   */
  isConnected(): Promise<boolean>;
}
