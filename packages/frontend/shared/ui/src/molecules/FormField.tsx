/**
 * FormField molecule
 * Composition of Input + Label + Error text
 */

import { Box } from "../atoms/Box";
import type { InputProps } from "../atoms/Input";
import { Input } from "../atoms/Input";
import { Text } from "../atoms/Text";

export interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  type?: InputProps["type"];
  disabled?: boolean;
}

/**
 * FormField - a form input field with label and error display
 *
 * @example
 * <FormField
 *   label="Email"
 *   value={email}
 *   onChange={setEmail}
 *   type="email"
 *   required
 *   error={emailError}
 * />
 */
export function FormField({
  label,
  value,
  onChange,
  error,
  required,
  placeholder,
  type = "text",
  disabled,
}: FormFieldProps) {
  return (
    <Box display="flex" flexDirection="column" gap="xs" width="100%">
      <Box display="flex" gap="xs">
        <Text size="sm" weight="medium" color="fg-primary">
          {label}
        </Text>
        {required && (
          <Text size="sm" weight="medium" color="error">
            *
          </Text>
        )}
      </Box>
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder !== undefined ? placeholder : ""}
        type={type}
        disabled={disabled !== undefined ? disabled : false}
        variant="outlined"
      />
      {error && (
        <Text size="sm" color="error">
          {error}
        </Text>
      )}
    </Box>
  );
}
