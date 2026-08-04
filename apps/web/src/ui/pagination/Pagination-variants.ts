import { cva, type VariantProps } from 'class-variance-authority';

export const paginationVariants = cva('flex flex-wrap items-center justify-between gap-3', {
  variants: {
    padding: {
      none: '',
      md: 'px-3 py-2.5',
    },
  },
  defaultVariants: {
    padding: 'none',
  },
});

export const paginationStatusVariants = cva('text-body-sm text-(--text-secondary)');

export type PaginationVariants = VariantProps<typeof paginationVariants>;
