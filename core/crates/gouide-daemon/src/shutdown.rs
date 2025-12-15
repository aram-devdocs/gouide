//! Graceful shutdown coordination.

use std::time::Duration;

use tokio::signal;
use tokio::sync::broadcast;
use tracing::{info, warn};

/// Coordinates graceful shutdown across the daemon.
pub struct ShutdownCoordinator {
    /// Sender to signal shutdown to all listeners.
    shutdown_tx: broadcast::Sender<()>,
}

impl ShutdownCoordinator {
    /// Create a new shutdown coordinator.
    pub fn new() -> Self {
        let (shutdown_tx, _) = broadcast::channel(1);
        Self { shutdown_tx }
    }

    /// Get a receiver to wait for shutdown signal.
    pub fn subscribe(&self) -> broadcast::Receiver<()> {
        self.shutdown_tx.subscribe()
    }

    /// Signal shutdown to all listeners.
    pub fn trigger(&self) {
        let _ = self.shutdown_tx.send(());
    }

    /// Wait for OS shutdown signals (SIGTERM, SIGINT, Ctrl+C).
    pub async fn wait_for_signal() {
        #[cfg(unix)]
        {
            use signal::unix::{signal, SignalKind};

            let mut sigterm = match signal(SignalKind::terminate()) {
                Ok(s) => s,
                Err(e) => {
                    tracing::error!("Failed to register SIGTERM handler: {e}");
                    std::process::exit(1);
                }
            };
            let mut sigint = match signal(SignalKind::interrupt()) {
                Ok(s) => s,
                Err(e) => {
                    tracing::error!("Failed to register SIGINT handler: {e}");
                    std::process::exit(1);
                }
            };

            tokio::select! {
                _ = sigterm.recv() => info!("Received SIGTERM"),
                _ = sigint.recv() => info!("Received SIGINT"),
                _ = signal::ctrl_c() => info!("Received Ctrl+C"),
            }
        }

        #[cfg(windows)]
        {
            if let Err(e) = signal::ctrl_c().await {
                tracing::error!("Failed to listen for Ctrl+C: {e}");
                std::process::exit(1);
            }
            info!("Received Ctrl+C");
        }
    }

    /// Initiate graceful shutdown with timeout.
    pub async fn shutdown(&self, timeout: Duration) {
        info!("Initiating graceful shutdown");
        self.trigger();

        // Give connections time to drain
        tokio::time::sleep(timeout).await;
        warn!("Shutdown timeout reached, forcing exit");
    }
}

impl Default for ShutdownCoordinator {
    fn default() -> Self {
        Self::new()
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
    use std::sync::atomic::{AtomicBool, Ordering};
    use std::sync::Arc;

    #[tokio::test]
    async fn test_shutdown_signal() {
        let coordinator = ShutdownCoordinator::new();
        let mut receiver = coordinator.subscribe();

        let received = Arc::new(AtomicBool::new(false));
        let received_clone = received.clone();

        let handle = tokio::spawn(async move {
            let _ = receiver.recv().await;
            received_clone.store(true, Ordering::SeqCst);
        });

        // Give the task time to start
        tokio::time::sleep(Duration::from_millis(10)).await;

        coordinator.trigger();

        // Wait for the task to complete
        tokio::time::timeout(Duration::from_millis(100), handle)
            .await
            .unwrap()
            .unwrap();

        assert!(received.load(Ordering::SeqCst));
    }

    #[tokio::test]
    async fn test_multiple_receivers() {
        let coordinator = ShutdownCoordinator::new();
        let mut rx1 = coordinator.subscribe();
        let mut rx2 = coordinator.subscribe();

        coordinator.trigger();

        // Both receivers should get the signal
        assert!(rx1.recv().await.is_ok());
        assert!(rx2.recv().await.is_ok());
    }
}
