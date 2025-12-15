/**
 * StatusBar organism
 * Bottom status bar showing connection status and system information
 */

import { Badge } from "../atoms/Badge";
import { Box } from "../atoms/Box";
import { Button } from "../atoms/Button";
import { Text } from "../atoms/Text";

export interface StatusBarProps {
  /** Current connection status */
  status: "disconnected" | "connecting" | "connected" | "error";
  /** Status message or protocol version */
  message?: string | undefined;
  /** Error message if status is error */
  error?: string | undefined;
  /** Daemon ID to display */
  daemonId?: string | undefined;
  /** Retry callback for error state */
  onRetry?: (() => void) | undefined;
}

/**
 * StatusBar - connection and system status display
 *
 * Displays current daemon connection status with appropriate visual indicators
 * and optional system information like daemon ID.
 *
 * @example
 * <StatusBar
 *   status="connected"
 *   message="v1.0.0"
 *   daemonId="abc12345"
 * />
 *
 * @example
 * // Error state with retry
 * <StatusBar
 *   status="error"
 *   error="Connection refused"
 *   onRetry={handleRetry}
 * />
 */
export function StatusBar({ status, message, error, daemonId, onRetry }: StatusBarProps) {
  const getStatusVariant = (): "default" | "accent" | "success" | "warning" | "error" => {
    switch (status) {
      case "disconnected":
        return "default";
      case "connecting":
        return "warning";
      case "connected":
        return "success";
      case "error":
        return "error";
    }
  };

  const getStatusText = (): string => {
    switch (status) {
      case "disconnected":
        return "Disconnected";
      case "connecting":
        return "Connecting...";
      case "connected":
        return message ? `Connected to daemon (v${message})` : "Connected";
      case "error":
        return error ? `Error: ${error}` : "Error";
    }
  };

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
      <Box display="flex" alignItems="center" gap="md">
        <Badge variant={getStatusVariant()} size="sm">
          <Text size="sm">{getStatusText()}</Text>
        </Badge>
        {status === "error" && onRetry && (
          <Button variant="secondary" size="sm" onPress={onRetry}>
            Retry
          </Button>
        )}
      </Box>
      <Box display="flex" alignItems="center" gap="md">
        {status === "connected" && daemonId && (
          <Box style={{ fontFamily: "var(--font-mono)" }}>
            <Text size="sm" color="fg-secondary">
              daemon: {daemonId}
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
}
