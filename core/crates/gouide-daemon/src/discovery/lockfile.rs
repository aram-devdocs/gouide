//! Lock file management for daemon discovery.
//!
//! The lock file prevents multiple daemons from running simultaneously
//! and provides metadata for clients to discover the running daemon.

// Allow unsafe code for platform-specific libc calls
#![allow(unsafe_code)]

use std::fs::{self, File, OpenOptions};
use std::path::PathBuf;

use fs4::fs_std::FileExt;
use serde::{Deserialize, Serialize};
use tracing::{info, warn};

use crate::transport::default_lock_path;

/// Metadata written to the lock file for client discovery.
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

/// A held lock file that prevents other daemons from starting.
///
/// The lock is released when this struct is dropped.
pub struct LockFile {
    #[allow(dead_code)]
    file: File,
    path: PathBuf,
    metadata_path: PathBuf,
}

impl LockFile {
    /// Try to acquire the daemon lock at the default path.
    pub fn acquire() -> anyhow::Result<Self> {
        Self::acquire_at(&default_lock_path())
    }

    /// Try to acquire the daemon lock at a specific path.
    pub fn acquire_at(path: &str) -> anyhow::Result<Self> {
        let path = PathBuf::from(path);
        let metadata_path = path.with_extension("json");

        // Ensure parent directory exists
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)?;
        }

        let file = OpenOptions::new()
            .read(true)
            .write(true)
            .create(true)
            .truncate(false)
            .open(&path)?;

        // Try exclusive lock (non-blocking)
        // fs4 0.13 returns Ok(true) if acquired, Ok(false) if already locked
        let acquired = file.try_lock_exclusive().map_err(|e| {
            anyhow::anyhow!("Failed to acquire daemon lock at {}: {}", path.display(), e)
        })?;

        if !acquired {
            anyhow::bail!(
                "Failed to acquire daemon lock at {}: Another daemon may be running.",
                path.display()
            );
        }

        info!(path = %path.display(), "Acquired daemon lock");

        Ok(Self {
            file,
            path,
            metadata_path,
        })
    }

    /// Write daemon metadata atomically.
    ///
    /// Uses write-to-temp-then-rename pattern for atomicity.
    pub fn write_metadata(&self, metadata: &DaemonMetadata) -> anyhow::Result<()> {
        let json = serde_json::to_string_pretty(metadata)?;

        // Write to temp file first
        let temp_path = self.metadata_path.with_extension("tmp");
        fs::write(&temp_path, &json)?;

        // Atomic rename
        fs::rename(&temp_path, &self.metadata_path)?;

        info!(
            path = %self.metadata_path.display(),
            daemon_id = %metadata.daemon_id,
            "Wrote daemon metadata"
        );

        Ok(())
    }

    /// Get the lock file path.
    pub fn path(&self) -> &PathBuf {
        &self.path
    }

    /// Get the metadata file path.
    pub fn metadata_path(&self) -> &PathBuf {
        &self.metadata_path
    }
}

impl Drop for LockFile {
    fn drop(&mut self) {
        // Clean up metadata file
        if let Err(e) = fs::remove_file(&self.metadata_path) {
            if self.metadata_path.exists() {
                warn!(
                    path = %self.metadata_path.display(),
                    error = %e,
                    "Failed to remove metadata file"
                );
            }
        }

        // Clean up lock file
        if let Err(e) = fs::remove_file(&self.path) {
            warn!(
                path = %self.path.display(),
                error = %e,
                "Failed to remove lock file"
            );
        } else {
            info!(path = %self.path.display(), "Released daemon lock");
        }
    }
}

/// Read existing daemon metadata (for client discovery).
///
/// Returns None if the metadata doesn't exist or the daemon is not running.
#[allow(dead_code)]
pub(super) fn read_metadata(lock_path: &str) -> anyhow::Result<Option<DaemonMetadata>> {
    let metadata_path = PathBuf::from(lock_path).with_extension("json");

    if !metadata_path.exists() {
        return Ok(None);
    }

    let contents = fs::read_to_string(&metadata_path)?;
    let metadata: DaemonMetadata = serde_json::from_str(&contents)?;

    // Verify the process is still running
    if !is_process_alive(metadata.pid) {
        warn!(
            pid = metadata.pid,
            "Found stale daemon metadata, process not running"
        );
        // Clean up stale files
        let _ = fs::remove_file(&metadata_path);
        let _ = fs::remove_file(lock_path);
        return Ok(None);
    }

    Ok(Some(metadata))
}

/// Check if a process is still running.
#[cfg(unix)]
#[allow(dead_code, clippy::cast_possible_wrap)]
fn is_process_alive(pid: u32) -> bool {
    // kill with signal 0 checks if process exists without sending a signal
    #[allow(clippy::cast_possible_wrap)]
    unsafe {
        libc::kill(pid as i32, 0) == 0
    }
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

#[cfg(test)]
#[allow(
    clippy::unwrap_used,
    clippy::expect_used,
    clippy::panic,
    clippy::uninlined_format_args
)]
mod tests {
    use super::*;
    use tempfile::TempDir;

    #[test]
    fn test_acquire_lock() {
        let temp_dir = TempDir::new().unwrap();
        let lock_path = temp_dir.path().join("test.lock");

        let lock = LockFile::acquire_at(lock_path.to_str().unwrap()).unwrap();
        assert!(lock_path.exists());

        drop(lock);
        assert!(!lock_path.exists());
    }

    #[test]
    fn test_double_lock_fails() {
        let temp_dir = TempDir::new().unwrap();
        let lock_path = temp_dir.path().join("double.lock");

        let _lock1 = LockFile::acquire_at(lock_path.to_str().unwrap()).unwrap();

        // Second lock should fail
        let result = LockFile::acquire_at(lock_path.to_str().unwrap());
        assert!(result.is_err());
    }

    #[test]
    fn test_write_and_read_metadata() {
        let temp_dir = TempDir::new().unwrap();
        let lock_path = temp_dir.path().join("meta.lock");
        let lock_path_str = lock_path.to_str().unwrap();

        let lock = LockFile::acquire_at(lock_path_str).unwrap();

        let metadata = DaemonMetadata {
            pid: std::process::id(),
            start_time: chrono::Utc::now().timestamp(),
            protocol_version: "1.0.0".to_string(),
            endpoint: "/tmp/test.sock".to_string(),
            daemon_id: "test-daemon".to_string(),
        };

        lock.write_metadata(&metadata).unwrap();

        // Read it back
        let read_meta = read_metadata(lock_path_str).unwrap().unwrap();
        assert_eq!(read_meta.daemon_id, "test-daemon");
        assert_eq!(read_meta.protocol_version, "1.0.0");

        drop(lock);

        // After drop, metadata should be cleaned up
        assert!(read_metadata(lock_path_str).unwrap().is_none());
    }

    #[test]
    fn test_is_process_alive() {
        // Current process should be alive
        assert!(is_process_alive(std::process::id()));

        // Note: We can't reliably test for "not alive" PIDs because:
        // - u32::MAX might wrap or behave unexpectedly on some systems
        // - kill(pid, 0) returns ESRCH for non-existent PIDs but that's system-dependent
        // The important test is that our own PID is detected as alive.
    }
}
