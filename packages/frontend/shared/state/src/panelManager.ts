/**
 * Panel management types and utilities
 */

export type PanelPosition = "left" | "right" | "bottom" | "center" | "hidden";

export type PanelId = "file-tree" | "terminal" | "docs" | "search" | "command-palette" | "settings";

export interface PanelContent {
  type: string;
  props?: Record<string, unknown>;
}

/**
 * Constraints defining where a panel can be positioned
 */
export interface PanelPositionConstraints {
  allowedPositions: PanelPosition[]; // Which positions this panel can occupy
  preferredPosition: PanelPosition; // Default position
  canBeModal: boolean; // Can open as center modal
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
  constraints: PanelPositionConstraints; // Positioning constraints
  priority?: number; // For conflict resolution (higher priority wins)
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
    constraints: {
      allowedPositions: ["left", "right"],
      preferredPosition: "left",
      canBeModal: false,
    },
    priority: 100, // High priority - file tree stays in place
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
    constraints: {
      allowedPositions: ["bottom", "left", "right"],
      preferredPosition: "bottom",
      canBeModal: false,
    },
    priority: 90, // Medium-high priority
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
    constraints: {
      allowedPositions: ["right", "left", "center"],
      preferredPosition: "right",
      canBeModal: true,
    },
    priority: 70, // Medium priority - can be moved
  },
  {
    id: "search",
    position: "left",
    isVisible: false,
    size: DEFAULT_PANEL_SIZES.left,
    minSize: MIN_PANEL_SIZES.left,
    maxSize: MAX_PANEL_SIZES.left,
    resizable: true,
    content: {
      type: "search",
    },
    constraints: {
      allowedPositions: ["left", "right", "bottom", "center"],
      preferredPosition: "left",
      canBeModal: true,
    },
    priority: 60, // Lower priority - flexible positioning
  },
  {
    id: "settings",
    position: "right",
    isVisible: false,
    size: DEFAULT_PANEL_SIZES.right,
    minSize: MIN_PANEL_SIZES.right,
    maxSize: MAX_PANEL_SIZES.right,
    resizable: true,
    content: {
      type: "settings",
    },
    constraints: {
      allowedPositions: ["right", "left", "center"],
      preferredPosition: "right",
      canBeModal: true,
    },
    priority: 50, // Lowest priority - very flexible
  },
  {
    id: "command-palette",
    position: "center",
    isVisible: false,
    resizable: false,
    content: {
      type: "command-palette",
    },
    constraints: {
      allowedPositions: ["center"],
      preferredPosition: "center",
      canBeModal: true,
    },
    priority: 999, // Highest priority - always center modal
  },
];

/**
 * Result of attempting to move a panel to a new position
 */
export type MoveResult =
  | {
      success: true;
      movedPanels: PanelId[]; // List of panels that were moved (including the target)
    }
  | {
      success: false;
      reason: string; // Why the move failed
      suggestion?: PanelPosition; // Alternative position suggestion
    };

/**
 * Resolve conflicts when moving a panel to a position
 * Returns the final position for the panel and identifies panels that need to move
 */
export function resolvePositionConflict(
  panels: Map<PanelId, PanelConfig>,
  targetPanelId: PanelId,
  desiredPosition: PanelPosition,
  options: { force?: boolean } = {},
): MoveResult {
  const targetPanel = panels.get(targetPanelId);

  if (!targetPanel) {
    return {
      success: false,
      reason: `Panel ${targetPanelId} not found`,
    };
  }

  // Check if position is allowed for this panel
  if (
    !targetPanel.constraints.allowedPositions.includes(desiredPosition) &&
    desiredPosition !== "hidden"
  ) {
    return {
      success: false,
      reason: `Panel ${targetPanelId} cannot be positioned at ${desiredPosition}`,
      suggestion: targetPanel.constraints.preferredPosition,
    };
  }

  // Special case: center modal or hidden can have multiple panels
  if (desiredPosition === "center" || desiredPosition === "hidden") {
    return {
      success: true,
      movedPanels: [targetPanelId],
    };
  }

  // Find existing panel at the desired position
  const existingPanel = Array.from(panels.values()).find(
    (p) => p.position === desiredPosition && p.id !== targetPanelId && p.isVisible,
  );

  if (!existingPanel) {
    // No conflict - position is free
    return {
      success: true,
      movedPanels: [targetPanelId],
    };
  }

  // Conflict detected - compare priorities
  const targetPriority = targetPanel.priority ?? 0;
  const existingPriority = existingPanel.priority ?? 0;

  if (options.force || targetPriority > existingPriority) {
    // Target panel wins - move existing panel to its preferred position
    const movedPanels = [targetPanelId];

    // Try to move existing panel to an alternative position
    const alternativePosition = existingPanel.constraints.preferredPosition;

    // If alternative is same as current, try other allowed positions
    const alternativePos =
      alternativePosition !== desiredPosition
        ? alternativePosition
        : existingPanel.constraints.allowedPositions.find((p) => p !== desiredPosition);

    if (alternativePos && alternativePos !== "hidden") {
      // Check if alternative position is free
      const alternativeTaken = Array.from(panels.values()).find(
        (p) => p.position === alternativePos && p.id !== existingPanel.id && p.isVisible,
      );

      if (!alternativeTaken) {
        movedPanels.push(existingPanel.id);
      } else {
        // Hide existing panel if no alternative is available
        movedPanels.push(existingPanel.id);
      }
    }

    return {
      success: true,
      movedPanels,
    };
  }

  // Existing panel wins - suggest alternative for target
  const suggestion = targetPanel.constraints.allowedPositions.find((p) => {
    if (p === "center" || p === "hidden") return true;
    return !Array.from(panels.values()).some((panel) => panel.position === p && panel.isVisible);
  });

  const result: MoveResult = {
    success: false,
    reason: `Position ${desiredPosition} is occupied by higher priority panel ${existingPanel.id}`,
  };

  if (suggestion !== undefined) {
    result.suggestion = suggestion;
  }

  return result;
}

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
