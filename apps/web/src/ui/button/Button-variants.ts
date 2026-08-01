import { cva, type VariantProps } from 'class-variance-authority';

export const buttonIntents = ['primary', 'neutral', 'destructive', 'success'] as const;
export const buttonAppearances = ['solid', 'outline', 'ghost'] as const;
export const buttonSizes = ['sm', 'md', 'lg'] as const;

export type ButtonIntent = (typeof buttonIntents)[number];
export type ButtonAppearance = (typeof buttonAppearances)[number];
export type ButtonSize = (typeof buttonSizes)[number];

// Two orthogonal axes: intent picks the token family, appearance picks how it is
// applied (filled / bordered / transparent), so the combination lives in
// compoundVariants. Class strings stay literal so Tailwind can see them at build time.
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
      },
      appearance: {
        solid: '',
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
