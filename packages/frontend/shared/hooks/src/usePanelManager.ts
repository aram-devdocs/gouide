/**
 * Panel management hook
 */

import {
  createInitialPanelState,
  deserializePanelState,
  type PanelConfig,
  type PanelId,
  type PanelPosition,
  type PanelState,
  STORAGE_KEYS,
  serializePanelState,
} from "@gouide/frontend-state";
import { useCallback, useEffect, useState } from "react";

export interface UsePanelManagerReturn {
  panels: Map<PanelId, PanelConfig>;
  togglePanel: (panelId: PanelId) => void;
  showPanel: (panelId: PanelId) => void;
  hidePanel: (panelId: PanelId) => void;
  setPanelSize: (panelId: PanelId, size: number) => void;
  setPanelPosition: (panelId: PanelId, position: PanelPosition) => void;
  hideAllPanels: () => void;
  resetToDefaults: () => void;
}

/**
 * Load initial state from storage
 */
function loadInitialState(): PanelState {
  if (typeof window === "undefined") {
    return createInitialPanelState();
  }

  try {
    // Load panel state from sessionStorage (per-session)
    const panelStateStored = sessionStorage.getItem(STORAGE_KEYS.PANEL_STATE);
    const panelState = panelStateStored ? deserializePanelState(panelStateStored) : {};

    const initialState = createInitialPanelState();

    return {
      panels: panelState.panels ?? initialState.panels,
    };
  } catch {
    return createInitialPanelState();
  }
}

/**
 * Panel management hook with state persistence
 *
 * Panels are hidden by default (minimalist design).
 * Use togglePanel or showPanel to display panels.
 *
 * @example
 * ```tsx
 * function App() {
 *   const panels = usePanelManager();
 *
 *   return (
 *     <PanelLayout
 *       leftPanel={panels.panels.get('file-tree')?.isVisible ? <FileTree /> : undefined}
 *     />
 *   );
 * }
 * ```
 */
export function usePanelManager(): UsePanelManagerReturn {
  const [state, setState] = useState<PanelState>(loadInitialState);

  // Persist state changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      // Save panel state to sessionStorage (per-session)
      sessionStorage.setItem(STORAGE_KEYS.PANEL_STATE, serializePanelState(state));
    } catch (error) {
      console.error("Failed to persist panel state:", error);
    }
  }, [state]);

  const togglePanel = useCallback((panelId: PanelId) => {
    setState((prev) => {
      const panels = new Map(prev.panels);
      const panel = panels.get(panelId);

      if (panel) {
        const isVisible = !panel.isVisible;
        panels.set(panelId, { ...panel, isVisible });

        return { panels };
      }

      return prev;
    });
  }, []);

  const showPanel = useCallback((panelId: PanelId) => {
    setState((prev) => {
      const panels = new Map(prev.panels);
      const panel = panels.get(panelId);

      if (panel && !panel.isVisible) {
        panels.set(panelId, { ...panel, isVisible: true });

        return { panels };
      }

      return prev;
    });
  }, []);

  const hidePanel = useCallback((panelId: PanelId) => {
    setState((prev) => {
      const panels = new Map(prev.panels);
      const panel = panels.get(panelId);

      if (panel?.isVisible) {
        panels.set(panelId, { ...panel, isVisible: false });

        return { panels };
      }

      return prev;
    });
  }, []);

  const setPanelSize = useCallback((panelId: PanelId, size: number) => {
    setState((prev) => {
      const panels = new Map(prev.panels);
      const panel = panels.get(panelId);

      if (panel) {
        // Clamp size to min/max
        const minSize = panel.minSize ?? 0;
        const maxSize = panel.maxSize ?? Number.POSITIVE_INFINITY;
        const clampedSize = Math.max(minSize, Math.min(maxSize, size));

        panels.set(panelId, { ...panel, size: clampedSize });
        return { ...prev, panels };
      }

      return prev;
    });
  }, []);

  const setPanelPosition = useCallback((panelId: PanelId, position: PanelPosition) => {
    setState((prev) => {
      const panels = new Map(prev.panels);
      const panel = panels.get(panelId);

      if (panel) {
        panels.set(panelId, { ...panel, position });
        return { ...prev, panels };
      }

      return prev;
    });
  }, []);

  const hideAllPanels = useCallback(() => {
    setState((prev) => {
      const panels = new Map(prev.panels);
      for (const [id, panel] of panels.entries()) {
        panels.set(id, { ...panel, isVisible: false });
      }

      return { panels };
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    setState(createInitialPanelState());
  }, []);

  return {
    panels: state.panels,
    togglePanel,
    showPanel,
    hidePanel,
    setPanelSize,
    setPanelPosition,
    hideAllPanels,
    resetToDefaults,
  };
}
