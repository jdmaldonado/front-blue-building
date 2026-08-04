import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { statusDotHaloVariants, statusDotVariants, type StatusDotVariants } from './StatusDot-variants';

type StatusDotProps = Omit<ComponentProps<'span'>, 'children'> &
  StatusDotVariants & {
    // What the color means, for people who cannot see it. Without this the dot
    // is decoration and stays hidden from screen readers.
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
