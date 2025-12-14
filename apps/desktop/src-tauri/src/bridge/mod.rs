//! Bridge module connecting Tauri frontend to gouide-daemon.
//!
//! This module provides:
//! - Daemon discovery via lock file
//! - gRPC client for daemon communication
//! - Tauri commands exposed to the frontend

pub mod client;
pub mod commands;
pub mod discovery;
