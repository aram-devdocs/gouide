/**
 * Panel management types and utilities
 */

export type PanelPosition = "left" | "right" | "bottom" | "center" | "hidden";

export type PanelId = "file-tree" | "terminal" | "docs" | "search" | "command-palette";

export interface PanelContent {
  type: string;
  props?: Record<string, unknown>;
}

export interface PanelConfig {
  id: PanelId;
  position: PanelPosition;
  isVisible: boolean;
  size?: number; // Width (left/right) or height (bottom) in pixels
  minSize?: number;
  maxSize?: number;
  resizable?: boolean;
  content: PanelContent;
}

export interface PanelState {
  panels: Map<PanelId, PanelConfig>;
}

export const DEFAULT_PANEL_SIZES = {
  left: 250,
  right: 400,
  bottom: 300,
} as const;

export const MIN_PANEL_SIZES = {
  left: 200,
  right: 300,
  bottom: 150,
} as const;

export const MAX_PANEL_SIZES = {
  left: 600,
  right: 800,
  bottom: 600,
} as const;

/**
 * Default panel configurations
 */
export const DEFAULT_PANELS: PanelConfig[] = [
  {
    id: "file-tree",
    position: "left",
    isVisible: false, // Hidden by default in zen mode
    size: DEFAULT_PANEL_SIZES.left,
    minSize: MIN_PANEL_SIZES.left,
    maxSize: MAX_PANEL_SIZES.left,
    resizable: true,
    content: {
      type: "file-tree",
    },
  },
  {
    id: "terminal",
    position: "bottom",
    isVisible: false,
    size: DEFAULT_PANEL_SIZES.bottom,
    minSize: MIN_PANEL_SIZES.bottom,
    maxSize: MAX_PANEL_SIZES.bottom,
    resizable: true,
    content: {
      type: "terminal",
    },
  },
  {
    id: "docs",
    position: "right",
    isVisible: false,
    size: DEFAULT_PANEL_SIZES.right,
    minSize: MIN_PANEL_SIZES.right,
    maxSize: MAX_PANEL_SIZES.right,
    resizable: true,
    content: {
      type: "docs",
    },
  },
  {
    id: "command-palette",
    position: "center",
    isVisible: false,
    resizable: false,
    content: {
      type: "command-palette",
    },
  },
];

/**
 * Create initial panel state
 * All panels hidden by default (minimalist style)
 */
export function createInitialPanelState(): PanelState {
  const panels = new Map<PanelId, PanelConfig>();

  for (const panel of DEFAULT_PANELS) {
    panels.set(panel.id, { ...panel });
  }

  return {
    panels,
  };
}

/**
 * Panel state persistence keys
 */
export const STORAGE_KEYS = {
  PANEL_STATE: "gouide.panelState",
} as const;

/**
 * Serialize panel state for storage
 */
export function serializePanelState(state: PanelState): string {
  const serializable = {
    panels: Array.from(state.panels.entries()).map(([id, config]) => ({
      id,
      position: config.position,
      isVisible: config.isVisible,
      size: config.size,
    })),
  };

  return JSON.stringify(serializable);
}

/**
 * Deserialize panel state from storage
 */
export function deserializePanelState(json: string): Partial<PanelState> {
  try {
    const data = JSON.parse(json);

    const panels = new Map<PanelId, PanelConfig>();

    // Start with defaults
    for (const panel of DEFAULT_PANELS) {
      panels.set(panel.id, { ...panel });
    }

    // Apply stored state
    if (Array.isArray(data.panels)) {
      for (const stored of data.panels) {
        const existing = panels.get(stored.id);
        if (existing) {
          panels.set(stored.id, {
            ...existing,
            position: stored.position ?? existing.position,
            isVisible: stored.isVisible ?? existing.isVisible,
            size: stored.size ?? existing.size,
          });
        }
      }
    }

    return {
      panels,
    };
  } catch {
    // Return defaults on parse error
    return {
      panels: new Map(DEFAULT_PANELS.map((p) => [p.id, { ...p }])),
    };
  }
}
