/**
 * @gouide/frontend-hooks
 * Shared React hooks for workspace and daemon management
 */

export type { ConnectionState, DaemonInfo } from "@gouide/core-client";
export {
  DaemonProvider,
  useDaemonConnection,
} from "./useDaemonConnection";
export {
  type Buffer,
  type FileTreeNode,
  useWorkspace,
  WorkspaceProvider,
} from "./useWorkspace";
