import type { ComponentProps } from 'react';
import { cn } from '../cn';
import { skeletonVariants, type SkeletonVariants } from './Skeleton-variants';

type SkeletonProps = ComponentProps<'span'> & SkeletonVariants;

// Placeholder while data loads. It is decoration, so it is hidden from screen
// readers: the loading state is announced by whoever owns the region.
export function Skeleton({ shape, className, ...props }: SkeletonProps) {
  return <span aria-hidden className={cn(skeletonVariants({ shape }), className)} {...props} />;
}
