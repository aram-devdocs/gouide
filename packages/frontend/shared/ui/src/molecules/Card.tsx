/**
 * Card molecule
 * Container component with header, body, and optional footer sections
 */

import type { ReactNode } from "react";
import { Box } from "../atoms/Box";
import { Divider } from "../atoms/Divider";

export interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  padding?: "sm" | "md" | "lg";
}

/**
 * Card - a container with optional header and footer
 *
 * @example
 * <Card
 *   header={<Text weight="semibold">File Explorer</Text>}
 *   footer={<Button>Load More</Button>}
 * >
 *   <Text>Card content goes here</Text>
 * </Card>
 */
export function Card({ children, header, footer, padding = "md" }: CardProps) {
  return (
    <Box
      backgroundColor="bg-secondary"
      borderRadius="sm"
      borderWidth={1}
      borderColor="border"
      display="flex"
      flexDirection="column"
      overflow="hidden"
    >
      {header && (
        <>
          <Box padding={padding}>{header}</Box>
          <Divider />
        </>
      )}
      <Box padding={padding} flex={1} overflow="auto">
        {children}
      </Box>
      {footer && (
        <>
          <Divider />
          <Box padding={padding}>{footer}</Box>
        </>
      )}
    </Box>
  );
}
