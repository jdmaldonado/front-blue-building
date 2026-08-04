import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { statusDotHaloVariants, statusDotVariants, type StatusDotVariants } from './StatusDot-variants';

type StatusDotProps = Omit<ComponentProps<'span'>, 'children'> &
  StatusDotVariants & {
    // What the color means. Without it the dot is only decoration.
    label?: string;
    halo?: boolean;
  };

export function StatusDot({ state, size, motion, halo = false, label, className, ...props }: StatusDotProps) {
  return (
    <span
      role={label === undefined ? undefined : 'status'}
      aria-hidden={label === undefined ? true : undefined}
      aria-label={label}
      className={cn('relative inline-flex', className)}
      {...props}
    >
      {halo ? <span className={statusDotHaloVariants({ state })} /> : null}
      <span className={statusDotVariants({ state, size, motion })} />
    </span>
  );
}
