import { open } from "@tauri-apps/plugin-dialog";
import { readDir, readTextFile, writeTextFile } from "@tauri-apps/plugin-fs";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";

// File tree node structure
export interface FileTreeNode {
  name: string;
  path: string;
  isDirectory: boolean;
  isSymlink?: boolean;
  children?: FileTreeNode[];
  childrenLoaded?: boolean;
  loadError?: string;
}

// Buffer structure for open files
export interface Buffer {
  path: string;
  content: string;
  isDirty: boolean;
}

// Workspace context state
interface WorkspaceState {
  workspacePath: string | null;
  files: FileTreeNode[];
  openBuffers: Map<string, Buffer>;
  activeBufferId: string | null;
  isDirty: Set<string>;
}

// Workspace context API
interface WorkspaceContext extends WorkspaceState {
  openWorkspace: () => Promise<void>;
  openFile: (path: string) => Promise<void>;
  closeFile: (path: string) => void;
  saveFile: (path: string, content: string) => Promise<void>;
  setActiveFile: (path: string) => void;
  updateBufferContent: (path: string, content: string) => void;
  loadDirectoryChildren: (path: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContext | undefined>(undefined);

interface WorkspaceProviderProps {
  children: ReactNode;
}

export function WorkspaceProvider({ children }: WorkspaceProviderProps) {
  const [state, setState] = useState<WorkspaceState>({
    workspacePath: null,
    files: [],
    openBuffers: new Map(),
    activeBufferId: null,
    isDirty: new Set(),
  });

  // Build file tree from directory (shallow - no recursion)
  const buildFileTreeShallow = useCallback(async (dirPath: string): Promise<FileTreeNode[]> => {
    console.log(`Reading directory: ${dirPath}`);
    try {
      const entries = await readDir(dirPath);
      console.log(`Found ${entries.length} entries in ${dirPath}`);
      const nodes: FileTreeNode[] = [];

      for (const entry of entries) {
        // Skip symlinks to prevent infinite loops
        if (entry.isSymlink) {
          console.log(`  - Skipping symlink: ${entry.name}`);
          continue;
        }

        // Build proper path - ensure no double slashes
        const fullPath = dirPath.endsWith("/")
          ? `${dirPath}${entry.name}`
          : `${dirPath}/${entry.name}`;

        const node: FileTreeNode = {
          name: entry.name,
          path: fullPath,
          isDirectory: entry.isDirectory,
          isSymlink: entry.isSymlink,
        };

        // For directories, mark as not loaded (will be lazy loaded)
        if (entry.isDirectory) {
          node.childrenLoaded = false;
        }

        console.log(`  - ${entry.name} (${entry.isDirectory ? "DIR" : "FILE"}) at ${fullPath}`);

        nodes.push(node);
      }

      // Sort: directories first, then alphabetically
      const sorted = nodes.sort((a, b) => {
        if (a.isDirectory && !b.isDirectory) return -1;
        if (!a.isDirectory && b.isDirectory) return 1;
        return a.name.localeCompare(b.name);
      });

      console.log(`Returning ${sorted.length} nodes from ${dirPath}`);
      return sorted;
    } catch (error) {
      console.error(`Failed to read directory ${dirPath}:`, error);
      return [];
    }
  }, []);

  // Open workspace directory
  const openWorkspace = useCallback(async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        recursive: true,
        title: "Open Folder",
      });

      if (selected && typeof selected === "string") {
        const fileTree = await buildFileTreeShallow(selected);
        setState((prev) => ({
          ...prev,
          workspacePath: selected,
          files: fileTree,
        }));
      }
    } catch (error) {
      console.error("Failed to open workspace:", error);
    }
  }, [buildFileTreeShallow]);

  // Load children for a specific directory (lazy loading)
  const loadDirectoryChildren = useCallback(
    async (dirPath: string) => {
      try {
        console.log(`Lazy loading children for: ${dirPath}`);
        const children = await buildFileTreeShallow(dirPath);

        setState((prev) => {
          // Recursive function to find and update the node
          const updateNodeInTree = (nodes: FileTreeNode[]): FileTreeNode[] => {
            return nodes.map((node) => {
              if (node.path === dirPath) {
                // Found the target node - update it
                console.log(`Found and updating node: ${dirPath}`);
                return {
                  ...node,
                  children,
                  childrenLoaded: true,
                };
              }
              // Recursively search in children
              if (node.children) {
                return {
                  ...node,
                  children: updateNodeInTree(node.children),
                };
              }
              return node;
            });
          };

          return {
            ...prev,
            files: updateNodeInTree(prev.files),
          };
        });
      } catch (error) {
        console.error(`Failed to load children for ${dirPath}:`, error);

        // Update node with error
        setState((prev) => {
          const updateNodeInTree = (nodes: FileTreeNode[]): FileTreeNode[] => {
            return nodes.map((node) => {
              if (node.path === dirPath) {
                return {
                  ...node,
                  children: [],
                  childrenLoaded: true,
                  loadError: error instanceof Error ? error.message : "Unknown error",
                };
              }
              if (node.children) {
                return {
                  ...node,
                  children: updateNodeInTree(node.children),
                };
              }
              return node;
            });
          };

          return {
            ...prev,
            files: updateNodeInTree(prev.files),
          };
        });
      }
    },
    [buildFileTreeShallow],
  );

  // Open file into buffer
  const openFile = useCallback(async (path: string) => {
    try {
      const content = await readTextFile(path);

      setState((prev) => {
        const newBuffers = new Map(prev.openBuffers);
        newBuffers.set(path, {
          path,
          content,
          isDirty: false,
        });

        return {
          ...prev,
          openBuffers: newBuffers,
          activeBufferId: path,
        };
      });
    } catch (error) {
      console.error(`Failed to open file ${path}:`, error);
    }
  }, []);

  // Close file buffer
  const closeFile = useCallback((path: string) => {
    setState((prev) => {
      const newBuffers = new Map(prev.openBuffers);
      newBuffers.delete(path);

      const newIsDirty = new Set(prev.isDirty);
      newIsDirty.delete(path);

      // If closing active file, clear active buffer
      const newActiveId = prev.activeBufferId === path ? null : prev.activeBufferId;

      return {
        ...prev,
        openBuffers: newBuffers,
        activeBufferId: newActiveId,
        isDirty: newIsDirty,
      };
    });
  }, []);

  // Save file to disk
  const saveFile = useCallback(async (path: string, content: string) => {
    try {
      await writeTextFile(path, content);

      setState((prev) => {
        const newBuffers = new Map(prev.openBuffers);
        const buffer = newBuffers.get(path);
        if (buffer) {
          buffer.content = content;
          buffer.isDirty = false;
        }

        const newIsDirty = new Set(prev.isDirty);
        newIsDirty.delete(path);

        return {
          ...prev,
          openBuffers: newBuffers,
          isDirty: newIsDirty,
        };
      });
    } catch (error) {
      console.error(`Failed to save file ${path}:`, error);
      throw error;
    }
  }, []);

  // Set active file
  const setActiveFile = useCallback((path: string) => {
    setState((prev) => ({
      ...prev,
      activeBufferId: path,
    }));
  }, []);

  // Update buffer content (marks as dirty)
  const updateBufferContent = useCallback((path: string, content: string) => {
    setState((prev) => {
      const newBuffers = new Map(prev.openBuffers);
      const buffer = newBuffers.get(path);
      if (buffer) {
        buffer.content = content;
        buffer.isDirty = true;
      }

      const newIsDirty = new Set(prev.isDirty);
      newIsDirty.add(path);

      return {
        ...prev,
        openBuffers: newBuffers,
        isDirty: newIsDirty,
      };
    });
  }, []);

  const value = useMemo<WorkspaceContext>(
    () => ({
      ...state,
      openWorkspace,
      openFile,
      closeFile,
      saveFile,
      setActiveFile,
      updateBufferContent,
      loadDirectoryChildren,
    }),
    [
      state,
      openWorkspace,
      openFile,
      closeFile,
      saveFile,
      setActiveFile,
      updateBufferContent,
      loadDirectoryChildren,
    ],
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

// Hook to access workspace context
export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error("useWorkspace must be used within WorkspaceProvider");
  }
  return context;
}
