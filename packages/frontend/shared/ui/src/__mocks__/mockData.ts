/**
 * Mock data for Storybook stories
 * Provides realistic sample data for UI component testing
 */

import type { ConnectionState, DaemonInfo, WelcomeInfo } from "@gouide/core-client";
import type { Buffer, FileTreeNode } from "@gouide/frontend-hooks";
import type { DaemonData, WorkspaceData } from "../templates/AppShell";

/**
 * Mock file tree with nested structure
 */
export const mockFileTree: FileTreeNode[] = [
  {
    name: "src",
    path: "/project/src",
    isDirectory: true,
    childrenLoaded: true,
    children: [
      {
        name: "components",
        path: "/project/src/components",
        isDirectory: true,
        childrenLoaded: true,
        children: [
          {
            name: "Button.tsx",
            path: "/project/src/components/Button.tsx",
            isDirectory: false,
          },
          {
            name: "Input.tsx",
            path: "/project/src/components/Input.tsx",
            isDirectory: false,
          },
          {
            name: "Card.tsx",
            path: "/project/src/components/Card.tsx",
            isDirectory: false,
          },
        ],
      },
      {
        name: "hooks",
        path: "/project/src/hooks",
        isDirectory: true,
        childrenLoaded: true,
        children: [
          {
            name: "useAuth.ts",
            path: "/project/src/hooks/useAuth.ts",
            isDirectory: false,
          },
          {
            name: "useTheme.ts",
            path: "/project/src/hooks/useTheme.ts",
            isDirectory: false,
          },
        ],
      },
      {
        name: "utils",
        path: "/project/src/utils",
        isDirectory: true,
        childrenLoaded: true,
        children: [
          {
            name: "format.ts",
            path: "/project/src/utils/format.ts",
            isDirectory: false,
          },
          {
            name: "validation.ts",
            path: "/project/src/utils/validation.ts",
            isDirectory: false,
          },
        ],
      },
      {
        name: "App.tsx",
        path: "/project/src/App.tsx",
        isDirectory: false,
      },
      {
        name: "index.tsx",
        path: "/project/src/index.tsx",
        isDirectory: false,
      },
    ],
  },
  {
    name: "public",
    path: "/project/public",
    isDirectory: true,
    childrenLoaded: true,
    children: [
      {
        name: "index.html",
        path: "/project/public/index.html",
        isDirectory: false,
      },
      {
        name: "favicon.ico",
        path: "/project/public/favicon.ico",
        isDirectory: false,
      },
    ],
  },
  {
    name: "package.json",
    path: "/project/package.json",
    isDirectory: false,
  },
  {
    name: "tsconfig.json",
    path: "/project/tsconfig.json",
    isDirectory: false,
  },
  {
    name: "README.md",
    path: "/project/README.md",
    isDirectory: false,
  },
];

/**
 * Mock file tree with loading state
 */
export const mockFileTreeLoading: FileTreeNode[] = [
  {
    name: "src",
    path: "/project/src",
    isDirectory: true,
    childrenLoaded: false,
  },
  {
    name: "README.md",
    path: "/project/README.md",
    isDirectory: false,
  },
];

/**
 * Mock file tree with error
 */
export const mockFileTreeWithError: FileTreeNode[] = [
  {
    name: "src",
    path: "/project/src",
    isDirectory: true,
    childrenLoaded: true,
    loadError: "Permission denied",
    children: [],
  },
];

/**
 * Empty file tree
 */
export const mockFileTreeEmpty: FileTreeNode[] = [];

/**
 * Mock file content samples
 */
export const mockFileContent = {
  typescript: `import { useState } from "react";

export function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,

  javascript: `function greet(name) {
  return \`Hello, \${name}!\`;
}

const message = greet("World");
console.log(message);`,

  rust: `fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    let sum: i32 = numbers.iter().sum();
    println!("Sum: {}", sum);

    let doubled: Vec<i32> = numbers
        .iter()
        .map(|x| x * 2)
        .collect();
    println!("Doubled: {:?}", doubled);
}`,

  python: `def calculate_fibonacci(n):
    """Calculate nth Fibonacci number"""
    if n <= 1:
        return n
    return calculate_fibonacci(n - 1) + calculate_fibonacci(n - 2)

# Print first 10 Fibonacci numbers
for i in range(10):
    print(f"F({i}) = {calculate_fibonacci(i)}")`,

  json: `{
  "name": "my-app",
  "version": "1.0.0",
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "typescript": "^5.7.2",
    "vite": "^6.0.3"
  }
}`,

  markdown: `# Project Documentation

## Getting Started

This is a sample project demonstrating modern web development.

### Features

- Fast development with Vite
- Type-safe with TypeScript
- Component library with Storybook

### Installation

\`\`\`bash
npm install
npm run dev
\`\`\``,
};

/**
 * Mock welcome info for connected state
 */
export const mockWelcomeInfo: WelcomeInfo = {
  protocol_version: "1.0.0",
  daemon_id: "daemon-12345",
  daemon_version: "0.1.0",
  reconnect_token: "mock-token-abc123",
  session_timeout_seconds: 3600,
};

/**
 * Mock daemon info
 */
export const mockDaemonInfo: DaemonInfo = {
  pid: 12345,
  daemon_id: "daemon-12345",
  protocol_version: "1.0.0",
  endpoint: "/tmp/gouide-daemon.sock",
};

/**
 * Mock daemon connection states
 */
export const mockConnectionStates = {
  disconnected: { status: "disconnected" } as ConnectionState,
  connecting: { status: "connecting" } as ConnectionState,
  connected: { status: "connected", welcome: mockWelcomeInfo } as ConnectionState,
  error: { status: "error", error: "Connection refused" } as ConnectionState,
};

/**
 * Mock buffers
 */
export const mockBuffer1: Buffer = {
  path: "/project/src/App.tsx",
  content: mockFileContent.typescript,
  isDirty: false,
};

export const mockBuffer2: Buffer = {
  path: "/project/README.md",
  content: mockFileContent.markdown,
  isDirty: false,
};

export const mockBuffer3: Buffer = {
  path: "/project/src/components/Button.tsx",
  content: mockFileContent.typescript,
  isDirty: true,
};

/**
 * Mock open buffers map
 */
export const mockOpenBuffers = new Map<string, Buffer>([
  [mockBuffer1.path, mockBuffer1],
  [mockBuffer2.path, mockBuffer2],
]);

/**
 * Mock workspace data (complete)
 */
export const mockWorkspaceData: WorkspaceData = {
  workspacePath: "/Users/username/dev/my-project",
  files: mockFileTree,
  openBuffers: mockOpenBuffers,
  activeBufferId: "/project/src/App.tsx",
  isDirty: new Set<string>(),
  openWorkspace: async () => {
    console.log("Opening workspace...");
  },
  openFile: async (path: string) => {
    console.log(`Opening file: ${path}`);
  },
  closeFile: (path: string) => {
    console.log(`Closing file: ${path}`);
  },
  saveFile: async (path: string, _content: string) => {
    console.log(`Saving file: ${path}`);
  },
  setActiveFile: (path: string) => {
    console.log(`Setting active file: ${path}`);
  },
  updateBufferContent: (path: string, _content: string) => {
    console.log(`Updating buffer: ${path}`);
  },
  loadDirectoryChildren: async (path: string) => {
    console.log(`Loading directory: ${path}`);
  },
};

/**
 * Mock workspace with no folder
 */
export const mockWorkspaceDataEmpty: WorkspaceData = {
  workspacePath: null,
  files: [],
  openBuffers: new Map(),
  activeBufferId: null,
  isDirty: new Set(),
  openWorkspace: async () => {
    console.log("Opening workspace...");
  },
  openFile: async () => {
    /* noop */
  },
  closeFile: () => {
    /* noop */
  },
  saveFile: async () => {
    /* noop */
  },
  setActiveFile: () => {
    /* noop */
  },
  updateBufferContent: () => {
    /* noop */
  },
  loadDirectoryChildren: async () => {
    /* noop */
  },
};

/**
 * Mock daemon data (disconnected)
 */
export const mockDaemonDataDisconnected: DaemonData = {
  state: mockConnectionStates.disconnected,
  daemonInfo: null,
  connect: async () => {
    console.log("Connecting to daemon...");
  },
  disconnect: async () => {
    /* noop */
  },
  retry: async () => {
    /* noop */
  },
};

/**
 * Mock daemon data (connected)
 */
export const mockDaemonDataConnected: DaemonData = {
  state: mockConnectionStates.connected,
  daemonInfo: mockDaemonInfo,
  connect: async () => {
    /* noop */
  },
  disconnect: async () => {
    console.log("Disconnecting from daemon...");
  },
  retry: async () => {
    /* noop */
  },
};

/**
 * Mock daemon data (connecting)
 */
export const mockDaemonDataConnecting: DaemonData = {
  state: mockConnectionStates.connecting,
  daemonInfo: null,
  connect: async () => {
    /* noop */
  },
  disconnect: async () => {
    /* noop */
  },
  retry: async () => {
    /* noop */
  },
};

/**
 * Mock daemon data (error)
 */
export const mockDaemonDataError: DaemonData = {
  state: mockConnectionStates.error,
  daemonInfo: null,
  connect: async () => {
    /* noop */
  },
  disconnect: async () => {
    /* noop */
  },
  retry: async () => {
    console.log("Retrying connection...");
  },
};
