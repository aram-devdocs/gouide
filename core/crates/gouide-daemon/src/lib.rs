//! Gouide IDE core daemon.
//!
//! The daemon is the central hub of the Gouide IDE, providing gRPC services
//! over local IPC (Unix domain sockets on Unix, named pipes on Windows).
//!
//! # Architecture
//!
//! - **Transport**: Platform-specific IPC (UDS/named pipes)
//! - **Services**: gRPC services implementing the protocol from `gouide-protocol`
//! - **Session**: Client connection tracking and capability negotiation
//! - **Discovery**: Lock file and metadata for daemon discovery by clients
//!
//! # Usage
//!
//! ```ignore
//! use gouide_daemon::{DaemonServer, DaemonConfig};
//!
//! #[tokio::main]
//! async fn main() -> anyhow::Result<()> {
//!     let config = DaemonConfig::default();
//!     let server = DaemonServer::new(config);
//!     server.run().await
//! }
//! ```

pub mod config;
pub mod discovery;
pub mod server;
pub mod services;
pub mod session;
pub mod shutdown;
pub mod transport;

pub use config::DaemonConfig;
pub use server::DaemonServer;
