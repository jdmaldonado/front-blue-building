import { cva, type VariantProps } from 'class-variance-authority';

export const skeletonShapes = ['line', 'block', 'circle'] as const;
export type SkeletonShape = (typeof skeletonShapes)[number];

// A flat base with a lighter band travelling over it. The band is a gradient
// twice as wide as the box, moved with `background-position` by the shimmer
// animation, so nothing is painted on top and the layout never shifts.
export const skeletonVariants = cva(
  [
    'block bg-(--skeleton-bg)',
    'bg-[linear-gradient(90deg,var(--skeleton-bg)_0%,var(--skeleton-shine)_50%,var(--skeleton-bg)_100%)]',
    'bg-[length:200%_100%] animate-shimmer',
  ],
  {
    variants: {
      shape: {
        line: 'h-4 rounded-(--radius-1)',
        block: 'h-full w-full rounded-(--radius-2)',
        circle: 'aspect-square rounded-(--radius-round)',
      },
    },
    defaultVariants: {
      shape: 'line',
    },
  },
);

export type SkeletonVariants = VariantProps<typeof skeletonVariants>;
