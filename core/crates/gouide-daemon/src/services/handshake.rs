//! Handshake service implementation.

use std::sync::Arc;

use gouide_protocol::handshake_service_server::HandshakeService as HandshakeServiceTrait;
use gouide_protocol::{
    establish_response, DisconnectRequest, DisconnectResponse, EstablishRequest, EstablishResponse,
    PingRequest, PingResponse, Timestamp, Welcome,
};
use tonic::{Request, Response, Status};
use tracing::info;

use crate::config::DaemonConfig;
use crate::session::SessionManager;

/// Handshake service for establishing client connections.
pub struct HandshakeService {
    session_manager: Arc<SessionManager>,
    config: Arc<DaemonConfig>,
    daemon_id: String,
}

impl HandshakeService {
    /// Create a new handshake service.
    pub fn new(
        session_manager: Arc<SessionManager>,
        config: Arc<DaemonConfig>,
        daemon_id: String,
    ) -> Self {
        Self {
            session_manager,
            config,
            daemon_id,
        }
    }
}

#[tonic::async_trait]
impl HandshakeServiceTrait for HandshakeService {
    async fn establish(
        &self,
        request: Request<EstablishRequest>,
    ) -> Result<Response<EstablishResponse>, Status> {
        let hello = request.into_inner();
        info!(
            client_id = %hello.client_id,
            client_name = %hello.client_name,
            protocol_version = %hello.protocol_version,
            "Handshake establish request"
        );

        match self.session_manager.register(&hello).await {
            Ok(session) => {
                let welcome = Welcome {
                    protocol_version: self.config.protocol_version.clone(),
                    daemon_id: self.daemon_id.clone(),
                    daemon_version: env!("CARGO_PKG_VERSION").to_string(),
                    workspace_limits: Some(self.config.workspace_limits),
                    reconnect_token: session.reconnect_token,
                    negotiated_capabilities: Some(session.negotiated_capabilities),
                    session_timeout_seconds: self.config.session_timeout_secs,
                    server_time: Some(current_timestamp()),
                };

                info!(
                    client_id = %hello.client_id,
                    "Handshake successful"
                );

                Ok(Response::new(EstablishResponse {
                    result: Some(establish_response::Result::Welcome(welcome)),
                }))
            }
            Err(error) => {
                info!(
                    client_id = %hello.client_id,
                    error_code = error.code,
                    "Handshake failed"
                );

                Ok(Response::new(EstablishResponse {
                    result: Some(establish_response::Result::Error(error)),
                }))
            }
        }
    }

    async fn disconnect(
        &self,
        request: Request<DisconnectRequest>,
    ) -> Result<Response<DisconnectResponse>, Status> {
        let req = request.into_inner();
        info!(reason = %req.reason, "Client disconnect request");

        // Note: In a full implementation, we'd extract the client_id from
        // request metadata or a session context. For MVP, disconnect
        // is a no-op since we don't track connection-to-session mapping yet.

        Ok(Response::new(DisconnectResponse { success: true }))
    }

    async fn ping(&self, request: Request<PingRequest>) -> Result<Response<PingResponse>, Status> {
        let req = request.into_inner();

        Ok(Response::new(PingResponse {
            client_time: req.client_time,
            server_time: Some(current_timestamp()),
        }))
    }
}

/// Get the current timestamp.
fn current_timestamp() -> Timestamp {
    let now = chrono::Utc::now();
    Timestamp {
        seconds: now.timestamp(),
        #[allow(clippy::cast_possible_wrap)]
        nanos: now.timestamp_subsec_nanos() as i32,
    }
}

#[cfg(test)]
#[allow(
    clippy::unwrap_used,
    clippy::expect_used,
    clippy::panic,
    clippy::uninlined_format_args
)]
mod tests {
    use super::*;
    use gouide_protocol::Capabilities;

    fn create_service() -> HandshakeService {
        let config = Arc::new(DaemonConfig::default());
        let session_manager = Arc::new(SessionManager::new((*config).clone()));
        HandshakeService::new(session_manager, config, "test-daemon".to_string())
    }

    fn test_hello(client_id: &str) -> EstablishRequest {
        EstablishRequest {
            protocol_version: "1.0.0".to_string(),
            client_id: client_id.to_string(),
            client_name: "Test Client".to_string(),
            client_version: "0.1.0".to_string(),
            capabilities: Some(Capabilities::default()),
            reconnect_token: String::new(),
        }
    }

    #[tokio::test]
    async fn test_establish_success() {
        let service = create_service();
        let hello = test_hello("test-client");

        let response = service.establish(Request::new(hello)).await.unwrap();
        let result = response.into_inner().result.unwrap();

        match result {
            establish_response::Result::Welcome(welcome) => {
                assert_eq!(welcome.protocol_version, "1.0.0");
                assert_eq!(welcome.daemon_id, "test-daemon");
                assert!(!welcome.reconnect_token.is_empty());
            }
            establish_response::Result::Error(e) => {
                panic!("Expected Welcome, got error: {:?}", e);
            }
        }
    }

    #[tokio::test]
    async fn test_ping() {
        let service = create_service();
        let client_time = Timestamp {
            seconds: 1000,
            nanos: 500,
        };

        let response = service
            .ping(Request::new(PingRequest {
                client_time: Some(client_time),
            }))
            .await
            .unwrap();

        let pong = response.into_inner();
        assert_eq!(pong.client_time.unwrap().seconds, 1000);
        assert!(pong.server_time.is_some());
    }
}
