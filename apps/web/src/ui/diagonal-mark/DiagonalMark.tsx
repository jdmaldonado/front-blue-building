import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { diagonalMarkVariants, type DiagonalMarkVariants } from './DiagonalMark-variants';

type DiagonalMarkProps = ComponentProps<'svg'> & DiagonalMarkVariants;

// The slanted line with an open dot at each end that the current app draws next
// to its fields and buttons. It leans 25 degrees, like every slanted frame, so
// it runs alongside one instead of cutting across it.
export function DiagonalMark({ size, className, ...props }: DiagonalMarkProps) {
  return (
    <svg
      viewBox="0 0 32 64"
      fill="none"
      aria-hidden
      className={cn(diagonalMarkVariants({ size }), className)}
      {...props}
    >
      <path d="M29 5 L5 59" stroke="currentColor" strokeWidth={1.6} />
      <circle cx="29" cy="5" r="2.6" stroke="currentColor" strokeWidth={1.6} />
      <circle cx="5" cy="59" r="2.6" stroke="currentColor" strokeWidth={1.6} />
    </svg>
  );
}
