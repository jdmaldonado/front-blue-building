import { cva, type VariantProps } from 'class-variance-authority';

export const fieldVariants = cva('flex flex-col gap-1.5');

export const fieldLabelVariants = cva('text-body-sm font-medium', {
  variants: {
    invalid: {
      true: 'text-(--destructive)',
      false: 'text-(--text-secondary)',
    },
  },
  defaultVariants: {
    invalid: false,
  },
});

export const fieldMessageVariants = cva('text-label', {
  variants: {
    tone: {
      error: 'text-(--destructive)',
      hint: 'text-(--text-muted)',
    },
    inset: {
      true: 'pl-10',
      false: '',
    },
  },
  defaultVariants: {
    tone: 'hint',
    inset: false,
  },
});

export type FieldLabelVariants = VariantProps<typeof fieldLabelVariants>;
export type FieldMessageVariants = VariantProps<typeof fieldMessageVariants>;
