/**
 * @gouide/frontend-state
 * Shared state management
 */

export type { Command, CommandCategory, CommandRegistry } from "./commandRegistry";
export { commandRegistry } from "./commandRegistry";
export type {
  MoveResult,
  PanelConfig,
  PanelContent,
  PanelId,
  PanelPosition,
  PanelPositionConstraints,
  PanelState,
} from "./panelManager";
export {
  createInitialPanelState,
  DEFAULT_PANEL_SIZES,
  DEFAULT_PANELS,
  deserializePanelState,
  MAX_PANEL_SIZES,
  MIN_PANEL_SIZES,
  resolvePositionConflict,
  STORAGE_KEYS,
  serializePanelState,
} from "./panelManager";
export type { ThemeRegistry } from "./themeRegistry";
export { themeRegistry } from "./themeRegistry";
