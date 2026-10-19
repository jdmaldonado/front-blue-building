import { cva, type VariantProps } from 'class-variance-authority';

export const iconButtonSizes = ['sm', 'md', 'lg'] as const;
export type IconButtonSize = (typeof iconButtonSizes)[number];

export const iconButtonTones = ['neutral', 'accent', 'destructive', 'warning', 'success'] as const;
export type IconButtonTone = (typeof iconButtonTones)[number];

export const iconButtonVariants = cva(
  [
    'inline-flex shrink-0 items-center justify-center rounded-(--icon-button-radius) border transition-colors',
    'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
    'cursor-pointer disabled:cursor-not-allowed disabled:opacity-60',
  ],
  {
    variants: {
      size: {
        // 44px keeps the touch target usable on mobile.
        sm: 'size-9',
        md: 'size-11',
        // Same height as a large Button, so they line up in a row.
        lg: 'size-13',
      },
      tone: {
        neutral:
          'border-(--border-default) bg-(--surface-sunken) text-(--icon-button-foreground) hover:bg-(--icon-button-bg-hover)',
        accent: 'border-(--border-default) bg-transparent text-(--accent) hover:bg-(--accent-subtle)',
        destructive: 'border-(--destructive) bg-(--destructive-subtle) text-(--destructive) hover:bg-transparent',
        warning: 'border-(--warning) bg-transparent text-(--warning) hover:bg-(--warning-subtle)',
        success: 'border-(--success) bg-transparent text-(--success) hover:bg-(--success-subtle)',
      },
    },
    defaultVariants: {
      size: 'sm',
      tone: 'neutral',
    },
  },
);

export type IconButtonVariants = VariantProps<typeof iconButtonVariants>;
