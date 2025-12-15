/**
 * Main Gouide client for communicating with the daemon.
 */

import type { CoreTransport } from "./transport.js";
import type {
  DaemonInfo,
  WelcomeInfo,
  PingResult,
  ConnectionState,
} from "./types.js";

/**
 * Options for creating a GouideClient.
 */
export interface GouideClientOptions {
  /** Transport implementation to use */
  transport: CoreTransport;
  /** Unique identifier for this client (auto-generated if not provided) */
  clientId?: string;
  /** Human-readable name for this client */
  clientName?: string;
}

/**
 * Event types emitted by the client.
 */
export type ClientEvent =
  | { type: "connecting" }
  | { type: "connected"; welcome: WelcomeInfo }
  | { type: "disconnected" }
  | { type: "error"; error: string };

/**
 * Listener for client events.
 */
export type ClientEventListener = (event: ClientEvent) => void;

/**
 * Generate a unique client ID.
 */
function generateClientId(): string {
  return `client-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Main client for communicating with the Gouide daemon.
 *
 * The client handles:
 * - Daemon discovery
 * - Connection lifecycle
 * - Health monitoring (ping)
 *
 * @example
 * ```typescript
 * import { GouideClient } from "@gouide/core-client";
 * import { tauriTransport } from "@gouide/core-client/tauri";
 *
 * const client = new GouideClient({
 *   transport: tauriTransport,
 *   clientName: "Gouide Desktop",
 * });
 *
 * // Discover and connect
 * const daemon = await client.discover();
 * if (daemon) {
 *   await client.connect();
 *   console.log("Connected to daemon:", client.getConnectionState());
 * }
 * ```
 */
export class GouideClient {
  private readonly transport: CoreTransport;
  /** Unique identifier for this client */
  readonly clientId: string;
  /** Human-readable name for this client */
  readonly clientName: string;
  private state: ConnectionState = { status: "disconnected" };
  private listeners: Set<ClientEventListener> = new Set();

  constructor(options: GouideClientOptions) {
    this.transport = options.transport;
    this.clientId = options.clientId ?? generateClientId();
    this.clientName = options.clientName ?? "Gouide Client";
  }

  /**
   * Get the current connection state.
   */
  getConnectionState(): ConnectionState {
    return this.state;
  }

  /**
   * Check if currently connected to daemon.
   */
  isConnected(): boolean {
    return this.state.status === "connected";
  }

  /**
   * Subscribe to client events.
   * @returns Unsubscribe function
   */
  subscribe(listener: ClientEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(event: ClientEvent): void {
    for (const listener of this.listeners) {
      try {
        listener(event);
      } catch (e) {
        console.error("Error in client event listener:", e);
      }
    }
  }

  private setState(state: ConnectionState): void {
    this.state = state;
    switch (state.status) {
      case "connecting":
        this.emit({ type: "connecting" });
        break;
      case "connected":
        this.emit({ type: "connected", welcome: state.welcome });
        break;
      case "disconnected":
        this.emit({ type: "disconnected" });
        break;
      case "error":
        this.emit({ type: "error", error: state.error });
        break;
    }
  }

  /**
   * Discover a running daemon instance.
   * @returns Daemon info if found, null if no daemon is running.
   */
  async discover(): Promise<DaemonInfo | null> {
    return this.transport.discover();
  }

  /**
   * Connect to the daemon.
   *
   * Will discover the daemon automatically if not already discovered.
   *
   * @returns Welcome info on success
   * @throws Error if no daemon is running or connection fails
   */
  async connect(): Promise<WelcomeInfo> {
    if (this.state.status === "connected") {
      return this.state.welcome;
    }

    this.setState({ status: "connecting" });

    try {
      const welcome = await this.transport.connect(
        this.clientId,
        this.clientName
      );
      this.setState({ status: "connected", welcome });
      return welcome;
    } catch (e) {
      const error = e instanceof Error ? e.message : String(e);
      this.setState({ status: "error", error });
      throw e;
    }
  }

  /**
   * Disconnect from the daemon.
   */
  async disconnect(): Promise<void> {
    if (this.state.status !== "connected") {
      return;
    }

    try {
      await this.transport.disconnect();
    } finally {
      this.setState({ status: "disconnected" });
    }
  }

  /**
   * Ping the daemon to check connection health.
   * @returns Ping result with timing info
   * @throws Error if not connected
   */
  async ping(): Promise<PingResult> {
    if (this.state.status !== "connected") {
      throw new Error("Not connected to daemon");
    }
    return this.transport.ping();
  }
}
