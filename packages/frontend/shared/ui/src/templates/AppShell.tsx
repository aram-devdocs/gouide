/**
 * AppShell template
 * Main application layout that composes all templates with hook data
 *
 * STRICT TEMPLATE ARCHITECTURE:
 * Apps should ONLY import AppShell and pass hook return values.
 * AppShell internally composes all other templates.
 */

// Import hook return types
import type { Buffer, ConnectionState, DaemonInfo, FileTreeNode } from "@gouide/frontend-hooks";
import { Box } from "../atoms/Box";
import { Divider } from "../atoms/Divider";
import { Text } from "../atoms/Text";
import { EditorAreaTemplate } from "./EditorAreaTemplate";
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
 * and internally composes all other templates.
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
  // Compute active buffer from workspace state
  const activeBuffer = workspace.activeBufferId
    ? (workspace.openBuffers.get(workspace.activeBufferId) ?? null)
    : null;

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      backgroundColor="bg-primary"
      overflow="hidden"
    >
      {/* Navigation Bar */}
      <Box
        backgroundColor="bg-secondary"
        paddingX="md"
        paddingY="sm"
        display="flex"
        alignItems="center"
        height={30}
        flexShrink={0}
      >
        <Text size="base" weight="semibold" color="fg-primary">
          Gouide
        </Text>
      </Box>
      <Divider />

      {/* Main content area with sidebar */}
      <Box display="flex" flex={1} overflow="hidden">
        {/* Sidebar */}
        <Box
          width={250}
          backgroundColor="bg-secondary"
          display="flex"
          flexDirection="row"
          overflow="hidden"
          flexShrink={0}
        >
          <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
            <SidebarTemplate
              workspacePath={workspace.workspacePath}
              files={workspace.files}
              onOpenWorkspace={workspace.openWorkspace}
              onFileSelect={workspace.openFile}
              onLoadDirectory={workspace.loadDirectoryChildren}
            />
          </Box>
          <Divider orientation="vertical" />
        </Box>

        {/* Main content */}
        <Box flex={1} display="flex" flexDirection="column" overflow="hidden">
          <EditorAreaTemplate activeBuffer={activeBuffer} onSave={workspace.saveFile} />
        </Box>
      </Box>

      {/* Status Bar */}
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
