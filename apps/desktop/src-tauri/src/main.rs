//! Gouide Desktop application entry point.

// Prevents additional console window on Windows in release
#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]
// Binary doesn't directly use all lib dependencies
#![allow(unused_crate_dependencies)]
// Tauri's generated context has large stack frames
#![allow(clippy::large_stack_frames)]

#[allow(unreachable_pub)]
mod bridge;

use tauri::Manager;
use tracing::info;

use bridge::settings::load_settings;
use bridge::tray::create_tray;

fn main() {
    // Initialize tracing for logging
    #[allow(clippy::unwrap_used)]
    {
        tracing_subscriber::fmt()
            .with_env_filter(
                tracing_subscriber::EnvFilter::from_default_env()
                    .add_directive("gouide_desktop=debug".parse().unwrap())
                    .add_directive("tonic=info".parse().unwrap()),
            )
            .init();
    }

    info!("Starting Gouide Desktop");

    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_single_instance::init(|app, _argv, _cwd| {
            // When a second instance tries to launch, focus the existing window
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
        }))
        .setup(|app| {
            // Create system tray
            if let Err(e) = create_tray(app.handle()) {
                tracing::error!("Failed to create tray: {}", e);
            }

            info!("App setup complete");
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                let app = window.app_handle();
                let settings = load_settings(app);

                if settings.quit_on_close {
                    // Let the close proceed normally - will quit the app
                    info!("Window close requested, quitting app");
                } else {
                    // Prevent close and hide to tray instead
                    api.prevent_close();
                    let _ = window.hide();
                    info!("Window hidden to tray");
                }
            }
        })
        .invoke_handler(tauri::generate_handler![
            bridge::commands::discover_daemon,
            bridge::commands::connect,
            bridge::commands::disconnect,
            bridge::commands::ping,
            bridge::commands::is_connected,
            bridge::commands::ensure_and_connect,
            bridge::commands::get_settings,
            bridge::commands::set_settings,
            bridge::commands::shutdown_daemon,
        ])
        .run(tauri::generate_context!())
        .unwrap_or_else(|e| {
            tracing::error!("Fatal error while running Tauri application: {e}");
            std::process::exit(1);
        });
}
