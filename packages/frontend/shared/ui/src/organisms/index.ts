/**
 * Organisms - complex UI sections composed from molecules and atoms
 *
 * Organisms represent complete, standalone UI sections like navigation bars,
 * sidebars, file tree panels, or editor panels.
 *
 * Rules:
 * - Import from ../atoms/*, ../molecules/*, or other organisms
 * - Cannot import primitives directly
 * - Can have component state for UI interactions
 * - Accept data via props (no fetching)
 * - Represent complete UI sections
 */

export type { CommandPaletteProps } from "./CommandPalette";
export { CommandPalette } from "./CommandPalette";
export type { EditorPanelProps } from "./EditorPanel";
export { EditorPanel } from "./EditorPanel";
export type { FileTreeNode, FileTreePanelProps } from "./FileTreePanel";
export { FileTreePanel } from "./FileTreePanel";
export type { GlassSidebarProps } from "./GlassSidebar";
export { GlassSidebar } from "./GlassSidebar";
export type { NavBarProps } from "./NavBar";
export { NavBar } from "./NavBar";
export type { SettingsPanelProps } from "./SettingsPanel";
export { SettingsPanel } from "./SettingsPanel";
export type { SidebarProps } from "./Sidebar";
export { Sidebar } from "./Sidebar";
export type { StatusBarProps } from "./StatusBar";
export { StatusBar } from "./StatusBar";
export type { ThemeSelectorProps } from "./ThemeSelector";
export { ThemeSelector } from "./ThemeSelector";
