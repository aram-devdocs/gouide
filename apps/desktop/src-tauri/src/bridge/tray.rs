//! System tray icon and menu management.

use tauri::{
    image::Image,
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIcon, TrayIconBuilder, TrayIconEvent},
    AppHandle, Emitter, Manager,
};
use tracing::{debug, error, info};

/// Tray menu item IDs
const MENU_SHOW: &str = "show";
const MENU_QUIT: &str = "quit";

/// Create and configure the system tray icon.
pub fn create_tray(app: &AppHandle) -> Result<TrayIcon, Box<dyn std::error::Error>> {
    // Create menu items
    let show_item = MenuItem::with_id(app, MENU_SHOW, "Show Window", true, None::<&str>)?;
    let quit_item = MenuItem::with_id(app, MENU_QUIT, "Quit", true, None::<&str>)?;

    // Build menu
    let menu = Menu::with_items(app, &[&show_item, &quit_item])?;

    // Load icon - use the app's default icon
    let icon = load_tray_icon()?;

    // Build tray icon
    let tray = TrayIconBuilder::new()
        .icon(icon)
        .menu(&menu)
        .tooltip("Gouide")
        .on_menu_event(|app, event| {
            handle_menu_event(app, event.id.as_ref());
        })
        .on_tray_icon_event(|tray, event| {
            handle_tray_event(tray.app_handle(), event);
        })
        .build(app)?;

    info!("System tray initialized");
    Ok(tray)
}

/// Load the tray icon from embedded bytes.
fn load_tray_icon() -> Result<Image<'static>, Box<dyn std::error::Error>> {
    // For now, use a simple embedded PNG icon
    // In production, this would be the actual Gouide icon
    // Tauri expects RGBA image data

    // Create a simple 32x32 blue square icon as placeholder
    // In production, replace with: Image::from_path("icons/32x32.png")
    let size = 32u32;
    let mut rgba = Vec::with_capacity((size * size * 4) as usize);
    for y in 0..size {
        for x in 0..size {
            // Create a simple gradient icon (blue-ish)
            let is_border = x == 0 || x == size - 1 || y == 0 || y == size - 1;
            if is_border {
                // Border: darker blue
                rgba.extend_from_slice(&[30, 60, 120, 255]);
            } else {
                // Fill: lighter blue
                rgba.extend_from_slice(&[60, 120, 200, 255]);
            }
        }
    }

    Ok(Image::new_owned(rgba, size, size))
}

/// Handle tray menu item clicks.
fn handle_menu_event(app: &AppHandle, menu_id: &str) {
    debug!("Tray menu event: {}", menu_id);

    match menu_id {
        MENU_SHOW => {
            show_window(app);
        }
        MENU_QUIT => {
            quit_app(app);
        }
        _ => {
            debug!("Unknown menu item: {}", menu_id);
        }
    }
}

/// Handle tray icon click events.
fn handle_tray_event(app: &AppHandle, event: TrayIconEvent) {
    match event {
        TrayIconEvent::Click {
            button: MouseButton::Left,
            button_state: MouseButtonState::Up,
            ..
        } => {
            debug!("Tray icon left-clicked");
            show_window(app);
        }
        TrayIconEvent::DoubleClick {
            button: MouseButton::Left,
            ..
        } => {
            debug!("Tray icon double-clicked");
            show_window(app);
        }
        _ => {}
    }
}

/// Show the main window and bring it to foreground.
fn show_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
        debug!("Window shown and focused");
    } else {
        error!("Main window not found");
    }
}

/// Quit the application completely.
fn quit_app(app: &AppHandle) {
    info!("Quitting application from tray");

    // Emit event to allow cleanup
    let _ = app.emit("app-quit", ());

    // Stop the daemon
    if let Err(e) = super::lifecycle::stop_daemon() {
        error!("Failed to stop daemon: {}", e);
    }

    // Exit the app
    app.exit(0);
}
