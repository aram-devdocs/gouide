/**
 * @gouide/frontend-state
 * Shared state management
 */

export type { Command, CommandCategory, CommandRegistry } from "./commandRegistry";
export { commandRegistry } from "./commandRegistry";
export type {
  PanelConfig,
  PanelContent,
  PanelId,
  PanelPosition,
  PanelState,
} from "./panelManager";
export {
  createInitialPanelState,
  DEFAULT_PANEL_SIZES,
  DEFAULT_PANELS,
  deserializePanelState,
  MAX_PANEL_SIZES,
  MIN_PANEL_SIZES,
  STORAGE_KEYS,
  serializePanelState,
} from "./panelManager";
