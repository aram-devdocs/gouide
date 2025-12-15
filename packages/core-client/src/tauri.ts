/**
 * Tauri transport implementation for daemon communication.
 *
 * This transport uses Tauri's invoke API to communicate with
 * the Rust bridge, which in turn connects to the daemon via gRPC/UDS.
 */

import { invoke } from "@tauri-apps/api/core";
import type { CoreTransport } from "./transport.js";
import type { DaemonInfo, WelcomeInfo, PingResult } from "./types.js";

/**
 * Application settings for window behavior.
 */
export interface AppSettings {
  /** If true, closing the window quits the app. If false, minimizes to tray. */
  quit_on_close: boolean;
  /** If true, start minimized to tray. */
  start_minimized: boolean;
}

/**
 * Tauri-based transport for daemon communication.
 *
 * Uses Tauri's invoke mechanism to call Rust commands that
 * handle the actual gRPC communication with the daemon.
 */
export class TauriTransport implements CoreTransport {
  async discover(): Promise<DaemonInfo | null> {
    return invoke<DaemonInfo | null>("discover_daemon");
  }

  async connect(clientId: string, clientName: string): Promise<WelcomeInfo> {
    return invoke<WelcomeInfo>("connect", {
      clientId,
      clientName,
    });
  }

  async disconnect(): Promise<void> {
    await invoke("disconnect");
  }

  async ping(): Promise<PingResult> {
    return invoke<PingResult>("ping");
  }

  async isConnected(): Promise<boolean> {
    return invoke<boolean>("is_connected");
  }

  // --- Lifecycle and settings methods ---

  /**
   * Ensure daemon is running and connect to it.
   *
   * This is the main entry point for "attach-or-spawn" logic.
   * If no daemon is running, it will spawn one before connecting.
   */
  async ensureAndConnect(
    clientId: string,
    clientName: string
  ): Promise<WelcomeInfo> {
    return invoke<WelcomeInfo>("ensure_and_connect", {
      clientId,
      clientName,
    });
  }

  /**
   * Get current app settings.
   */
  async getSettings(): Promise<AppSettings> {
    return invoke<AppSettings>("get_settings");
  }

  /**
   * Update app settings.
   */
  async setSettings(settings: AppSettings): Promise<void> {
    await invoke("set_settings", { settings });
  }

  /**
   * Stop the daemon gracefully.
   */
  async shutdownDaemon(): Promise<void> {
    await invoke("shutdown_daemon");
  }
}

// Export a singleton instance for convenience
export const tauriTransport = new TauriTransport();
