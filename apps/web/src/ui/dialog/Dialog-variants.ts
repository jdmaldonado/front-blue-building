import { cva, type VariantProps } from 'class-variance-authority';

export const dialogSizes = ['sm', 'md', 'lg'] as const;
export type DialogSize = (typeof dialogSizes)[number];

// Uses the native <dialog>, so backdrop, ESC and focus trap are free. Bottom
// sheet on mobile, centered from sm up.
export const dialogVariants = cva(
  [
    'w-full max-h-[85dvh] p-0 backdrop:bg-black/60',
    'mt-auto mb-0 rounded-t-(--card-radius) rounded-b-none',
    'sm:my-auto sm:rounded-(--card-radius)',
    'border border-(--card-border) bg-(--card-bg) text-(--text-primary) shadow-(--shadow-3)',
  ],
  {
    variants: {
      size: {
        sm: 'sm:max-w-md',
        md: 'sm:max-w-xl',
        lg: 'sm:max-w-3xl',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export const dialogHeaderVariants = cva('flex items-start gap-3 border-b border-(--card-border) px-5 py-4 sm:px-6');

export const dialogBodyVariants = cva('flex-1 overflow-auto px-5 py-4 sm:px-6');

export const dialogFooterVariants = cva(
  'flex flex-col gap-2 border-t border-(--card-border) px-5 py-4 sm:flex-row sm:justify-end sm:px-6',
);

export type DialogVariants = VariantProps<typeof dialogVariants>;
