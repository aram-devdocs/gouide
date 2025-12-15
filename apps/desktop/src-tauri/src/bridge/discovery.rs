//! Daemon discovery via lock file.
//!
//! Reads the daemon metadata file to find a running daemon instance.

// Allow unsafe code for platform-specific libc calls
#![allow(unsafe_code)]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

/// Metadata about a running daemon instance.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct DaemonMetadata {
    /// Process ID of the daemon.
    pub pid: u32,
    /// Unix timestamp when the daemon started.
    pub start_time: i64,
    /// Protocol version the daemon implements.
    pub protocol_version: String,
    /// IPC endpoint path (socket or named pipe).
    pub endpoint: String,
    /// Unique identifier for this daemon instance.
    pub daemon_id: String,
}

/// Get the default lock file path for the current platform and user.
pub fn default_lock_path() -> String {
    #[cfg(unix)]
    {
        let uid = unsafe { libc::getuid() };
        format!("/tmp/gouide-{}/daemon.lock", uid)
    }
    #[cfg(windows)]
    {
        let username = std::env::var("USERNAME").unwrap_or_else(|_| "user".to_string());
        let local_app_data = std::env::var("LOCALAPPDATA")
            .unwrap_or_else(|_| format!(r"C:\Users\{}\AppData\Local", username));
        format!(r"{}\Gouide\daemon.lock", local_app_data)
    }
}

/// Check if a process is still running.
#[cfg(unix)]
fn is_process_alive(pid: u32) -> bool {
    // kill with signal 0 checks if process exists without sending a signal
    unsafe { libc::kill(pid as i32, 0) == 0 }
}

#[cfg(windows)]
fn is_process_alive(pid: u32) -> bool {
    use std::ptr::null_mut;
    unsafe {
        let handle = windows_sys::Win32::System::Threading::OpenProcess(
            windows_sys::Win32::System::Threading::PROCESS_QUERY_LIMITED_INFORMATION,
            0,
            pid,
        );
        if handle.is_null() {
            false
        } else {
            windows_sys::Win32::Foundation::CloseHandle(handle);
            true
        }
    }
}

/// Discover a running daemon by reading the lock file metadata.
///
/// Returns `None` if no daemon is running or the metadata is stale.
pub fn discover_daemon() -> Option<DaemonMetadata> {
    let lock_path = default_lock_path();
    let metadata_path = PathBuf::from(&lock_path).with_extension("json");

    if !metadata_path.exists() {
        tracing::debug!("No daemon metadata file at {:?}", metadata_path);
        return None;
    }

    let contents = match fs::read_to_string(&metadata_path) {
        Ok(c) => c,
        Err(e) => {
            tracing::warn!("Failed to read daemon metadata: {}", e);
            return None;
        }
    };

    let metadata: DaemonMetadata = match serde_json::from_str(&contents) {
        Ok(m) => m,
        Err(e) => {
            tracing::warn!("Failed to parse daemon metadata: {}", e);
            return None;
        }
    };

    // Verify the process is still running
    if !is_process_alive(metadata.pid) {
        tracing::info!(
            pid = metadata.pid,
            "Found stale daemon metadata, process not running"
        );
        // Clean up stale files
        let _ = fs::remove_file(&metadata_path);
        let _ = fs::remove_file(&lock_path);
        return None;
    }

    tracing::info!(
        daemon_id = %metadata.daemon_id,
        endpoint = %metadata.endpoint,
        protocol_version = %metadata.protocol_version,
        "Discovered running daemon"
    );

    Some(metadata)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_lock_path_format() {
        let path = default_lock_path();
        #[cfg(unix)]
        assert!(path.starts_with("/tmp/gouide-"));
        #[cfg(windows)]
        assert!(path.contains("Gouide"));
    }
}
