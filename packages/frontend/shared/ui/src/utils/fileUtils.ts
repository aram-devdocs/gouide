/**
 * File utility functions for UI components
 * Pure functions for file path manipulation and language detection
 */

/**
 * Detect programming language from file extension
 * @param path - File path with extension
 * @returns Language identifier for Monaco editor or "plaintext"
 */
export function getLanguageFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();

  const languageMap: Record<string, string> = {
    js: "javascript",
    jsx: "javascript",
    ts: "typescript",
    tsx: "typescript",
    json: "json",
    md: "markdown",
    html: "html",
    css: "css",
    scss: "scss",
    rs: "rust",
    toml: "toml",
    yaml: "yaml",
    yml: "yaml",
    xml: "xml",
    sh: "shell",
    bash: "shell",
    proto: "proto",
    py: "python",
    rb: "ruby",
    go: "go",
    java: "java",
    c: "c",
    cpp: "cpp",
    h: "c",
    hpp: "cpp",
  };

  return languageMap[ext || ""] || "plaintext";
}

/**
 * Extract filename from full file path
 * @param path - Full file path
 * @returns Filename with extension or "Untitled"
 */
export function getFilename(path: string): string {
  const parts = path.split("/");
  return parts[parts.length - 1] || "Untitled";
}

/**
 * Extract workspace name from workspace path
 * @param workspacePath - Full workspace directory path
 * @returns Workspace directory name or null
 */
export function getWorkspaceName(workspacePath: string | null): string | null {
  if (!workspacePath) return null;
  const parts = workspacePath.split("/");
  return parts[parts.length - 1] || parts[parts.length - 2] || null;
}
