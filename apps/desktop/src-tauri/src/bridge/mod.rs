//! Bridge module connecting Tauri frontend to gouide-daemon.
//!
//! This module provides:
//! - Daemon discovery via lock file
//! - Daemon lifecycle management (attach-or-spawn)
//! - gRPC client for daemon communication
//! - System tray icon and menu
//! - User settings persistence
//! - Tauri commands exposed to the frontend

pub mod client;
pub mod commands;
pub mod discovery;
pub mod lifecycle;
pub mod settings;
pub mod tray;
