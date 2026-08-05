import { cva, type VariantProps } from 'class-variance-authority';

export const emptyStateVariants = cva('flex flex-col items-center justify-center text-center', {
  variants: {
    padding: {
      sm: 'gap-2 px-4 py-8',
      md: 'gap-3 px-6 py-12',
    },
  },
  defaultVariants: {
    padding: 'md',
  },
});

export const emptyStateIconVariants = cva(
  'flex items-center justify-center rounded-(--radius-2) bg-(--surface-sunken) text-(--text-muted)',
  {
    variants: {
      padding: {
        sm: 'size-10',
        md: 'size-14',
      },
    },
    defaultVariants: {
      padding: 'md',
    },
  },
);

export const emptyStateTitleVariants = cva('text-title-sm font-medium text-(--text-primary)');
export const emptyStateTextVariants = cva('max-w-sm text-body-sm text-(--text-secondary)');

export type EmptyStateVariants = VariantProps<typeof emptyStateVariants>;
