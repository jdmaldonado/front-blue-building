import { cva, type VariantProps } from 'class-variance-authority';

export const tooltipSides = ['top', 'bottom', 'left', 'right'] as const;
export type TooltipSide = (typeof tooltipSides)[number];

export const tooltipVariants = cva(
  [
    'pointer-events-none absolute z-50 w-max max-w-56 rounded-(--tooltip-radius) px-2.5 py-1.5',
    'bg-(--tooltip-bg) text-(--tooltip-foreground) text-caption shadow-(--shadow-2)',
    // Out of the layout while hidden: an invisible bubble still takes room and
    // gave tables a sideways scroll.
    'hidden group-hover:block group-focus-visible:block',
  ],
  {
    variants: {
      side: {
        top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
        bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
        left: 'top-1/2 right-full mr-2 -translate-y-1/2',
        right: 'top-1/2 left-full ml-2 -translate-y-1/2',
      },
    },
    defaultVariants: {
      side: 'top',
    },
  },
);

export type TooltipVariants = VariantProps<typeof tooltipVariants>;
