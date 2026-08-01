import { cva, type VariantProps } from 'class-variance-authority';

export const cardPaddings = ['none', 'sm', 'md', 'lg'] as const;
export type CardPadding = (typeof cardPaddings)[number];

export const cardVariants = cva('rounded-(--card-radius) border border-(--card-border) bg-(--card-bg)', {
  variants: {
    elevation: {
      flat: '',
      raised: 'shadow-(--shadow-1)',
      floating: 'shadow-(--shadow-2)',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    elevation: 'raised',
    padding: 'none',
  },
});

export type CardVariants = VariantProps<typeof cardVariants>;
