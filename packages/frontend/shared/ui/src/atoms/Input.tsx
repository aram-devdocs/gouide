/**
 * Input atom
 * Text input component with variants
 */

import type { ColorToken, SpacingToken } from "@gouide/frontend-theme";
import { Box } from "@gouide/primitives-desktop";
import type { ChangeEvent } from "react";

export interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  variant?: "outlined" | "filled";
  size?: "sm" | "md" | "lg";
  type?: "text" | "password" | "email" | "search";
  ariaLabel?: string;
  autoFocus?: boolean;
}

const variantStyles: Record<
  InputProps["variant"] & string,
  { bg: ColorToken; border: ColorToken }
> = {
  outlined: { bg: "bg-primary", border: "border" },
  filled: { bg: "bg-secondary", border: "border" },
};

const sizeStyles: Record<
  InputProps["size"] & string,
  { padding: SpacingToken; fontSize: "sm" | "base" | "lg" }
> = {
  sm: { padding: "xs", fontSize: "sm" },
  md: { padding: "sm", fontSize: "base" },
  lg: { padding: "md", fontSize: "lg" },
};

/**
 * Input - a text input field
 *
 * @example
 * <Input
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   placeholder="Search..."
 *   variant="outlined"
 * />
 */
export function Input({
  value,
  onChange,
  placeholder,
  disabled,
  variant = "outlined",
  size = "md",
  type = "text",
  ariaLabel,
  autoFocus,
}: InputProps) {
  const variantStyle = variantStyles[variant];
  const sizeStyle = sizeStyles[size];

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    onChange(target.value);
  };

  return (
    <Box width="100%">
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        {...(ariaLabel !== undefined && { "aria-label": ariaLabel })}
        {...(autoFocus !== undefined && { autoFocus })}
        style={{
          width: "100%",
          backgroundColor: `var(--${variantStyle.bg})`,
          borderColor: `var(--${variantStyle.border})`,
          borderWidth: "1px",
          borderStyle: "solid",
          padding: `var(--spacing-${sizeStyle.padding})`,
          borderRadius: "var(--radius-sm)",
          fontSize: `var(--font-size-${sizeStyle.fontSize})`,
          color: "var(--fg-primary)",
          outline: "none",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif",
        }}
      />
    </Box>
  );
}
