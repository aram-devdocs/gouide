/**
 * @gouide/frontend-ui
 * STRICT MODE: Template-only exports
 *
 * STRICT TEMPLATE ARCHITECTURE:
 * Apps can ONLY import templates from this package.
 * Atoms, molecules, and organisms are internal implementation details.
 *
 * This enforces clean separation:
 * - Apps import: @gouide/frontend-ui (templates only)
 * - Apps import: @gouide/frontend-hooks (data & state)
 * - Templates use: atoms, molecules, organisms (internally)
 *
 * Benefits:
 * - Apps cannot create ad-hoc UI compositions
 * - All UI patterns centralized in templates
 * - Consistent UX across the application
 * - Easy to update UI without touching apps
 */

// ONLY templates exported to apps
export * from "./templates";

// Everything else is internal only (not exported):
// - Atoms, molecules, organisms are used by templates
// - Apps cannot import these directly
