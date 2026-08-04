import { cva, type VariantProps } from 'class-variance-authority';

export const checkboxSizes = ['sm', 'md'] as const;
export type CheckboxSize = (typeof checkboxSizes)[number];

// The real <input> stays in the DOM but invisible, so keyboard, forms and
// screen readers keep working. This box is what people see, and it reacts to
// the input state with `peer-*`.
export const checkboxVariants = cva(
  [
    'flex shrink-0 items-center justify-center rounded-(--radius-1) border transition-colors',
    'duration-(--duration-fast) ease-standard',
    'border-(--checkbox-border) bg-(--input-bg) text-(--checkbox-foreground)',
    'peer-checked:border-(--checkbox-bg-checked) peer-checked:bg-(--checkbox-bg-checked)',
    'peer-indeterminate:border-(--checkbox-bg-checked) peer-indeterminate:bg-(--checkbox-bg-checked)',
    'peer-focus-visible:ring-[3px] peer-focus-visible:ring-(--accent-subtle)',
    'peer-disabled:opacity-60',
  ],
  {
    variants: {
      checkboxSize: {
        sm: 'size-4',
        md: 'size-5',
      },
    },
    defaultVariants: {
      checkboxSize: 'md',
    },
  },
);

export const checkboxLabelVariants = cva('flex items-start gap-2.5 text-(--text-primary)', {
  variants: {
    checkboxSize: {
      sm: 'text-body-sm',
      md: 'text-body',
    },
    disabled: {
      true: 'cursor-not-allowed opacity-60',
      false: 'cursor-pointer',
    },
  },
  defaultVariants: {
    checkboxSize: 'md',
    disabled: false,
  },
});

export const checkboxDescriptionVariants = cva('text-body-sm text-(--text-secondary)');

export type CheckboxVariants = VariantProps<typeof checkboxVariants>;
