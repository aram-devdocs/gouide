/**
 * Box atom
 * Re-export of primitive Box for consistency and API stability
 *
 * This allows components to import Box from atoms layer
 * instead of directly from primitives, maintaining proper
 * atomic design hierarchy.
 */

export type { BoxProps } from "@gouide/primitives-desktop";
export { Box } from "@gouide/primitives-desktop";
