/**
 * Templates - STRICT MODE: Template-only exports
 *
 * STRICT TEMPLATE ARCHITECTURE:
 * Apps can ONLY import templates from this package.
 * Atoms, molecules, and organisms are internal implementation details.
 *
 * Templates accept data from hooks and manage their own UI state.
 * They handle expansion, hover, dirty indicators, etc. internally.
 *
 * Rules:
 * - Templates receive data via props (from hooks)
 * - Templates manage UI state internally
 * - Templates do NOT fetch data or have business logic
 * - Apps should ONLY import AppShell (or specific templates if needed)
 */

// Main application shell - apps typically only need this
export type {
  AppShellProps,
  DaemonData,
  WorkspaceData,
} from "./AppShell";
export { AppShell } from "./AppShell";
export type { CommandPaletteTemplateProps } from "./CommandPaletteTemplate";
export { CommandPaletteTemplate } from "./CommandPaletteTemplate";
export type { EditorAreaTemplateProps } from "./EditorAreaTemplate";
export { EditorAreaTemplate } from "./EditorAreaTemplate";
export type { EditorLayoutProps } from "./EditorLayout";
export { EditorLayout } from "./EditorLayout";
// Utility templates
export type { EmptyStateProps } from "./EmptyState";
export { EmptyState } from "./EmptyState";
export type { MonacoEditorTemplateProps } from "./MonacoEditorTemplate";
export { MonacoEditorTemplate } from "./MonacoEditorTemplate";
export type { PanelLayoutProps } from "./PanelLayout";
export { PanelLayout } from "./PanelLayout";
// Individual templates (for advanced use cases)
export type { SidebarTemplateProps } from "./SidebarTemplate";
export { SidebarTemplate } from "./SidebarTemplate";
export type { StatusBarTemplateProps } from "./StatusBarTemplate";
export { StatusBarTemplate } from "./StatusBarTemplate";
