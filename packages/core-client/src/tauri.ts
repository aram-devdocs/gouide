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
}

// Export a singleton instance for convenience
export const tauriTransport = new TauriTransport();
