import { cva, type VariantProps } from 'class-variance-authority';

export const badgeTones = ['neutral', 'success', 'danger', 'warning', 'accent'] as const;
export type BadgeTone = (typeof badgeTones)[number];

export const badgeVariants = cva(
  'inline-flex items-center gap-2 rounded-(--radius-round) font-mono tracking-wide uppercase',
  {
    variants: {
      tone: {
        neutral: 'bg-(--surface-sunken) text-(--text-secondary)',
        success: 'bg-(--success-subtle) text-(--success)',
        danger: 'bg-(--destructive-subtle) text-(--destructive)',
        warning: 'bg-(--warning-subtle) text-(--warning)',
        accent: 'bg-(--accent-subtle) text-(--accent)',
      },
      size: {
        sm: 'px-2.5 py-0.5 text-caption',
        md: 'px-3 py-1 text-label',
      },
    },
    defaultVariants: {
      tone: 'neutral',
      size: 'md',
    },
  },
);

// The dot borrows the badge text color, so it needs no tone of its own.
export const badgeDotVariants = cva('rounded-(--radius-round) bg-current', {
  variants: {
    size: {
      sm: 'size-1.5',
      md: 'size-2',
    },
    pulse: {
      true: 'animate-pulse',
      false: '',
    },
  },
  defaultVariants: {
    size: 'md',
    pulse: false,
  },
});

export type BadgeVariants = VariantProps<typeof badgeVariants>;
