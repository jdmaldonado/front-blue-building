import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { skeletonVariants, type SkeletonVariants } from './Skeleton-variants';

type SkeletonProps = ComponentProps<'span'> & SkeletonVariants;

// Decoration while data loads, so it is hidden from screen readers. The region
// that owns it announces the loading state.
export function Skeleton({ shape, className, ...props }: SkeletonProps) {
  return <span aria-hidden className={cn(skeletonVariants({ shape }), className)} {...props} />;
}
