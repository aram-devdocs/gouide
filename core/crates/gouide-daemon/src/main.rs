//! Gouide daemon entry point.

use gouide_daemon::{DaemonConfig, DaemonServer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt, EnvFilter};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")))
        .with(tracing_subscriber::fmt::layer())
        .init();

    tracing::info!(
        version = env!("CARGO_PKG_VERSION"),
        "Starting Gouide daemon"
    );

    // Load configuration (from defaults for now, future: env/args)
    let config = DaemonConfig::default();

    // Create and run the server
    let server = DaemonServer::new(config);
    server.run().await?;

    tracing::info!("Gouide daemon shutdown complete");
    Ok(())
}
