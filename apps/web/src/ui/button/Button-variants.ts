import { cva, type VariantProps } from 'class-variance-authority';

export const buttonIntents = ['primary', 'neutral', 'destructive', 'success', 'warning'] as const;
export const buttonAppearances = ['solid', 'outline', 'ghost'] as const;
export const buttonSizes = ['sm', 'md', 'lg'] as const;

export type ButtonIntent = (typeof buttonIntents)[number];
export type ButtonAppearance = (typeof buttonAppearances)[number];
export type ButtonSize = (typeof buttonSizes)[number];

// intent picks the color, appearance picks how it is applied, so the pairs live
// in compoundVariants. Classes stay literal so Tailwind can find them.
export const buttonVariants = cva(
  [
    'inline-flex select-none items-center justify-center rounded-(--button-radius) font-semibold transition-colors',
    'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-60',
  ],
  {
    variants: {
      intent: {
        primary: '',
        neutral: '',
        destructive: '',
        success: '',
        warning: '',
      },
      appearance: {
        // Filled buttons carry the honeycomb texture of the brand. The pattern
        // is drawn in white at low opacity, so it only shows on the fill.
        solid: 'bg-[image:var(--pattern-honeycomb)] bg-[length:39px_22.52px]',
        outline: 'border',
        ghost: '',
      },
      size: {
        sm: 'h-9 gap-2 px-3 text-body-sm',
        md: 'h-11 gap-2 px-4 text-body',
        lg: 'h-13 gap-2.5 px-5 text-body-lg',
      },
    },
    compoundVariants: [
      {
        appearance: 'solid',
        intent: 'primary',
        class: 'bg-(--button-primary-bg) text-(--button-primary-foreground) hover:bg-(--button-primary-bg-hover)',
      },
      {
        appearance: 'solid',
        intent: 'neutral',
        class: 'bg-(--button-neutral-bg) text-(--button-neutral-foreground) hover:bg-(--button-neutral-bg-hover)',
      },
      {
        appearance: 'solid',
        intent: 'destructive',
        class:
          'bg-(--button-destructive-bg) text-(--button-destructive-foreground) hover:bg-(--button-destructive-bg-hover)',
      },
      {
        appearance: 'solid',
        intent: 'success',
        class: 'bg-(--button-success-bg) text-(--button-success-foreground) hover:bg-(--button-success-bg-hover)',
      },
      {
        appearance: 'solid',
        intent: 'warning',
        class: 'bg-(--button-warning-bg) text-(--button-warning-foreground) hover:bg-(--button-warning-bg-hover)',
      },
      {
        appearance: 'outline',
        intent: 'warning',
        class: 'border-(--button-warning-border) text-(--button-warning-text) hover:bg-(--button-warning-soft)',
      },
      {
        appearance: 'ghost',
        intent: 'warning',
        class: 'text-(--button-warning-text) hover:bg-(--button-warning-soft)',
      },
      {
        appearance: 'outline',
        intent: 'primary',
        class: 'border-(--button-primary-border) text-(--button-primary-text) hover:bg-(--button-primary-soft)',
      },
      {
        appearance: 'outline',
        intent: 'neutral',
        class: 'border-(--button-neutral-border) text-(--button-neutral-text) hover:bg-(--button-neutral-soft)',
      },
      {
        appearance: 'outline',
        intent: 'destructive',
        class:
          'border-(--button-destructive-border) text-(--button-destructive-text) hover:bg-(--button-destructive-soft)',
      },
      {
        appearance: 'outline',
        intent: 'success',
        class: 'border-(--button-success-border) text-(--button-success-text) hover:bg-(--button-success-soft)',
      },
      {
        appearance: 'ghost',
        intent: 'primary',
        class: 'text-(--button-primary-text) hover:bg-(--button-primary-soft)',
      },
      {
        appearance: 'ghost',
        intent: 'neutral',
        class: 'text-(--button-neutral-text) hover:bg-(--button-neutral-soft)',
      },
      {
        appearance: 'ghost',
        intent: 'destructive',
        class: 'text-(--button-destructive-text) hover:bg-(--button-destructive-soft)',
      },
      {
        appearance: 'ghost',
        intent: 'success',
        class: 'text-(--button-success-text) hover:bg-(--button-success-soft)',
      },
    ],
    defaultVariants: {
      intent: 'primary',
      appearance: 'solid',
      size: 'md',
    },
  },
);

export type ButtonVariants = VariantProps<typeof buttonVariants>;
