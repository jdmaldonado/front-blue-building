import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { badgeDotVariants, badgeVariants, type BadgeVariants } from './Badge-variants';

type BadgeProps = ComponentProps<'span'> &
  BadgeVariants & {
    // Shows the leading status dot; `pulse` animates it for live alerts.
    dot?: boolean;
    pulse?: boolean;
  };

export function Badge({ tone, size, dot = false, pulse = false, className, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size }), className)} {...props}>
      {dot ? <span className={badgeDotVariants({ size, pulse })} aria-hidden /> : null}
      {children}
    </span>
  );
}
