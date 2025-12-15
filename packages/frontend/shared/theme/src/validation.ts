/**
 * Theme validation using Ajv JSON Schema validator
 */

import Ajv from "ajv";
import { type ThemeSchema, themeJsonSchema } from "./schema";

// Create Ajv instance
const ajv = new Ajv({
  allErrors: true,
  verbose: true,
});

// Compile schema
const validateTheme = ajv.compile(themeJsonSchema);

/**
 * Validates a theme object against the schema
 * @param theme The theme object to validate
 * @returns The validated theme
 * @throws Error if validation fails
 */
export function validateThemeObject(theme: unknown): ThemeSchema {
  const valid = validateTheme(theme);

  if (!valid) {
    const errors = validateTheme.errors || [];
    const errorMessages = errors.map((err) => `${err.instancePath} ${err.message}`).join(", ");
    throw new Error(`Theme validation failed: ${errorMessages}`);
  }

  return theme as ThemeSchema;
}

/**
 * Safely validates a theme and returns validation result
 * @param theme The theme object to validate
 * @returns Object with success flag and either validated theme or error
 */
export function safeValidateTheme(
  theme: unknown,
): { success: true; theme: ThemeSchema } | { success: false; error: string } {
  try {
    const validatedTheme = validateThemeObject(theme);
    return { success: true, theme: validatedTheme };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown validation error",
    };
  }
}

/**
 * Validates multiple themes at once
 * @param themes Array of theme objects to validate
 * @returns Array of validation results
 */
export function validateThemes(themes: unknown[]): Array<{
  index: number;
  success: boolean;
  theme?: ThemeSchema;
  error?: string;
}> {
  return themes.map((theme, index) => {
    const result = safeValidateTheme(theme);
    if (result.success) {
      return { index, success: true, theme: result.theme };
    }
    return { index, success: false, error: result.error };
  });
}
