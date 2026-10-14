import { cva, type VariantProps } from 'class-variance-authority';

export const passwordInputVariants = cva('relative flex w-full');

// Leaves room on the right so the text never runs under the eye button.
export const passwordInputFieldVariants = cva('', {
  variants: {
    appearance: {
      plain: 'pr-11',
      slanted: 'pr-19',
    },
  },
  defaultVariants: {
    appearance: 'plain',
  },
});

// On a slanted field the button stays clear of the leaning edge.
export const passwordToggleVariants = cva(
  [
    'absolute top-1/2 z-20 inline-flex size-9 -translate-y-1/2 items-center justify-center rounded-(--radius-1)',
    'cursor-pointer text-(--text-muted) transition-colors hover:text-(--text-primary)',
    'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-60',
  ],
  {
    variants: {
      appearance: {
        plain: 'right-1',
        slanted: 'right-9',
      },
    },
    defaultVariants: {
      appearance: 'plain',
    },
  },
);

export type PasswordInputVariants = VariantProps<typeof passwordToggleVariants>;
