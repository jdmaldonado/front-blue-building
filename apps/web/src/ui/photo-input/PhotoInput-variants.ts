import { cva, type VariantProps } from 'class-variance-authority';

export const photoInputSizes = ['md', 'lg'] as const;
export type PhotoInputSize = (typeof photoInputSizes)[number];

export const photoInputVariants = cva(
  [
    'relative flex shrink-0 items-center justify-center overflow-hidden',
    'rounded-(--photo-input-radius) border border-(--photo-input-border) bg-(--photo-input-bg)',
    'text-(--photo-input-foreground)',
    'transition-colors duration-(--duration-fast) ease-standard',
    'focus-within:border-(--photo-input-border-focus) focus-within:ring-[3px] focus-within:ring-(--accent-subtle)',
  ],
  {
    variants: {
      photoInputSize: {
        md: 'size-24',
        lg: 'size-32',
      },
      invalid: {
        true: 'border-(--destructive)',
        false: '',
      },
    },
    defaultVariants: {
      photoInputSize: 'md',
      invalid: false,
    },
  },
);

export type PhotoInputVariants = VariantProps<typeof photoInputVariants>;

export const photoInputTriggerVariants = cva(
  ['absolute inset-0 flex cursor-pointer flex-col items-center justify-center gap-1 text-center', 'text-caption'],
  {
    variants: {
      // Over a photo it shrinks to a strip at the bottom: it stays visible on a
      // phone, where nothing hovers, without hiding the face underneath. Same
      // scrim as the dialog backdrop.
      overPhoto: {
        true: 'inset-y-auto bottom-0 h-7 bg-black/55 text-white',
        false: '',
      },
    },
    defaultVariants: {
      overPhoto: false,
    },
  },
);

export const photoInputHintVariants = cva('text-(--text-muted) text-caption');
