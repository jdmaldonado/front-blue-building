import { cva, type VariantProps } from 'class-variance-authority';

export const skeletonShapes = ['line', 'block', 'circle'] as const;
export type SkeletonShape = (typeof skeletonShapes)[number];

// A lighter band moves over a flat base with `background-position`, so nothing
// is painted on top and the layout never shifts.
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
