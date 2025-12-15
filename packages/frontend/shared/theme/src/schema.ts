/**
 * Theme JSON schema - defines the structure for all theme files
 */

export interface ThemeMetadata {
  id: string;
  name: string;
  version: string;
  author?: string;
}

export interface ThemeColors {
  bg: {
    primary: string;
    secondary: string;
    tertiary: string;
    hover: string;
    active: string;
  };
  fg: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };
  accent: string;
  border: string;
  error: string;
  success: string;
  warning: string;
  info: string;
  glass: {
    tint: string;
    highlight: string;
    shadow: string;
  };
}

export interface ThemeGlass {
  blur: {
    none: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
  opacity: {
    transparent: number;
    light: number;
    medium: number;
    heavy: number;
    opaque: number;
  };
  borderOpacity: {
    none: number;
    subtle: number;
    visible: number;
    strong: number;
  };
}

export interface ThemeAnimation {
  duration: {
    instant: number;
    fast: number;
    normal: number;
    slow: number;
    slower: number;
  };
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
    spring: string;
  };
}

export interface ThemeBreakpoints {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface ThemeShadows {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  glass: string;
}

/**
 * Complete theme schema
 */
export interface ThemeSchema {
  meta: ThemeMetadata;
  colors: ThemeColors;
  glass: ThemeGlass;
  animation: ThemeAnimation;
  breakpoints: ThemeBreakpoints;
  shadows: ThemeShadows;
}

/**
 * JSON Schema for validation with Ajv
 */
export const themeJsonSchema = {
  $schema: "http://json-schema.org/draft-07/schema#",
  type: "object",
  required: ["meta", "colors", "glass", "animation", "breakpoints", "shadows"],
  properties: {
    meta: {
      type: "object",
      required: ["id", "name", "version"],
      properties: {
        id: { type: "string", pattern: "^[a-z0-9-]+$" },
        name: { type: "string", minLength: 1 },
        version: { type: "string", pattern: "^\\d+\\.\\d+\\.\\d+$" },
        author: { type: "string" },
      },
    },
    colors: {
      type: "object",
      required: ["bg", "fg", "accent", "border", "error", "success", "warning", "info", "glass"],
      properties: {
        bg: {
          type: "object",
          required: ["primary", "secondary", "tertiary", "hover", "active"],
          properties: {
            primary: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            secondary: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            tertiary: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            hover: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            active: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
          },
        },
        fg: {
          type: "object",
          required: ["primary", "secondary", "muted", "inverse"],
          properties: {
            primary: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            secondary: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            muted: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            inverse: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
          },
        },
        accent: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
        border: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
        error: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
        success: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
        warning: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
        info: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
        glass: {
          type: "object",
          required: ["tint", "highlight", "shadow"],
          properties: {
            tint: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            highlight: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
            shadow: { type: "string", pattern: "^#[0-9a-fA-F]{6}$" },
          },
        },
      },
    },
    glass: {
      type: "object",
      required: ["blur", "opacity", "borderOpacity"],
      properties: {
        blur: {
          type: "object",
          required: ["none", "sm", "md", "lg", "xl"],
          properties: {
            none: { type: "number", minimum: 0 },
            sm: { type: "number", minimum: 0 },
            md: { type: "number", minimum: 0 },
            lg: { type: "number", minimum: 0 },
            xl: { type: "number", minimum: 0 },
          },
        },
        opacity: {
          type: "object",
          required: ["transparent", "light", "medium", "heavy", "opaque"],
          properties: {
            transparent: { type: "number", minimum: 0, maximum: 1 },
            light: { type: "number", minimum: 0, maximum: 1 },
            medium: { type: "number", minimum: 0, maximum: 1 },
            heavy: { type: "number", minimum: 0, maximum: 1 },
            opaque: { type: "number", minimum: 0, maximum: 1 },
          },
        },
        borderOpacity: {
          type: "object",
          required: ["none", "subtle", "visible", "strong"],
          properties: {
            none: { type: "number", minimum: 0, maximum: 1 },
            subtle: { type: "number", minimum: 0, maximum: 1 },
            visible: { type: "number", minimum: 0, maximum: 1 },
            strong: { type: "number", minimum: 0, maximum: 1 },
          },
        },
      },
    },
    animation: {
      type: "object",
      required: ["duration", "easing"],
      properties: {
        duration: {
          type: "object",
          required: ["instant", "fast", "normal", "slow", "slower"],
          properties: {
            instant: { type: "number", minimum: 0 },
            fast: { type: "number", minimum: 0 },
            normal: { type: "number", minimum: 0 },
            slow: { type: "number", minimum: 0 },
            slower: { type: "number", minimum: 0 },
          },
        },
        easing: {
          type: "object",
          required: ["linear", "easeIn", "easeOut", "easeInOut", "spring"],
          properties: {
            linear: { type: "string" },
            easeIn: { type: "string" },
            easeOut: { type: "string" },
            easeInOut: { type: "string" },
            spring: { type: "string" },
          },
        },
      },
    },
    breakpoints: {
      type: "object",
      required: ["sm", "md", "lg", "xl", "xxl"],
      properties: {
        sm: { type: "number", minimum: 0 },
        md: { type: "number", minimum: 0 },
        lg: { type: "number", minimum: 0 },
        xl: { type: "number", minimum: 0 },
        xxl: { type: "number", minimum: 0 },
      },
    },
    shadows: {
      type: "object",
      required: ["none", "sm", "md", "lg", "xl", "glass"],
      properties: {
        none: { type: "string" },
        sm: { type: "string" },
        md: { type: "string" },
        lg: { type: "string" },
        xl: { type: "string" },
        glass: { type: "string" },
      },
    },
  },
} as const;
