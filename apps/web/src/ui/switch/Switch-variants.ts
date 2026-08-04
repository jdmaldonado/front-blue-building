import { cva, type VariantProps } from 'class-variance-authority';

export const switchSizes = ['sm', 'md'] as const;
export type SwitchSize = (typeof switchSizes)[number];

export const switchTrackVariants = cva(
  [
    'relative flex shrink-0 items-center rounded-(--radius-round) border transition-colors',
    'duration-(--duration-base) ease-standard',
    'border-(--toggle-border) bg-(--toggle-track-off)',
    'peer-checked:border-(--toggle-track-on) peer-checked:bg-(--toggle-track-on)',
    'peer-focus-visible:ring-[3px] peer-focus-visible:ring-(--accent-subtle)',
    'peer-disabled:opacity-60',
  ],
  {
    variants: {
      switchSize: {
        sm: 'h-5 w-9',
        md: 'h-6 w-11',
      },
    },
    defaultVariants: {
      switchSize: 'md',
    },
  },
);

// The knob lives inside the track, so `peer-checked` cannot reach it: that
// variant only matches siblings. It reads the checked prop instead.
export const switchKnobVariants = cva(
  [
    'absolute left-0.5 rounded-(--radius-round) bg-(--toggle-knob) shadow-(--shadow-1)',
    'transition-transform duration-(--duration-base) ease-standard',
  ],
  {
    variants: {
      switchSize: {
        sm: 'size-3.5',
        md: 'size-4.5',
      },
      checked: {
        true: '',
        false: 'translate-x-0',
      },
    },
    compoundVariants: [
      { switchSize: 'sm', checked: true, class: 'translate-x-4' },
      { switchSize: 'md', checked: true, class: 'translate-x-5' },
    ],
    defaultVariants: {
      switchSize: 'md',
      checked: false,
    },
  },
);

export const switchLabelVariants = cva('flex items-center gap-3 text-(--text-primary)', {
  variants: {
    switchSize: {
      sm: 'text-body-sm',
      md: 'text-body',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-60',
      false: 'cursor-pointer',
    },
  },
  defaultVariants: {
    switchSize: 'md',
    disabled: false,
  },
});

export type SwitchVariants = VariantProps<typeof switchTrackVariants>;
