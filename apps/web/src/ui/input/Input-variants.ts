import { cva, type VariantProps } from 'class-variance-authority';

export const inputSizes = ['sm', 'md'] as const;
export type InputSize = (typeof inputSizes)[number];

export const inputVariants = cva(
  [
    'w-full rounded-(--input-radius) border border-(--input-border) bg-(--input-bg) text-(--input-foreground)',
    'placeholder:text-(--input-placeholder)',
    'focus:border-(--input-border-focus) focus:ring-[3px] focus:ring-(--accent-subtle) focus:outline-none',
    'aria-invalid:border-(--destructive)',
    'disabled:cursor-not-allowed disabled:opacity-60',
  ],
  {
    variants: {
      inputSize: {
        sm: 'px-3 py-2 text-body-sm',
        md: 'px-3.5 py-2.5 text-body',
      },
    },
    defaultVariants: {
      inputSize: 'md',
    },
  },
);

export type InputVariants = VariantProps<typeof inputVariants>;
