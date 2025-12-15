//! User settings persistence using tauri-plugin-store.

use serde::{Deserialize, Serialize};
use tauri::AppHandle;
use tauri_plugin_store::StoreExt;
use tracing::{debug, warn};

const SETTINGS_FILE: &str = "settings.json";
const SETTINGS_KEY: &str = "app_settings";

/// Application settings.
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AppSettings {
    /// If true, closing the window quits the app entirely.
    /// If false, closing minimizes to system tray.
    #[serde(default)]
    pub quit_on_close: bool,

    /// If true, start minimized to tray (no window shown).
    #[serde(default)]
    pub start_minimized: bool,
}

impl Default for AppSettings {
    fn default() -> Self {
        Self {
            quit_on_close: false, // Default: minimize to tray
            start_minimized: false,
        }
    }
}

/// Load settings from store, returning defaults if not found.
pub fn load_settings(app: &AppHandle) -> AppSettings {
    let store = match app.store(SETTINGS_FILE) {
        Ok(s) => s,
        Err(e) => {
            warn!("Failed to open settings store: {}", e);
            return AppSettings::default();
        }
    };

    match store.get(SETTINGS_KEY) {
        Some(value) => match serde_json::from_value(value.clone()) {
            Ok(settings) => {
                debug!("Loaded settings: {:?}", settings);
                settings
            }
            Err(e) => {
                warn!("Failed to parse settings: {}", e);
                AppSettings::default()
            }
        },
        None => {
            debug!("No settings found, using defaults");
            AppSettings::default()
        }
    }
}

/// Save settings to store.
pub fn save_settings(app: &AppHandle, settings: &AppSettings) -> Result<(), String> {
    let store = app
        .store(SETTINGS_FILE)
        .map_err(|e| format!("Failed to open settings store: {}", e))?;

    let value = serde_json::to_value(settings)
        .map_err(|e| format!("Failed to serialize settings: {}", e))?;

    store.set(SETTINGS_KEY, value);
    store
        .save()
        .map_err(|e| format!("Failed to save settings: {}", e))?;

    debug!("Saved settings: {:?}", settings);
    Ok(())
}
