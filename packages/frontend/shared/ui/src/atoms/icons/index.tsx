/**
 * SVG Icon Library
 * Stroke-based, theme-aware icons with consistent design language
 *
 * Design guidelines:
 * - 24x24 viewBox
 * - 1.5px stroke width
 * - Round line caps/joins
 * - No fills (stroke only)
 * - currentColor for theme awareness
 */

import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * File icon - document outline
 */
export function FileIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="File"
      {...props}
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" />
      <path d="M14 2v6h6" />
      <path d="M9 13h6" />
      <path d="M9 17h6" />
    </svg>
  );
}

/**
 * Folder icon - closed folder
 */
export function FolderIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Folder"
      {...props}
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  );
}

/**
 * Folder open icon - opened folder
 */
export function FolderOpenIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Open folder"
      {...props}
    >
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v2" />
      <path d="M2 13l2.5 6h15l2.5-6H2z" />
    </svg>
  );
}

/**
 * Terminal icon - command prompt
 */
export function TerminalIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Terminal"
      {...props}
    >
      <path d="M4 17l6-6-6-6" />
      <path d="M12 19h8" />
    </svg>
  );
}

/**
 * Search icon - magnifying glass
 */
export function SearchIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Search"
      {...props}
    >
      <circle cx="11" cy="11" r="8" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

/**
 * Settings icon - gear
 */
export function SettingsIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Settings"
      {...props}
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v6m0 6v10M4.22 4.22l4.24 4.24m5.08 5.08l4.24 4.24M1 12h6m6 0h10M4.22 19.78l4.24-4.24m5.08-5.08l4.24-4.24" />
    </svg>
  );
}

/**
 * Chevron left - navigation arrow
 */
export function ChevronLeftIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Chevron left"
      {...props}
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

/**
 * Chevron right - navigation arrow
 */
export function ChevronRightIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Chevron right"
      {...props}
    >
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

/**
 * Chevron down - navigation arrow
 */
export function ChevronDownIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Chevron down"
      {...props}
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

/**
 * Chevron up - navigation arrow
 */
export function ChevronUpIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Chevron up"
      {...props}
    >
      <path d="M18 15l-6-6-6 6" />
    </svg>
  );
}

/**
 * Command icon - ⌘ symbol
 */
export function CommandIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Command"
      {...props}
    >
      <path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
    </svg>
  );
}

/**
 * X icon - close/cancel
 */
export function XIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Close"
      {...props}
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

/**
 * Check icon - checkmark/success
 */
export function CheckIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Check"
      {...props}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/**
 * Plus icon - add/create
 */
export function PlusIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Plus"
      {...props}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

/**
 * Minus icon - remove/minimize
 */
export function MinusIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Minus"
      {...props}
    >
      <path d="M5 12h14" />
    </svg>
  );
}

/**
 * Panel left icon - sidebar on left
 */
export function PanelLeftIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Panel left"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 3v18" />
    </svg>
  );
}

/**
 * Panel right icon - sidebar on right
 */
export function PanelRightIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Panel right"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M15 3v18" />
    </svg>
  );
}

/**
 * Panel bottom icon - panel at bottom
 */
export function PanelBottomIcon(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      aria-label="Panel bottom"
      {...props}
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 15h18" />
    </svg>
  );
}

/**
 * All icons in a registry for dynamic access
 */
export const ICONS = {
  file: FileIcon,
  folder: FolderIcon,
  folderOpen: FolderOpenIcon,
  terminal: TerminalIcon,
  search: SearchIcon,
  settings: SettingsIcon,
  chevronLeft: ChevronLeftIcon,
  chevronRight: ChevronRightIcon,
  chevronDown: ChevronDownIcon,
  chevronUp: ChevronUpIcon,
  command: CommandIcon,
  x: XIcon,
  check: CheckIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  panelLeft: PanelLeftIcon,
  panelRight: PanelRightIcon,
  panelBottom: PanelBottomIcon,
} as const;

export type IconName = keyof typeof ICONS;
