/**
 * Types for the Gouide core client.
 *
 * Re-exports relevant types from the protocol package and defines
 * client-specific types.
 */

// Re-export protocol types that clients need
export type {
  Hello,
  Welcome,
  EstablishResponse,
  DisconnectRequest,
  DisconnectResponse,
  PingRequest,
  PingResponse,
  Capabilities,
  WorkspaceLimits,
  Timestamp,
} from "@gouide/protocol";

/**
 * Information about a discovered daemon instance.
 */
export interface DaemonInfo {
  /** Process ID of the daemon */
  pid: number;
  /** Unique identifier for this daemon instance */
  daemon_id: string;
  /** Protocol version the daemon implements */
  protocol_version: string;
  /** IPC endpoint path (socket or named pipe) */
  endpoint: string;
}

/**
 * Welcome information returned after successful connection.
 */
export interface WelcomeInfo {
  /** Protocol version negotiated */
  protocol_version: string;
  /** Unique identifier for this daemon instance */
  daemon_id: string;
  /** Daemon software version */
  daemon_version: string;
  /** Token for reconnecting to the same session */
  reconnect_token: string;
  /** Session timeout in seconds */
  session_timeout_seconds: number;
}

/**
 * Response from a ping operation.
 */
export interface PingResult {
  /** Server time in seconds since epoch */
  server_time_seconds: number;
  /** Server time nanoseconds component */
  server_time_nanos: number;
  /** Round-trip time in milliseconds */
  round_trip_ms: number;
}

/**
 * Connection state of the client.
 */
export type ConnectionState =
  | { status: "disconnected" }
  | { status: "connecting" }
  | { status: "connected"; welcome: WelcomeInfo }
  | { status: "error"; error: string };
