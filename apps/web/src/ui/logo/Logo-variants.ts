import { cva, type VariantProps } from 'class-variance-authority';

export const logoSizes = ['sm', 'md', 'lg'] as const;
export type LogoSize = (typeof logoSizes)[number];

export const logoVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: 'gap-2',
      md: 'gap-2.5',
      lg: 'gap-3',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export const logoWordmarkVariants = cva('font-display font-bold tracking-tight', {
  variants: {
    size: {
      sm: 'text-body-lg',
      md: 'text-title-sm',
      lg: 'text-title',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// The mark keeps the hexagon ratio (28 x 32) at every size.
export const logoMarkSize: Record<LogoSize, { width: number; height: number }> = {
  sm: { width: 21, height: 24 },
  md: { width: 26, height: 30 },
  lg: { width: 32, height: 37 },
};

export type LogoVariants = VariantProps<typeof logoVariants>;
