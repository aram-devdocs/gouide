/**
 * Command palette state management hook
 */

import { type Command, commandRegistry } from "@gouide/frontend-state";
import { useCallback, useState } from "react";

export interface CommandPaletteState {
  isOpen: boolean;
  query: string;
  selectedIndex: number;
  filteredCommands: Command[];
}

export interface UseCommandPaletteReturn extends CommandPaletteState {
  open: () => void;
  close: () => void;
  toggle: () => void;
  setQuery: (query: string) => void;
  selectNext: () => void;
  selectPrevious: () => void;
  executeSelected: () => Promise<void>;
}

/**
 * Hook for managing command palette state
 *
 * @example
 * ```tsx
 * function App() {
 *   const palette = useCommandPalette();
 *
 *   return (
 *     <>
 *       <button onClick={palette.open}>Open Palette</button>
 *       {palette.isOpen && (
 *         <CommandPalette
 *           query={palette.query}
 *           commands={palette.filteredCommands}
 *           selectedIndex={palette.selectedIndex}
 *           onQueryChange={palette.setQuery}
 *           onClose={palette.close}
 *           onExecute={palette.executeSelected}
 *         />
 *       )}
 *     </>
 *   );
 * }
 * ```
 */
export function useCommandPalette(): UseCommandPaletteReturn {
  const [state, setState] = useState<CommandPaletteState>({
    isOpen: false,
    query: "",
    selectedIndex: 0,
    filteredCommands: [],
  });

  const open = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      query: "",
      selectedIndex: 0,
      filteredCommands: commandRegistry.getAll(),
    }));
  }, []);

  const close = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
      query: "",
      selectedIndex: 0,
    }));
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => {
      if (prev.isOpen) {
        return {
          ...prev,
          isOpen: false,
          query: "",
          selectedIndex: 0,
        };
      }
      return {
        ...prev,
        isOpen: true,
        query: "",
        selectedIndex: 0,
        filteredCommands: commandRegistry.getAll(),
      };
    });
  }, []);

  const setQuery = useCallback((query: string) => {
    const filtered = query.trim() ? commandRegistry.search(query) : commandRegistry.getAll();

    setState((prev) => ({
      ...prev,
      query,
      filteredCommands: filtered,
      selectedIndex: 0,
    }));
  }, []);

  const selectNext = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedIndex: Math.min(prev.selectedIndex + 1, prev.filteredCommands.length - 1),
    }));
  }, []);

  const selectPrevious = useCallback(() => {
    setState((prev) => ({
      ...prev,
      selectedIndex: Math.max(prev.selectedIndex - 1, 0),
    }));
  }, []);

  const executeSelected = useCallback(async () => {
    const command = state.filteredCommands[state.selectedIndex];
    if (command) {
      await commandRegistry.execute(command.id);
      close();
    }
  }, [state.filteredCommands, state.selectedIndex, close]);

  return {
    ...state,
    open,
    close,
    toggle,
    setQuery,
    selectNext,
    selectPrevious,
    executeSelected,
  };
}
