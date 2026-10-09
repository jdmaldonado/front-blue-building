import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { diagonalMarkVariants, type DiagonalMarkVariants } from './DiagonalMark-variants';

type DiagonalMarkProps = ComponentProps<'svg'> & DiagonalMarkVariants;

// The slanted line with an open ring at each end that the current app draws next
// to its fields and buttons. Traced from its `shape-1.svg`, which is why the
// viewBox keeps those odd numbers: rings of radius 8.5 at 25 degrees from each
// other, and a hairline between them that stops at the rings, never inside. The
// stroke is pinned to 1px so it reads the same at every size.
export function DiagonalMark({ size, className, ...props }: DiagonalMarkProps) {
  return (
    <svg
      viewBox="0 0 161 319.4"
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      // Without this the hairline scales with the box and fades out at the
      // smaller sizes: 0.5px at lg, which most screens round away.
      vectorEffect="non-scaling-stroke"
      aria-hidden
      className={cn(diagonalMarkVariants({ size }), className)}
      {...props}
    >
      <circle cx="151.5" cy="9.5" r="8.5" />
      <path d="M146.2 17.4 L14.7 302" />
      <circle cx="9.5" cy="309.9" r="8.5" />
    </svg>
  );
}
