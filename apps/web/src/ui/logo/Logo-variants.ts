import { cva, type VariantProps } from 'class-variance-authority';

export const logoSizes = ['sm', 'md', 'lg', 'xl'] as const;
export type LogoSize = (typeof logoSizes)[number];

export const logoVariants = cva('flex items-center', {
  variants: {
    size: {
      sm: 'gap-2',
      md: 'gap-2.5',
      lg: 'gap-3',
      xl: 'gap-4',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// The mark is square.
export const logoMarkVariants = cva('shrink-0', {
  variants: {
    size: {
      sm: 'size-6',
      md: 'size-8',
      lg: 'size-10',
      xl: 'size-14',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

// The lettering keeps its own ratio, so only the height is set.
export const logoWordmarkVariants = cva('w-auto shrink-0', {
  variants: {
    size: {
      sm: 'h-2.5',
      md: 'h-3',
      lg: 'h-4',
      xl: 'h-5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type LogoVariants = VariantProps<typeof logoVariants>;
