//! Daemon lifecycle management: attach-or-spawn logic.

// Allow unsafe code for platform-specific libc calls
#![allow(unsafe_code)]

use std::path::PathBuf;
use std::sync::OnceLock;
use std::time::Duration;
use tauri::AppHandle;
use tokio::sync::Mutex;
use tokio::time::sleep;
use tracing::{debug, error, info};

use super::discovery::{default_lock_path, discover_daemon, DaemonMetadata};

/// Global mutex to ensure only one daemon spawn happens at a time.
static DAEMON_ENSURE_LOCK: OnceLock<Mutex<()>> = OnceLock::new();

fn get_ensure_lock() -> &'static Mutex<()> {
    DAEMON_ENSURE_LOCK.get_or_init(|| Mutex::new(()))
}

/// Maximum time to wait for daemon socket to become available.
const SOCKET_READY_TIMEOUT: Duration = Duration::from_secs(3);
/// Polling interval when waiting for socket.
const SOCKET_POLL_INTERVAL: Duration = Duration::from_millis(100);

/// Result of daemon startup attempt.
#[derive(Debug)]
pub enum DaemonStartResult {
    /// Daemon was already running.
    AlreadyRunning(DaemonMetadata),
    /// Daemon was spawned and is now ready.
    Spawned(DaemonMetadata),
    /// Failed to start daemon.
    Failed(String),
}

/// Get the path to the daemon binary.
///
/// In dev mode: looks for `core/target/release/gouide-daemon` or `debug/`
/// In production: uses the bundled sidecar
fn get_daemon_path(_app: &AppHandle) -> Result<PathBuf, String> {
    // In dev mode, we need to find the daemon binary relative to the project root.
    // The Tauri app runs from apps/desktop/src-tauri, so we walk up to find the workspace root.

    // Try to find via current working directory first (most reliable in dev)
    if let Ok(cwd) = std::env::current_dir() {
        // Try common development layouts
        for relative in &[
            "core/target/release/gouide-daemon",
            "core/target/debug/gouide-daemon",
            "../core/target/release/gouide-daemon",
            "../core/target/debug/gouide-daemon",
            "../../core/target/release/gouide-daemon",
            "../../core/target/debug/gouide-daemon",
            "../../../core/target/release/gouide-daemon",
            "../../../core/target/debug/gouide-daemon",
        ] {
            let path = cwd.join(relative);
            if path.exists() {
                debug!("Using daemon path relative to cwd: {:?}", path);
                return Ok(path);
            }
        }
    }

    // Try via executable path (useful when running from a different directory)
    if let Ok(exe_path) = std::env::current_exe() {
        if let Some(exe_dir) = exe_path.parent() {
            // In dev mode, exe is at apps/desktop/src-tauri/target/debug/gouide-desktop
            // Walk up to find workspace root
            let mut search_path = exe_dir.to_path_buf();
            for _ in 0..8 {
                for subpath in &[
                    "core/target/release/gouide-daemon",
                    "core/target/debug/gouide-daemon",
                ] {
                    let daemon_path = search_path.join(subpath);
                    if daemon_path.exists() {
                        debug!("Using daemon path relative to exe: {:?}", daemon_path);
                        return Ok(daemon_path);
                    }
                }
                if !search_path.pop() {
                    break;
                }
            }

            // In production, sidecar would be next to the executable
            let sidecar_path = exe_dir.join("gouide-daemon");
            if sidecar_path.exists() {
                debug!("Using bundled sidecar: {:?}", sidecar_path);
                return Ok(sidecar_path);
            }
        }
    }

    Err(
        "Could not locate gouide-daemon binary. Build it with: cargo build --release -p gouide-daemon"
            .to_string(),
    )
}

/// Get the expected socket path for the daemon.
fn get_socket_path() -> PathBuf {
    let lock_path = default_lock_path();
    PathBuf::from(lock_path).with_extension("sock")
}

/// Wait for the daemon socket to become available.
async fn wait_for_socket() -> bool {
    let socket_path = get_socket_path();
    let start = std::time::Instant::now();

    while start.elapsed() < SOCKET_READY_TIMEOUT {
        if socket_path.exists() {
            debug!("Daemon socket is ready at {:?}", socket_path);
            return true;
        }
        sleep(SOCKET_POLL_INTERVAL).await;
    }

    false
}

/// Ensure the runtime directory exists.
fn ensure_runtime_dir() -> Result<PathBuf, String> {
    let lock_path = default_lock_path();
    let runtime_dir = PathBuf::from(&lock_path)
        .parent()
        .ok_or_else(|| "Invalid lock path".to_string())?
        .to_path_buf();

    if !runtime_dir.exists() {
        std::fs::create_dir_all(&runtime_dir)
            .map_err(|e| format!("Failed to create runtime dir: {}", e))?;

        // Set permissions on Unix
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            std::fs::set_permissions(&runtime_dir, std::fs::Permissions::from_mode(0o700))
                .map_err(|e| format!("Failed to set runtime dir permissions: {}", e))?;
        }
    }

    Ok(runtime_dir)
}

/// Spawn the daemon process.
async fn spawn_daemon(app: &AppHandle) -> Result<(), String> {
    let daemon_path = get_daemon_path(app)?;
    let runtime_dir = ensure_runtime_dir()?;

    info!("Spawning daemon from: {:?}", daemon_path);

    // Open log file for daemon output
    let log_path = runtime_dir.join("daemon.log");
    let log_file = std::fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open(&log_path)
        .map_err(|e| format!("Failed to open log file: {}", e))?;

    let log_file_err = log_file
        .try_clone()
        .map_err(|e| format!("Failed to clone log file handle: {}", e))?;

    // Spawn daemon as detached process
    let child = std::process::Command::new(&daemon_path)
        .stdout(std::process::Stdio::from(log_file))
        .stderr(std::process::Stdio::from(log_file_err))
        .stdin(std::process::Stdio::null())
        .spawn()
        .map_err(|e| format!("Failed to spawn daemon: {}", e))?;

    info!("Daemon spawned with PID: {}", child.id());

    // Wait for socket to become ready
    if !wait_for_socket().await {
        return Err(format!(
            "Daemon spawned but socket not ready after {:?}. Check logs at {:?}",
            SOCKET_READY_TIMEOUT, log_path
        ));
    }

    Ok(())
}

/// Ensure a daemon is running, spawning one if necessary.
///
/// Returns the daemon metadata on success.
/// Uses a global lock to prevent multiple simultaneous spawn attempts.
pub async fn ensure_daemon(app: &AppHandle) -> DaemonStartResult {
    // Acquire lock to prevent concurrent spawn attempts
    let _guard = get_ensure_lock().lock().await;

    // Check if a daemon is already running (recheck after acquiring lock)
    if let Some(metadata) = discover_daemon() {
        info!(
            daemon_id = %metadata.daemon_id,
            pid = metadata.pid,
            "Found existing daemon"
        );
        return DaemonStartResult::AlreadyRunning(metadata);
    }

    // No daemon running, spawn one
    info!("No daemon running, spawning...");

    match spawn_daemon(app).await {
        Ok(()) => {
            // Verify daemon is now discoverable
            if let Some(metadata) = discover_daemon() {
                info!(
                    daemon_id = %metadata.daemon_id,
                    pid = metadata.pid,
                    "Daemon spawned and ready"
                );
                DaemonStartResult::Spawned(metadata)
            } else {
                DaemonStartResult::Failed("Daemon spawned but not discoverable".to_string())
            }
        }
        Err(e) => {
            error!("Failed to spawn daemon: {}", e);
            DaemonStartResult::Failed(e)
        }
    }
}

/// Stop the daemon if it's running.
pub fn stop_daemon() -> Result<(), String> {
    if let Some(metadata) = discover_daemon() {
        info!(pid = metadata.pid, "Stopping daemon");

        #[cfg(unix)]
        {
            // Send SIGTERM for graceful shutdown
            let result = unsafe { libc::kill(metadata.pid as i32, libc::SIGTERM) };
            if result != 0 {
                return Err(format!(
                    "Failed to send SIGTERM to daemon (pid {})",
                    metadata.pid
                ));
            }
        }

        #[cfg(windows)]
        {
            use tracing::warn;
            // On Windows, we'd use TerminateProcess or send a message via named pipe
            // For MVP, just log a warning - the daemon will exit when the app closes
            warn!("Daemon stop via signal not implemented on Windows, daemon will exit on its own");
        }
    }

    Ok(())
}
