//! Daemon configuration.

use gouide_protocol::{Capabilities, WorkspaceLimits};

/// Daemon configuration loaded from environment/args.
#[derive(Debug, Clone)]
pub struct DaemonConfig {
    /// Protocol version this daemon implements.
    pub protocol_version: String,
    /// Maximum concurrent clients.
    pub max_clients: usize,
    /// Session timeout in seconds.
    pub session_timeout_secs: u32,
    /// Workspace limits for negotiation.
    pub workspace_limits: WorkspaceLimits,
    /// Graceful shutdown timeout in seconds.
    pub shutdown_timeout_secs: u64,
}

impl DaemonConfig {
    /// Get the capabilities this daemon supports.
    pub fn daemon_capabilities(&self) -> Capabilities {
        Capabilities {
            supports_chunking: true,
            supports_sequences: true,
            supports_binary_deltas: false, // Future
            supports_compression: false,   // Future
        }
    }
}

impl Default for DaemonConfig {
    fn default() -> Self {
        Self {
            protocol_version: "1.0.0".to_string(),
            max_clients: 16,
            session_timeout_secs: 300, // 5 minutes
            workspace_limits: WorkspaceLimits {
                max_message_bytes: 4 * 1024 * 1024, // 4MB
                max_in_flight: 64,
                recommended_page_size: 100,
                max_concurrent_streams: 32,
            },
            shutdown_timeout_secs: 30,
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_default_config() {
        let config = DaemonConfig::default();
        assert_eq!(config.protocol_version, "1.0.0");
        assert_eq!(config.max_clients, 16);
        assert!(config.daemon_capabilities().supports_chunking);
    }
}
