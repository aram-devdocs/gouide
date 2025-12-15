/**
 * SearchBar molecule
 * Composition of Input + Icon + Clear button
 */

import { Box } from "../atoms/Box";
import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import { Input } from "../atoms/Input";

export interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onClear?: () => void;
}

/**
 * SearchBar - a search input with icon and optional clear button
 *
 * @example
 * <SearchBar
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   placeholder="Search files..."
 *   onClear={() => setSearchQuery('')}
 * />
 */
export function SearchBar({ value, onChange, placeholder = "Search...", onClear }: SearchBarProps) {
  const handleClear = () => {
    onChange("");
    onClear?.();
  };

  return (
    <Box display="flex" alignItems="center" gap="sm" width="100%">
      <Icon size="sm" color="fg-secondary">
        🔍
      </Icon>
      <Box flex={1}>
        <Input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          type="search"
          variant="filled"
          size="sm"
        />
      </Box>
      {value && (
        <Button variant="ghost" size="sm" onPress={handleClear}>
          ✕
        </Button>
      )}
    </Box>
  );
}
