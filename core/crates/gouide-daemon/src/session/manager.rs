//! Session manager for tracking connected clients.

use std::collections::HashMap;
use std::sync::Arc;

use chrono::{DateTime, Utc};
use gouide_protocol::{Capabilities, HandshakeError, HandshakeErrorCode, Hello};
use tokio::sync::RwLock;
use tracing::{info, warn};
use uuid::Uuid;

use crate::config::DaemonConfig;

/// State for a connected client session.
#[derive(Debug, Clone)]
pub struct ClientSession {
    /// Client identifier from Hello message.
    pub client_id: String,
    /// Human-readable client name.
    pub client_name: String,
    /// Client version string.
    pub client_version: String,
    /// Token for session restoration on reconnect.
    pub reconnect_token: String,
    /// When the session was established.
    pub connected_at: DateTime<Utc>,
    /// Last activity timestamp.
    pub last_activity: DateTime<Utc>,
    /// Negotiated capabilities for this session.
    pub negotiated_capabilities: Capabilities,
}

impl ClientSession {
    /// Create a new session from a Hello message.
    fn new(hello: &Hello, config: &DaemonConfig) -> Self {
        let now = Utc::now();
        Self {
            client_id: hello.client_id.clone(),
            client_name: hello.client_name.clone(),
            client_version: hello.client_version.clone(),
            reconnect_token: Uuid::new_v4().to_string(),
            connected_at: now,
            last_activity: now,
            negotiated_capabilities: negotiate_capabilities(
                hello.capabilities.as_ref(),
                &config.daemon_capabilities(),
            ),
        }
    }

    /// Update the last activity timestamp.
    pub fn touch(&mut self) {
        self.last_activity = Utc::now();
    }
}

/// Negotiate capabilities between client and daemon.
fn negotiate_capabilities(client: Option<&Capabilities>, daemon: &Capabilities) -> Capabilities {
    match client {
        Some(c) => Capabilities {
            supports_chunking: c.supports_chunking && daemon.supports_chunking,
            supports_sequences: c.supports_sequences && daemon.supports_sequences,
            supports_binary_deltas: c.supports_binary_deltas && daemon.supports_binary_deltas,
            supports_compression: c.supports_compression && daemon.supports_compression,
        },
        None => Capabilities::default(),
    }
}

/// Manages all connected client sessions.
pub struct SessionManager {
    sessions: RwLock<HashMap<String, Arc<RwLock<ClientSession>>>>,
    config: DaemonConfig,
}

impl SessionManager {
    /// Create a new session manager.
    pub fn new(config: DaemonConfig) -> Self {
        Self {
            sessions: RwLock::new(HashMap::new()),
            config,
        }
    }

    /// Register a new client session after successful handshake validation.
    ///
    /// Returns the session on success, or a HandshakeError on failure.
    pub async fn register(&self, hello: &Hello) -> Result<ClientSession, HandshakeError> {
        let mut sessions = self.sessions.write().await;

        // Check capacity
        if sessions.len() >= self.config.max_clients {
            warn!(
                max_clients = self.config.max_clients,
                current = sessions.len(),
                "Daemon at capacity, rejecting client"
            );
            return Err(HandshakeError {
                code: HandshakeErrorCode::CapacityExceeded as i32,
                message: format!("Daemon at capacity ({} clients)", self.config.max_clients),
                supported_versions: vec![],
                retry_hint: None,
            });
        }

        // Check for duplicate client ID and handle reconnection
        if sessions.contains_key(&hello.client_id) {
            info!(
                client_id = %hello.client_id,
                "Client reconnecting - removing old session"
            );
            // Allow reconnection by removing the old session
            sessions.remove(&hello.client_id);
        }

        // Validate protocol version
        if !self.is_compatible_version(&hello.protocol_version) {
            warn!(
                client_version = %hello.protocol_version,
                daemon_version = %self.config.protocol_version,
                "Protocol version mismatch"
            );
            return Err(HandshakeError {
                code: HandshakeErrorCode::VersionMismatch as i32,
                message: "Protocol version mismatch".to_string(),
                supported_versions: vec![self.config.protocol_version.clone()],
                retry_hint: None,
            });
        }

        // Create and store the session
        let session = ClientSession::new(hello, &self.config);
        info!(
            client_id = %session.client_id,
            client_name = %session.client_name,
            "Client session registered"
        );
        sessions.insert(hello.client_id.clone(), Arc::new(RwLock::new(session.clone())));

        Ok(session)
    }

    /// Remove a client session on disconnect.
    pub async fn unregister(&self, client_id: &str) {
        let mut sessions = self.sessions.write().await;
        if sessions.remove(client_id).is_some() {
            info!(client_id = %client_id, "Client session unregistered");
        }
    }

    /// Get a session by client ID.
    pub async fn get(&self, client_id: &str) -> Option<Arc<RwLock<ClientSession>>> {
        self.sessions.read().await.get(client_id).cloned()
    }

    /// Get the current number of active sessions.
    pub async fn active_count(&self) -> usize {
        self.sessions.read().await.len()
    }

    /// Check if a protocol version is compatible with this daemon.
    fn is_compatible_version(&self, client_version: &str) -> bool {
        // For MVP, require exact match
        // Future: implement semver compatibility checking
        client_version == self.config.protocol_version
    }

    /// Get the daemon's protocol version.
    pub fn protocol_version(&self) -> &str {
        &self.config.protocol_version
    }

    /// Get the daemon config.
    pub fn config(&self) -> &DaemonConfig {
        &self.config
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn test_hello(client_id: &str) -> Hello {
        Hello {
            protocol_version: "1.0.0".to_string(),
            client_id: client_id.to_string(),
            client_name: "Test Client".to_string(),
            client_version: "0.1.0".to_string(),
            capabilities: Some(Capabilities {
                supports_chunking: true,
                supports_sequences: true,
                supports_binary_deltas: false,
                supports_compression: false,
            }),
            reconnect_token: String::new(),
        }
    }

    #[tokio::test]
    async fn test_register_client() {
        let config = DaemonConfig::default();
        let manager = SessionManager::new(config);

        let hello = test_hello("test-client-1");
        let session = manager.register(&hello).await.unwrap();

        assert_eq!(session.client_id, "test-client-1");
        assert!(!session.reconnect_token.is_empty());
        assert_eq!(manager.active_count().await, 1);
    }

    #[tokio::test]
    async fn test_duplicate_client_reconnects() {
        let config = DaemonConfig::default();
        let manager = SessionManager::new(config);

        let hello = test_hello("dup-client");
        let session1 = manager.register(&hello).await.unwrap();
        let token1 = session1.reconnect_token.clone();

        // Same client reconnecting - should succeed and get a new token
        let session2 = manager.register(&hello).await.unwrap();
        let token2 = session2.reconnect_token.clone();

        assert_ne!(token1, token2);
        assert_eq!(manager.active_count().await, 1);
    }

    #[tokio::test]
    async fn test_version_mismatch_rejected() {
        let config = DaemonConfig::default();
        let manager = SessionManager::new(config);

        let mut hello = test_hello("version-client");
        hello.protocol_version = "2.0.0".to_string();

        let result = manager.register(&hello).await;
        assert!(result.is_err());

        let error = result.unwrap_err();
        assert_eq!(error.code, HandshakeErrorCode::VersionMismatch as i32);
        assert!(error.supported_versions.contains(&"1.0.0".to_string()));
    }

    #[tokio::test]
    async fn test_unregister_client() {
        let config = DaemonConfig::default();
        let manager = SessionManager::new(config);

        let hello = test_hello("unreg-client");
        manager.register(&hello).await.unwrap();
        assert_eq!(manager.active_count().await, 1);

        manager.unregister("unreg-client").await;
        assert_eq!(manager.active_count().await, 0);
    }

    #[tokio::test]
    async fn test_capability_negotiation() {
        let config = DaemonConfig::default();
        let manager = SessionManager::new(config);

        let hello = test_hello("cap-client");
        let session = manager.register(&hello).await.unwrap();

        // Client and daemon both support chunking and sequences
        assert!(session.negotiated_capabilities.supports_chunking);
        assert!(session.negotiated_capabilities.supports_sequences);
        // Neither supports binary deltas or compression yet
        assert!(!session.negotiated_capabilities.supports_binary_deltas);
        assert!(!session.negotiated_capabilities.supports_compression);
    }
}
