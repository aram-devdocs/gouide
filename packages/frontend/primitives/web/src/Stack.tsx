import { forwardRef } from 'react';
import type { StackProps } from './types';
import { Box } from './Box';

const alignMap = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  stretch: 'stretch',
} as const;

const justifyMap = {
  start: 'flex-start',
  end: 'flex-end',
  center: 'center',
  between: 'space-between',
  around: 'space-around',
} as const;

type StackElement = HTMLDivElement;

/**
 * Stack - vertical or horizontal flex container with consistent spacing
 * A convenience wrapper around Box with sensible defaults
 */
export const Stack = forwardRef<StackElement, StackProps>(function Stack(
  { direction = 'vertical', spacing, align, justify, children, ...rest },
  ref
) {
  return (
    <Box
      ref={ref}
      display="flex"
      flexDirection={direction === 'vertical' ? 'column' : 'row'}
      gap={spacing}
      alignItems={align ? alignMap[align] : undefined}
      justifyContent={justify ? justifyMap[justify] : undefined}
      {...rest}
    >
      {children}
    </Box>
  );
});
