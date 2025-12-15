/**
 * AppShell template
 * Main application layout with zen mode, panels, and command palette
 *
 * STRICT TEMPLATE ARCHITECTURE:
 * Apps should ONLY import AppShell and pass hook return values.
 * AppShell internally composes all other templates.
 */

import {
  type Buffer,
  type ConnectionState,
  type DaemonInfo,
  type FileTreeNode,
  useCommandPalette,
  useKeyboardShortcuts,
  usePanelManager,
} from "@gouide/frontend-hooks";
import { commandRegistry } from "@gouide/frontend-state";
import { useEffect } from "react";
import { Box } from "../atoms/Box";
import { Divider } from "../atoms/Divider";
import { Text } from "../atoms/Text";
import { GlassSidebar } from "../organisms/GlassSidebar";
import { CommandPaletteTemplate } from "./CommandPaletteTemplate";
import { EditorAreaTemplate } from "./EditorAreaTemplate";
import { PanelLayout } from "./PanelLayout";
import { SidebarTemplate } from "./SidebarTemplate";
import { StatusBarTemplate } from "./StatusBarTemplate";

/** Workspace data from useWorkspace hook */
export interface WorkspaceData {
  workspacePath: string | null;
  files: FileTreeNode[];
  openBuffers: Map<string, Buffer>;
  activeBufferId: string | null;
  isDirty: Set<string>;
  openWorkspace: () => Promise<void>;
  openFile: (path: string) => Promise<void>;
  closeFile: (path: string) => void;
  saveFile: (path: string, content: string) => Promise<void>;
  setActiveFile: (path: string) => void;
  updateBufferContent: (path: string, content: string) => void;
  loadDirectoryChildren: (path: string) => Promise<void>;
}

/** Daemon connection data from useDaemonConnection hook */
export interface DaemonData {
  state: ConnectionState;
  daemonInfo: DaemonInfo | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  retry: () => Promise<void>;
}

export interface AppShellProps {
  /** Workspace data from useWorkspace hook */
  workspace: WorkspaceData;
  /** Daemon connection data from useDaemonConnection hook */
  daemon: DaemonData;
}

/**
 * AppShell - complete application shell
 *
 * The ONLY template apps should import. Accepts hook return values
 * and internally composes all other templates with panels and
 * command palette.
 *
 * Features:
 * - Minimalist by default (editor only, panels hidden)
 * - Command palette (Cmd+K)
 * - Panel management (Cmd+B for file tree, Cmd+J for terminal, etc.)
 * - Glass UI with backdrop blur
 * - Keyboard-first workflow
 *
 * @example
 * ```tsx
 * import { AppShell } from "@gouide/frontend-ui";
 * import { useWorkspace, useDaemonConnection } from "@gouide/frontend-hooks";
 *
 * export default function App() {
 *   const workspace = useWorkspace();
 *   const daemon = useDaemonConnection();
 *
 *   return <AppShell workspace={workspace} daemon={daemon} />;
 * }
 * ```
 */
export function AppShell({ workspace, daemon }: AppShellProps) {
  // Panel management
  const panels = usePanelManager();

  // Command palette
  const palette = useCommandPalette();

  // Compute active buffer from workspace state
  const activeBuffer = workspace.activeBufferId
    ? (workspace.openBuffers.get(workspace.activeBufferId) ?? null)
    : null;

  // Register file commands from workspace
  useEffect(() => {
    // Register files as commands for quick access
    const fileCommands: string[] = [];

    const registerFileCommands = (files: typeof workspace.files) => {
      for (const file of files) {
        if (!file.isDirectory) {
          const commandId = `file.open.${file.path}`;
          commandRegistry.register({
            id: commandId,
            label: file.name,
            category: "file",
            keywords: [file.path, file.name, "open"],
            execute: async () => {
              await workspace.openFile(file.path);
            },
          });
          fileCommands.push(commandId);
        }
        // Recursively register files in subdirectories
        if (file.children) {
          registerFileCommands(file.children);
        }
      }
    };

    registerFileCommands(workspace.files);

    // Cleanup
    return () => {
      for (const commandId of fileCommands) {
        commandRegistry.unregister(commandId);
      }
    };
  }, [workspace.files, workspace]);

  // Register commands
  useEffect(() => {
    // View commands
    commandRegistry.register({
      id: "view.commandPalette",
      label: "Show Command Palette",
      category: "view",
      keywords: ["command", "palette", "search", "find"],
      keybinding: "Cmd+K",
      execute: () => palette.open(),
    });

    commandRegistry.register({
      id: "view.toggleFileTree",
      label: "Toggle File Explorer",
      category: "view",
      keywords: ["file", "tree", "explorer", "sidebar"],
      keybinding: "Cmd+B",
      execute: () => panels.togglePanel("file-tree"),
    });

    commandRegistry.register({
      id: "view.toggleTerminal",
      label: "Toggle Terminal",
      category: "view",
      keywords: ["terminal", "console", "shell"],
      keybinding: "Cmd+J",
      execute: () => panels.togglePanel("terminal"),
    });

    commandRegistry.register({
      id: "view.toggleDocs",
      label: "Toggle Documentation",
      category: "view",
      keywords: ["docs", "documentation", "help"],
      keybinding: "Cmd+Shift+D",
      execute: () => panels.togglePanel("docs"),
    });

    commandRegistry.register({
      id: "view.hideAllPanels",
      label: "Hide All Panels",
      category: "view",
      keywords: ["hide", "close", "panels", "minimal"],
      execute: () => panels.hideAllPanels(),
    });

    // File commands
    commandRegistry.register({
      id: "file.openWorkspace",
      label: "Open Workspace",
      category: "file",
      keywords: ["open", "workspace", "folder"],
      keybinding: "Cmd+Shift+O",
      execute: () => workspace.openWorkspace(),
    });

    commandRegistry.register({
      id: "file.save",
      label: "Save File",
      category: "file",
      keywords: ["save", "write"],
      keybinding: "Cmd+S",
      execute: async () => {
        if (activeBuffer) {
          await workspace.saveFile(activeBuffer.path, activeBuffer.content);
        }
      },
    });

    // Cleanup on unmount
    return () => {
      commandRegistry.unregister("view.commandPalette");
      commandRegistry.unregister("view.toggleFileTree");
      commandRegistry.unregister("view.toggleTerminal");
      commandRegistry.unregister("view.toggleDocs");
      commandRegistry.unregister("view.hideAllPanels");
      commandRegistry.unregister("file.openWorkspace");
      commandRegistry.unregister("file.save");
    };
  }, [palette, panels, workspace, activeBuffer]);

  // Register keyboard shortcuts
  useKeyboardShortcuts([
    {
      commandId: "view.commandPalette",
      binding: { key: "k", meta: true },
      description: "Show Command Palette",
    },
    {
      commandId: "view.toggleFileTree",
      binding: { key: "b", meta: true },
      description: "Toggle File Explorer",
    },
    {
      commandId: "view.toggleTerminal",
      binding: { key: "j", meta: true },
      description: "Toggle Terminal",
    },
    {
      commandId: "view.toggleDocs",
      binding: { key: "d", meta: true, shift: true },
      description: "Toggle Documentation",
    },
    {
      commandId: "file.openWorkspace",
      binding: { key: "o", meta: true, shift: true },
      description: "Open Workspace",
    },
    {
      commandId: "file.save",
      binding: { key: "s", meta: true },
      description: "Save File",
    },
  ]);

  // Get panel visibility states
  const fileTreePanel = panels.panels.get("file-tree");
  const terminalPanel = panels.panels.get("terminal");
  const docsPanel = panels.panels.get("docs");

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      backgroundColor="bg-primary"
      overflow="hidden"
    >
      {/* Top navigation bar (always visible) */}
      <Box
        backgroundColor="bg-secondary"
        paddingX="md"
        paddingY="sm"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        height={30}
        flexShrink={0}
      >
        <Text size="base" weight="semibold" color="fg-primary">
          Gouide
        </Text>
      </Box>
      <Divider />

      {/* Main panel layout */}
      <Box flex={1} overflow="hidden">
        <PanelLayout
          editor={<EditorAreaTemplate activeBuffer={activeBuffer} onSave={workspace.saveFile} />}
          leftPanel={
            fileTreePanel?.isVisible ? (
              <GlassSidebar position="left" width={fileTreePanel.size ?? 250}>
                <SidebarTemplate
                  workspacePath={workspace.workspacePath}
                  files={workspace.files}
                  onOpenWorkspace={workspace.openWorkspace}
                  onFileSelect={workspace.openFile}
                  onLoadDirectory={workspace.loadDirectoryChildren}
                />
              </GlassSidebar>
            ) : undefined
          }
          leftPanelWidth={fileTreePanel?.size ?? 250}
          rightPanel={
            docsPanel?.isVisible ? (
              <GlassSidebar position="right" width={docsPanel.size ?? 400}>
                <Box padding="md">
                  <Text size="base" color="fg-secondary">
                    Documentation panel (coming soon)
                  </Text>
                </Box>
              </GlassSidebar>
            ) : undefined
          }
          rightPanelWidth={docsPanel?.size ?? 400}
          bottomPanel={
            terminalPanel?.isVisible ? (
              <Box
                backgroundColor="bg-secondary"
                padding="md"
                style={{
                  borderTop: "1px solid var(--border-color)",
                }}
              >
                <Text size="base" color="fg-secondary">
                  Terminal panel (coming soon)
                </Text>
              </Box>
            ) : undefined
          }
          bottomPanelHeight={terminalPanel?.size ?? 300}
          centerModal={
            palette.isOpen ? (
              <CommandPaletteTemplate
                isOpen={palette.isOpen}
                query={palette.query}
                commands={palette.filteredCommands}
                selectedIndex={palette.selectedIndex}
                onQueryChange={palette.setQuery}
                onClose={palette.close}
                onSelectNext={palette.selectNext}
                onSelectPrevious={palette.selectPrevious}
                onExecute={palette.executeSelected}
              />
            ) : undefined
          }
        />
      </Box>

      {/* Status Bar (always visible) */}
      <Divider />
      <Box
        backgroundColor="bg-tertiary"
        paddingX="md"
        paddingY="xs"
        display="flex"
        alignItems="center"
        height={22}
        flexShrink={0}
      >
        <StatusBarTemplate
          connectionState={daemon.state}
          daemonInfo={daemon.daemonInfo}
          onRetry={daemon.retry}
        />
      </Box>
    </Box>
  );
}
