import { cva, type VariantProps } from 'class-variance-authority';

export const textareaSizes = ['sm', 'md'] as const;
export type TextareaSize = (typeof textareaSizes)[number];

// Same skin as Input: it is the same field, only taller.
export const textareaVariants = cva(
  [
    'w-full rounded-(--input-radius) border border-(--input-border) bg-(--input-bg) text-(--input-foreground)',
    'placeholder:text-(--input-placeholder)',
    'focus:border-(--input-border-focus) focus:ring-[3px] focus:ring-(--accent-subtle) focus:outline-none',
    'aria-invalid:border-(--destructive)',
    'disabled:cursor-not-allowed disabled:opacity-60',
    'resize-y field-sizing-content',
  ],
  {
    variants: {
      textareaSize: {
        sm: 'min-h-20 px-3 py-2 text-field sm:text-body-sm',
        md: 'min-h-24 px-3.5 py-2.5 text-field sm:text-body',
      },
    },
    defaultVariants: {
      textareaSize: 'md',
    },
  },
);

export type TextareaVariants = VariantProps<typeof textareaVariants>;
