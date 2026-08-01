import { cva, type VariantProps } from 'class-variance-authority';

// Same component, two looks: `list` is the classic radio (circle + label),
// `segmented` is the pill-style single choice for 2-4 short options.
export const radioGroupAppearances = ['list', 'segmented'] as const;
export type RadioGroupAppearance = (typeof radioGroupAppearances)[number];

export const radioGroupSizes = ['sm', 'md'] as const;
export type RadioGroupSize = (typeof radioGroupSizes)[number];

export const radioGroupVariants = cva('', {
  variants: {
    appearance: {
      list: 'flex flex-col',
      segmented: 'inline-flex w-full gap-1 rounded-(--radius-round) bg-(--surface-sunken)',
    },
    size: {
      sm: '',
      md: '',
    },
  },
  compoundVariants: [
    { appearance: 'list', size: 'sm', class: 'gap-1.5' },
    { appearance: 'list', size: 'md', class: 'gap-2' },
    { appearance: 'segmented', size: 'sm', class: 'p-0.5' },
    { appearance: 'segmented', size: 'md', class: 'p-1' },
  ],
  defaultVariants: {
    appearance: 'list',
    size: 'md',
  },
});

export const radioGroupItemVariants = cva(
  [
    'flex items-center gap-2 font-medium transition-colors',
    'focus-visible:ring-2 focus-visible:ring-(--border-focus) focus-visible:outline-none',
    'disabled:cursor-not-allowed disabled:opacity-60',
  ],
  {
    variants: {
      appearance: {
        list: 'rounded-(--radius-1) text-left text-(--text-primary)',
        segmented: 'flex-1 justify-center rounded-(--radius-round)',
      },
      size: {
        sm: 'text-label',
        md: 'text-body-sm',
      },
      selected: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      { appearance: 'segmented', size: 'sm', class: 'px-3 py-1' },
      { appearance: 'segmented', size: 'md', class: 'px-3 py-1.5' },
      {
        appearance: 'segmented',
        selected: true,
        class: 'bg-(--surface-raised) text-(--text-primary) shadow-(--shadow-1)',
      },
      {
        appearance: 'segmented',
        selected: false,
        class: 'text-(--text-secondary) hover:text-(--text-primary)',
      },
    ],
    defaultVariants: {
      appearance: 'list',
      size: 'md',
      selected: false,
    },
  },
);

// Only drawn in the `list` appearance: the circle that shows the choice.
export const radioGroupIndicatorVariants = cva(
  'flex shrink-0 items-center justify-center rounded-(--radius-round) border-2 transition-colors',
  {
    variants: {
      size: {
        sm: 'size-3.5',
        md: 'size-4',
      },
      selected: {
        true: 'border-(--radio-border-checked)',
        false: 'border-(--radio-border)',
      },
    },
    defaultVariants: {
      size: 'md',
      selected: false,
    },
  },
);

export const radioGroupDotVariants = cva('rounded-(--radius-round) bg-(--radio-dot)', {
  variants: {
    size: {
      sm: 'size-1.5',
      md: 'size-2',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type RadioGroupVariants = VariantProps<typeof radioGroupVariants>;
