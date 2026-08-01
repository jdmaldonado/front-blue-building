import { cva, type VariantProps } from 'class-variance-authority';

export const spinnerSizes = ['sm', 'md', 'lg'] as const;
export type SpinnerSize = (typeof spinnerSizes)[number];

// Borrows the current text color so it works inside any intent (button, alert...).
export const spinnerVariants = cva('inline-block animate-spin rounded-full border-current border-t-transparent', {
  variants: {
    size: {
      sm: 'size-3 border-2',
      md: 'size-4 border-2',
      lg: 'size-6 border-[3px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type SpinnerVariants = VariantProps<typeof spinnerVariants>;
