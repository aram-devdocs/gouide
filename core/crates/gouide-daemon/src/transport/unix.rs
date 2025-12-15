//! Unix domain socket transport implementation.

use std::fs;
use std::os::unix::fs::PermissionsExt;
use std::path::PathBuf;

use tokio::net::{UnixListener as TokioUnixListener, UnixStream};
use tracing::{info, warn};

use super::default_endpoint_path;

/// Unix domain socket listener for the daemon.
pub struct UnixListener {
    listener: TokioUnixListener,
    path: PathBuf,
}

impl UnixListener {
    /// Bind to the default socket path.
    ///
    /// Creates the parent directory with user-only permissions (0700),
    /// removes any stale socket file, and binds the listener.
    pub fn bind() -> anyhow::Result<Self> {
        Self::bind_at(&default_endpoint_path())
    }

    /// Bind to a specific socket path.
    pub fn bind_at(path: &str) -> anyhow::Result<Self> {
        let path = PathBuf::from(path);

        // Ensure parent directory exists with correct permissions
        if let Some(parent) = path.parent() {
            if !parent.exists() {
                fs::create_dir_all(parent)?;
                info!(path = %parent.display(), "Created daemon socket directory");
            }
            // Set directory permissions to user-only (0700)
            fs::set_permissions(parent, fs::Permissions::from_mode(0o700))?;
        }

        // Remove stale socket file if exists
        if path.exists() {
            warn!(path = %path.display(), "Removing stale socket file");
            fs::remove_file(&path)?;
        }

        // Bind the listener
        let listener = TokioUnixListener::bind(&path)?;
        info!(path = %path.display(), "Daemon listening on Unix socket");

        // Set socket file permissions to user-only (0600)
        fs::set_permissions(&path, fs::Permissions::from_mode(0o600))?;

        Ok(Self { listener, path })
    }

    /// Accept the next incoming connection.
    pub async fn accept(&self) -> std::io::Result<UnixStream> {
        let (stream, _addr) = self.listener.accept().await?;
        Ok(stream)
    }

    /// Get the socket path.
    pub fn path(&self) -> &PathBuf {
        &self.path
    }

    /// Get the endpoint string for discovery metadata.
    pub fn endpoint(&self) -> String {
        self.path.to_string_lossy().to_string()
    }
}

impl Drop for UnixListener {
    fn drop(&mut self) {
        // Clean up the socket file on shutdown
        if let Err(e) = fs::remove_file(&self.path) {
            warn!(
                path = %self.path.display(),
                error = %e,
                "Failed to remove socket file on shutdown"
            );
        } else {
            info!(path = %self.path.display(), "Removed socket file");
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

    #[tokio::test]
    async fn test_unix_listener_bind() {
        let temp_dir = TempDir::new().unwrap();
        let socket_path = temp_dir.path().join("test.sock");

        let listener = UnixListener::bind_at(socket_path.to_str().unwrap()).unwrap();

        assert!(socket_path.exists());
        assert_eq!(listener.endpoint(), socket_path.to_string_lossy());

        // Check permissions
        let metadata = fs::metadata(&socket_path).unwrap();
        let permissions = metadata.permissions();
        assert_eq!(permissions.mode() & 0o777, 0o600);

        drop(listener);
        assert!(!socket_path.exists());
    }

    #[tokio::test]
    async fn test_unix_listener_removes_stale_socket() {
        let temp_dir = TempDir::new().unwrap();
        let socket_path = temp_dir.path().join("stale.sock");

        // Create a stale file
        fs::write(&socket_path, "stale").unwrap();
        assert!(socket_path.exists());

        // Binding should remove it and succeed
        let listener = UnixListener::bind_at(socket_path.to_str().unwrap()).unwrap();

        assert!(socket_path.exists());
        drop(listener);
    }
}
