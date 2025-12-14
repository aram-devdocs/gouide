// Prevents additional console window on Windows in release
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod bridge;

use tracing::info;

fn main() {
    // Initialize tracing for logging
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::from_default_env()
                .add_directive("gouide_desktop=debug".parse().unwrap())
                .add_directive("tonic=info".parse().unwrap()),
        )
        .init();

    info!("Starting Gouide Desktop");

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            bridge::commands::discover_daemon,
            bridge::commands::connect,
            bridge::commands::disconnect,
            bridge::commands::ping,
            bridge::commands::is_connected,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
