//! gRPC server setup and lifecycle.

use std::sync::Arc;
use std::time::Duration;

use gouide_protocol::control_server::ControlServer;
use gouide_protocol::handshake_server::HandshakeServer;
use hyper::body::Incoming;
use hyper::service::service_fn;
use hyper_util::rt::{TokioExecutor, TokioIo};
use tokio::net::UnixStream;
use tonic::body::BoxBody;
use tonic::server::NamedService;
use tower::ServiceExt;
use tower_service::Service;
use tracing::{error, info, warn};
use uuid::Uuid;

use crate::config::DaemonConfig;
use crate::discovery::{DaemonMetadata, LockFile};
use crate::services::{ControlService, HandshakeService};
use crate::session::SessionManager;
use crate::shutdown::ShutdownCoordinator;
use crate::transport::UnixListener;

/// The main daemon server.
pub struct DaemonServer {
    config: Arc<DaemonConfig>,
    session_manager: Arc<SessionManager>,
    shutdown: Arc<ShutdownCoordinator>,
}

impl DaemonServer {
    /// Create a new daemon server.
    pub fn new(config: DaemonConfig) -> Self {
        let config = Arc::new(config);
        Self {
            session_manager: Arc::new(SessionManager::new((*config).clone())),
            config,
            shutdown: Arc::new(ShutdownCoordinator::new()),
        }
    }

    /// Run the daemon server.
    pub async fn run(&self) -> anyhow::Result<()> {
        let daemon_id = Uuid::new_v4().to_string();
        info!(daemon_id = %daemon_id, version = env!("CARGO_PKG_VERSION"), "Starting daemon");

        // Acquire the lock file to prevent multiple daemons
        let lock = LockFile::acquire()?;

        // Create the transport listener
        let listener = UnixListener::bind().await?;
        let endpoint = listener.endpoint();

        // Write metadata for client discovery
        lock.write_metadata(&DaemonMetadata {
            pid: std::process::id(),
            start_time: chrono::Utc::now().timestamp(),
            protocol_version: self.config.protocol_version.clone(),
            endpoint: endpoint.clone(),
            daemon_id: daemon_id.clone(),
        })?;

        // Create services
        let handshake_service = HandshakeService::new(
            self.session_manager.clone(),
            self.config.clone(),
            daemon_id.clone(),
        );
        let control_service = ControlService::new();

        // Build the gRPC router
        let handshake_server = HandshakeServer::new(handshake_service);
        let control_server = ControlServer::new(control_service);

        info!(
            endpoint = %endpoint,
            "Daemon ready, waiting for connections"
        );

        // Spawn signal handler
        let shutdown = self.shutdown.clone();
        let shutdown_timeout = self.config.shutdown_timeout_secs;
        tokio::spawn(async move {
            ShutdownCoordinator::wait_for_signal().await;
            shutdown
                .shutdown(Duration::from_secs(shutdown_timeout))
                .await;
        });

        // Accept connections
        let mut shutdown_rx = self.shutdown.subscribe();
        loop {
            tokio::select! {
                accept_result = listener.accept() => {
                    match accept_result {
                        Ok(stream) => {
                            let handshake = handshake_server.clone();
                            let control = control_server.clone();
                            tokio::spawn(async move {
                                if let Err(e) = serve_connection(stream, handshake, control).await {
                                    warn!(error = %e, "Connection error");
                                }
                            });
                        }
                        Err(e) => {
                            error!(error = %e, "Accept error");
                        }
                    }
                }
                _ = shutdown_rx.recv() => {
                    info!("Shutdown signal received, stopping accept loop");
                    break;
                }
            }
        }

        info!("Daemon shutdown complete");

        // Lock file and listener are cleaned up automatically when dropped
        drop(lock);
        drop(listener);

        Ok(())
    }
}

/// Serve a single connection with the gRPC services.
async fn serve_connection<H, C>(stream: UnixStream, handshake: H, control: C) -> anyhow::Result<()>
where
    H: Service<
            hyper::Request<Incoming>,
            Response = hyper::Response<BoxBody>,
            Error = std::convert::Infallible,
        > + Clone
        + Send
        + 'static
        + NamedService,
    H::Future: Send,
    C: Service<
            hyper::Request<Incoming>,
            Response = hyper::Response<BoxBody>,
            Error = std::convert::Infallible,
        > + Clone
        + Send
        + 'static
        + NamedService,
    C::Future: Send,
{
    let io = TokioIo::new(stream);

    // Create a service that routes to the appropriate gRPC service based on path
    let service = service_fn(move |req: hyper::Request<Incoming>| {
        let handshake = handshake.clone();
        let control = control.clone();

        async move {
            let path = req.uri().path();

            // Route based on service name in the path
            // gRPC paths are like /<package>.<service>/<method>
            if path.starts_with(&format!("/{}/", H::NAME)) {
                handshake.oneshot(req).await
            } else if path.starts_with(&format!("/{}/", C::NAME)) {
                control.oneshot(req).await
            } else {
                // Unknown service
                Ok(hyper::Response::builder()
                    .status(404)
                    .body(tonic::body::empty_body())
                    .unwrap())
            }
        }
    });

    hyper_util::server::conn::auto::Builder::new(TokioExecutor::new())
        .http2_only()
        .serve_connection(io, service)
        .await
        .map_err(|e| anyhow::anyhow!("HTTP connection error: {}", e))?;

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_daemon_server_creation() {
        let config = DaemonConfig::default();
        let _server = DaemonServer::new(config);
    }
}
