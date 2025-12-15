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
export {
  type Buffer,
  type FileTreeNode,
  useWorkspace,
  WorkspaceProvider,
} from "./useWorkspace";
