/**
 * @gouide/core-client - Client library for communicating with the Gouide daemon.
 *
 * @example
 * ```typescript
 * import { GouideClient } from "@gouide/core-client";
 * import { tauriTransport } from "@gouide/core-client/tauri";
 *
 * const client = new GouideClient({
 *   transport: tauriTransport,
 *   clientName: "My App",
 * });
 *
 * const daemon = await client.discover();
 * if (daemon) {
 *   await client.connect();
 * }
 * ```
 */

export type {
  ClientEvent,
  ClientEventListener,
  GouideClientOptions,
} from "./client.js";
// Main client
export { GouideClient } from "./client.js";

// Transport interface
export type { CoreTransport } from "./transport.js";
// Types
// Re-export protocol types for convenience
export type {
  Capabilities,
  ConnectionState,
  DaemonInfo,
  Hello,
  PingResult,
  Welcome,
  WelcomeInfo,
  WorkspaceLimits,
} from "./types.js";
