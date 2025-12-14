//! Tauri commands for daemon communication.
//!
//! These commands are exposed to the frontend via `tauri::invoke`.

use std::sync::OnceLock;

use serde::Serialize;
use tokio::sync::Mutex;
use tracing::{debug, info};

use super::client::{DaemonClient, PingResponse, WelcomeInfo};
use super::discovery::{discover_daemon as discover, DaemonMetadata};

/// Global daemon client instance.
static DAEMON_CLIENT: OnceLock<Mutex<DaemonClient>> = OnceLock::new();

fn get_client() -> &'static Mutex<DaemonClient> {
    DAEMON_CLIENT.get_or_init(|| Mutex::new(DaemonClient::new()))
}

/// Information about a discovered daemon.
#[derive(Debug, Clone, Serialize)]
pub struct DaemonInfo {
    pub pid: u32,
    pub daemon_id: String,
    pub protocol_version: String,
    pub endpoint: String,
}

impl From<DaemonMetadata> for DaemonInfo {
    fn from(m: DaemonMetadata) -> Self {
        Self {
            pid: m.pid,
            daemon_id: m.daemon_id,
            protocol_version: m.protocol_version,
            endpoint: m.endpoint,
        }
    }
}

/// Discover a running daemon instance.
///
/// Returns daemon info if a daemon is running, or null if not found.
#[tauri::command]
pub async fn discover_daemon() -> Result<Option<DaemonInfo>, String> {
    debug!("Discovering daemon...");
    match discover() {
        Some(metadata) => {
            info!(daemon_id = %metadata.daemon_id, "Found running daemon");
            Ok(Some(metadata.into()))
        }
        None => {
            info!("No daemon running");
            Ok(None)
        }
    }
}

/// Connect to the daemon.
///
/// # Arguments
/// * `client_id` - Unique identifier for this client
/// * `client_name` - Human-readable name for this client
///
/// # Returns
/// Welcome information from the daemon on success.
#[tauri::command]
pub async fn connect(client_id: String, client_name: String) -> Result<WelcomeInfo, String> {
    info!(client_id = %client_id, "Connecting to daemon...");

    // First discover the daemon
    let metadata = discover().ok_or_else(|| "No daemon running".to_string())?;

    // Connect
    let client = get_client().lock().await;
    client
        .connect(&metadata, client_id, client_name)
        .await
        .map_err(|e| e.to_string())
}

/// Disconnect from the daemon.
#[tauri::command]
pub async fn disconnect() -> Result<(), String> {
    info!("Disconnecting from daemon...");
    let client = get_client().lock().await;
    client.disconnect().await.map_err(|e| e.to_string())
}

/// Ping the daemon to check connection health.
///
/// # Returns
/// Ping response with server time and round-trip latency.
#[tauri::command]
pub async fn ping() -> Result<PingResponse, String> {
    debug!("Pinging daemon...");
    let client = get_client().lock().await;
    client.ping().await.map_err(|e| e.to_string())
}

/// Check if connected to daemon.
#[tauri::command]
pub async fn is_connected() -> Result<bool, String> {
    let client = get_client().lock().await;
    Ok(client.is_connected().await)
}
