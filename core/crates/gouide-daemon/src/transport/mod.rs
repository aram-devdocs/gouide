//! Platform-specific transport layer for daemon IPC.
//!
//! On Unix systems, we use Unix domain sockets.
//! On Windows, we use named pipes (future implementation).

#[cfg(unix)]
mod unix;

#[cfg(unix)]
pub use unix::*;

/// Get the default endpoint path for this platform and user.
pub fn default_endpoint_path() -> String {
    #[cfg(unix)]
    {
        let uid = unsafe { libc::getuid() };
        format!("/tmp/gouide-{}/daemon.sock", uid)
    }
    #[cfg(windows)]
    {
        let username = std::env::var("USERNAME").unwrap_or_else(|_| "user".to_string());
        format!(r"\\.\pipe\gouide-{}", username)
    }
}

/// Get the default lock file path for this platform and user.
pub fn default_lock_path() -> String {
    #[cfg(unix)]
    {
        let uid = unsafe { libc::getuid() };
        format!("/tmp/gouide-{}/daemon.lock", uid)
    }
    #[cfg(windows)]
    {
        let username = std::env::var("USERNAME").unwrap_or_else(|_| "user".to_string());
        let local_app_data =
            std::env::var("LOCALAPPDATA").unwrap_or_else(|_| format!(r"C:\Users\{}\AppData\Local", username));
        format!(r"{}\Gouide\daemon.lock", local_app_data)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_endpoint_path_format() {
        let path = default_endpoint_path();
        #[cfg(unix)]
        assert!(path.starts_with("/tmp/gouide-"));
        #[cfg(windows)]
        assert!(path.starts_with(r"\\.\pipe\gouide-"));
    }
}
