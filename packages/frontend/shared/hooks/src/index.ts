/**
 * @gouide/frontend-hooks
 * Shared React hooks for workspace and daemon management
 */

export type { ConnectionState, DaemonInfo } from "@gouide/core-client";
export {
  ANIMATION_DURATION,
  useAnimateOnMount,
  useDelayedVisibility,
  useStaggeredDelay,
} from "./useAnimation";
export type { CommandPaletteState, UseCommandPaletteReturn } from "./useCommandPalette";
export { useCommandPalette } from "./useCommandPalette";
export {
  DaemonProvider,
  useDaemonConnection,
} from "./useDaemonConnection";
export {
  type UseEditorAutoSaveOptions,
  type UseEditorAutoSaveReturn,
  useEditorAutoSave,
} from "./useEditorAutoSave";
export {
  type UseFileSearchReturn,
  useFileSearch,
} from "./useFileSearch";
export {
  type UseFileTreeExpansionOptions,
  type UseFileTreeExpansionReturn,
  useFileTreeExpansion,
} from "./useFileTreeExpansion";
export type { Keybinding, ShortcutHandler } from "./useKeyboardShortcuts";
export { matchesKeybinding, parseKeybinding, useKeyboardShortcuts } from "./useKeyboardShortcuts";
export type { UsePanelManagerReturn } from "./usePanelManager";
export { usePanelManager } from "./usePanelManager";
export type { SpringConfig, UseSpringReturn } from "./useSpring";
export { SPRING_PRESETS, useSpring } from "./useSpring";
export type { UseThemeReturn } from "./useTheme";
export { useTheme } from "./useTheme";
export {
  type Buffer,
  type FileTreeNode,
  useWorkspace,
  WorkspaceProvider,
} from "./useWorkspace";
