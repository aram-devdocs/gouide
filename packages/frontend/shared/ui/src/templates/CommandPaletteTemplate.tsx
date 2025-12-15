/**
 * CommandPaletteTemplate - complete command palette with glass overlay
 */

import type { Command } from "@gouide/frontend-state";
import { GlassOverlay } from "../atoms/GlassOverlay";
import { CommandPalette } from "../organisms/CommandPalette";

export interface CommandPaletteTemplateProps {
  isOpen: boolean;
  query: string;
  commands: Command[];
  selectedIndex: number;
  onQueryChange: (query: string) => void;
  onClose: () => void;
  onSelectNext: () => void;
  onSelectPrevious: () => void;
  onExecute: () => void;
}

/**
 * CommandPaletteTemplate - complete command palette interface
 *
 * Combines glass overlay backdrop with command palette UI.
 * Use with useCommandPalette hook for state management.
 *
 * @example
 * ```tsx
 * function App() {
 *   const palette = useCommandPalette();
 *
 *   if (!palette.isOpen) return null;
 *
 *   return (
 *     <CommandPaletteTemplate
 *       isOpen={palette.isOpen}
 *       query={palette.query}
 *       commands={palette.filteredCommands}
 *       selectedIndex={palette.selectedIndex}
 *       onQueryChange={palette.setQuery}
 *       onClose={palette.close}
 *       onSelectNext={palette.selectNext}
 *       onSelectPrevious={palette.selectPrevious}
 *       onExecute={palette.executeSelected}
 *     />
 *   );
 * }
 * ```
 */
export function CommandPaletteTemplate({
  isOpen,
  query,
  commands,
  selectedIndex,
  onQueryChange,
  onClose,
  onSelectNext,
  onSelectPrevious,
  onExecute,
}: CommandPaletteTemplateProps) {
  if (!isOpen) return null;

  return (
    <GlassOverlay onClick={onClose}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Event handler is on parent GlassOverlay */}
      <div onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <CommandPalette
          query={query}
          commands={commands}
          selectedIndex={selectedIndex}
          onQueryChange={onQueryChange}
          onClose={onClose}
          onSelectNext={onSelectNext}
          onSelectPrevious={onSelectPrevious}
          onExecute={onExecute}
        />
      </div>
    </GlassOverlay>
  );
}
