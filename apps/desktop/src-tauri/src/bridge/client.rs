//! gRPC client for daemon communication over Unix domain sockets.

use std::sync::Arc;

use gouide_protocol::handshake_service_client::HandshakeServiceClient;
use gouide_protocol::{
    establish_response, Capabilities, DisconnectRequest, EstablishRequest, PingRequest, Timestamp,
};
use tokio::net::UnixStream;
use tokio::sync::Mutex;
use tonic::transport::{Channel, Endpoint, Uri};
use tower::service_fn;
use tracing::{debug, info};

use crate::bridge::discovery::DaemonMetadata;

/// Error type for daemon client operations.
#[derive(Debug, thiserror::Error)]
pub enum ClientError {
    #[error("Not connected to daemon")]
    NotConnected,
    #[error("Connection failed: {0}")]
    ConnectionFailed(String),
    #[error("Handshake failed: {0}")]
    HandshakeFailed(String),
    #[error("RPC error: {0}")]
    RpcError(#[from] tonic::Status),
    #[error("Transport error: {0}")]
    TransportError(#[from] tonic::transport::Error),
}

/// Welcome information returned after successful connection.
#[derive(Debug, Clone, serde::Serialize)]
pub struct WelcomeInfo {
    pub protocol_version: String,
    pub daemon_id: String,
    pub daemon_version: String,
    pub reconnect_token: String,
    pub session_timeout_seconds: u32,
}

/// Response from ping operation.
#[derive(Debug, Clone, serde::Serialize)]
pub struct PingResponse {
    pub server_time_seconds: i64,
    pub server_time_nanos: i32,
    pub round_trip_ms: u64,
}

/// State of the daemon client connection.
#[allow(dead_code)]
struct ConnectionState {
    channel: Channel,
    client_id: String,
    welcome: WelcomeInfo,
}

/// Client for communicating with the gouide daemon.
pub struct DaemonClient {
    state: Arc<Mutex<Option<ConnectionState>>>,
}

impl DaemonClient {
    /// Create a new daemon client (not yet connected).
    pub fn new() -> Self {
        Self {
            state: Arc::new(Mutex::new(None)),
        }
    }

    /// Connect to the daemon at the given socket path.
    pub async fn connect(
        &self,
        metadata: &DaemonMetadata,
        client_id: String,
        client_name: String,
    ) -> Result<WelcomeInfo, ClientError> {
        let endpoint = &metadata.endpoint;
        info!(endpoint = %endpoint, "Connecting to daemon");

        // Create a channel that connects over Unix domain socket
        let channel = create_uds_channel(endpoint).await?;

        // Perform handshake
        let establish_request = EstablishRequest {
            protocol_version: "1.0.0".to_string(),
            client_id: client_id.clone(),
            client_name,
            client_version: env!("CARGO_PKG_VERSION").to_string(),
            capabilities: Some(Capabilities::default()),
            reconnect_token: String::new(),
        };

        debug!("Sending EstablishRequest to daemon");
        let response = HandshakeServiceClient::new(channel.clone())
            .establish(establish_request)
            .await?;
        let result = response
            .into_inner()
            .result
            .ok_or_else(|| ClientError::HandshakeFailed("Empty response".to_string()))?;

        match result {
            establish_response::Result::Welcome(welcome) => {
                info!(
                    daemon_id = %welcome.daemon_id,
                    protocol_version = %welcome.protocol_version,
                    "Handshake successful"
                );

                let welcome_info = WelcomeInfo {
                    protocol_version: welcome.protocol_version,
                    daemon_id: welcome.daemon_id,
                    daemon_version: welcome.daemon_version,
                    reconnect_token: welcome.reconnect_token,
                    session_timeout_seconds: welcome.session_timeout_seconds,
                };

                // Store connection state
                let mut state = self.state.lock().await;
                *state = Some(ConnectionState {
                    channel,
                    client_id,
                    welcome: welcome_info.clone(),
                });

                Ok(welcome_info)
            }
            establish_response::Result::Error(error) => Err(ClientError::HandshakeFailed(format!(
                "Code {}: {}",
                error.code, error.message
            ))),
        }
    }

    /// Disconnect from the daemon.
    pub async fn disconnect(&self) -> Result<(), ClientError> {
        let mut state = self.state.lock().await;

        if let Some(conn) = state.take() {
            let _ = HandshakeServiceClient::new(conn.channel)
                .disconnect(DisconnectRequest {
                    reason: "Client closing".to_string(),
                })
                .await;
            info!("Disconnected from daemon");
        }

        Ok(())
    }

    /// Check if connected to daemon.
    pub async fn is_connected(&self) -> bool {
        self.state.lock().await.is_some()
    }

    /// Ping the daemon to check connection health.
    pub async fn ping(&self) -> Result<PingResponse, ClientError> {
        let state = self.state.lock().await;
        let conn = state.as_ref().ok_or(ClientError::NotConnected)?;

        let start = std::time::Instant::now();
        let client_time = current_timestamp();

        let response = HandshakeServiceClient::new(conn.channel.clone())
            .ping(PingRequest {
                client_time: Some(client_time),
            })
            .await?;

        #[allow(clippy::cast_possible_truncation)]
        let round_trip_ms = start.elapsed().as_millis() as u64;
        let pong = response.into_inner();

        let server_time = pong.server_time.unwrap_or_default();
        Ok(PingResponse {
            server_time_seconds: server_time.seconds,
            server_time_nanos: server_time.nanos,
            round_trip_ms,
        })
    }
}

impl Default for DaemonClient {
    fn default() -> Self {
        Self::new()
    }
}

/// Create a tonic channel that connects over Unix domain socket.
async fn create_uds_channel(socket_path: &str) -> Result<Channel, ClientError> {
    let socket_path = socket_path.to_string();

    // For UDS, we need a dummy URI and a custom connector
    let channel = Endpoint::try_from("http://[::]:50051")
        .map_err(|e| ClientError::ConnectionFailed(e.to_string()))?
        .connect_with_connector(service_fn(move |_: Uri| {
            let path = socket_path.clone();
            async move {
                let stream = UnixStream::connect(&path).await?;
                Ok::<_, std::io::Error>(hyper_util::rt::TokioIo::new(stream))
            }
        }))
        .await
        .map_err(|e| ClientError::ConnectionFailed(e.to_string()))?;

    Ok(channel)
}

/// Get the current timestamp.
fn current_timestamp() -> Timestamp {
    let now = chrono::Utc::now();
    Timestamp {
        seconds: now.timestamp(),
        nanos: now.timestamp_subsec_nanos() as i32,
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_client_creation() {
        let client = DaemonClient::new();
        // Client should be created without error
        assert!(matches!(client.state.try_lock(), Ok(state) if state.is_none()));
    }
}
