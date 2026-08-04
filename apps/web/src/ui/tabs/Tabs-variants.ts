import { cva, type VariantProps } from 'class-variance-authority';

export const tabsAppearances = ['underline', 'pill'] as const;
export type TabsAppearance = (typeof tabsAppearances)[number];

// On narrow screens the list scrolls sideways instead of wrapping.
export const tabsVariants = cva(
  'flex items-center overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  {
    variants: {
      appearance: {
        underline: 'gap-1 border-b border-(--table-border)',
        pill: 'gap-1 rounded-(--radius-round) bg-(--surface-sunken) p-1',
      },
    },
    defaultVariants: {
      appearance: 'underline',
    },
  },
);

export const tabsItemVariants = cva(
  [
    'relative flex shrink-0 items-center gap-2 whitespace-nowrap transition-colors',
    'duration-(--duration-fast) ease-standard',
    'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-60',
  ],
  {
    variants: {
      appearance: {
        underline: 'px-3 py-2.5 text-body-sm',
        pill: 'rounded-(--radius-round) px-3.5 py-1.5 text-body-sm',
      },
      active: {
        true: 'text-(--tab-foreground-active) font-medium',
        false: 'text-(--tab-foreground) hover:text-(--tab-foreground-active)',
      },
    },
    compoundVariants: [{ appearance: 'pill', active: true, class: 'bg-(--surface-raised) shadow-(--shadow-1)' }],
    defaultVariants: {
      appearance: 'underline',
      active: false,
    },
  },
);

// Grows from the middle when the tab becomes active.
export const tabsIndicatorVariants = cva(
  [
    'absolute inset-x-0 -bottom-px h-0.5 rounded-(--radius-round) bg-(--tab-indicator)',
    'origin-center transition-transform duration-(--duration-base) ease-standard',
  ],
  {
    variants: {
      active: {
        true: 'scale-x-100',
        false: 'scale-x-0',
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export type TabsVariants = VariantProps<typeof tabsVariants>;
